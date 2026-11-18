import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature, type CheckoutSession } from "@/lib/payments/paymongo";
import { markOrderPaid, UUID } from "@/lib/shop-orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WebhookEvent = { data?: { id?: string; attributes?: { type?: string; livemode?: boolean; data?: CheckoutSession } } };

// PayMongo calls this when a checkout is paid. Register it in the PayMongo dashboard (Developers > Webhooks)
// for the event checkout_session.payment.paid, and put the webhook's secret key in PAYMONGO_WEBHOOK_SECRET.
// Answering 2xx tells PayMongo to stop retrying, so only signature and server errors return an error code.
export async function POST(request: NextRequest) {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const raw = await request.text();
  let event: WebhookEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const attributes = event.data?.attributes;
  const livemode = attributes?.livemode === true;
  if (!verifyWebhookSignature(request.headers.get("paymongo-signature"), raw, secret, livemode)) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }
  const eventId = event.data?.id;
  const type = attributes?.type;
  if (!eventId || !type) return NextResponse.json({ error: "bad_event" }, { status: 400 });

  try {
    const db = createAdminClient();
    // Record each event once; a retried event that was already processed is acknowledged and skipped.
    const { error: insertError } = await db.from("payment_events").insert({ event_id: eventId, event_type: type, livemode, payload: event });
    if (insertError?.code === "23505") return NextResponse.json({ received: true, duplicate: true });
    if (insertError) throw insertError;

    if (type === "checkout_session.payment.paid" && attributes?.data) {
      const orderId = attributes.data.attributes?.metadata?.order_id;
      if (!orderId || !UUID.test(orderId)) return NextResponse.json({ received: true, ignored: "no_order" });
      const result = await markOrderPaid(orderId, attributes.data);
      if (result === "mismatch") console.error("Webhook did not match its order", { eventId, orderId });
      return NextResponse.json({ received: true, result });
    }
    return NextResponse.json({ received: true, ignored: type });
  } catch (error) {
    console.error("PayMongo webhook failed", error);
    // Let PayMongo retry; the event row may exist, so remove it so the retry is processed.
    await createAdminClient().from("payment_events").delete().eq("event_id", eventId).then(() => undefined, () => undefined);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
