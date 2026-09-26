import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { AuthNotice } from "@/components/auth-feedback";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  await requireAdmin();
  const { notice } = await searchParams;

  let visitorCount: number | null = null;
  let downloadCount: number | null = null;
  let countsError = false;
  if (process.env.SUPABASE_SECRET_KEY) {
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
  }

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
      <div className="analytics-grid">
        <section className="analytics-card"><h2>Unique visitors</h2><strong>{visitorCount ?? "—"}</strong><p>Browser cookies counted once.</p></section>
        <section className="analytics-card"><h2>Resume downloads</h2><strong>{downloadCount ?? "—"}</strong><p>Recorded PDF responses.</p></section>
      </div>
    </div>
  );
}
