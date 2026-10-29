import { setPassword } from "../../loginauthentication/actions";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { PageHeader } from "@/components/dashboard-page-header";
import { PasswordFields } from "@/components/password-fields";

const providerNames: Record<string, string> = { google: "Google", email: "Email and password" };

export default async function AccountSettingsPage({ searchParams }: { searchParams: Promise<{ password?: string }> }) {
  const user = await requireAdmin();
  const { password } = await searchParams;
  const providers = ((user.app_metadata?.providers as string[] | undefined) ?? [user.app_metadata?.provider].filter(Boolean) as string[])
    .map((provider) => providerNames[provider] ?? provider);
  const lastSignIn = user.last_sign_in_at
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(user.last_sign_in_at))
    : "—";
  return (
    <div className="dashboard-content">
      <PageHeader eyebrow="/ Account (04)" title="Account" lede="How you sign in to this workspace." />
      <div className="db-grid">
        <section className="analytics-card db-card db-span-5">
          <div className="db-card-head"><div><p className="analytics-eyebrow">YOUR ACCOUNT</p><h2>Signed in</h2></div></div>
          <dl className="db-facts">
            <div><dt>Email</dt><dd>{user.email ?? "—"}</dd></div>
            <div><dt>Sign-in methods</dt><dd>{providers.length ? providers.join(", ") : "—"}</dd></div>
            <div><dt>Last sign-in</dt><dd>{lastSignIn} <small>(Philippine time)</small></dd></div>
          </dl>
        </section>
        <section className="analytics-card db-card db-span-7">
          <div className="db-card-head"><div><p className="analytics-eyebrow">PASSWORD</p><h2>Set or change your email password</h2></div></div>
          <p className="audience-note">Use this password with your email address to sign in next time.</p>
          <ul id="password-rules" className="db-rules">
            <li>At least 12 characters</li>
            <li>Both fields must match</li>
            <li>Only within 10 minutes of signing in</li>
          </ul>
          {password && <p role={password === "updated" || password === "unchanged" ? "status" : "alert"} className={password === "updated" || password === "unchanged" ? "analytics-success" : "analytics-error"}>
            {password === "updated" ? "Password saved. You can now sign in with your email." : password === "unchanged" ? "This password is already saved. You can sign in with your email and password." : password === "invalid" ? "Use at least 12 characters and matching passwords." : password === "weak" ? "Choose a stronger password and try again." : password === "reauth" ? "For security, password changes need a sign-in from the last 10 minutes. Sign out, sign in again, then save your password." :"Could not save the password. Please try again."}
          </p>}
          <form action={setPassword} className="analytics-form">
            <PasswordFields />
            <button type="submit">Save password</button>
          </form>
        </section>
      </div>
    </div>
  );
}
