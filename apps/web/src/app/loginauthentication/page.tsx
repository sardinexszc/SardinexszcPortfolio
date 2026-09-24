import Link from "next/link";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export default async function LoginAuthenticationPage({ searchParams }: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: reason } = await searchParams;
  const error = reason === "not-authorized"
    ? "This Google account has not been approved for portfolio administration yet."
    : reason === "auth"
      ? "Google sign-in could not be completed. Please try again."
      : "";

  return (
    <main className="auth-page" id="main-content">
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="auth-eyebrow">PORTFOLIO / ADMIN</p>
        <h1 id="auth-title">Sign in</h1>
        <p>Continue with your authorized Google account to manage portfolio content.</p>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        <GoogleSignInButton />
        <Link className="auth-back" href="/">Back to portfolio</Link>
      </section>
    </main>
  );
}
