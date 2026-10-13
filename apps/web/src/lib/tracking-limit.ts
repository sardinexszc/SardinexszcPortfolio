import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Vercel supplies x-vercel-forwarded-for at the edge. Avoid storing the address itself in Supabase.
export function clientAddress(headers: Headers): string {
  const address = headers.get("x-vercel-forwarded-for") ?? headers.get("x-forwarded-for") ?? "local";
  return address.split(",")[0].trim();
}

export async function consumeRateLimit(host: string, address: string, action: string, limit: number, windowSeconds = 60): Promise<boolean> {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("Supabase server credentials are missing");
  const bucket = createHmac("sha256", secret).update(`${host}:${action}:${address}`).digest("hex");
  const { data, error } = await createAdminClient().rpc("consume_portfolio_limit", {
    p_bucket: bucket,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error || typeof data !== "boolean") throw error ?? new Error("Tracking rate limit unavailable");
  return data;
}

export async function consumeTrackingLimit(request: NextRequest, action: string, limit: number): Promise<boolean> {
  return consumeRateLimit(request.nextUrl.hostname, clientAddress(request.headers), action, limit);
}

export function trackingLimitResponse() {
  return NextResponse.json({ success: false, code: "rate_limited" }, {
    status: 429,
    headers: { "Cache-Control": "no-store", "Retry-After": "60" },
  });
}
