import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/loginauthentication");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) {
    redirect("/loginauthentication?error=not-authorized");
  }

  const [projects, skills, timeline] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("timeline_entries").select("*").order("start_date", { ascending: false }).order("sort_order"),
  ]);
  if (projects.error || skills.error || timeline.error) {
    throw new Error("Unable to load admin content.");
  }

  return <AdminDashboard projects={projects.data} skills={skills.data} timeline={timeline.data} />;
}
