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
    const { error } = await createAdminClient()
      .from("visitors")
      .upsert({ visitor_id: visitorId }, { onConflict: "visitor_id", ignoreDuplicates: true });
    if (error) throw error;
    const response = NextResponse.json({ success: true, recorded: true, newVisitor: !existing || !uuidPattern.test(existing) }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(cookieName, visitorId, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
      path: "/", maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch (error) {
    console.error("Visit tracking failed", error);
    return NextResponse.json({ success: false, code: "tracking_unavailable", message: "Visit tracking is temporarily unavailable." }, { status: 503 });
  }
}
