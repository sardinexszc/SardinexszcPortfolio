import type { Metadata } from "next";
import Link from "next/link";
import { AuthNotice, GoogleSignInLink } from "@/components/auth-feedback";
import "@/components/dashboard.css";

export const dynamic = "force-dynamic";
// Private admin route: keep it out of search results even if a crawler ignores robots.txt.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;
  const messages: Record<string, string> = {
    unavailable: "Sign-in is unavailable right now. Please try again shortly.",
    google: "Google sign-in could not start. Please try again.",
    "google-only": "Sign in with Google to open the workspace.",
    unauthorized: "This account is not authorized to view analytics.",
    callback: "Google sign-in could not be completed. Please try again.",
  };
  return (
    <main id="main-content" className="analytics-shell">
      <Link href="/" className="analytics-back">← Back to portfolio</Link>
      <div className="analytics-card">
        <p className="analytics-eyebrow">/ Portfolio admin</p>
        <h1>Sign in<span className="db-dot">.</span></h1>
        <p>Access portfolio analytics and content.</p>
        {error && <p role="alert" className="analytics-error">{messages[error] ?? "Sign-in failed. Please try again."}</p>}
        {notice === "signed-out" && <AuthNotice message="Signed out successfully." successNotice="signed-out" />}
        <div className="analytics-social-form">
          <GoogleSignInLink />
        </div>
      </div>
    </main>
  );
}
