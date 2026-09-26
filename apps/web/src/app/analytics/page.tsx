import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { AuthNotice } from "@/components/auth-feedback";
import { getPortfolio } from "@/lib/api";
import { projectDisplayTitle } from "@/lib/work-projects";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  await requireAdmin();
  const { notice } = await searchParams;

  let visitorCount: number | null = null;
  let downloadCount: number | null = null;
  let countsError = false;
  let engagementError = false;
  let audienceError = false;
  let eventCounts: Array<{ event_type: string; project_id: number | null; link_kind: string | null; total: number }> = [];
  let locationCounts: Array<{ country_code: string; city: string; visits: number }> = [];
  let deviceCounts: Array<{ device_type: string; browser: string; visits: number }> = [];
  let sessionSummary: { visits: number; engaged_visits: number; average_active_seconds: number } | null = null;
  const projects = (await getPortfolio()).projects;
  if (process.env.SUPABASE_SECRET_KEY) {
    const db = createAdminClient();
    try {
      const [visitors, downloads] = await Promise.all([
        db.from("visitors").select("*", { count: "exact", head: true }),
        db.from("resume_downloads").select("*", { count: "exact", head: true }),
      ]);
      if (visitors.error || downloads.error) throw visitors.error ?? downloads.error;
      visitorCount = visitors.count;
      downloadCount = downloads.count;
    } catch (error) {
      console.error("Analytics counts could not be loaded", error);
      countsError = true;
    }
    try {
      const { data, error } = await db.from("portfolio_event_counts")
        .select("event_type, project_id, link_kind, total")
        .eq("site_host", "ivansalinas.vercel.app");
      if (error) throw error;
      eventCounts = data ?? [];
    } catch (error) {
      console.error("Engagement counts could not be loaded", error);
      engagementError = true;
    }
    try {
      const [locations, devices, sessions] = await Promise.all([
        db.from("portfolio_location_counts").select("country_code, city, visits").eq("site_host", "ivansalinas.vercel.app"),
        db.from("portfolio_device_counts").select("device_type, browser, visits").eq("site_host", "ivansalinas.vercel.app"),
        db.from("portfolio_session_summary").select("visits, engaged_visits, average_active_seconds").eq("site_host", "ivansalinas.vercel.app").maybeSingle(),
      ]);
      if (locations.error || devices.error || sessions.error) throw locations.error ?? devices.error ?? sessions.error;
      locationCounts = locations.data ?? [];
      deviceCounts = devices.data ?? [];
      sessionSummary = sessions.data;
    } catch (error) {
      console.error("Audience insights could not be loaded", error);
      audienceError = true;
    }
  }

  const countFor = (type: string, projectId: number | null, linkKind: string | null = null) =>
    Number(eventCounts.find((row) => row.event_type === type && row.project_id === projectId && row.link_kind === linkKind)?.total ?? 0);
  const rankedProjects = projects.map((project) => ({
    id: project.id,
    title: projectDisplayTitle(project),
    opens: countFor("project_open", project.id),
    liveClicks: countFor("outbound_click", project.id, "live_project"),
    githubClicks: countFor("outbound_click", project.id, "github_repository"),
  })).sort((a, b) => b.opens - a.opens);
  const totalOutbound = eventCounts.filter((row) => row.event_type === "outbound_click")
    .reduce((total, row) => total + Number(row.total), 0);
  const engagementAvailable = !engagementError && Boolean(process.env.SUPABASE_SECRET_KEY);
  const displayCount = (count: number) => engagementAvailable ? count : "—";
  const totalSessions = Number(sessionSummary?.visits ?? 0);
  const engagedSessions = Number(sessionSummary?.engaged_visits ?? 0);
  const averageSeconds = Number(sessionSummary?.average_active_seconds ?? 0);
  const nonEngagedRate = totalSessions ? Math.round((1 - engagedSessions / totalSessions) * 100) : null;
  const audienceAvailable = !audienceError && Boolean(process.env.SUPABASE_SECRET_KEY);
  const groupCounts = <T extends { visits: number }>(rows: T[], key: (row: T) => string) => {
    const grouped = new Map<string, number>();
    for (const row of rows) grouped.set(key(row), (grouped.get(key(row)) ?? 0) + Number(row.visits));
    return [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  };
  const countries = groupCounts(locationCounts, (row) => row.country_code);
  const cities = [...locationCounts].sort((a, b) => Number(b.visits) - Number(a.visits));
  const devices = groupCounts(deviceCounts, (row) => row.device_type);
  const browsers = groupCounts(deviceCounts, (row) => row.browser);
  const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
  const countryLabel = (code: string) => code === "Unknown" ? code : countryNames.of(code) ?? code;
  const activeTime = averageSeconds >= 60 ? `${Math.floor(averageSeconds / 60)}m ${averageSeconds % 60}s` : `${averageSeconds}s`;

  return (
    <div className="dashboard-content">
      <header className="dashboard-page-header">
        <p className="analytics-eyebrow">OVERVIEW / 01</p>
        <h1>Engagement dashboard</h1>
        <p>Unique browsers and resume downloads since tracking was enabled.</p>
      </header>
      {notice === "signed-in" && <AuthNotice message="Signed in successfully." successNotice="signed-in" />}
      {notice === "signout-failed" && <AuthNotice message="Could not sign out. Please try again." error />}
      {!process.env.SUPABASE_SECRET_KEY && <p role="status">Analytics data will appear after the Supabase server key is configured.</p>}
      {countsError && <p role="alert" className="analytics-error">Analytics counts could not be loaded. <Link href="/analytics">Try again</Link>.</p>}
      {engagementError && <p role="alert" className="analytics-error">Engagement counts could not be loaded. <Link href="/analytics">Try again</Link>.</p>}
      {audienceError && <p role="alert" className="analytics-error">Audience insights could not be loaded. <Link href="/analytics">Try again</Link>.</p>}
      <div className="analytics-grid">
        <section className="analytics-card"><h2>Unique visitors</h2><strong>{visitorCount ?? "—"}</strong><p>Browser cookies counted once.</p></section>
        <section className="analytics-card"><h2>Resume downloads</h2><strong>{downloadCount ?? "—"}</strong><p>Recorded PDF responses.</p></section>
      </div>
      <div className="engagement-panels">
        <section className="analytics-card engagement-panel">
          <div className="engagement-panel-heading"><div><p className="analytics-eyebrow">PROJECT INTEREST</p><h2>Most explored projects</h2></div><span>Detail opens</span></div>
          <ol className="engagement-list">
            {rankedProjects.map((project) => <li key={project.id}>
              <div><strong>{project.title}</strong><small>Live link: {displayCount(project.liveClicks)} · GitHub: {displayCount(project.githubClicks)}</small></div>
              <span>{displayCount(project.opens)}</span>
            </li>)}
          </ol>
        </section>
        <section className="analytics-card engagement-panel">
          <div className="engagement-panel-heading"><div><p className="analytics-eyebrow">OUTBOUND TRAFFIC</p><h2>Links followed</h2></div><span>Total clicks</span></div>
          <p className="engagement-total">{displayCount(totalOutbound)}</p>
          <ul className="engagement-list engagement-list-compact">
            <li><span>GitHub profile</span><span>{displayCount(countFor("outbound_click", null, "github_profile"))}</span></li>
            <li><span>LinkedIn profile</span><span>{displayCount(countFor("outbound_click", null, "linkedin_profile"))}</span></li>
            <li><span>Live project links</span><span>{displayCount(rankedProjects.reduce((total, project) => total + project.liveClicks, 0))}</span></li>
            <li><span>GitHub repository links</span><span>{displayCount(rankedProjects.reduce((total, project) => total + project.githubClicks, 0))}</span></li>
          </ul>
        </section>
      </div>
      <p className="engagement-footnote">Project activity is counted from this release onward on the production site. Preview activity is excluded.</p>
      <div className="audience-panels">
        <section className="analytics-card engagement-panel">
          <p className="analytics-eyebrow">AUDIENCE</p>
          <h2>Visitor locations</h2>
          <p className="audience-note">Approximate location based on network information. Counts are visits.</p>
          <h3>Countries</h3>
          <ul className="engagement-list engagement-list-compact">{countries.slice(0, 5).map(([country, visits]) =>
            <li key={country}><span>{countryLabel(country)}</span><span>{visits}</span></li>)}</ul>
          <h3>Cities</h3>
          <ul className="engagement-list engagement-list-compact">{cities.slice(0, 5).map((row) =>
            <li key={`${row.country_code}-${row.city}`}><span>{row.city}, {row.country_code}</span><span>{row.visits}</span></li>)}</ul>
          {audienceAvailable && !countries.length && <p className="audience-note">No visits recorded yet.</p>}
          {!audienceAvailable && <p className="audience-note">—</p>}
        </section>
        <section className="analytics-card engagement-panel">
          <p className="analytics-eyebrow">DEVICES</p>
          <h2>How visitors browse</h2>
          <p className="audience-note">Broad categories inferred from the browser, not a device fingerprint.</p>
          <h3>Device type</h3>
          <ul className="engagement-list engagement-list-compact">{devices.map(([device, visits]) =>
            <li key={device}><span>{device}</span><span>{visits}</span></li>)}</ul>
          <h3>Browser</h3>
          <ul className="engagement-list engagement-list-compact">{browsers.map(([browser, visits]) =>
            <li key={browser}><span>{browser}</span><span>{visits}</span></li>)}</ul>
          {audienceAvailable && !devices.length && <p className="audience-note">No visits recorded yet.</p>}
          {!audienceAvailable && <p className="audience-note">—</p>}
        </section>
      </div>
      <section className="analytics-card session-panel">
        <div><p className="analytics-eyebrow">ENGAGEMENT</p><h2>Time spent exploring</h2>
          <p className="audience-note">Active time excludes the landing loader and time in a hidden tab. Values are estimates.</p></div>
        <div className="session-metrics">
          <div><span>Average active time</span><strong>{audienceAvailable && totalSessions ? activeTime : "—"}</strong></div>
          <div><span>Engaged visits</span><strong>{audienceAvailable ? engagedSessions : "—"}</strong></div>
          <div><span>Non-engaged visits</span><strong>{audienceAvailable && nonEngagedRate !== null ? `${nonEngagedRate}%` : "—"}</strong></div>
        </div>
        <p className="audience-note">A visit is engaged after 10 active seconds or a recorded project/link interaction. Preview visits are excluded.</p>
      </section>
    </div>
  );
}
