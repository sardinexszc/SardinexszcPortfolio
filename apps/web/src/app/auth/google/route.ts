import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const productionOrigin = "https://ivansalinas.vercel.app";
  const previewOrigin = "https://portfolio-sardinexszc-git-backend-e57fb2-sardinexszcs-projects.vercel.app";
  const origin = request.nextUrl.origin;
  if (process.env.VERCEL_ENV && origin !== productionOrigin && origin !== previewOrigin) {
    const canonicalOrigin = process.env.VERCEL_ENV === "preview" ? previewOrigin : productionOrigin;
    return NextResponse.redirect(new URL("/auth/google", canonicalOrigin));
  }

  const response = NextResponse.redirect(new URL("/loginauthentication?error=google", request.url));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    response.headers.set("Location", new URL("/loginauthentication?error=unavailable", request.url).toString());
    return response;
  }

  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: new URL("/auth/callback", origin).toString() },
    });
    if (error || !data.url) {
      console.warn("Google sign-in initiation failed", error?.code ?? "missing_url");
      return response;
    }
    response.headers.set("Location", data.url);
  } catch (error) {
    console.error("Google sign-in initiation threw", error instanceof Error ? error.name : "unknown");
  }
  return response;
}
