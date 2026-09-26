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
    }).then((response) => {
      if (!response.ok) console.warn("Visit tracking is temporarily unavailable.");
    }).catch(() => {
      console.warn("Visit tracking is temporarily unavailable.");
    });
  }, []);
  return null;
}
