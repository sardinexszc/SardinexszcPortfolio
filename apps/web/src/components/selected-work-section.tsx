import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import {
  getRoleSummary,
  inferCategory,
  projectDisplayTitle,
  projectHasScreenshot,
  projectSlug,
  splitStack,
} from "@/lib/work-projects";

const projectDetails: Record<string, { problem: string; implementation: string; outcome: string }> = {
  "crops-and-resources-rd-center": {
    problem: "Research, extension, personnel, and administrative records needed a centralized institutional system.",
    implementation: "A web platform that organizes records and supports institutional information access and administrative workflows.",
    outcome: "A deployed central source for research, extension, personnel, and administrative information.",
  },
  "claarrdec-real-time-monitoring-system": {
    problem: "Consortium reporting, project tracking, and monitoring and evaluation workflows required centralized data management.",
    implementation: "A Laravel and MySQL system for reporting, project records, and monitoring and evaluation activities across member institutions.",
    outcome: "A deployed system supporting CLAARRDEC reporting, project tracking, and oversight workflows.",
  },
  "claarrdec-cms-e-library": {
    problem: "Institutional content and library resources needed both public delivery and controlled access.",
    implementation: "A Laravel content management and e-library platform with public pages, authenticated access, administrative functions, and usage reporting.",
    outcome: "A deployed institutional website combining content publishing, e-library access, and usage reporting.",
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
    implementation: project.description,
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

      <details className="work-card-disclosure">
        <summary>Project details</summary>
        <div className="work-card-detail-grid">
          <section><p className="work-eyebrow">Problem</p><p>{details.problem}</p></section>
          <section><p className="work-eyebrow">Implementation</p><p>{details.implementation}</p></section>
          <section><p className="work-eyebrow">Contribution</p><p>{role}</p></section>
          <section><p className="work-eyebrow">Verified outcome</p><p>{details.outcome}</p></section>
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
              {project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer">Live project <ArrowUpRight size={15} /></a> : null}
              {project.github_url ? <a href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={15} /></a> : null}
              <Link href={`/work/${slug}`}>Case study <ArrowUpRight size={15} /></Link>
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
