import { createServerClient } from "@supabase/ssr";
import { authCookieOptions } from "@/lib/supabase/cookie-options";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Supabase sends the sign-in code to its Site URL (the home page) when the callback URL is not on its
  // allow-list. Forward it to the callback so sign-in still completes; the home page itself is untouched.
  if (request.nextUrl.pathname === "/") {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.next();
    const callback = new URL("/auth/callback", request.url);
    callback.searchParams.set("code", code);
    return NextResponse.redirect(callback);
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return NextResponse.next({ request });
  }
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookieOptions: authCookieOptions,
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
        },
      },
    },
  );
  await supabase.auth.getUser();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/", "/loginauthentication", "/analytics/:path*"] };
