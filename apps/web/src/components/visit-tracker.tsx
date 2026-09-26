"use client";

import { useEffect } from "react";
import { getPortfolioSession, savePortfolioSession } from "@/lib/portfolio-session";
import { LANDING_LOADER_DURATION_MS } from "@/components/landing-loader";

let visitRequestStarted = false;

export function VisitTracker() {
  useEffect(() => {
    const session = getPortfolioSession();
    if (!visitRequestStarted) {
      visitRequestStarted = true;
      void fetch("/api/track-visit", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      }).then((response) => {
        if (!response.ok) console.warn("Visit tracking is temporarily unavailable.");
      }).catch(() => {
        console.warn("Visit tracking is temporarily unavailable.");
      });
    }

    let ready = false;
    let lastTick = performance.now();
    const readyTimer = window.setTimeout(() => {
      ready = true;
      lastTick = performance.now();
    }, LANDING_LOADER_DURATION_MS);

    function recordActivity() {
      if (!ready) return;
      const now = performance.now();
      session.activeMs += Math.max(0, Math.min(now - lastTick, 15_000));
      lastTick = now;
      savePortfolioSession(session);
      const activeSeconds = Math.min(86400, Math.floor(session.activeMs / 1000));
      if (activeSeconds < 1) return;
      const body = JSON.stringify({ sessionId: session.id, activeSeconds });
      const url = "/api/track-session";
      if (navigator.sendBeacon?.(url, new Blob([body], { type: "application/json" }))) return;
      void fetch(url, { method: "POST", body, headers: { "Content-Type": "application/json" }, credentials: "same-origin", keepalive: true }).catch(() => {});
    }

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") recordActivity();
    }, 10_000);
    const visibilityChange = () => {
      if (document.visibilityState === "hidden") recordActivity();
      else lastTick = performance.now();
    };
    const pageHide = () => { if (document.visibilityState === "visible") recordActivity(); };
    document.addEventListener("visibilitychange", visibilityChange);
    window.addEventListener("pagehide", pageHide);
    return () => {
      window.clearTimeout(readyTimer);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", visibilityChange);
      window.removeEventListener("pagehide", pageHide);
    };
  }, []);
  return null;
}
