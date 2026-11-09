import { NextRequest } from "next/server";
import { profile } from "@/lib/profile";
import { serveTrackedDocument } from "@/lib/serve-document";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The one-page résumé. Analytics must never stop a recruiter from getting it.
export function GET(request: NextRequest) {
  return serveTrackedDocument(request, { filename: profile.resumeFilename, table: "resume_downloads", limitAction: "resume", label: "Resume" });
}
