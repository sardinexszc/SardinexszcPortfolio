import {
  ArrowUpRight,
  BookOpen,
  Bot,
  Code2,
  Cpu,
  Github,
  Globe,
  Layers,
  LineChart,
  Lock,
  Microscope,
  Target,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectDialog } from "./project-dialog";
import { TechChip, TechIcon } from "./tech-icon";
import { TrackedLink } from "./tracked-elements";
import {
  getRoleSummary,
  inferCategory,
  projectDisplayTitle,
  projectHasScreenshot,
  projectSlug,
  splitStack,
  type ProjectCategory,
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

const categoryIcons: Record<ProjectCategory, LucideIcon> = {
  "Research Information System": Microscope,
  "Monitoring & Evaluation": LineChart,
  "CMS / E-Library": BookOpen,
  "Full-Stack Web Application": Code2,
  "AI / Automation": Bot,
  "IoT / Smart Agriculture": Cpu,
};

export function projectAnchor(project: Project): string {
  return `project-${projectSlug(project)}`;
}

function hostOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

// Until real screenshots exist, the cover is a browser-frame placeholder with the project's
// category icon, so cards are not walls of text. A project with image_url shows the screenshot.
function ProjectCover({ project, title, category }: { project: Project; title: string; category: ProjectCategory }) {
  const CategoryIcon = categoryIcons[category];
  const host = hostOf(project.live_url) ?? "internal system";

  return (
    <figure className="work-cover" data-category={projectSlug(project)}>
      <div className="work-cover-chrome" aria-hidden="true">
        <span /><span /><span />
        <p>{host}</p>
      </div>
      {projectHasScreenshot(project) ? (
        // eslint-disable-next-line @next/next/no-img-element -- screenshot URLs come from the database; switch to next/image once real assets exist.
        <img src={project.image_url as string} alt={`${title} screenshot`} loading="lazy" decoding="async" />
      ) : (
        <div className="work-cover-placeholder" aria-hidden="true">
          <CategoryIcon size={44} strokeWidth={1.4} />
        </div>
      )}
    </figure>
  );
}

function ProjectLinks({ project, title }: { project: Project; title: string }) {
  if (!project.live_url && !project.github_url) {
    return <p className="work-link-note"><Lock size={14} aria-hidden="true" /> Internal system, no public link</p>;
  }

  return (
    <div className="work-links">
      {project.live_url ? <TrackedLink href={project.live_url} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", projectId: project.id, linkKind: "live_project" }}><Globe size={15} aria-hidden="true" /> Live site <span className="visually-hidden">for {title} (opens in a new tab)</span><ArrowUpRight size={15} aria-hidden="true" /></TrackedLink> : null}
      {project.github_url ? <TrackedLink href={project.github_url} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", projectId: project.id, linkKind: "github_repository" }}><Github size={15} aria-hidden="true" /> Source <span className="visually-hidden">for {title} (opens in a new tab)</span><ArrowUpRight size={15} aria-hidden="true" /></TrackedLink> : null}
    </div>
  );
}

function WorkCard({ project }: { project: Project }) {
  const category = inferCategory(project);
  const CategoryIcon = categoryIcons[category];
  const role = getRoleSummary(project);
  const stack = splitStack(project);
  const slug = projectSlug(project);
  const title = projectDisplayTitle(project);
  const details = projectDetails[slug] ?? {
    problem: project.description,
    outcome: project.description,
  };

  return (
    <li className="work-card" id={projectAnchor(project)}>
      <ProjectDialog
        projectId={project.id}
        title={title}
        cover={<ProjectCover project={project} title={title} category={category} />}
        summary={
          <>
            <div className="work-card-body">
              <p className="work-card-category"><CategoryIcon size={15} aria-hidden="true" /> {category}</p>
              <h3>{title}</h3>
              <p>{project.description}</p>
            </div>
            <ul className="work-card-stack" aria-label={`${title} stack`}>
              {stack.primary.map((tech) => <li key={tech}><TechIcon name={tech} size={16} />{tech}</li>)}
            </ul>
          </>
        }
        footer={<ProjectLinks project={project} title={title} />}
      >
        <p className="work-card-category"><CategoryIcon size={15} aria-hidden="true" /> {category}</p>
        <p className="project-dialog-lead">{project.description}</p>
        <div className="project-dialog-grid">
          <section><h4><Target size={16} aria-hidden="true" /> Challenge</h4><p>{details.problem}</p></section>
          <section><h4><UserRound size={16} aria-hidden="true" /> My role</h4><p>{role}</p></section>
          <section><h4><Trophy size={16} aria-hidden="true" /> Result</h4><p>{details.outcome}</p></section>
        </div>
        <section className="project-dialog-stack">
          <h4><Layers size={16} aria-hidden="true" /> Stack</h4>
          <div className="work-stack">
            {[...stack.primary, ...stack.supporting].map((tech) => <TechChip key={tech} name={tech} />)}
          </div>
        </section>
        <ProjectLinks project={project} title={title} />
      </ProjectDialog>
    </li>
  );
}

export function SelectedWorkSection({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.filter((project) => project.featured);
  const visibleProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  return (
    <ul className="work-grid">
      {visibleProjects.map((project) => (
        <WorkCard key={project.id} project={project} />
      ))}
    </ul>
  );
}
