import { createHmac, timingSafeEqual } from "node:crypto";

// No "server-only" import, so the unit tests can load it directly; it only runs in server code.
// Verifies the Paymongo-Signature header: "t=<unix seconds>,te=<test signature>,li=<live signature>".
// The signature is HMAC-SHA256 of "<t>.<raw body>" with the webhook's secret key; te is set for test-mode
// events and li for live ones. Events older than toleranceSeconds are refused to stop replays.
export function verifyWebhookSignature(header: string | null, rawBody: string, secret: string, livemode: boolean, now = Date.now(), toleranceSeconds = 300): boolean {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((part) => {
    const index = part.indexOf("=");
    return [part.slice(0, index).trim(), part.slice(index + 1).trim()];
  }));
  const timestamp = Number(parts.t);
  const signature = livemode ? parts.li : parts.te;
  if (!Number.isFinite(timestamp) || !signature) return false;
  if (Math.abs(now / 1000 - timestamp) > toleranceSeconds) return false;
  const expected = createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
