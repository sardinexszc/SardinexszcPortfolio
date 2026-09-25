import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { setPassword, signOut } from "../loginauthentication/actions";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ password?: string }> }) {
  const { password } = await searchParams;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    redirect("/loginauthentication?error=unavailable");
  }
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || !process.env.SUPABASE_ADMIN_USER_ID || user.id !== process.env.SUPABASE_ADMIN_USER_ID) {
    redirect("/loginauthentication");
  }

  let visitorCount: number | null = null;
  let downloadCount: number | null = null;
  if (process.env.SUPABASE_SECRET_KEY) {
    const db = createAdminClient();
    const [visitors, downloads] = await Promise.all([
      db.from("visitors").select("*", { count: "exact", head: true }),
      db.from("resume_downloads").select("*", { count: "exact", head: true }),
    ]);
    if (visitors.error || downloads.error) {
      throw new Error("Analytics counts could not be loaded");
    }
    visitorCount = visitors.count;
    downloadCount = downloads.count;
  }

  return (
    <main id="main-content" className="analytics-shell">
      <header className="analytics-header">
        <Link href="/" className="analytics-back">← Portfolio</Link>
        <form action={signOut}><button type="submit">Sign out</button></form>
      </header>
      <p className="analytics-eyebrow">PORTFOLIO / ADMIN</p>
      <h1>Engagement dashboard</h1>
      <p>Unique browsers and resume downloads since tracking was enabled.</p>
      {visitorCount === null && <p role="status">Analytics data will appear after the Supabase server key is configured.</p>}
      <div className="analytics-grid">
        <section className="analytics-card"><h2>Unique visitors</h2><strong>{visitorCount ?? "—"}</strong><p>Browser cookies counted once.</p></section>
        <section className="analytics-card"><h2>Resume downloads</h2><strong>{downloadCount ?? "—"}</strong><p>Recorded PDF responses.</p></section>
      </div>
      <section className="analytics-card analytics-password-card">
        <h2>Set an email password</h2>
        <p>Signed in with Google? Create a password to use the email sign-in form next time.</p>
        {password && <p role="status" className={password === "updated" ? "" : "analytics-error"}>
          {password === "updated" ? "Password saved. You can now sign in with your email." : password === "invalid" ? "Use at least 12 characters and matching passwords." : "Could not save the password. Please try again."}
        </p>}
        <form action={setPassword} className="analytics-form">
          <label htmlFor="new-password">New password</label>
          <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={12} required />
          <label htmlFor="confirm-password">Confirm password</label>
          <input id="confirm-password" name="confirmation" type="password" autoComplete="new-password" minLength={12} required />
          <button type="submit">Save password</button>
        </form>
      </section>
    </main>
  );
}
