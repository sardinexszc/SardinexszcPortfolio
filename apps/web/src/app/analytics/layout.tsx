import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { signOut } from "../loginauthentication/actions";
import { AuthSubmitButton } from "@/components/auth-feedback";
import { DashboardNavigation } from "@/components/dashboard-navigation";

export const dynamic = "force-dynamic";

export default async function AnalyticsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar" aria-label="Dashboard sidebar">
        <div className="dashboard-sidebar-top">
          <Link href="/" className="dashboard-brand" aria-label="Ivan Salinas portfolio home">IS<span>.</span></Link>
          <div>
            <p className="dashboard-sidebar-eyebrow">PORTFOLIO / ADMIN</p>
            <p className="dashboard-sidebar-title">Workspace</p>
          </div>
        </div>
        <DashboardNavigation />
        <div className="dashboard-sidebar-footer">
          <span className="dashboard-account-label">Signed in as</span>
          <span className="dashboard-account-email" title={user.email}>{user.email ?? "Administrator"}</span>
          <form action={signOut}><AuthSubmitButton action="sign-out" /></form>
        </div>
      </aside>
      <main id="main-content" className="dashboard-main">{children}</main>
    </div>
  );
}
