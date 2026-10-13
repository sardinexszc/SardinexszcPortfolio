import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { TrackedDetails, TrackedLink } from "./tracked-elements";
import {
  getRoleSummary,
  inferCategory,
  projectDisplayTitle,
  projectHasScreenshot,
  projectSlug,
  splitStack,
} from "@/lib/work-projects";

// [NEEDS INFO] Each "outcome" should carry a real, verifiable number when one exists
// (users, institutions, records, reports, time saved). See PORTFOLIO_AUDIT.md.
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

export function projectAnchor(project: Project): string {
  return `project-${projectSlug(project)}`;
}

function WorkCard({ project, index }: { project: Project; index: number }) {
  const category = inferCategory(project);
  const role = getRoleSummary(project);
  const stack = splitStack(project);
  const slug = projectSlug(project);
  const title = projectDisplayTitle(project);
  const hasScreenshot = projectHasScreenshot(project);
  const details = projectDetails[slug] ?? {
    problem: project.description,
    outcome: project.description,
  };

  return (
    <li className="work-card" id={projectAnchor(project)}>
      <div className="work-card-header">
        <p className="work-card-number">Project {String(index + 1).padStart(2, "0")}</p>
        <p className="work-card-category">{category}</p>
      </div>

      <div className="work-card-core">
        <h3>{title}</h3>
        <p>{project.description}</p>
      </div>

      <div className="work-card-scanline">
        <div><span className="work-eyebrow">Contribution</span><strong>{role}</strong></div>
        <div><span className="work-eyebrow">Stack</span><strong>{stack.primary.slice(0, 3).join(" · ")}</strong></div>
      </div>

      {project.live_url || project.github_url ? (
        <div className="work-links">
          {project.live_url ? <TrackedLink href={project.live_url} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", projectId: project.id, linkKind: "live_project" }}>Visit live site <span className="visually-hidden">for {title} (opens in a new tab)</span><ArrowUpRight size={15} aria-hidden="true" /></TrackedLink> : null}
          {project.github_url ? <TrackedLink href={project.github_url} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", projectId: project.id, linkKind: "github_repository" }}>Source code <span className="visually-hidden">for {title} (opens in a new tab)</span><ArrowUpRight size={15} aria-hidden="true" /></TrackedLink> : null}
        </div>
      ) : (
        <p className="work-link-note">Public link currently unavailable</p>
      )}

      <TrackedDetails className="work-card-disclosure" projectId={project.id}>
        <summary>Challenge, role, and result</summary>
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
        </div>
      </TrackedDetails>

      {hasScreenshot ? (
        <figure className="work-screenshot">
          {/* eslint-disable-next-line @next/next/no-img-element -- screenshot URLs are not configured yet; switch to next/image once real assets exist. */}
          <img src={project.image_url as string} alt={`${title} screenshot`} loading="lazy" decoding="async" />
        </figure>
      ) : null}
    </li>
  );
}

export function SelectedWorkSection({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.filter((project) => project.featured);
  const visibleProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  return (
    <ul className="work-grid">
      {visibleProjects.map((project, index) => (
        <WorkCard key={project.id} project={project} index={index} />
      ))}
    </ul>
  );
}
