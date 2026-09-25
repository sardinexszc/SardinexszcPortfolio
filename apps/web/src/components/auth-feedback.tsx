"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export function AuthNotice({ message, error = false }: { message: string; error?: boolean }) {
  return <p role={error ? "alert" : "status"} className={`analytics-auth-notice${error ? " analytics-auth-notice-error" : ""}`}>{message}</p>;
}

export function AuthSubmitButton({ action }: { action: "sign-in" | "sign-out" }) {
  const { pending } = useFormStatus();
  const label = action === "sign-in" ? (pending ? "Signing in…" : "Sign in") : (pending ? "Signing out…" : "Sign out");
  return <button className="analytics-auth-button" type="submit" disabled={pending} aria-disabled={pending} data-pending={pending}>{label}</button>;
}

export function GoogleSignInLink() {
  const [redirecting, setRedirecting] = useState(false);
  return <a href="/auth/google" onClick={() => setRedirecting(true)} aria-disabled={redirecting} data-pending={redirecting}>{redirecting ? "Connecting to Google…" : "Continue with Google"}</a>;
}
