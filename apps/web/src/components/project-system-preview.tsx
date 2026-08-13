"use client";

import { useState } from "react";
import { BarChart3, BookOpen, CheckCircle2, FolderKanban, Search } from "lucide-react";
import type { Project } from "@/lib/types";
import { projectSlug } from "@/lib/work-projects";

type PreviewVariant = "research" | "monitoring" | "library";

function getVariant(project: Project): PreviewVariant {
  const slug = projectSlug(project);
  if (slug === "claarrdec-real-time-monitoring-system") return "monitoring";
  if (slug === "claarrdec-cms-e-library") return "library";
  return "research";
}

const previewData = {
  research: {
    label: "Research workspace",
    tabs: ["Programs", "Records", "Teams"],
    headings: ["Research programs", "Recent research records", "Working groups"],
    descriptions: ["Browse active research and extension initiatives.", "Review organized institutional knowledge.", "See the teams supporting each program."],
    rows: [["Crop systems", "Active", "12 records"], ["Community extension", "Active", "8 records"], ["Resource studies", "Review", "6 records"]],
    icon: FolderKanban,
  },
  monitoring: {
    label: "Monitoring workspace",
    tabs: ["Overview", "Reports", "Milestones"],
    headings: ["Program overview", "Reporting status", "Upcoming milestones"],
    descriptions: ["Track participating projects from one operational view.", "See submissions and review status at a glance.", "Keep delivery activities visible to member institutions."],
    rows: [["Quarterly reports", "82%", "24 submitted"], ["Active projects", "18", "3 need review"], ["Member institutions", "12", "All connected"]],
    icon: BarChart3,
  },
  library: {
    label: "Knowledge library",
    tabs: ["Discover", "Collections", "Insights"],
    headings: ["Find institutional knowledge", "Featured collections", "Library engagement"],
    descriptions: ["Search resources across public and authenticated content.", "Browse curated materials by topic and audience.", "Understand how visitors use the information library."],
    rows: [["Research publications", "Library", "128 items"], ["Extension resources", "Collection", "64 items"], ["Most-read topics", "Insights", "Crop systems"]],
    icon: BookOpen,
  },
} as const;

export function ProjectSystemPreview({ project }: { project: Project }) {
  const variant = getVariant(project);
  const preview = previewData[variant];
  const [activeTab, setActiveTab] = useState(0);
  const Icon = preview.icon;

  return (
    <section className={`system-preview system-preview-${variant}`} aria-label={`${project.title} interactive system preview`}>
      <div className="system-preview-topbar">
        <div className="system-preview-brand"><Icon size={14} aria-hidden="true" /><span>{preview.label}</span></div>
        <span className="system-preview-demo">Interactive preview</span>
      </div>

      <div className="system-preview-tabs" role="tablist" aria-label={`${project.title} preview views`}>
        {preview.tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === index}
            className={activeTab === index ? "is-active" : undefined}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="system-preview-content" role="tabpanel">
        <div className="system-preview-intro">
          <div>
            <p>{preview.label}</p>
            <h4>{preview.headings[activeTab]}</h4>
          </div>
          {variant === "library" ? <Search size={16} aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}
        </div>
        <p className="system-preview-description">{preview.descriptions[activeTab]}</p>
        <div className="system-preview-rows">
          {preview.rows.map(([name, status, detail], index) => (
            <div className="system-preview-row" key={name} style={{ opacity: activeTab === 0 || index !== 2 ? 1 : 0.82 }}>
              <span>{name}</span><b>{status}</b><small>{detail}</small>
            </div>
          ))}
        </div>
      </div>
      <p className="system-preview-note">Representative workflow — not a production screenshot.</p>
    </section>
  );
}
