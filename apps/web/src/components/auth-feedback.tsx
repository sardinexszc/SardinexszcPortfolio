"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export function AuthNotice({ message, error = false }: { message: string; error?: boolean }) {
  return <p role={error ? "alert" : "status"} className={`analytics-auth-notice${error ? " analytics-auth-notice-error" : ""}`}>{message}</p>;
}

function AuthPendingOverlay({ message }: { message: string }) {
  return <div className="auth-loading-overlay" role="status" aria-live="polite">
    <div className="auth-loading-content">
      <span className="auth-loader" aria-hidden="true" />
      <span>{message}</span>
    </div>
  </div>;
}

export function AuthSubmitButton({ action }: { action: "sign-in" | "sign-out" }) {
  const { pending } = useFormStatus();
  const label = action === "sign-in" ? (pending ? "Signing in…" : "Sign in") : (pending ? "Signing out…" : "Sign out");
  return <>
    <button className="analytics-auth-button" type="submit" disabled={pending} aria-disabled={pending} data-pending={pending}>{label}</button>
    {pending && <AuthPendingOverlay message={label} />}
  </>;
}

export function GoogleSignInLink() {
  const [redirecting, setRedirecting] = useState(false);
  return <>
    <a href="/auth/google" onClick={(event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (redirecting) return;
      setRedirecting(true);
      window.setTimeout(() => window.location.assign("/auth/google"), 150);
    }} aria-disabled={redirecting} data-pending={redirecting}>{redirecting ? "Connecting to Google…" : "Continue with Google"}</a>
    {redirecting && <AuthPendingOverlay message="Connecting to Google…" />}
  </>;
}
