"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
