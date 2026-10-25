import type { Metadata } from "next";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { DashboardShell } from "@/components/dashboard-shell";

export const dynamic = "force-dynamic";
// Private admin route: keep it out of search results even if a crawler ignores robots.txt.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AnalyticsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();

  return <DashboardShell email={user.email ?? "Administrator"}>{children}</DashboardShell>;
}
