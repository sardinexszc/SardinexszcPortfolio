import Link from "next/link";
import { signIn, signInWithGoogle } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main id="main-content" className="analytics-shell">
      <Link href="/" className="analytics-back">← Back to portfolio</Link>
      <div className="analytics-card">
        <p className="analytics-eyebrow">PORTFOLIO / ADMIN</p>
        <h1>Sign in</h1>
        <p>Access private portfolio engagement analytics.</p>
        {error && <p role="alert" className="analytics-error">{error === "unavailable" ? "Authentication is not configured yet." : "Sign-in failed or this account is not authorized."}</p>}
        <form action={signIn} className="analytics-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <button type="submit">Sign in</button>
        </form>
        <form action={signInWithGoogle} className="analytics-social-form">
          <button type="submit">Continue with Google</button>
        </form>
      </div>
    </main>
  );
}
