import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeTrackingLimit } from "@/lib/tracking-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const filename = "2026_ICLSalinas_Resume.pdf";

async function recordDownload(request: NextRequest) {
  // Rate-limited requests still get the resume; they just are not counted again.
  if (!await consumeTrackingLimit(request, "resume", 10)) return;
  const { error } = await createAdminClient().from("resume_downloads").insert({});
  if (error) throw error;
}

export async function GET(request: NextRequest) {
  let pdf: Buffer;
  try {
    pdf = await readFile(path.join(process.cwd(), "assets", "resume", filename));
  } catch (error) {
    console.error("Resume file could not be read", error);
    return NextResponse.json({ success: false, code: "download_unavailable", message: "Resume download is temporarily unavailable. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  try {
    await recordDownload(request);
  } catch (error) {
    // Analytics must never stop a recruiter from getting the resume.
    console.error("Resume download tracking failed", error);
  }

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "private, no-store",
    },
  });
}
