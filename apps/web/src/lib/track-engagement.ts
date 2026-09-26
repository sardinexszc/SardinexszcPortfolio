import { getPortfolioSession } from "@/lib/portfolio-session";

export type EngagementEvent =
  | { type: "project_open"; projectId: number }
  | { type: "outbound_click"; projectId: number; linkKind: "live_project" | "github_repository" }
  | { type: "outbound_click"; linkKind: "github_profile" | "linkedin_profile" };

export function trackEngagement(event: EngagementEvent) {
  const body = JSON.stringify({ ...event, sessionId: getPortfolioSession().id });
  const url = "/api/track-engagement";
  if (navigator.sendBeacon?.(url, new Blob([body], { type: "application/json" }))) return;
  void fetch(url, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => {
    // An analytics request must never interrupt navigation.
  });
}
