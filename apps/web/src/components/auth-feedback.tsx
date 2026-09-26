"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";

export function AuthNotice({ message, error = false, successNotice }: { message: string; error?: boolean; successNotice?: "signed-in" | "signed-out" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!successNotice) return;
    const timer = window.setTimeout(() => {
      setVisible(false);
      const url = new URL(window.location.href);
      if (url.searchParams.get("notice") === successNotice) {
        url.searchParams.delete("notice");
        window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
      }
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [successNotice]);

  if (!visible) return null;
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
    <button className="analytics-auth-button" type="submit" disabled={pending} aria-disabled={pending} data-pending={pending} title={action === "sign-out" ? label : undefined}>
      {action === "sign-out" && <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />}
      <span>{label}</span>
    </button>
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
