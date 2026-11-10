"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { sendReceipt, UUID } from "@/lib/shop-orders";
import { emailConfigured } from "@/lib/email";

const back = (status: string) => redirect(`/analytics/shop?${status}`);

export async function resendReceipt(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) back("error=Unknown%20order");
  if (!emailConfigured()) back("error=" + encodeURIComponent("Email is not set up yet (RESEND_API_KEY and SHOP_FROM_EMAIL)."));
  let ok = false;
  try { ok = await sendReceipt(id); } catch (error) { console.error("Resend receipt failed", error); }
  revalidatePath("/analytics/shop");
  back(ok ? "saved=receipt%20sent" : "error=" + encodeURIComponent("The receipt could not be sent. Check the email settings and try again."));
}

// Refunds themselves are issued in the PayMongo dashboard; this records it, which also stops downloads.
export async function markRefunded(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) back("error=Unknown%20order");
  const { error } = await createAdminClient().from("orders").update({ status: "refunded" }).eq("id", id).eq("status", "paid");
  if (error) console.error("Mark refunded failed", error);
  revalidatePath("/analytics/shop");
  back(error ? "error=Could%20not%20update%20the%20order" : "saved=order%20marked%20refunded");
}

// Gives a buyer their downloads back (for example after a broken file was replaced).
export async function resetDownloads(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) back("error=Unknown%20order");
  const { error } = await createAdminClient().from("orders").update({ download_count: 0, paid_at: new Date().toISOString() }).eq("id", id).eq("status", "paid");
  if (error) console.error("Reset downloads failed", error);
  revalidatePath("/analytics/shop");
  back(error ? "error=Could%20not%20update%20the%20order" : "saved=downloads%20reset%20for%207%20days");
}
