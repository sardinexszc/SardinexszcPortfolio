import "server-only";

// PayMongo through its REST API (https://developers.paymongo.com). No SDK: two calls and one signature check.
const API = "https://api.paymongo.com/v1";
export const PAYMENT_METHODS = ["gcash", "paymaya", "card"] as const;

export function paymongoConfigured() {
  return Boolean(process.env.PAYMONGO_SECRET_KEY);
}

function authHeader() {
  const key = process.env.PAYMONGO_SECRET_KEY;
  if (!key) throw new Error("PAYMONGO_SECRET_KEY is not set");
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: authHeader(), "Content-Type": "application/json", Accept: "application/json", ...init?.headers },
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = body?.errors?.map((e: { detail?: string }) => e.detail).join("; ") || response.statusText;
    throw new Error(`PayMongo ${path} failed (${response.status}): ${detail}`);
  }
  return body as T;
}

export type CheckoutSession = {
  id: string;
  attributes: {
    checkout_url: string;
    status: string; // "active" | "expired"
    metadata?: Record<string, string> | null;
    payments?: { id: string; attributes: { amount: number; currency: string; status: string } }[];
    line_items?: { amount: number; currency: string; quantity: number }[];
  };
};

export async function createCheckoutSession(input: {
  orderId: string; productTitle: string; description: string; amount: number;
  buyerName: string; buyerEmail: string; successUrl: string; cancelUrl: string;
}): Promise<CheckoutSession> {
  const { data } = await call<{ data: CheckoutSession }>("/checkout_sessions", {
    method: "POST",
    body: JSON.stringify({
      data: {
        attributes: {
          line_items: [{ name: input.productTitle, description: input.description.slice(0, 255) || input.productTitle, amount: input.amount, currency: "PHP", quantity: 1 }],
          payment_method_types: PAYMENT_METHODS,
          billing: { name: input.buyerName, email: input.buyerEmail },
          description: input.productTitle,
          reference_number: input.orderId,
          metadata: { order_id: input.orderId },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
        },
      },
    }),
  });
  return data;
}

export async function retrieveCheckoutSession(id: string): Promise<CheckoutSession> {
  const { data } = await call<{ data: CheckoutSession }>(`/checkout_sessions/${encodeURIComponent(id)}`);
  return data;
}

// The paid payment on a session, if any.
export function paidPayment(session: CheckoutSession) {
  return session.attributes.payments?.find((payment) => payment.attributes.status === "paid") ?? null;
}

export { verifyWebhookSignature } from "./signature";
