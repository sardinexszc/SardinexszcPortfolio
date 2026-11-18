import { NextRequest } from "next/server";
import { profile } from "@/lib/profile";
import { serveTrackedDocument } from "@/lib/serve-document";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The full CV, counted separately from the résumé (needs sql/portfolio_cv_downloads.sql).
export function GET(request: NextRequest) {
  return serveTrackedDocument(request, { filename: profile.cvFilename, table: "cv_downloads", limitAction: "cv", label: "CV" });
}
