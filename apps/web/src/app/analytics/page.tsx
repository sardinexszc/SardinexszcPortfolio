import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { AuthNotice } from "@/components/auth-feedback";
import { getPortfolio } from "@/lib/api";
import { projectDisplayTitle } from "@/lib/work-projects";
import { PageHeader } from "@/components/dashboard-page-header";
import { TrendChart } from "@/components/trend-chart";

export const dynamic = "force-dynamic";

type DailyRow = { day: string; visits: number; downloads: number; outbound: number; sessions: number; engaged: number };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  await requireAdmin();
  const { notice } = await searchParams;

  let visitorCount: number | null = null;
  let downloadCount: number | null = null;
  let countsError = false;
  let engagementError = false;
  let audienceError = false;
  let dailyError = false;
  let daily: DailyRow[] = [];
  let eventCounts: Array<{ event_type: string; project_id: number | null; link_kind: string | null; total: number }> = [];
  let locationCounts: Array<{ country_code: string; city: string; visits: number }> = [];
  let deviceCounts: Array<{ device_type: string; browser: string; visits: number }> = [];
  let sessionSummaries: Array<{ visits: number; engaged_visits: number; average_active_seconds: number }> = [];
  const projects = (await getPortfolio()).projects;
  if (process.env.SUPABASE_SECRET_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const db = createAdminClient();
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
      const { data, error } = await createAdminClient().from("portfolio_daily_counts")
        .select("day, visits, downloads, outbound, sessions, engaged").order("day");
      if (error) throw error;
      daily = data ?? [];
    } catch (error) {
      console.error("Daily counts could not be loaded", error);
      dailyError = true;
    }
    try {
      const db = createAdminClient();
      const { data, error } = await db.from("portfolio_event_counts")
        .select("event_type, project_id, link_kind, total");
      if (error) throw error;
      eventCounts = data ?? [];
    } catch (error) {
      console.error("Engagement counts could not be loaded", error);
      engagementError = true;
    }
    try {
      const db = createAdminClient();
      const [locations, devices, sessions] = await Promise.all([
        db.from("portfolio_location_counts").select("country_code, city, visits"),
        db.from("portfolio_device_counts").select("device_type, browser, visits"),
        db.from("portfolio_session_summary").select("visits, engaged_visits, average_active_seconds"),
      ]);
      if (locations.error || devices.error || sessions.error) throw locations.error ?? devices.error ?? sessions.error;
      locationCounts = locations.data ?? [];
      deviceCounts = devices.data ?? [];
      sessionSummaries = sessions.data ?? [];
    } catch (error) {
      console.error("Audience insights could not be loaded", error);
      audienceError = true;
    }
  }

  const countFor = (type: string, projectId: number | null, linkKind: string | null = null) =>
    eventCounts.filter((row) => row.event_type === type && row.project_id === projectId && row.link_kind === linkKind)
      .reduce((total, row) => total + Number(row.total), 0);
  const rankedProjects = projects.map((project) => {
    const liveClicks = countFor("outbound_click", project.id, "live_project");
    const githubClicks = countFor("outbound_click", project.id, "github_repository");
    return { id: project.id, title: projectDisplayTitle(project), opens: countFor("project_open", project.id), liveClicks, githubClicks, clicks: liveClicks + githubClicks };
  }).sort((a, b) => b.clicks - a.clicks || b.opens - a.opens);
  // Opens came from the old project dialog; the current home page links straight out.
  const legacyOpens = rankedProjects.reduce((total, project) => total + project.opens, 0);
  const totalOutbound = eventCounts.filter((row) => row.event_type === "outbound_click")
    .reduce((total, row) => total + Number(row.total), 0);
  const configured = Boolean(process.env.SUPABASE_SECRET_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL);
  const engagementAvailable = !engagementError && configured;
  const displayCount = (count: number) => engagementAvailable ? count : "—";
  const totalSessions = sessionSummaries.reduce((total, row) => total + Number(row.visits), 0);
  const engagedSessions = sessionSummaries.reduce((total, row) => total + Number(row.engaged_visits), 0);
  const averageSeconds = totalSessions ? Math.round(sessionSummaries.reduce((total, row) =>
    total + Number(row.average_active_seconds) * Number(row.visits), 0) / totalSessions) : 0;
  const nonEngagedRate = totalSessions ? Math.round((1 - engagedSessions / totalSessions) * 100) : null;
  const audienceAvailable = !audienceError && configured;
  const groupCounts = <T extends { visits: number }>(rows: T[], key: (row: T) => string) => {
    const grouped = new Map<string, number>();
    for (const row of rows) grouped.set(key(row), (grouped.get(key(row)) ?? 0) + Number(row.visits));
    return [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  };
  const countries = groupCounts(locationCounts, (row) => row.country_code);
  const cities = groupCounts(locationCounts, (row) => `${row.country_code}\u0000${row.city}`)
    .map(([label, visits]) => { const [country_code, city] = label.split("\u0000"); return { country_code, city, visits }; });
  const devices = groupCounts(deviceCounts, (row) => row.device_type);
  const browsers = groupCounts(deviceCounts, (row) => row.browser);
  const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
  const countryLabel = (code: string) => code === "Unknown" ? code : countryNames.of(code) ?? code;
  const activeTime = averageSeconds >= 60 ? `${Math.floor(averageSeconds / 60)}m ${averageSeconds % 60}s` : `${averageSeconds}s`;

  // Last 30 days against the 30 before, from the daily view (90 days, oldest first).
  const sum = (rows: DailyRow[], key: Exclude<keyof DailyRow, "day">) => rows.reduce((total, row) => total + Number(row[key]), 0);
  const last30 = daily.slice(-30), prev30 = daily.slice(-60, -30);
  const dailyAvailable = configured && !dailyError && daily.length >= 60;
  const rate = (rows: DailyRow[]) => sum(rows, "visits") ? (sum(rows, "downloads") / sum(rows, "visits")) * 100 : 0;
  const delta = (now: number, before: number, unit = "") => {
    const diff = Math.round((now - before) * 10) / 10;
    return diff === 0 ? "Same as the 30 days before" : `${diff > 0 ? "▲ +" : "▼ "}${diff}${unit} vs the 30 days before`;
  };
  const kpis = [
    { label: "New visitors", value: sum(last30, "visits"), change: delta(sum(last30, "visits"), sum(prev30, "visits")), note: visitorCount !== null ? `${visitorCount} all time` : null },
    { label: "Résumé downloads", value: sum(last30, "downloads"), change: delta(sum(last30, "downloads"), sum(prev30, "downloads")), note: downloadCount !== null ? `${downloadCount} all time` : null },
    { label: "Download rate", value: `${Math.round(rate(last30) * 10) / 10}%`, change: delta(rate(last30), rate(prev30), " pts"), note: "Downloads per new visitor" },
    { label: "Engaged visits", value: sum(last30, "engaged"), change: delta(sum(last30, "engaged"), sum(prev30, "engaged")), note: sum(last30, "sessions") ? `${Math.round((sum(last30, "engaged") / sum(last30, "sessions")) * 100)}% of ${sum(last30, "sessions")} visits` : null },
  ];
  const retry = (what: string) => <p role="alert" className="analytics-error db-card-error">{what} could not be loaded. <Link href="/analytics">Try again</Link></p>;

  return (
    <div className="dashboard-content">
      <PageHeader eyebrow="/ Overview (01)" title="Dashboard" lede="Is the portfolio working? The last 30 days against the 30 before, in Philippine time." />
      {notice === "signed-in" && <AuthNotice message="Signed in successfully." successNotice="signed-in" />}
      {notice === "signout-failed" && <AuthNotice message="Could not sign out. Please try again." error />}
      {!configured && <p role="status" className="cms-status">Analytics data will appear when this deployment can access its Supabase server credentials.</p>}
      <div className="db-grid">
        {kpis.map((kpi) => (
          <section key={kpi.label} className="analytics-card db-card db-kpi db-span-3">
            <h2>{kpi.label}</h2>
            <strong>{dailyAvailable ? kpi.value : "—"}</strong>
            {dailyAvailable ? <p className="db-kpi-change">{kpi.change}</p> : null}
            {kpi.note ? <p className="audience-note">{kpi.note}</p> : null}
          </section>
        ))}
        {configured && countsError && !dailyError ? <div className="db-span-12">{retry("All-time totals")}</div> : null}

        <section className="analytics-card db-card db-span-8">
          <div className="db-card-head"><div><p className="analytics-eyebrow">TREND</p><h2>Last 30 days</h2></div><span>{dailyAvailable ? `${sum(last30, "outbound")} link clicks` : ""}</span></div>
          {dailyAvailable ? <TrendChart days={last30} /> : configured && dailyError ? retry("The trend and 30-day totals") : <p className="audience-note">—</p>}
        </section>

        <section className="analytics-card db-card db-span-4">
          <div className="db-card-head"><div><p className="analytics-eyebrow">PROJECT INTEREST</p><h2>What recruiters click</h2></div><span>Live + GitHub</span></div>
          {configured && engagementError ? retry("Project clicks") : null}
          <ol className="engagement-list">
            {rankedProjects.map((project) => <li key={project.id}>
              <div><strong>{project.title}</strong><small>Live: {displayCount(project.liveClicks)} · GitHub: {displayCount(project.githubClicks)}</small></div>
              <span>{displayCount(project.clicks)}</span>
            </li>)}
          </ol>
          {engagementAvailable && legacyOpens > 0 ? <p className="audience-note db-legacy">{legacyOpens} detail opens from the previous design are not counted here.</p> : null}
        </section>

        <section className="analytics-card db-card db-span-4">
          <div className="db-card-head"><div><p className="analytics-eyebrow">OUTBOUND TRAFFIC</p><h2>Links followed</h2></div><span>All time</span></div>
          {configured && engagementError ? retry("Link clicks") : null}
          <p className="engagement-total">{displayCount(totalOutbound)}</p>
          <ul className="engagement-list engagement-list-compact">
            <li><span>GitHub profile</span><span>{displayCount(countFor("outbound_click", null, "github_profile"))}</span></li>
            <li><span>LinkedIn profile</span><span>{displayCount(countFor("outbound_click", null, "linkedin_profile"))}</span></li>
            <li><span>Live project links</span><span>{displayCount(rankedProjects.reduce((total, project) => total + project.liveClicks, 0))}</span></li>
            <li><span>GitHub repository links</span><span>{displayCount(rankedProjects.reduce((total, project) => total + project.githubClicks, 0))}</span></li>
          </ul>
        </section>

        <section className="analytics-card db-card db-span-4">
          <div className="db-card-head"><div><p className="analytics-eyebrow">AUDIENCE</p><h2>Where visitors are</h2></div><span>Visits</span></div>
          {configured && audienceError ? retry("Locations") : null}
          <h3 className="db-subhead">Countries</h3>
          <ul className="engagement-list engagement-list-compact">{countries.slice(0, 5).map(([country, visits]) =>
            <li key={country}><span>{countryLabel(country)}</span><span>{visits}</span></li>)}</ul>
          <h3 className="db-subhead">Cities</h3>
          <ul className="engagement-list engagement-list-compact">{cities.slice(0, 5).map((row) =>
            <li key={`${row.country_code}-${row.city}`}><span>{row.city}, {row.country_code}</span><span>{row.visits}</span></li>)}</ul>
          {audienceAvailable && !countries.length && <p className="audience-note">No session details recorded yet.</p>}
          <p className="audience-note db-legacy">Approximate, from network information.</p>
        </section>

        <section className="analytics-card db-card db-span-4">
          <div className="db-card-head"><div><p className="analytics-eyebrow">DEVICES</p><h2>How visitors browse</h2></div><span>Visits</span></div>
          {configured && audienceError ? retry("Devices") : null}
          <h3 className="db-subhead">Device type</h3>
          <ul className="engagement-list engagement-list-compact">{devices.map(([device, visits]) =>
            <li key={device}><span>{device}</span><span>{visits}</span></li>)}</ul>
          <h3 className="db-subhead">Browser</h3>
          <ul className="engagement-list engagement-list-compact">{browsers.map(([browser, visits]) =>
            <li key={browser}><span>{browser}</span><span>{visits}</span></li>)}</ul>
          {audienceAvailable && !devices.length && <p className="audience-note">No session details recorded yet.</p>}
          <p className="audience-note db-legacy">Broad categories from the browser, not a fingerprint.</p>
        </section>

        <section className="analytics-card session-panel db-span-12">
          <div><p className="analytics-eyebrow">ENGAGEMENT · ALL TIME</p><h2>Time spent exploring</h2></div>
          <div className="session-metrics">
            <div><span>Average active time</span><strong>{audienceAvailable && totalSessions ? activeTime : "—"}</strong></div>
            <div><span>Engaged visits</span><strong>{audienceAvailable ? engagedSessions : "—"}</strong></div>
            <div><span>Non-engaged rate</span><strong>{audienceAvailable && nonEngagedRate !== null ? `${nonEngagedRate}%` : "—"}</strong></div>
          </div>
          <p className="audience-note">A visit is engaged after 10 active seconds or a recorded link click. Active time excludes time in a hidden tab. Sessions before 2026-10-13 also excluded a 5-second landing loader.</p>
        </section>
      </div>
    </div>
  );
}
