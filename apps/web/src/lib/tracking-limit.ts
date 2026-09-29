import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Vercel supplies this header at the edge. Avoid storing the address itself in Supabase.
export async function consumeTrackingLimit(request: NextRequest, action: string, limit: number): Promise<boolean> {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("Supabase server credentials are missing");
  const address = request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ?? "local";
  const identity = `${request.nextUrl.hostname}:${action}:${address.split(",")[0].trim()}`;
  const bucket = createHmac("sha256", secret).update(identity).digest("hex");
  const { data, error } = await createAdminClient().rpc("consume_portfolio_limit", {
    p_bucket: bucket,
    p_limit: limit,
    p_window_seconds: 60,
  });
  if (error || typeof data !== "boolean") throw error ?? new Error("Tracking rate limit unavailable");
  return data;
}

export function trackingLimitResponse() {
  return NextResponse.json({ success: false, code: "rate_limited" }, {
    status: 429,
    headers: { "Cache-Control": "no-store", "Retry-After": "60" },
  });
}
