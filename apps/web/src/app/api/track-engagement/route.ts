import { NextRequest, NextResponse } from "next/server";
import { getPortfolio } from "@/lib/api";
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
    if (body.length > 256) return NextResponse.json({ success: false, code: "invalid_event" }, { status: 400 });
    const event: unknown = JSON.parse(body);
    if (!event || typeof event !== "object" || Array.isArray(event)) {
      return NextResponse.json({ success: false, code: "invalid_event" }, { status: 400 });
    }
    const { type, projectId, linkKind, sessionId } = event as Record<string, unknown>;
    const projects = (await getPortfolio()).projects;
    const project = typeof projectId === "number" && Number.isInteger(projectId)
      ? projects.find((item) => item.id === projectId) : undefined;

    let record: { event_type: string; project_id: number | null; link_kind: string | null; site_host: string; session_id: string | null };
    const siteHost = request.nextUrl.hostname.toLowerCase();
    const session_id = typeof sessionId === "string" && uuidPattern.test(sessionId) ? sessionId : null;
    if (type === "project_open" && project && linkKind === undefined) {
      record = { event_type: type, project_id: project.id, link_kind: null, site_host: siteHost, session_id };
    } else if (type === "outbound_click" && project &&
      ((linkKind === "live_project" && project.live_url) || (linkKind === "github_repository" && project.github_url))) {
      record = { event_type: type, project_id: project.id, link_kind: linkKind, site_host: siteHost, session_id };
    } else if (type === "outbound_click" && projectId === undefined &&
      (linkKind === "github_profile" || linkKind === "linkedin_profile")) {
      record = { event_type: type, project_id: null, link_kind: linkKind, site_host: siteHost, session_id };
    } else {
      return NextResponse.json({ success: false, code: "invalid_event" }, { status: 400 });
    }

    const { error } = await createAdminClient().from("portfolio_events").insert(record);
    if (error) {
      console.error("Engagement database write failed", error);
      return NextResponse.json({ success: false, code: "database_write_failed" }, { status: 503 });
    }
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ success: false, code: "invalid_event" }, { status: 400 });
    console.error("Engagement tracking failed", error);
    const code = error instanceof Error && error.message === "Supabase server credentials are missing"
      ? "server_configuration_missing" : "tracking_unavailable";
    return NextResponse.json({ success: false, code }, { status: 503 });
  }
}
