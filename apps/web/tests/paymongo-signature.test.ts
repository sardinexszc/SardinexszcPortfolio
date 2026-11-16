// Run: npm test  (node --test with type stripping; react-server condition so "server-only" imports load)
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyWebhookSignature } from "../src/lib/payments/signature.ts";

const secret = "whsk_test_secret";
const body = JSON.stringify({ data: { id: "evt_1", attributes: { type: "checkout_session.payment.paid", livemode: false } } });
const now = 1_800_000_000_000;
const t = String(now / 1000);
const sign = (payload: string, key = secret, ts = t) => createHmac("sha256", key).update(`${ts}.${payload}`).digest("hex");

test("accepts a valid test-mode signature", () => {
  assert.equal(verifyWebhookSignature(`t=${t},te=${sign(body)},li=`, body, secret, false, now), true);
});

test("accepts a valid live-mode signature only in the li field", () => {
  assert.equal(verifyWebhookSignature(`t=${t},te=,li=${sign(body)}`, body, secret, true, now), true);
  assert.equal(verifyWebhookSignature(`t=${t},te=${sign(body)},li=`, body, secret, true, now), false);
});

test("rejects a tampered body", () => {
  assert.equal(verifyWebhookSignature(`t=${t},te=${sign(body)},li=`, body.replace("evt_1", "evt_2"), secret, false, now), false);
});

test("rejects the wrong secret", () => {
  assert.equal(verifyWebhookSignature(`t=${t},te=${sign(body, "other")},li=`, body, secret, false, now), false);
});

test("rejects a stale event (replay)", () => {
  const old = String(now / 1000 - 600);
  assert.equal(verifyWebhookSignature(`t=${old},te=${sign(body, secret, old)},li=`, body, secret, false, now), false);
});

test("rejects missing or malformed headers", () => {
  assert.equal(verifyWebhookSignature(null, body, secret, false, now), false);
  assert.equal(verifyWebhookSignature("garbage", body, secret, false, now), false);
  assert.equal(verifyWebhookSignature(`t=${t},te=${sign(body)}`, body, "", false, now), false);
});
