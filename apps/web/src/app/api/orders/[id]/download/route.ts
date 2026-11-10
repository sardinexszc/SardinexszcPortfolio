import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DOWNLOAD_DAYS, DOWNLOAD_LIMIT } from "@/lib/shop";
import { getOrder, validDownloadToken } from "@/lib/shop-orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const refuse = (message: string, status: number) =>
  new NextResponse(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

// Sends the buyer to a 60-second signed link for the product file in the private shop-files bucket,
// after checking the link's token and counting the download (at most DOWNLOAD_LIMIT within DOWNLOAD_DAYS).
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id).catch(() => null);
  if (!order || !validDownloadToken(order.id, request.nextUrl.searchParams.get("token"))) return refuse("This download link is not valid.", 404);
  if (order.status !== "paid") return refuse("This order is not paid.", 403);
  const filePath = order.product?.file_path;
  if (!filePath) return refuse(`This order has no file. Please email the seller and quote order ${order.id}.`, 404);

  const db = createAdminClient();
  const { data: allowed, error } = await db.rpc("consume_order_download", { p_order_id: order.id, p_limit: DOWNLOAD_LIMIT, p_days: DOWNLOAD_DAYS });
  if (error) {
    console.error("Download count failed", error);
    return refuse("Downloads are temporarily unavailable. Please try again.", 503);
  }
  if (!allowed) return refuse(`This link has been used ${DOWNLOAD_LIMIT} times or is older than ${DOWNLOAD_DAYS} days. Email the seller with order ${order.id} for a new one.`, 410);

  const name = filePath.split("/").pop() || "download";
  const { data, error: signError } = await db.storage.from("shop-files").createSignedUrl(filePath, 60, { download: name });
  if (signError || !data) {
    console.error("Signed link failed", signError);
    // Give the count back: the buyer did not get the file.
    await db.from("orders").update({ download_count: Math.max(0, order.download_count) }).eq("id", order.id);
    return refuse("The file could not be prepared. Please try again or email the seller.", 503);
  }
  return NextResponse.redirect(data.signedUrl, { status: 303, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
}
