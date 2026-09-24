import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requestedNext = request.nextUrl.searchParams.get("next") ?? "/admin";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/admin";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: admin } = user
        ? await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle()
        : { data: null };
      if (admin) return NextResponse.redirect(new URL(next, request.url));

      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/loginauthentication?error=not-authorized", request.url));
    }
  }

  return NextResponse.redirect(new URL("/loginauthentication?error=auth", request.url));
}
