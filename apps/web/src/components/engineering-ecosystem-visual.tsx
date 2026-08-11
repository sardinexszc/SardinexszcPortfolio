"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { smoothScrollToId } from "@/lib/smooth-scroll";
import type { Portfolio } from "@/lib/types";

const LazyScene = dynamic(
  () => import("./engineering-ecosystem-scene").then((module) => module.EngineeringEcosystemScene),
  {
    ssr: false,
    loading: () => <div className="ecosystem-loading" aria-hidden="true" />,
  },
);

const architectureFlow = [
  { key: "web", label: "Product Interfaces", sectionId: "work", detail: "Web applications and product delivery" },
  { key: "api", label: "Service Layer", sectionId: "about", detail: "Backend services and integration logic" },
  { key: "db", label: "Data Platform", sectionId: "about", detail: "Data persistence and operational systems" },
  { key: "ai", label: "Intelligence & Automation", sectionId: "work", detail: "Automation and AI-enabled workflows" },
  { key: "iot", label: "Connected Systems", sectionId: "work", detail: "Monitoring and device-connected operations" },
  { key: "research", label: "Research Infrastructure", sectionId: "about", detail: "Research workflows and evidence systems" },
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

function EcosystemFallback({ reason, onNavigate }: { reason: "mobile" | "reduced" | "webgl"; onNavigate: (key: string) => void }) {
  const reasonLabel =
    reason === "mobile"
      ? "Mobile optimized fallback"
      : reason === "reduced"
        ? "Reduced-motion fallback"
        : "WebGL unavailable fallback";

  return (
    <div className="ecosystem-fallback" aria-label={reasonLabel}>
      <p className="ecosystem-fallback-label">Engineering ecosystem</p>
      <div className="ecosystem-html-nav" role="list">
        {architectureFlow.map((item) => (
          <button key={item.key} type="button" className="ecosystem-html-nav-item" onClick={() => onNavigate(item.key)}>
            <span>{item.label}</span>
            <small>{item.detail}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

export function EngineeringEcosystemVisual({ portfolio }: { portfolio: Portfolio }) {
  const isClientHydrated = useIsClientHydrated();
  const isMobile = useIsMobile();
  const [paused, setPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

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
  const activeNode = architectureFlow.find((item) => item.key === hoveredNode);

  const tooltipContent = useMemo(() => {
    const projectTitles = portfolio.projects.map((project) => project.title);
    const timelineText = portfolio.timeline.map((entry) => entry.description).join(" ").toLowerCase();

    const domainMap: Record<string, { description: string; technologies: string[]; relatedProjects: string[] }> = {
      web: {
        description: "Client-facing systems for research, operations, and public access.",
        technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        relatedProjects: projectTitles.filter((title) => /research|development|center|consortium/i.test(title)).slice(0, 2),
      },
      api: {
        description: "Backend services, integrations, and application logic for institutional workflows.",
        technologies: ["Laravel", "PHP", "JavaScript"],
        relatedProjects: projectTitles.filter((title) => /monitoring|management|consortium|research/i.test(title)).slice(0, 2),
      },
      db: {
        description: "Data models, persistence, and operational systems that support dependable delivery.",
        technologies: ["MySQL", "Database design", "Data management"],
        relatedProjects: projectTitles.filter((title) => /database|management|monitoring/i.test(title)).slice(0, 2),
      },
      ai: {
        description: "Automation and AI-enabled workflows that support practical decision support.",
        technologies: ["AI-powered applications", "Automation workflows"],
        relatedProjects: timelineText.includes("automation") ? projectTitles.slice(0, 2) : projectTitles.slice(0, 1),
      },
      iot: {
        description: "Monitoring and connected-device systems for live operational environments.",
        technologies: ["IoT monitoring", "Real-time monitoring"],
        relatedProjects: projectTitles.filter((title) => /monitoring|smart|agriculture|real/i.test(title)).slice(0, 2),
      },
      research: {
        description: "Research infrastructure for evidence, knowledge, and informed delivery.",
        technologies: ["Research information systems", "Content management", "Database management"],
        relatedProjects: projectTitles.filter((title) => /research|consortium|database|management/i.test(title)).slice(0, 2),
      },
    };

    return hoveredNode ? domainMap[hoveredNode] ?? null : null;
  }, [hoveredNode, portfolio.projects, portfolio.timeline]);

  const handleNavigate = (key: string) => {
    const selected = architectureFlow.find((item) => item.key === key);
    if (selected) {
      smoothScrollToId(selected.sectionId);
    }
  };

  return (
    <aside className="ecosystem-panel" aria-labelledby="ecosystem-title">
      <div className="ecosystem-panel-head">
        <p className="ecosystem-kicker">Architecture visual</p>
        <h2 id="ecosystem-title">Engineering ecosystem</h2>
        <p className="ecosystem-summary">A systems-oriented view of how product interfaces, services, data, automation, connected devices, and research infrastructure work together in delivered software.</p>
      </div>

      <div className="ecosystem-stage">
        {mode === "scene" ? (
          <>
            <LazyScene
              reducedMotion={reducedMotion}
              paused={paused}
              scrollProgress={scrollProgress}
              hoveredNode={hoveredNode}
              onNodeHover={setHoveredNode}
              onNodeSelect={handleNavigate}
            />
            {activeNode && tooltipContent ? (
              <div className="ecosystem-tooltip" role="status" aria-live="polite">
                <strong>{activeNode.label}</strong>
                <span>{tooltipContent.description}</span>
                <span className="ecosystem-tooltip-label">Technologies</span>
                <span>{tooltipContent.technologies.join(" · ")}</span>
                <span className="ecosystem-tooltip-label">Related work</span>
                <span>{tooltipContent.relatedProjects.join(" · ")}</span>
              </div>
            ) : null}
          </>
        ) : (
          <EcosystemFallback reason={mode} onNavigate={handleNavigate} />
        )}
      </div>

      <ol className="ecosystem-flow" aria-label="Engineering flow navigation">
        {architectureFlow.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              className={`ecosystem-flow-item ${hoveredNode === item.key ? "is-active" : ""}`}
              onClick={() => handleNavigate(item.key)}
              onMouseEnter={() => setHoveredNode(item.key)}
              onMouseLeave={() => setHoveredNode((current) => (current === item.key ? null : current))}
            >
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="ecosystem-controls">
        <button
          type="button"
          className="ecosystem-toggle"
          onClick={() => setPaused((value) => !value)}
          disabled={mode !== "scene" || reducedMotion}
          aria-pressed={paused}
        >
          {reducedMotion ? "Motion: Off" : paused ? "Motion: Off" : "Motion: On"}
        </button>
      </div>
    </aside>
  );
}
