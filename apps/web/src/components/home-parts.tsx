"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/lib/types";
import { trackEngagement } from "@/lib/track-engagement";
import { getRoleSummary, inferCategory, isAllowedImage, projectDisplayTitle, projectSlug, splitStack } from "@/lib/work-projects";
import { TechChip } from "./tech-icon";
import { TrackedLink } from "./tracked-elements";

const PLACEHOLDER = "/images/placeholder/project.svg";
const EASE = [0.22, 1, 0.36, 1] as const;
const projectImage = (project: Project) => (isAllowedImage(project.image_url) ? project.image_url : PLACEHOLDER);

// Fades and lifts its content in once it scrolls into view.
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

// Each word rises out of its own clipped line. Screen readers get the plain text.
// The in-view trigger sits on the wrapper: a word starts clipped away, so it would never count as visible itself.
export function RiseText({ text, delay = 0, onLoad = false }: { text: string; delay?: number; onLoad?: boolean }) {
  const reduce = useReducedMotion();
  const trigger = onLoad ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.5 } };
  return (
    <>
      <span className="visually-hidden">{text}</span>
      <motion.span aria-hidden="true" initial={reduce ? false : "hidden"} {...trigger}>
        {text.split(" ").map((word, i, words) => (
          // The space sits outside the clipped box; inside it would collapse and glue words together.
          <Fragment key={i}>
            <span className="pf-rise">
              <motion.span variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, ease: EASE, delay: delay + i * 0.06 } } }}>{word}</motion.span>
            </span>{i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </>
  );
}

function ProjectLinks({ project, title }: { project: Project; title: string }) {
  return (
    <div className="pf-work-links">
      {project.live_url ? <TrackedLink href={project.live_url} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", projectId: project.id, linkKind: "live_project" }}>Live <ArrowUpRight size={13} aria-hidden="true" /><span className="visually-hidden">site for {title} (opens in a new tab)</span></TrackedLink> : null}
      {project.github_url ? <TrackedLink href={project.github_url} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", projectId: project.id, linkKind: "github_repository" }}>Source <ArrowUpRight size={13} aria-hidden="true" /><span className="visually-hidden">for {title} (opens in a new tab)</span></TrackedLink> : null}
    </div>
  );
}

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"];
export const roman = (index: number) => ROMAN[index] ?? String(index + 1);

// Chapter list in the side panel. The chapter crossing the middle of the viewport is marked current.
export function ChapterNav({ chapters }: { chapters: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(chapters[0]?.id);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
    }, { rootMargin: "-45% 0px -50% 0px" });
    for (const { id } of chapters) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [chapters]);
  return (
    <nav className="pf-chapters" aria-label="Chapters">
      <ol>
        {chapters.map(({ id, label }, i) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={current === id ? "location" : undefined}><span aria-hidden="true">{roman(i)}</span>{label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Projects as alternating image/text spreads. Each spread slides in from its image side.
export function ProjectSpreads({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const show = (project: Project) => {
    setOpen(project);
    dialogRef.current?.showModal();
    trackEngagement({ type: "project_open", projectId: project.id });
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <ol className="pf-spreads">
        {projects.map((project, i) => {
          const title = projectDisplayTitle(project);
          const image = projectImage(project);
          const flip = i % 2 === 1;
          return (
            <motion.li key={project.id} id={`project-${projectSlug(project)}`} className={`pf-spread${flip ? " pf-spread-flip" : ""}`}
              initial={reduce ? false : { opacity: 0, x: flip ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: EASE }}>
              <button type="button" className="pf-spread-media" onClick={() => show(project)} aria-label={`Open case study for ${title}`} aria-haspopup="dialog">
                <Image src={image} alt="" width={1600} height={1000} sizes="(max-width: 1000px) 100vw, 32vw" unoptimized={image.endsWith(".svg")} />
              </button>
              <div className="pf-spread-text">
                <span className="pf-numeral" aria-hidden="true">{roman(i)}.</span>
                <h3>{title}</h3>
                <p className="pf-spread-meta">{inferCategory(project)} · {getRoleSummary(project)}</p>
                <p>{project.description}</p>
                <div className="pf-spread-actions">
                  <button type="button" className="pf-textlink" onClick={() => show(project)} aria-haspopup="dialog">Read the case study <span aria-hidden="true">→</span></button>
                  <ProjectLinks project={project} title={title} />
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>

      {/* Native <dialog>: focus trapping and Esc come with showModal(). A backdrop click lands on the dialog itself. */}
      <dialog ref={dialogRef} className="pf-modal" aria-labelledby="pf-modal-title" onClick={(event) => { if (event.target === event.currentTarget) close(); }} onClose={() => setOpen(null)}>
        {open ? <ProjectCase project={open} onClose={close} /> : null}
      </dialog>
    </>
  );
}

function ProjectCase({ project, onClose }: { project: Project; onClose: () => void }) {
  const title = projectDisplayTitle(project);
  const image = projectImage(project);
  const stack = splitStack(project);
  return (
    <div className="pf-modal-inner">
      <button type="button" className="pf-modal-close" onClick={onClose} aria-label="Close case study"><X size={18} aria-hidden="true" /></button>
      <div className="pf-modal-media"><Image src={image} alt={`${title} screenshot`} width={1600} height={1000} sizes="(max-width: 760px) 100vw, 56rem" unoptimized={image.endsWith(".svg")} /></div>
      <p className="pf-modal-kicker">{inferCategory(project)}</p>
      <h3 id="pf-modal-title">{title}</h3>
      <p className="pf-modal-lead">{project.description}</p>
      <dl className="pf-modal-grid">
        <div><dt>Challenge</dt><dd>{project.problem || project.description}</dd></div>
        <div><dt>My role</dt><dd>{getRoleSummary(project)}</dd></div>
        <div><dt>Result</dt><dd>{project.outcome || project.description}</dd></div>
      </dl>
      <div className="pf-modal-stack">{[...stack.primary, ...stack.supporting].map((tech) => <TechChip key={tech} name={tech} />)}</div>
      <ProjectLinks project={project} title={title} />
    </div>
  );
}
