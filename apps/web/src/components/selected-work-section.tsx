import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

type ProjectCategory =
  | "Full-Stack Web Application"
  | "Research Information System"
  | "Monitoring & Evaluation"
  | "CMS / E-Library"
  | "AI / Automation"
  | "IoT / Smart Agriculture"
  | "Mobile / Computer Vision";

function inferCategory(project: Project): ProjectCategory {
  const title = project.title.toLowerCase();
  const description = project.description.toLowerCase();
  const stack = project.tech_stack.join(" ").toLowerCase();
  const haystack = `${title} ${description} ${stack}`;

  if (/(monitoring|m&e|evaluation|rtms)/.test(haystack)) return "Monitoring & Evaluation";
  if (/(cms|content management|e-library|library)/.test(haystack)) return "CMS / E-Library";
  if (/(research|rd|r&d|consortium)/.test(haystack)) return "Research Information System";
  if (/(iot|smart agriculture|esp32|sensor)/.test(haystack)) return "IoT / Smart Agriculture";
  if (/(ai|automation|llm|n8n)/.test(haystack)) return "AI / Automation";
  if (/(mobile|computer vision)/.test(haystack)) return "Mobile / Computer Vision";
  return "Full-Stack Web Application";
}

function sentenceCase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed[0].toUpperCase() + trimmed.slice(1);
}

function getProblemFromDescription(description: string): string {
  const marker = /,\s*built to\s+/i;
  if (marker.test(description)) {
    return sentenceCase(description.split(marker)[0]);
  }
  const firstSentence = description.split(".")[0]?.trim();
  return firstSentence ? sentenceCase(firstSentence) : "Problem statement is not yet documented in this public project dataset.";
}

function getOutcomeFromDescription(description: string): string | null {
  const builtToMatch = description.match(/built to\s+(.+?)(?:\.|$)/i);
  if (builtToMatch?.[1]) {
    return sentenceCase(builtToMatch[1]);
  }

  const improveMatch = description.match(/(improve\s+.+?)(?:\.|$)/i);
  if (improveMatch?.[1]) {
    return sentenceCase(improveMatch[1]);
  }

  return null;
}

function getKeyFunctionality(description: string): string[] {
  const normalized = description.replace(/\.$/, "");
  const chunks = normalized
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length >= 3) {
    return chunks.slice(0, 3).map(sentenceCase);
  }

  return [
    sentenceCase(normalized),
    "Structured data management for organization workflows",
    "Web-based delivery for operational access",
  ];
}

function getArchitecture(project: Project): string {
  const stack = project.tech_stack.map((item) => item.toLowerCase());
  const hasLaravel = stack.some((item) => item.includes("laravel") || item.includes("php"));
  const hasNext = stack.some((item) => item.includes("next") || item.includes("react"));

  if (hasLaravel && hasNext) {
    return "Web application architecture with a frontend client and backend service layers, using relational data management and role-aware application flows.";
  }

  if (hasLaravel) {
    return "Server-rendered web architecture using backend-driven application workflows and relational data structures.";
  }

  if (hasNext) {
    return "Frontend-first web architecture with component-based UI, typed code organization, and deployment-focused delivery.";
  }

  return "Architecture details are not yet fully documented in this public project dataset.";
}

function hasScreenshot(project: Project): boolean {
  return Boolean(project.image_url && project.image_url.trim().length > 0);
}

