import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="analytics-shell">
      <p className="analytics-eyebrow">404 / Page not found</p>
      <h1>This page does not exist.</h1>
      <p>The link may be outdated. You can find my projects, experience, resume, and contact details on the homepage.</p>
      <p><Link className="hero-cta hero-cta-primary" href="/">Back to portfolio</Link></p>
    </main>
  );
}
