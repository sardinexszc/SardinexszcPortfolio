import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeTrackingLimit } from "@/lib/tracking-limit";

type TrackedDocument = {
  filename: string; // file in assets/resume, also the download name
  table: "resume_downloads" | "cv_downloads"; // one row per counted download
  limitAction: string; // rate-limit bucket: at most 10 counted downloads a minute per address
  label: string; // for logs and the error message
};

// Serves a private PDF from assets/resume and counts the download.
// Counting never blocks the file: rate-limited or failed tracking still returns the PDF.
export async function serveTrackedDocument(request: NextRequest, doc: TrackedDocument) {
  let pdf: Buffer;
  try {
    pdf = await readFile(path.join(process.cwd(), "assets", "resume", doc.filename));
  } catch (error) {
    console.error(`${doc.label} file could not be read`, error);
    return NextResponse.json({ success: false, code: "download_unavailable", message: `${doc.label} download is temporarily unavailable. Please try again.` }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  try {
    if (await consumeTrackingLimit(request, doc.limitAction, 10)) {
      const { error } = await createAdminClient().from(doc.table).insert({});
      if (error) throw error;
    }
  } catch (error) {
    console.error(`${doc.label} download tracking failed`, error);
  }

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${doc.filename}"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "private, no-store",
    },
  });
}
