import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const cookieName = "portfolio_visitor_id";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ success: false, code: "invalid_origin", message: "Visit could not be recorded." }, { status: 403 });
  }
  const existing = request.cookies.get(cookieName)?.value;
  const visitorId = existing && uuidPattern.test(existing) ? existing : randomUUID();
  try {
    const body = await request.text();
    if (body.length > 128) return NextResponse.json({ success: false, code: "invalid_session" }, { status: 400 });
    const payload: unknown = body ? JSON.parse(body) : null;
    const suppliedSession = payload && typeof payload === "object" && !Array.isArray(payload)
      ? (payload as Record<string, unknown>).sessionId : null;
    const sessionId = typeof suppliedSession === "string" && uuidPattern.test(suppliedSession)
      ? suppliedSession : randomUUID();
    const db = createAdminClient();
    const { error } = await db
      .from("visitors")
      .upsert({ visitor_id: visitorId }, { onConflict: "visitor_id", ignoreDuplicates: true });
    if (error) throw error;
    const agent = request.headers.get("user-agent") ?? "";
    const cityHeader = request.headers.get("x-vercel-ip-city");
    let city: string | null = null;
    try { city = cityHeader ? decodeURIComponent(cityHeader).slice(0, 80) : null; } catch { /* Unknown city. */ }
    const countryHeader = request.headers.get("x-vercel-ip-country")?.toUpperCase();
    const country = countryHeader && /^[A-Z]{2}$/.test(countryHeader) ? countryHeader : null;
    const device = /iPad|Tablet|Android(?!.*Mobile)/i.test(agent) ? "Tablet" :
      /Mobile|iPhone|Android/i.test(agent) ? "Mobile" : agent ? "Desktop" : "Other";
    const browser = /Edg|EdgiOS|Edge/i.test(agent) ? "Edge" :
      /Firefox|FxiOS/i.test(agent) ? "Firefox" : /Chrome|CriOS/i.test(agent) ? "Chrome" :
      /Safari/i.test(agent) ? "Safari" : "Other";
    const { error: sessionError } = await db.from("portfolio_sessions").upsert({
      session_id: sessionId,
      visitor_id: visitorId,
      site_host: request.nextUrl.hostname.toLowerCase(),
      country_code: country,
      city,
      device_type: device,
      browser,
    }, { onConflict: "session_id", ignoreDuplicates: true });
    if (sessionError) throw sessionError;
    const response = NextResponse.json({ success: true, recorded: true, sessionId, newVisitor: !existing || !uuidPattern.test(existing) }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(cookieName, visitorId, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
      path: "/", maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ success: false, code: "invalid_session" }, { status: 400 });
    console.error("Visit tracking failed", error);
    return NextResponse.json({ success: false, code: "tracking_unavailable", message: "Visit tracking is temporarily unavailable." }, { status: 503 });
  }
}
