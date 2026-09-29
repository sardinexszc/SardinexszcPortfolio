import { setPassword } from "../../loginauthentication/actions";
import { requireAdmin } from "@/lib/supabase/require-admin";

export default async function AccountSettingsPage({ searchParams }: { searchParams: Promise<{ password?: string }> }) {
  await requireAdmin();
  const { password } = await searchParams;
  return (
    <div className="dashboard-content">
      <header className="dashboard-page-header">
        <p className="analytics-eyebrow">WORKSPACE / 03</p>
        <h1>Account Settings</h1>
        <p>Manage how you access your private dashboard.</p>
      </header>
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
    </div>
  );
}
