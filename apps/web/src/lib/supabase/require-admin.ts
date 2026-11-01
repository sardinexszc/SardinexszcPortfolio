import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// The admin signs in with Google only, so Google's 2-Step Verification guards the workspace.
// A session from any other method (a password via the Supabase API, say) is refused.
function signedInWithGoogle(amr: ({ method: string } | string)[] | undefined) {
  return amr?.some((entry) => (typeof entry === "string" ? entry : entry.method) === "oauth") ?? false;
}

export async function requireAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    redirect("/loginauthentication?error=unavailable");
  }
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !process.env.SUPABASE_ADMIN_USER_ID || user.id !== process.env.SUPABASE_ADMIN_USER_ID) {
    redirect("/loginauthentication");
  }
  const { data: claims } = await supabase.auth.getClaims();
  if (!signedInWithGoogle(claims?.claims.amr)) {
    redirect("/loginauthentication?error=google-only");
  }
  return user;
}
