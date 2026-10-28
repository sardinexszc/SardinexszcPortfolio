"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Menu as MenuIcon, X } from "lucide-react";
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

// A photo frame that opens upward once, on load. Used for the staged hero entrance.
export function ClipReveal({ children, className, delay = 0 }: { children: ReactNode; className: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.1, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

// Moves its image a little against the scroll. The image is scaled up so its edges never show.
export function Parallax({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <div ref={ref} className="pf-parallax">
      <motion.div className="pf-parallax-inner" style={reduce ? undefined : { y, scale: 1.12 }}>{children}</motion.div>
    </div>
  );
}

// The <details> works without JS; this adds closing on link click, outside click and Esc.
export function SiteMenu({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const menu = ref.current;
    const onClick = (event: MouseEvent) => { if (menu && !menu.contains(event.target as Node)) menu.open = false; };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menu) return;
      menu.open = false;
      menu.querySelector("summary")?.focus();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <details ref={ref} className="pf-menu" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary aria-label={open ? "Close menu" : "Open menu"}>{open ? <X size={18} aria-hidden="true" /> : <MenuIcon size={18} aria-hidden="true" />}</summary>
      <nav aria-label="Main" onClick={(event) => { if ((event.target as HTMLElement).closest("a") && ref.current) ref.current.open = false; }}>{children}</nav>
    </details>
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
