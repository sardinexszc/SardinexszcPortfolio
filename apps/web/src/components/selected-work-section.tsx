"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { trackEngagement } from "@/lib/track-engagement";
import {
  getRoleSummary,
  inferCategory,
  projectDisplayTitle,
  projectHasScreenshot,
  projectSlug,
  splitStack,
} from "@/lib/work-projects";

const projectDetails: Record<string, { problem: string; outcome: string }> = {
  "crops-and-resources-rd-center": {
    problem: "Records were spread across research and administrative teams.",
    outcome: "Deployed a shared platform for staff to access and manage these records.",
  },
  "claarrdec-real-time-monitoring-system": {
    problem: "Member institutions needed a shared way to report and monitor projects.",
    outcome: "Deployed reporting and project tracking tools for consortium oversight.",
  },
  "claarrdec-cms-e-library": {
    problem: "Public content and library resources needed different access levels.",
    outcome: "Deployed a website with publishing, e-library access, and usage reports.",
  },
};

function WorkCard({ project, index }: { project: Project; index: number }) {
  const category = inferCategory(project);
  const role = getRoleSummary(project);
  const stack = splitStack(project);
  const slug = projectSlug(project);
  const hasScreenshot = projectHasScreenshot(project);
  const details = projectDetails[slug] ?? {
    problem: project.description,
    outcome: project.description,
  };

  return (
    <article className="work-card" role="listitem">
      <div className="work-card-header">
        <p className="work-card-number">Project {String(index + 1).padStart(2, "0")}</p>
        <p className="work-card-category">{category}</p>
      </div>

      <div className="work-card-core">
        <h3>{projectDisplayTitle(project)}</h3>
        <p>{project.description}</p>
      </div>

      <div className="work-card-scanline">
        <div><span className="work-eyebrow">Contribution</span><strong>{role}</strong></div>
        <div><span className="work-eyebrow">Stack</span><strong>{stack.primary.slice(0, 3).join(" · ")}</strong></div>
      </div>

      <details className="work-card-disclosure" onToggle={(event) => {
        if (event.currentTarget.open) trackEngagement({ type: "project_open", projectId: project.id });
      }}>
        <summary>Project details</summary>
        <div className="work-card-detail-grid">
          <section><p className="work-eyebrow">Challenge</p><p>{details.problem}</p></section>
          <section><p className="work-eyebrow">My role</p><p>{role}</p></section>
          <section><p className="work-eyebrow">Result</p><p>{details.outcome}</p></section>
          <section>
            <p className="work-eyebrow">Primary stack</p>
            <div className="work-stack">
              {stack.primary.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </section>

          {stack.supporting.length > 0 ? (
            <section>
              <p className="work-eyebrow">Supporting technologies</p>
              <div className="work-stack">
                {stack.supporting.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <p className="work-eyebrow">Links</p>
            <div className="work-links">
              {project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer" onClick={() => trackEngagement({ type: "outbound_click", projectId: project.id, linkKind: "live_project" })}>Live project <ArrowUpRight size={15} /></a> : null}
              {project.github_url ? <a href={project.github_url} target="_blank" rel="noopener noreferrer" onClick={() => trackEngagement({ type: "outbound_click", projectId: project.id, linkKind: "github_repository" })}>GitHub <ArrowUpRight size={15} /></a> : null}
            </div>
          </section>
        </div>
      </details>

      {hasScreenshot ? (
        <figure className="work-screenshot">
          <img src={project.image_url as string} alt={`${projectDisplayTitle(project)} screenshot`} loading="lazy" decoding="async" />
        </figure>
      ) : null}
    </article>
  );
}

export function SelectedWorkSection({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.filter((project) => project.featured);
  const visibleProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  return (
    <div className="work-grid" role="list">
      {visibleProjects.map((project, index) => (
        <WorkCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
