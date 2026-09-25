import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const loginUrl = new URL("/loginauthentication?error=invalid", url.origin);
  const code = url.searchParams.get("code");

  if (!code || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user || data.user.id !== process.env.SUPABASE_ADMIN_USER_ID) {
    await supabase.auth.signOut();
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL("/analytics", url.origin));
}
