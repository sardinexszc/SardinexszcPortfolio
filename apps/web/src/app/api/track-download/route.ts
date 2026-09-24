import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const filename = "2026_ICLSalinas_Resume.pdf";

export async function GET() {
  try {
    const file = await readFile(path.join(process.cwd(), "public", "files", filename));
    const { error } = await createAdminClient().from("resume_downloads").insert({});
    if (error) throw error;
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(file.length),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Resume delivery failed", error);
    return NextResponse.json({ error: "Resume temporarily unavailable" }, { status: 503 });
  }
}
