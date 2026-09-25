"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

export async function setPassword(formData: FormData) {
  const password = formData.get("password");
  const confirmation = formData.get("confirmation");
  if (typeof password !== "string" || password.length < 12 || password !== confirmation) {
    redirect("/analytics?password=invalid");
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== process.env.SUPABASE_ADMIN_USER_ID) {
    redirect("/loginauthentication?error=unauthorized");
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error?.code === "same_password") redirect("/analytics?password=unchanged");
  if (error) redirect("/analytics?password=failed");
  redirect("/analytics?password=updated");
}
