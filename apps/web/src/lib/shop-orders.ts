import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteOrigin } from "@/lib/site-url";
import { profile } from "@/lib/profile";
import { paidPayment, retrieveCheckoutSession, type CheckoutSession } from "@/lib/payments/paymongo";
import { escapeHtml, sendEmail } from "@/lib/email";
import { DOWNLOAD_DAYS, DOWNLOAD_LIMIT, formatCentavos, type ProductKind } from "@/lib/shop";

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type OrderView = {
  id: string;
  status: "pending" | "paid" | "refunded" | "failed";
  product_title: string;
  buyer_name: string;
  buyer_email: string;
  amount: number;
  download_count: number;
  paid_at: string | null;
  checkout_session_id: string | null;
  receipt_sent_at: string | null;
  product: { kind: ProductKind; slug: string; file_path: string | null; service_instructions: string | null } | null;
};

const ORDER_COLUMNS = "id,status,product_title,buyer_name,buyer_email,amount,download_count,paid_at,checkout_session_id,receipt_sent_at,product:products(kind,slug,file_path,service_instructions)";

// The download link carries an HMAC of the order id, so knowing an order id alone is not enough to download.
// It is derived, not stored, so the thank-you page and the receipt can show the same link.
function tokenSecret() {
  const secret = process.env.SHOP_TOKEN_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("No secret for download links");
  return secret;
}
export function downloadToken(orderId: string) {
  return createHmac("sha256", tokenSecret()).update(`order:${orderId}`).digest("base64url");
}
export function validDownloadToken(orderId: string, token: string | null) {
  if (!token) return false;
  const a = Buffer.from(downloadToken(orderId));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function downloadUrl(orderId: string, origin = getSiteOrigin()) {
  return `${origin}/api/orders/${orderId}/download?token=${downloadToken(orderId)}`;
}
export function thankYouUrl(orderId: string, origin = getSiteOrigin()) {
  return `${origin}/shop/thank-you?order=${orderId}`;
}

export async function getOrder(orderId: string): Promise<OrderView | null> {
  if (!UUID.test(orderId)) return null;
  const { data, error } = await createAdminClient().from("orders").select(ORDER_COLUMNS).eq("id", orderId).maybeSingle();
  if (error) throw error;
  return data as OrderView | null;
}

// Marks an order paid once PayMongo says so. Called by the webhook and by the thank-you page check;
// both pass a session fetched from or signed by PayMongo, never anything the browser sent.
// The amount must match what the order was created for. Safe to call more than once.
export async function markOrderPaid(orderId: string, session: CheckoutSession): Promise<"paid" | "already" | "not_paid" | "mismatch"> {
  const order = await getOrder(orderId);
  if (!order) return "mismatch";
  if (order.status === "paid") return "already";
  if (order.checkout_session_id !== session.id || session.attributes.metadata?.order_id !== orderId) return "mismatch";
  const payment = paidPayment(session);
  if (!payment) return "not_paid";
  if (payment.attributes.amount !== order.amount || payment.attributes.currency !== "PHP") {
    console.error("Paid amount does not match the order", { orderId, paid: payment.attributes.amount, expected: order.amount });
    return "mismatch";
  }
  const { data, error } = await createAdminClient().from("orders")
    .update({ status: "paid", payment_id: payment.id, paid_at: new Date().toISOString() })
    .eq("id", orderId).eq("status", "pending").select("id");
  if (error) throw error;
  if (!data?.length) return "already"; // a parallel call won the update
  try {
    await sendReceipt(orderId);
  } catch (emailError) {
    // The buyer still sees everything on the thank-you page; the receipt can be resent from the dashboard.
    console.error("Receipt email failed", emailError);
  }
  return "paid";
}

// For the thank-you page: if the webhook has not arrived yet, ask PayMongo directly.
export async function confirmWithPaymongo(order: OrderView): Promise<OrderView> {
  if (order.status !== "pending" || !order.checkout_session_id || !process.env.PAYMONGO_SECRET_KEY) return order;
  try {
    const session = await retrieveCheckoutSession(order.checkout_session_id);
    if ((await markOrderPaid(order.id, session)) === "paid") return (await getOrder(order.id)) ?? order;
  } catch (error) {
    console.error("PayMongo status check failed", error);
  }
  return order;
}

export async function sendReceipt(orderId: string) {
  const order = await getOrder(orderId);
  if (!order || order.status !== "paid") return false;
  const isService = order.product?.kind === "service";
  const link = isService ? thankYouUrl(order.id) : downloadUrl(order.id);
  const next = isService
    ? (order.product?.service_instructions || "I'll email you within 1 business day to schedule and get started.")
    : `Download it here (up to ${DOWNLOAD_LIMIT} times within ${DOWNLOAD_DAYS} days):`;
  const amount = formatCentavos(order.amount);
  const text = [
    `Hi ${order.buyer_name},`, "",
    `Thank you for buying ${order.product_title} (${amount}).`, "",
    next, link, "",
    `Order: ${order.id}`,
    `Questions? Reply to this email or write to ${profile.email}.`, "",
    profile.name,
  ].join("\n");
  const html = `<p>Hi ${escapeHtml(order.buyer_name)},</p>
<p>Thank you for buying <strong>${escapeHtml(order.product_title)}</strong> (${amount}).</p>
<p>${escapeHtml(next).replace(/\n/g, "<br>")}</p>
<p><a href="${link}">${isService ? "View your order" : "Download"}</a></p>
<p style="color:#707070;font-size:13px">Order ${order.id}<br>Questions? Reply to this email or write to ${escapeHtml(profile.email)}.</p>
<p>${escapeHtml(profile.name)}</p>`;
  const sent = await sendEmail({ to: order.buyer_email, subject: `Your order: ${order.product_title}`, text, html, replyTo: profile.email });
  if (sent) await createAdminClient().from("orders").update({ receipt_sent_at: new Date().toISOString() }).eq("id", orderId);
  return sent;
}
