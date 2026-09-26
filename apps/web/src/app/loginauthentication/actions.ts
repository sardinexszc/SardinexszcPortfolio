"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const emailValues = formData.getAll("email");
  const passwordValues = formData.getAll("password");
  if (emailValues.length !== 1 || passwordValues.length !== 1) {
    redirect("/loginauthentication?error=invalid-input");
  }
  const email = emailValues[0];
  const password = passwordValues[0];
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    redirect("/loginauthentication?error=missing-fields");
  }
  const normalizedEmail = email.trim();
  if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || password.length > 1024) {
    redirect("/loginauthentication?error=invalid-input");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    redirect("/loginauthentication?error=unavailable");
  }
  const supabase = await createClient();
  let result;
  try {
    result = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
  } catch (error) {
    console.error("Email sign-in request failed", error);
    redirect("/loginauthentication?error=unavailable");
  }
  const { data, error } = result;
  if (error || !data.user) {
    redirect(error?.code === "email_not_confirmed" ? "/loginauthentication?error=unconfirmed" : "/loginauthentication?error=credentials");
  }
  if (data.user.id !== process.env.SUPABASE_ADMIN_USER_ID) {
    await supabase.auth.signOut();
    redirect("/loginauthentication?error=unauthorized");
  }
  redirect("/analytics?notice=signed-in");
}

export async function signOut() {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Sign-out failed", error);
    redirect("/analytics?notice=signout-failed");
  }
  redirect("/loginauthentication?notice=signed-out");
}

export async function setPassword(formData: FormData) {
  const settingsPath = "/analytics/account-settings";
  const password = formData.get("password");
  const confirmation = formData.get("confirmation");
  if (typeof password !== "string" || password.length < 12 || password !== confirmation) {
    redirect(`${settingsPath}?password=invalid`);
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== process.env.SUPABASE_ADMIN_USER_ID) {
    redirect("/loginauthentication?error=unauthorized");
  }
  let error;
  try {
    ({ error } = await supabase.auth.updateUser({ password }));
  } catch (failure) {
    console.error("Password update request failed", failure);
    redirect(`${settingsPath}?password=failed`);
  }
  if (error?.code === "same_password") redirect(`${settingsPath}?password=unchanged`);
  if (error?.code === "weak_password") redirect(`${settingsPath}?password=weak`);
  if (error) redirect(`${settingsPath}?password=failed`);
  redirect(`${settingsPath}?password=updated`);
}
