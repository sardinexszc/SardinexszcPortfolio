"use client";

import { useEffect } from "react";

let visitRequestStarted = false;

export function VisitTracker() {
  useEffect(() => {
    if (visitRequestStarted) return;
    visitRequestStarted = true;
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
