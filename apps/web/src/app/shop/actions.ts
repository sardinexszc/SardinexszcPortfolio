"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCheckoutSession, paymongoConfigured } from "@/lib/payments/paymongo";
import { clientAddress, consumeRateLimit } from "@/lib/tracking-limit";
import { getSiteOrigin } from "@/lib/site-url";
import { thankYouUrl } from "@/lib/shop-orders";

export type CheckoutState = { error?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Starts a PayMongo checkout. The price always comes from the database; the form only sends the product
// slug and the buyer's name and email. The order is created as pending and only the webhook (or the
// thank-you page asking PayMongo) can mark it paid.
export async function startCheckout(_: CheckoutState, form: FormData): Promise<CheckoutState> {
  const slug = String(form.get("product") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!name || name.length > 120) return { error: "Please enter your name (up to 120 characters)." };
  if (!EMAIL.test(email) || email.length > 254) return { error: "Please enter a valid email address. Your receipt and download link go there." };
  if (form.get("agree") !== "on") return { error: "Please agree to the terms and refund policy." };
  if (!paymongoConfigured()) return { error: "Checkout is not open yet. Please try again soon, or email me to buy directly." };

  const origin = getSiteOrigin();
  let checkoutUrl: string;
  try {
    const requestHeaders = await headers();
    if (!await consumeRateLimit(new URL(origin).hostname, clientAddress(requestHeaders), "checkout", 5)) {
      return { error: "Too many attempts. Please wait a minute and try again." };
    }
    const db = createAdminClient();
    const { data: product, error } = await db.from("products").select("id,kind,title,summary,price_php,file_path,active").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!product || !product.active) return { error: "This product is no longer available." };
    if (product.kind !== "service" && !product.file_path) return { error: "This product is not ready to sell yet. Please email me instead." };

    const amount = product.price_php * 100;
    const { data: order, error: orderError } = await db.from("orders")
      .insert({ product_id: product.id, product_title: product.title, buyer_name: name, buyer_email: email, amount })
      .select("id").single();
    if (orderError) throw orderError;

    const session = await createCheckoutSession({
      orderId: order.id, productTitle: product.title, description: product.summary, amount,
      buyerName: name, buyerEmail: email,
      successUrl: thankYouUrl(order.id, origin), cancelUrl: `${origin}/shop/${encodeURIComponent(slug)}?cancelled=1`,
    });
    const { error: linkError } = await db.from("orders").update({ checkout_session_id: session.id }).eq("id", order.id);
    if (linkError) throw linkError;
    checkoutUrl = session.attributes.checkout_url;
  } catch (error) {
    console.error("Checkout could not start", error);
    return { error: "Checkout could not start. Please try again in a moment." };
  }
  redirect(checkoutUrl);
}