function ProjectCaseStudy({ project }: { project: Project }) {
  const category = inferCategory(project);
  const problem = getProblemFromDescription(project.description);
  const solution = project.description;
  const outcome = getOutcomeFromDescription(project.description);
  const features = getKeyFunctionality(project.description);

  return (
    <details className="work-case-study">
      <summary>
        Case Study (Level 3)
        <span>Open detailed breakdown and architecture notes (Level 4)</span>
      </summary>
      <div className="work-case-study-body">
        <section>
          <h4>Overview</h4>
          <p>{project.description}</p>
        </section>
        <section>
          <h4>Problem</h4>
          <p>{problem}</p>
        </section>
        <section>
          <h4>Solution</h4>
          <p>{solution}</p>
        </section>
        <section>
          <h4>Architecture</h4>
          <p>{getArchitecture(project)}</p>
        </section>
        <section>
          <h4>Features</h4>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Technology</h4>
          <p>{project.tech_stack.join(", ")}</p>
        </section>
        <section>
          <h4>My Role</h4>
          <p>Exact role scope is not explicitly documented in the public project dataset yet. Contact Ivan for implementation-level breakdown.</p>
        </section>
        <section>
          <h4>Outcome</h4>
          <p>{outcome ?? "Outcome metrics are not yet publicly documented for this project."}</p>
        </section>
        <section>
          <h4>Screenshots</h4>
          <p>{hasScreenshot(project) ? "Project screenshot is available in this card preview." : "No screenshot is currently provided in the public project data."}</p>
        </section>
        <section>
          <h4>Live Demo</h4>
          <p>{project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer">Open live project</a> : "No public live demo is listed."}</p>
        </section>
        <section>
          <h4>Repository</h4>
          <p>{project.github_url ? <a href={project.github_url} target="_blank" rel="noopener noreferrer">Open repository</a> : "No public repository is listed."}</p>
        </section>
        <section>
          <h4>Category</h4>
          <p>{category}</p>
        </section>
      </div>
    </details>
  );
}

function WorkCard({ project, index, featured }: { project: Project; index: number; featured: boolean }) {
  const category = inferCategory(project);
  const problem = getProblemFromDescription(project.description);
  const outcome = getOutcomeFromDescription(project.description);
  const features = getKeyFunctionality(project.description);

  return (
    <article className={`work-card ${featured ? "work-card-featured" : "work-card-standard"}`} role="listitem">
      <div className="work-card-header">
        <p className="work-card-number">{String(index + 1).padStart(2, "0")}</p>
        <p className="work-card-category">{category}</p>
      </div>

      <div className="work-card-body">
        <h3>{project.title}</h3>

        <div className="work-card-summary-grid">
          <div>
            <p className="work-eyebrow">Problem</p>
            <p>{problem}</p>
          </div>
          <div>
            <p className="work-eyebrow">Solution</p>
            <p>{project.description}</p>
          </div>
        </div>

        <div>
          <p className="work-eyebrow">My Contribution</p>
          <p>Contribution details are not explicitly documented in the current public project data. Scope details are available through case study discussion.</p>
        </div>

        <div>
          <p className="work-eyebrow">Key Functionality</p>
          <ul className="work-feature-list">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="work-eyebrow">Technical Stack</p>
          <div className="work-stack">
            {project.tech_stack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="work-eyebrow">Outcome / Impact</p>
          <p>{outcome ?? "Outcome metrics are not yet publicly documented for this project."}</p>
        </div>
      </div>

      {hasScreenshot(project) ? (
        <div
          className="work-screenshot"
          role="img"
          aria-label={`${project.title} screenshot`}
          style={{ backgroundImage: `url(${project.image_url})` }}
        />
      ) : (
        <div className="work-screenshot work-screenshot-placeholder" aria-hidden="true">
          <p>Screenshot not available in current data</p>
        </div>
      )}

      <div className="work-links">
        {project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer">Live Project <ArrowUpRight size={15} /></a> : null}
        {project.github_url ? <a href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub Repository <ArrowUpRight size={15} /></a> : null}
      </div>

      <ProjectCaseStudy project={project} />
    </article>
  );
}

export function SelectedWorkSection({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.filter((project) => project.featured);
  const visibleProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  return (
    <div className="work-grid" role="list">
      {visibleProjects.map((project, index) => (
        <WorkCard
          key={project.id}
          project={project}
          index={index}
          featured={index < 2}
        />
      ))}

      <article className="work-card work-card-secondary" role="listitem">
        <div className="work-card-header">
          <p className="work-card-number">More</p>
          <p className="work-card-category">Professional archive</p>
        </div>
        <div className="work-card-body">
          <h3>Additional Projects and Delivery History</h3>
          <p>More implementations, technical responsibilities, and project context are available on LinkedIn.</p>
          <div>
            <p className="work-eyebrow">Case Study Access</p>
            <p>Reach out if you want a deeper technical walkthrough of architecture, constraints, and implementation decisions.</p>
          </div>
        </div>
        <div className="work-links">
          <a href="https://www.linkedin.com/in/banbansalinas/" target="_blank" rel="noopener noreferrer">View LinkedIn Projects <ArrowUpRight size={15} /></a>
        </div>
      </article>
    </div>
  );
}
