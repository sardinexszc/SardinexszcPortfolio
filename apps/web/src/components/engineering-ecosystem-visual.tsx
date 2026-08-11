"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";

const LazyScene = dynamic(
  () => import("./engineering-ecosystem-scene").then((module) => module.EngineeringEcosystemScene),
  {
    ssr: false,
    loading: () => <div className="ecosystem-loading" aria-hidden="true" />,
  },
);

const architectureFlow = [
  "Web Applications",
  "APIs",
  "Databases",
  "AI / Automation",
  "IoT",
  "Research Systems",
] as const;

function useIsMobile(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const media = window.matchMedia("(max-width: 900px)");
      const listener = () => onStoreChange();
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(max-width: 900px)").matches;
    },
    () => false,
  );
}

function useIsClientHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function EcosystemFallback({ reason }: { reason: "mobile" | "reduced" | "webgl" }) {
  const reasonLabel =
    reason === "mobile"
      ? "Mobile optimized fallback"
      : reason === "reduced"
        ? "Reduced-motion fallback"
        : "WebGL unavailable fallback";

  return (
    <div className="ecosystem-fallback" aria-label={reasonLabel}>
      <p className="ecosystem-fallback-label">Engineering ecosystem</p>
      <ul>
        {architectureFlow.map((item, index) => (
          <li key={item}>
            <span>{item}</span>
            {index < architectureFlow.length - 1 ? <i aria-hidden="true" /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EngineeringEcosystemVisual() {
  const isClientHydrated = useIsClientHydrated();
  const isMobile = useIsMobile();
  const [paused, setPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const top = window.scrollY;
      const normalized = Math.min(top / 900, 1);
      setScrollProgress(normalized);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const mode = !isClientHydrated || isMobile ? (isMobile ? "mobile" : "scene") : "scene";

  return (
    <aside className="ecosystem-panel" aria-labelledby="ecosystem-title">
      <div className="ecosystem-panel-head">
        <p className="ecosystem-kicker">Architecture visual</p>
        <h2 id="ecosystem-title">Engineering ecosystem</h2>
        <p className="ecosystem-summary">A live system view of how web apps, APIs, data, automation, IoT, and research workflows connect in delivered software.</p>
      </div>

      <div className="ecosystem-stage" aria-hidden="true">
        {mode === "scene" ? (
          <LazyScene reducedMotion={false} paused={paused} scrollProgress={scrollProgress} />
        ) : (
          <EcosystemFallback reason={mode} />
        )}
      </div>

      <ol className="ecosystem-flow" aria-label="Engineering flow">
        {architectureFlow.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <div className="ecosystem-controls">
        <button
          type="button"
          className="ecosystem-toggle"
          onClick={() => setPaused((value) => !value)}
          disabled={mode !== "scene"}
          aria-pressed={paused}
        >
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
    </aside>
  );
}
