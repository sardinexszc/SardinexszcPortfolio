"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/lib/types";
import { trackEngagement } from "@/lib/track-engagement";
import { getRoleSummary, inferCategory, isAllowedImage, projectDisplayTitle, projectSlug, splitStack, type ProjectCategory } from "@/lib/work-projects";
import { TechChip } from "./tech-icon";
import { TrackedLink } from "./tracked-elements";

const PLACEHOLDER = "/images/placeholder/project.svg";
const EASE = [0.22, 1, 0.36, 1] as const;
const formatTime = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const projectImage = (project: Project) => (isAllowedImage(project.image_url) ? project.image_url : PLACEHOLDER);

// Local time in Nueva Ecija. Rendered after mount so server and client markup match.
export function LocalTime() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const tick = () => setNow(formatTime.format(new Date()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);
  return <span className="pf-time">{now}</span>;
}

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

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory | "all">("all");
  const [open, setOpen] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const categories = Array.from(new Set(projects.map(inferCategory)));
  const shown = active === "all" ? projects : projects.filter((project) => inferCategory(project) === active);

  const show = (project: Project) => {
    setOpen(project);
    dialogRef.current?.showModal();
    trackEngagement({ type: "project_open", projectId: project.id });
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <div className="pf-filter" role="group" aria-label="Filter projects by type">
        {(["all", ...categories] as const).map((category) => (
          <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)}>
            / {category === "all" ? "All projects" : category}
          </button>
        ))}
      </div>
      <ul className="pf-work-grid">
        {shown.map((project, i) => {
          const title = projectDisplayTitle(project);
          const image = projectImage(project);
          return (
            <motion.li key={project.id} id={`project-${projectSlug(project)}`} className="pf-work-card" layout initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, ease: EASE, delay: (i % 2) * 0.1 }}>
              <button type="button" className="pf-work-media" onClick={() => show(project)} aria-label={`Open case study for ${title}`} aria-haspopup="dialog">
                <Image src={image} alt="" width={1600} height={1000} sizes="(max-width: 760px) 100vw, 50vw" unoptimized={image.endsWith(".svg")} />
                <span className="pf-work-view" aria-hidden="true">View case study</span>
              </button>
              <div className="pf-work-meta">
                <div>
                  <h3><button type="button" onClick={() => show(project)} aria-haspopup="dialog">{title}</button></h3>
                  <p>{inferCategory(project)} · {getRoleSummary(project)}</p>
                </div>
                <ProjectLinks project={project} title={title} />
              </div>
            </motion.li>
          );
        })}
      </ul>

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
      <p className="pf-modal-kicker">/ {inferCategory(project)}</p>
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
