import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ success: false, code: "invalid_origin" }, { status: 403 });
  }
  try {
    const body = await request.text();
    if (body.length > 128) return NextResponse.json({ success: false, code: "invalid_activity" }, { status: 400 });
    const payload: unknown = JSON.parse(body);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ success: false, code: "invalid_activity" }, { status: 400 });
    }
    const { sessionId, activeSeconds } = payload as Record<string, unknown>;
    if (typeof sessionId !== "string" || !uuidPattern.test(sessionId) ||
      typeof activeSeconds !== "number" || !Number.isInteger(activeSeconds) || activeSeconds < 1 || activeSeconds > 86400) {
      return NextResponse.json({ success: false, code: "invalid_activity" }, { status: 400 });
    }
    const { error } = await createAdminClient().from("portfolio_sessions")
      .update({ active_seconds: activeSeconds, last_active_at: new Date().toISOString() })
      .eq("session_id", sessionId)
      .eq("site_host", request.nextUrl.hostname.toLowerCase())
      .lt("active_seconds", activeSeconds);
    if (error) throw error;
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ success: false, code: "invalid_activity" }, { status: 400 });
    console.error("Session tracking failed", error);
    return NextResponse.json({ success: false, code: "tracking_unavailable" }, { status: 503 });
  }
}
