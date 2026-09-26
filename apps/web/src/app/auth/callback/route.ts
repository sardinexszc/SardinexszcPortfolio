import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const response = NextResponse.redirect(new URL("/loginauthentication?error=callback", url.origin));
  const code = url.searchParams.get("code");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!code || !supabaseUrl || !publishableKey) return response;

  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  let result;
  try {
    result = await supabase.auth.exchangeCodeForSession(code);
  } catch (error) {
    console.error("Google callback request failed", error);
    return response;
  }
  const { data, error } = result;
  if (error || !data.user) {
    console.warn("Google callback exchange failed", error?.code ?? "no_user");
    return response;
  }
  if (data.user.id !== process.env.SUPABASE_ADMIN_USER_ID) {
    await supabase.auth.signOut();
    response.headers.set("Location", new URL("/loginauthentication?error=unauthorized", url.origin).toString());
    return response;
  }

  response.headers.set("Location", new URL("/analytics?notice=signed-in", url.origin).toString());
  return response;
}
