"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type Zoom = { origin: string; max: number };
const fallback: Zoom = { origin: "50% 50%", max: 60 };

// Where the glyph's ink sits inside its wrapper, from the font's own metrics, and how far to scale it
// so its stroke covers the whole screen. offsetLeft/Top ignore the zoom transform, so this works mid-scroll.
function measure(glyph: HTMLElement, baseline: HTMLElement, letter: string): Zoom {
  const style = getComputedStyle(glyph);
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return fallback;
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const ink = context.measureText(letter);
  const x = glyph.offsetLeft + (ink.actualBoundingBoxRight - ink.actualBoundingBoxLeft) / 2;
  const y = baseline.offsetTop - (ink.actualBoundingBoxAscent - ink.actualBoundingBoxDescent) / 2;
  const stroke = parseFloat(style.fontSize) * 0.1;
  return { origin: `${x}px ${y}px`, max: (2.4 * Math.hypot(window.innerWidth, window.innerHeight)) / stroke };
}

// Studio intro: the name fills the first screen. Scrolling dives into the last "s" of Salinas until the
// screen is black (inside the letter), then a giant "I" shrinks out of the black and settles into the
// IS mark before the page carries on. Decorative only; reduced-motion visitors skip it.
export function GlyphIntro() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const wordBase = useRef<HTMLSpanElement>(null), lastS = useRef<HTMLSpanElement>(null);
  const markBase = useRef<HTMLSpanElement>(null), firstI = useRef<HTMLSpanElement>(null);
  const [zoom, setZoom] = useState({ s: fallback, i: fallback });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  // A mouse wheel scrolls in ~100px steps; the spring glides between them so the dive never stutters.
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4, restDelta: 0.0001 });

  useEffect(() => {
    const update = () => {
      if (lastS.current && wordBase.current && firstI.current && markBase.current) {
        setZoom({ s: measure(lastS.current, wordBase.current, "s"), i: measure(firstI.current, markBase.current, "I") });
      }
    };
    document.fonts.ready.then(update);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Exponential scale reads as a steady dive; a linear one rushes at the start and crawls at the end.
  const wordScale = useTransform(p, (v) => zoom.s.max ** Math.min(Math.max(v / 0.42, 0), 1));
  const markScale = useTransform(p, (v) => zoom.i.max ** (1 - Math.min(Math.max((v - 0.5) / 0.32, 0), 1)));
  const wordOpacity = useTransform(p, [0.44, 0.45], [1, 0]);
  const black = useTransform(p, [0.34, 0.44, 0.5, 0.501], [0, 1, 1, 0]);
  const markOpacity = useTransform(p, [0.499, 0.5], [0, 1]);
  const markS = useTransform(p, [0.8, 0.9], [0, 1]);
  const markSx = useTransform(p, [0.8, 0.9], ["-0.25em", "0em"]);
  const cue = useTransform(p, [0, 0.05], [1, 0]);

  // While the screen is mostly black, the fixed bar switches to its dark look.
  useMotionValueEvent(p, "change", (v) => section.current?.closest(".pf")?.classList.toggle("pf-intro-dark", v > 0.4 && v < 0.62));

  if (reduce) return null;
  return (
    <section ref={section} className="pf-intro" aria-hidden="true">
      <div className="pf-intro-stage">
        <motion.span className="pf-intro-glyphs" style={{ scale: wordScale, opacity: wordOpacity, transformOrigin: zoom.s.origin }}>
          Ivan Salina<span ref={wordBase} className="pf-intro-baseline" /><span ref={lastS}>s</span>
        </motion.span>
        <motion.span className="pf-intro-black" style={{ opacity: black }} />
        <motion.span className="pf-intro-glyphs" style={{ scale: markScale, opacity: markOpacity, transformOrigin: zoom.i.origin }}>
          <span ref={markBase} className="pf-intro-baseline" /><span ref={firstI}>I</span><motion.span className="pf-intro-mark-s" style={{ opacity: markS, x: markSx }}>S</motion.span>
        </motion.span>
        <motion.span className="pf-intro-cue" style={{ opacity: cue }}>Scroll ↓</motion.span>
      </div>
    </section>
  );
}
