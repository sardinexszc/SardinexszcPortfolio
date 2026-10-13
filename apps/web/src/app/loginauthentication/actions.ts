"use server";

import { createClient } from "@/lib/supabase/server";
import { clientAddress, consumeRateLimit } from "@/lib/tracking-limit";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const signInAttemptLimit = 5;
const signInWindowSeconds = 15 * 60;
const passwordChangeMaxSessionAgeMs = 10 * 60 * 1000;

// Per-network cap on password attempts. If the limiter itself is unavailable, sign-in stays
// possible and Supabase Auth's own rate limits remain the backstop.
async function signInAllowed(): Promise<boolean> {
  try {
    const requestHeaders = await headers();
    const host = (requestHeaders.get("host") ?? "unknown").toLowerCase();
    return await consumeRateLimit(host, clientAddress(requestHeaders), "sign-in", signInAttemptLimit, signInWindowSeconds);
  } catch (error) {
    console.error("Sign-in rate limit unavailable", error);
    return true;
  }
}

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
  if (!await signInAllowed()) {
    redirect("/loginauthentication?error=rate-limited");
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
  // A stolen or forgotten-open session should not be enough to take over the account.
  const signedInAt = user.last_sign_in_at ? Date.parse(user.last_sign_in_at) : Number.NaN;
  if (!Number.isFinite(signedInAt) || Date.now() - signedInAt > passwordChangeMaxSessionAgeMs) {
    redirect(`${settingsPath}?password=reauth`);
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
  // Supabase's "Secure password change" requires a recent sign-in.
  if (error?.code === "reauthentication_needed" || error?.code === "reauthentication_not_valid") {
    redirect(`${settingsPath}?password=reauth`);
  }
  if (error) redirect(`${settingsPath}?password=failed`);
  redirect(`${settingsPath}?password=updated`);
}
