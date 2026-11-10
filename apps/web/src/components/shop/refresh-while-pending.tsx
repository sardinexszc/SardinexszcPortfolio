"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-renders the thank-you page every 3 seconds for up to 2 minutes while the payment is being confirmed.
export function RefreshWhilePending() {
  const router = useRouter();
  useEffect(() => {
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks += 1;
      if (ticks > 40) window.clearInterval(timer);
      else router.refresh();
    }, 3000);
    return () => window.clearInterval(timer);
  }, [router]);
  return null;
}
