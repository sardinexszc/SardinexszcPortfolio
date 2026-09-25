"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signIn(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    redirect("/loginauthentication?error=invalid");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    redirect("/loginauthentication?error=unavailable");
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    redirect("/loginauthentication?error=credentials");
  }
  if (data.user.id !== process.env.SUPABASE_ADMIN_USER_ID) {
    await supabase.auth.signOut();
    redirect("/loginauthentication?error=unauthorized");
  }
  redirect("/analytics");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/loginauthentication");
}

export async function signInWithGoogle() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    redirect("/loginauthentication?error=unavailable");
  }

  const origin = (await headers()).get("origin");
  if (!origin) redirect("/loginauthentication?error=invalid");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: new URL("/auth/callback", origin).toString() },
  });

  if (error || !data.url) redirect("/loginauthentication?error=invalid");
  redirect(data.url);
}
