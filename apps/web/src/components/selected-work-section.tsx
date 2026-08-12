"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import {
  getProjectSummary,
  getRoleSummary,
  inferCategory,
  projectDisplayTitle,
  projectHasScreenshot,
  projectSlug,
  splitStack,
} from "@/lib/work-projects";
import { motionTokens } from "@/lib/motion-tokens";
import { ProjectSystemPreview } from "./project-system-preview";

function WorkCard({ project, index }: { project: Project; index: number }) {
  const category = inferCategory(project);
  const summary = getProjectSummary(project);
  const role = getRoleSummary(project);
  const stack = splitStack(project);
  const slug = projectSlug(project);
  const hasScreenshot = projectHasScreenshot(project);

  return (
    <article className="work-card" role="listitem">
      <div className="work-card-header">
        <p className="work-card-number">Project {String(index + 1).padStart(2, "0")}</p>
        <p className="work-card-category">{category}</p>
      </div>

      <div className="work-card-core">
        <h3>{projectDisplayTitle(project)}</h3>
        <p>{summary}</p>
      </div>

      <div className="work-card-proof">
        <p className="work-eyebrow">Outcome</p>
        <p>{project.outcome?.trim() || "See the case study for the documented problem, implementation context, and system architecture."}</p>
      </div>

      <div className="work-links" aria-label={`${projectDisplayTitle(project)} links`}>
        <Link href={`/work/${slug}`}>Case study <ArrowUpRight size={15} /></Link>
        {project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer">Live project <ArrowUpRight size={15} /></a> : null}
        {project.github_url ? <a href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={15} /></a> : null}
      </div>

      <details className="work-card-disclosure">
        <summary>Project details</summary>
        <div className="work-card-detail-grid">
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
            <p className="work-eyebrow">My role</p>
            <p>{role}</p>
          </section>

          <section>
            <p className="work-eyebrow">Links</p>
            <div className="work-links">
              <Link href={`/work/${slug}`}>Open case study <ArrowUpRight size={15} /></Link>
            </div>
          </section>
        </div>
      </details>

      {hasScreenshot ? (
        <figure className="work-screenshot">
          <Image src={project.image_url as string} alt={`${projectDisplayTitle(project)} screenshot`} fill sizes="(max-width: 900px) 88vw, 33vw" />
        </figure>
      ) : (
        <ProjectSystemPreview project={project} />
      )}
    </article>
  );
}

export function SelectedWorkSection({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();
  const featuredProjects = projects.filter((project) => project.featured);
  const visibleProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  const revealInitial = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: motionTokens.distance.subtle };
  const revealVisible = { opacity: 1, y: 0 };

  return (
    <motion.div
      className="work-grid"
      role="list"
      initial={revealInitial}
      whileInView={revealVisible}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.ease.standard }}
    >
      {visibleProjects.map((project, index) => (
        <motion.div
          key={project.id}
          className="work-card-motion"
          initial={revealInitial}
          whileInView={revealVisible}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: motionTokens.duration.normal,
            ease: motionTokens.ease.standard,
            delay: reduceMotion ? 0 : index * motionTokens.delay.staggerStep,
          }}
          whileHover={reduceMotion ? undefined : { y: -2 }}
        >
          <WorkCard project={project} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}
