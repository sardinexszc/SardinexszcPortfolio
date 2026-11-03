"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
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
  const y = useTransform(useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 }), [0, 1], ["-6%", "6%"]);
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

const pillSpring = { stiffness: 320, damping: 26, mass: 0.6 };
const burstAngles = [0, 45, 90, 135, 180, 225, 270, 315];
const finePointerQuery = "(hover: hover) and (pointer: fine)";
function watchFinePointer(onChange: () => void) {
  const query = window.matchMedia(finePointerQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Magnetic link with a "smart contrast" blob: a white circle in difference blend that follows the
// pointer near the pill and grows into it on hover, so the red pill reads cyan and its text black.
// Mouse and trackpad only; touch screens and reduced-motion visitors get the plain link.
export function MagneticPill({ className, href, download, children }: { className: string; href: string; download?: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const finePointer = useSyncExternalStore(watchFinePointer, () => window.matchMedia(finePointerQuery).matches, () => false);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const zone = useRef<HTMLSpanElement>(null);
  const pill = useRef<HTMLAnchorElement>(null);
  const pullX = useSpring(0, pillSpring), pullY = useSpring(0, pillSpring);
  const blobX = useSpring(0, pillSpring), blobY = useSpring(0, pillSpring);
  const blobW = useSpring(0, pillSpring), blobH = useSpring(0, pillSpring);

  if (reduceMotion || !finePointer) return <a className={className} href={href} download={download}>{children}</a>;

  function track(event: React.PointerEvent) {
    const box = zone.current?.getBoundingClientRect(), link = pill.current;
    if (!box || !link) return;
    // offset* ignore the pull transform, so the pill's resting box is the reference.
    const x = event.clientX - box.left, y = event.clientY - box.top;
    const centerX = link.offsetLeft + link.offsetWidth / 2, centerY = link.offsetTop + link.offsetHeight / 2;
    const over = Math.abs(x - centerX) <= link.offsetWidth / 2 && Math.abs(y - centerY) <= link.offsetHeight / 2;
    pullX.set((x - centerX) * 0.3);
    pullY.set((y - centerY) * 0.3);
    blobX.set(over ? centerX + (x - centerX) * 0.3 : x);
    blobY.set(over ? centerY + (y - centerY) * 0.3 : y);
    blobW.set(over ? link.offsetWidth + 8 : 18);
    blobH.set(over ? link.offsetHeight + 8 : 18);
  }

  function release() {
    pullX.set(0); pullY.set(0); blobW.set(0); blobH.set(0);
  }

  function burst(event: React.MouseEvent) {
    const box = zone.current?.getBoundingClientRect();
    if (!box) return;
    const id = Date.now();
    setBursts((current) => [...current, { id, x: event.clientX - box.left, y: event.clientY - box.top }]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item.id !== id)), 700);
  }

  return (
    <span ref={zone} className="pf-magnet" onPointerMove={track} onPointerLeave={release}>
      <motion.a ref={pill} className={className} href={href} download={download} onClick={burst} style={{ x: pullX, y: pullY }}>{children}</motion.a>
      <motion.span className="pf-magnet-blob" aria-hidden="true" style={{ left: blobX, top: blobY, width: blobW, height: blobH }} />
      {bursts.map((item) => burstAngles.map((angle) => (
        <motion.span key={`${item.id}-${angle}`} className="pf-magnet-spark" aria-hidden="true" style={{ left: item.x, top: item.y }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos((angle * Math.PI) / 180) * 42, y: Math.sin((angle * Math.PI) / 180) * 42, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
      )))}
    </span>
  );
}
