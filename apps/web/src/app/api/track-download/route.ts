import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const filename = "2026_ICLSalinas_Resume.pdf";

export async function GET(request: NextRequest) {
  try {
    const { error } = await createAdminClient().from("resume_downloads").insert({});
    if (error) throw error;
    return NextResponse.redirect(new URL(`/files/${filename}`, request.url), {
      status: 307,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Resume delivery failed", error);
    return NextResponse.json({ success: false, code: "download_unavailable", message: "Resume download is temporarily unavailable. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
