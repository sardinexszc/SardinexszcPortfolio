"use client";

import { useEffect, useState } from "react";

export const LANDING_LOADER_DURATION_MS = 5250;

export function LandingLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setLeaving(true), 5000);
    const removeTimer = window.setTimeout(() => setVisible(false), LANDING_LOADER_DURATION_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`landing-loader-overlay${leaving ? " landing-loader-leaving" : ""}`} role="status" aria-label="Loading portfolio">
      <div className="landing-loader-content">
        <span className="landing-loader-label">IS / PORTFOLIO</span>
        <span className="landing-loader-grid" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <span className="landing-loader-square" style={{ animationDelay: `${index * 75}ms` }} key={index} />
          ))}
        </span>
        <span className="landing-loader-caption">Loading portfolio</span>
      </div>
    </div>
  );
}
