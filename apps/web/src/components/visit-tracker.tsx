"use client";

import { useEffect } from "react";

export function VisitTracker() {
  useEffect(() => {
    void fetch("/api/track-visit", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
    }).catch(() => {
      // Analytics should never block the portfolio.
    });
  }, []);
  return null;
}
