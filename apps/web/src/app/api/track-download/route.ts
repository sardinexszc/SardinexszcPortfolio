import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeTrackingLimit, trackingLimitResponse } from "@/lib/tracking-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const filename = "2026_ICLSalinas_Resume.pdf";

export async function GET(request: NextRequest) {
  try {
    if (!await consumeTrackingLimit(request, "resume", 10)) return trackingLimitResponse();
    const pdf = await readFile(path.join(process.cwd(), "assets", "resume", filename));
    const { error } = await createAdminClient().from("resume_downloads").insert({});
    if (error) throw error;
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdf.length),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Resume delivery failed", error);
    return NextResponse.json({ success: false, code: "download_unavailable", message: "Resume download is temporarily unavailable. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
