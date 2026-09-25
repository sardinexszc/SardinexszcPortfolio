"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Portfolio page could not be loaded", error); }, [error]);

  return (
    <main className="analytics-shell">
      <div className="analytics-card">
        <h1>Something went wrong</h1>
        <p>We could not load this page. Please try again.</p>
        <button type="button" className="analytics-retry" onClick={reset}>Try again</button>
        <p><Link href="/">Return to portfolio</Link></p>
      </div>
    </main>
  );
}
