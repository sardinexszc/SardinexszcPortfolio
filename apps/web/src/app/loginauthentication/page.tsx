import Link from "next/link";
import { signIn } from "./actions";
import { AuthNotice, AuthSubmitButton, GoogleSignInLink } from "@/components/auth-feedback";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;
  const messages: Record<string, string> = {
    unavailable: "Sign-in is unavailable right now. Please try again shortly.",
    google: "Google sign-in could not start. Please try again.",
    "missing-fields": "Enter your email and password.",
    "invalid-input": "Enter a valid email and password.",
    unconfirmed: "Confirm your email address before signing in.",
    credentials: "Email or password is incorrect.",
    unauthorized: "This account is not authorized to view analytics.",
    callback: "Google sign-in could not be completed. Please try again.",
  };
  return (
    <main id="main-content" className="analytics-shell">
      <Link href="/" className="analytics-back">← Back to portfolio</Link>
      <div className="analytics-card">
        <p className="analytics-eyebrow">PORTFOLIO / ADMIN</p>
        <h1>Sign in</h1>
        <p>Access private portfolio engagement analytics.</p>
        {error && <p role="alert" className="analytics-error">{messages[error] ?? "Sign-in failed. Please try again."}</p>}
        {notice === "signed-out" && <AuthNotice message="Signed out successfully." successNotice="signed-out" />}
        <form action={signIn} className="analytics-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" maxLength={254} required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" maxLength={1024} required />
          <AuthSubmitButton action="sign-in" />
        </form>
        <div className="analytics-social-form">
          <GoogleSignInLink />
        </div>
      </div>
    </main>
  );
}
