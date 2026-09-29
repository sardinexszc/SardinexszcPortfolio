import { requireAdmin } from "@/lib/supabase/require-admin";
import { DashboardShell } from "@/components/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function AnalyticsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();

  return <DashboardShell email={user.email ?? "Administrator"}>{children}</DashboardShell>;
}
