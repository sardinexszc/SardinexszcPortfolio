import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { profile } from "@/lib/profile";
import { DOWNLOAD_DAYS, DOWNLOAD_LIMIT, formatCentavos } from "@/lib/shop";
import { confirmWithPaymongo, downloadUrl, getOrder } from "@/lib/shop-orders";
import { RefreshWhilePending } from "@/components/shop/refresh-while-pending";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your order", robots: { index: false, follow: false } };

// The order id in the link is random and is only given to the buyer (PayMongo's return link and the receipt).
export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId = "" } = await searchParams;
  let order = await getOrder(orderId).catch((error) => { console.error("Order could not be loaded", error); return null; });
  if (order) order = await confirmWithPaymongo(order);

  if (!order) {
    return (
      <div className="shop-status">
        <h1>Order not found</h1>
        <p>Check the link in your receipt email, or write to <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
        <p><Link href="/shop">Back to the shop</Link></p>
      </div>
    );
  }

  if (order.status === "pending") {
    return (
      <div className="shop-status" aria-live="polite">
        <RefreshWhilePending />
        <p className="pf-tile-kind">Order {order.id.slice(0, 8)}</p>
        <h1>Confirming your payment…</h1>
        <p>This usually takes a few seconds and the page updates on its own. If you closed the payment page without paying, you were not charged.</p>
        <p className="shop-note">Still waiting after a few minutes? Email <a href={`mailto:${profile.email}`}>{profile.email}</a> with order {order.id}.</p>
      </div>
    );
  }

  if (order.status !== "paid") {
    return (
      <div className="shop-status">
        <h1>This order is {order.status}</h1>
        <p>Questions? Email <a href={`mailto:${profile.email}`}>{profile.email}</a> with order {order.id}.</p>
      </div>
    );
  }

  const isService = order.product?.kind === "service";
  const left = Math.max(0, DOWNLOAD_LIMIT - order.download_count);
  return (
    <div className="shop-status">
      <p className="pf-tile-kind">Paid · {formatCentavos(order.amount)}</p>
      <h1>Thank you, {order.buyer_name.split(" ")[0]}!</h1>
      <p>You bought <strong>{order.product_title}</strong>. {order.receipt_sent_at ? `A receipt was sent to ${order.buyer_email}.` : `Keep this page's link: it is your receipt.`}</p>
      {isService ? (
        <div className="shop-next">
          <h2>What happens next</h2>
          <p className="shop-pre">{order.product?.service_instructions || "I'll email you within 1 business day to schedule and get started."}</p>
        </div>
      ) : order.product?.file_path ? (
        <div className="shop-next">
          <a className="pf-pill" href={downloadUrl(order.id)}>Download <ArrowDown size={15} aria-hidden="true" /></a>
          <p className="shop-note">{left} of {DOWNLOAD_LIMIT} downloads left, within {DOWNLOAD_DAYS} days of payment.</p>
        </div>
      ) : (
        <p>Your file is being prepared. I&apos;ll email it to you shortly.</p>
      )}
      <p className="shop-note">Order {order.id} · Questions? <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
    </div>
  );
}
