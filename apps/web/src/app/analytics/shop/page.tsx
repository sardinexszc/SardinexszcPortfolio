import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { PageHeader } from "@/components/dashboard-page-header";
import { CmsStatus } from "@/components/cms-fields";
import { ConfirmSubmit } from "@/components/cms-confirm";
import { paymongoConfigured } from "@/lib/payments/paymongo";
import { emailConfigured } from "@/lib/email";
import { DOWNLOAD_LIMIT, formatCentavos } from "@/lib/shop";
import { markRefunded, resendReceipt, resetDownloads } from "./actions";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string; status: string; product_title: string; buyer_name: string; buyer_email: string; amount: number;
  download_count: number; created_at: string; paid_at: string | null; receipt_sent_at: string | null; product: { kind: string } | null;
};

// Abandoned checkouts stay pending; after a day they are just noise.
const isStale = (order: { status: string; created_at: string }) => order.status === "pending" && Date.now() - new Date(order.created_at).getTime() > 24 * 3600 * 1000;

const when = (iso: string) => new Date(iso).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });

export default async function ShopOrdersPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const { saved, error } = await searchParams;
  let orders: OrderRow[] = [];
  let loadError = false;
  try {
    const { data, error: dbError } = await createAdminClient().from("orders")
      .select("id,status,product_title,buyer_name,buyer_email,amount,download_count,created_at,paid_at,receipt_sent_at,product:products(kind)")
      .order("created_at", { ascending: false }).limit(200);
    if (dbError) throw dbError;
    orders = (data ?? []) as unknown as OrderRow[];
  } catch (dbError) {
    console.error("Orders could not be loaded", dbError);
    loadError = true;
  }
  const paid = orders.filter((order) => order.status === "paid");
  // The 1st of this month at 00:00 in Manila (UTC+8, no daylight saving).
  const [year, month] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit" }).format(new Date()).split("-").map(Number);
  const monthStart = Date.UTC(year, month - 1, 1) - 8 * 3600 * 1000;
  const thisMonth = paid.filter((order) => order.paid_at && new Date(order.paid_at).getTime() >= monthStart);
  const sum = (rows: OrderRow[]) => rows.reduce((total, order) => total + order.amount, 0);

  const setup = [
    { label: "PayMongo checkout", ok: paymongoConfigured(), fix: "Add PAYMONGO_SECRET_KEY in Vercel" },
    { label: "Payment webhook", ok: Boolean(process.env.PAYMONGO_WEBHOOK_SECRET), fix: "Add PAYMONGO_WEBHOOK_SECRET in Vercel" },
    { label: "Receipt emails", ok: emailConfigured(), fix: "Add RESEND_API_KEY and SHOP_FROM_EMAIL in Vercel" },
  ];

  return (
    <div className="dashboard-content">
      <PageHeader eyebrow="/ Shop (04)" title="Shop" lede="Orders and sales, in Philippine time. Edit products under Content > Shop products." />
      <CmsStatus saved={saved} error={error ?? (loadError ? "Orders could not be loaded. Reload to try again." : undefined)} />
      <div className="db-grid">
        <section className="analytics-card db-card db-kpi db-span-3"><h2>Sales this month</h2><strong>{formatCentavos(sum(thisMonth))}</strong><p className="audience-note">{thisMonth.length} paid order{thisMonth.length === 1 ? "" : "s"}</p></section>
        <section className="analytics-card db-card db-kpi db-span-3"><h2>Sales, last 200 orders</h2><strong>{formatCentavos(sum(paid))}</strong><p className="audience-note">{paid.length} paid</p></section>
        <section className="analytics-card db-card db-span-6">
          <div className="db-card-head"><div><p className="analytics-eyebrow">SETUP</p><h2>Ready to sell?</h2></div><Link href="/analytics/content/products">Edit products</Link></div>
          <ul className="shop-setup">
            {setup.map((item) => <li key={item.label}><span aria-hidden="true">{item.ok ? "✓" : "○"}</span> {item.label}: {item.ok ? "connected" : item.fix}</li>)}
          </ul>
        </section>
        <section className="analytics-card db-card db-span-12">
          <div className="db-card-head"><div><p className="analytics-eyebrow">ORDERS</p><h2>Latest orders</h2></div><span>{orders.length}</span></div>
          {orders.length === 0 ? <p className="audience-note">No orders yet.</p> : (
            <ol className="engagement-list shop-orders">
              {orders.map((order) => (
                <li key={order.id}>
                  <div>
                    <strong>{order.product_title} · {formatCentavos(order.amount)}</strong>
                    <small>{order.buyer_name} · <a href={`mailto:${order.buyer_email}`}>{order.buyer_email}</a></small>
                    <small>{when(order.created_at)} · {isStale(order) ? "abandoned" : order.status}{order.status === "paid" && order.product?.kind !== "service" ? ` · ${order.download_count}/${DOWNLOAD_LIMIT} downloads` : ""}{order.status === "paid" ? (order.receipt_sent_at ? " · receipt sent" : " · no receipt sent") : ""} · {order.id.slice(0, 8)}</small>
                  </div>
                  {order.status === "paid" ? (
                    <form className="shop-order-actions">
                      <input type="hidden" name="id" value={order.id} />
                      <ConfirmSubmit className="db-button db-button-ghost" formAction={resendReceipt}>Resend receipt</ConfirmSubmit>
                      {order.product?.kind !== "service" ? <ConfirmSubmit className="db-button db-button-ghost" formAction={resetDownloads} confirm="Give this buyer 5 new downloads for 7 days?">Reset downloads</ConfirmSubmit> : null}
                      <ConfirmSubmit className="db-button db-button-ghost" formAction={markRefunded} confirm="Mark as refunded? Issue the refund in the PayMongo dashboard first. Downloads stop.">Mark refunded</ConfirmSubmit>
                    </form>
                  ) : <span>{isStale(order) ? "—" : order.status}</span>}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
