import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { setPassword, signOut } from "../loginauthentication/actions";
import { AuthNotice, AuthSubmitButton } from "@/components/auth-feedback";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ password?: string; notice?: string }> }) {
  const { password, notice } = await searchParams;
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
    <main id="main-content" className="analytics-shell">
      <header className="analytics-header">
        <Link href="/" className="analytics-back">← Portfolio</Link>
        <form action={signOut}><AuthSubmitButton action="sign-out" /></form>
      </header>
      <p className="analytics-eyebrow">PORTFOLIO / ADMIN</p>
      <h1>Engagement dashboard</h1>
      <p>Unique browsers and resume downloads since tracking was enabled.</p>
      {notice === "signed-in" && <AuthNotice message="Signed in successfully." />}
      {notice === "signout-failed" && <AuthNotice message="Could not sign out. Please try again." error />}
      {!process.env.SUPABASE_SECRET_KEY && <p role="status">Analytics data will appear after the Supabase server key is configured.</p>}
      {countsError && <p role="alert" className="analytics-error">Analytics counts could not be loaded. <Link href="/analytics">Try again</Link>.</p>}
      <div className="analytics-grid">
        <section className="analytics-card"><h2>Unique visitors</h2><strong>{visitorCount ?? "—"}</strong><p>Browser cookies counted once.</p></section>
        <section className="analytics-card"><h2>Resume downloads</h2><strong>{downloadCount ?? "—"}</strong><p>Recorded PDF responses.</p></section>
      </div>
      <section className="analytics-card analytics-password-card">
        <h2>Set or change your email password</h2>
        <p>Use this password with your email address to sign in next time.</p>
        {password && <p role={password === "updated" || password === "unchanged" ? "status" : "alert"} className={password === "updated" || password === "unchanged" ? "analytics-success" : "analytics-error"}>
          {password === "updated" ? "Password saved. You can now sign in with your email." : password === "unchanged" ? "This password is already saved. You can sign in with your email and password." : password === "invalid" ? "Use at least 12 characters and matching passwords." : password === "weak" ? "Choose a stronger password and try again." : "Could not save the password. Please try again."}
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
