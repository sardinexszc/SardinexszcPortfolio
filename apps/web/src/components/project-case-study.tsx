import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import {
  getArchitecture,
  getKeyFeatures,
  getOutcomeStatement,
  getProblemStatement,
  getRoleSummary,
  getSolutionStatement,
  inferCategory,
  projectDisplayTitle,
  projectHasScreenshot,
  splitStack,
} from "@/lib/work-projects";

type ProjectCaseStudyProps = {
  project: Project;
};

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const architecture = getArchitecture(project);
  const category = inferCategory(project);
  const roleSummary = getRoleSummary(project);
  const stack = splitStack(project);
  const features = getKeyFeatures(project);
  const problem = getProblemStatement(project);
  const solution = getSolutionStatement(project);
  const outcome = getOutcomeStatement(project);
  const hasScreenshot = projectHasScreenshot(project);

  return (
    <article className="case-study-layout" aria-labelledby="case-study-title">
      <header className="case-study-header">
        <p className="case-study-category">{category}</p>
        <h1 id="case-study-title">{projectDisplayTitle(project)}</h1>
        <p className="case-study-overview">{project.description}</p>
      </header>

      {hasScreenshot ? (
        <figure className="case-study-visual">
          <img src={project.image_url as string} alt={`${projectDisplayTitle(project)} project visual`} loading="eager" decoding="async" />
        </figure>
      ) : null}

      <section className="case-study-section">
        <h2>My Role</h2>
        <p>{roleSummary}</p>
      </section>

      {problem ? (
        <section className="case-study-section">
          <h2>Problem</h2>
          <p>{problem}</p>
        </section>
      ) : null}

      {solution ? (
        <section className="case-study-section">
          <h2>Solution</h2>
          <p>{solution}</p>
        </section>
      ) : null}

      {features.length > 0 ? (
        <section className="case-study-section">
          <h2>Key Features</h2>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="case-study-section">
        <h2>Technology</h2>
        <div className="case-study-stack-wrap">
          {stack.primary.length > 0 ? (
            <div>
              <p className="case-study-mini-label">Primary stack</p>
              <div className="case-study-stack-list">
                {stack.primary.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          ) : null}

          {stack.supporting.length > 0 ? (
            <div>
              <p className="case-study-mini-label">Supporting technologies</p>
              <div className="case-study-stack-list">
                {stack.supporting.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {architecture ? (
        <section className="case-study-section">
          <h2>{architecture.title}</h2>
          <div className="case-study-architecture" role="img" aria-label={`${projectDisplayTitle(project)} architecture flow`}>
            {architecture.layers.map((layer, index) => (
              <div key={layer} className="case-study-architecture-node">
                <span>{layer}</span>
                {index < architecture.layers.length - 1 ? <i aria-hidden="true">↓</i> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {outcome ? (
        <section className="case-study-section">
          <h2>Outcome</h2>
          <p>{outcome}</p>
        </section>
      ) : null}

      {(project.live_url || project.github_url) ? (
        <section className="case-study-section">
          <h2>Project Links</h2>
          <div className="case-study-links">
            {project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer">Live project <ArrowUpRight size={15} /></a> : null}
            {project.github_url ? <a href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub repository <ArrowUpRight size={15} /></a> : null}
          </div>
        </section>
      ) : null}
    </article>
  );
}
