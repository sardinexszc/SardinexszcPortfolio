"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { TrackedLink } from "./tracked-elements";

const EASE = [0.22, 1, 0.36, 1] as const;

// Fades and lifts its content in once it scrolls into view.
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

// Oversized decorative word. It rises out of its own line once, on load or when scrolled to.
// Screen readers skip it: each one repeats a heading that is already in the page.
// The in-view trigger sits on the wrapper: the word starts clipped away, so it would never count as visible itself.
export function Wordmark({ text, className, onLoad = false }: { text: string; className: string; onLoad?: boolean }) {
  const reduce = useReducedMotion();
  const trigger = onLoad ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.4 } };
  return (
    <motion.div className={className} aria-hidden="true" initial={reduce ? false : "hidden"} {...trigger}>
      <motion.span variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1.1, ease: EASE } } }}>{text}</motion.span>
    </motion.div>
  );
}

export function ProjectLinks({ project, title }: { project: Project; title: string }) {
  return (
    <div className="pf-work-links">
      {project.live_url ? <TrackedLink href={project.live_url} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", projectId: project.id, linkKind: "live_project" }}>Live <ArrowUpRight size={14} aria-hidden="true" /><span className="visually-hidden">site for {title} (opens in a new tab)</span></TrackedLink> : null}
      {project.github_url ? <TrackedLink href={project.github_url} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", projectId: project.id, linkKind: "github_repository" }}>Source <ArrowUpRight size={14} aria-hidden="true" /><span className="visually-hidden">for {title} (opens in a new tab)</span></TrackedLink> : null}
    </div>
  );
}
