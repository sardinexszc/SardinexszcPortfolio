import { requireAdmin } from "@/lib/supabase/require-admin";
import { PageHeader } from "@/components/dashboard-page-header";

const providerNames: Record<string, string> = { google: "Google", email: "Email and password" };

export default async function AccountSettingsPage() {
  const user = await requireAdmin();
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
          <div className="db-card-head"><div><p className="analytics-eyebrow">SECURITY</p><h2>Google sign-in only</h2></div></div>
          <p className="audience-note">This workspace opens only for a Google sign-in, so your Google account&apos;s 2-Step Verification protects it. Keep 2-Step Verification turned on in your Google account.</p>
        </section>
      </div>
    </div>
  );
}
