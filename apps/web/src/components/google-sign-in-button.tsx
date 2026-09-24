"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function GoogleSignInButton() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setError("");
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/admin` },
      });
      if (authError) throw authError;
    } catch {
      setError("Google sign-in is unavailable. Check the Supabase Auth configuration and try again.");
      setLoading(false);
    }
  }

  return <>
    {error ? <p className="auth-error" role="alert">{error}</p> : null}
    <button className="auth-button" type="button" onClick={signIn} disabled={loading}>
      {loading ? "Connecting…" : "Continue with Google"}
    </button>
  </>;
}
