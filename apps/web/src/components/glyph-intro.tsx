"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type Zoom = { origin: string; max: number };
const fallback: Zoom = { origin: "50% 50%", max: 60 };

// Where the glyph's ink sits inside its wrapper, from the font's own metrics, and the scale at which it
// just covers the stage: any larger only adds scrolling through plain black. offsetLeft/Top ignore the
// zoom transform, so this works mid-scroll.
function measure(glyph: HTMLElement, baseline: HTMLElement, letter: "s" | "I"): Zoom {
  const wrapper = glyph.offsetParent as HTMLElement | null, stage = wrapper?.offsetParent as HTMLElement | null;
  const style = getComputedStyle(glyph);
  const context = document.createElement("canvas").getContext("2d");
  if (!wrapper || !stage || !context) return fallback;
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const ink = context.measureText(letter);
  const x = glyph.offsetLeft + (ink.actualBoundingBoxRight - ink.actualBoundingBoxLeft) / 2;
  const y = baseline.offsetTop - (ink.actualBoundingBoxAscent - ink.actualBoundingBoxDescent) / 2;
  // Distance from the zoom point to the stage's farthest edges.
  const reachX = Math.max(wrapper.offsetLeft + x, stage.clientWidth - wrapper.offsetLeft - x);
  const reachY = Math.max(wrapper.offsetTop + y, stage.clientHeight - wrapper.offsetTop - y);
  // The I is a plain bar, so its own box must reach both edges. The s is a curved band about 0.12em thick,
  // so its half-thickness must reach the farthest corner.
  const max = letter === "I"
    ? Math.max(reachX / ((ink.actualBoundingBoxRight + ink.actualBoundingBoxLeft) / 2), reachY / ((ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent) / 2))
    : (1.2 * Math.hypot(reachX, reachY)) / (parseFloat(style.fontSize) * 0.06);
  return { origin: `${x}px ${y}px`, max: max * 1.02 };
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
  // Timeline: dive into the s (0-0.42), a brief black beat (to 0.45), the I backs out (0.45-0.75), the S joins.
  const wordScale = useTransform(p, (v) => zoom.s.max ** Math.min(Math.max(v / 0.42, 0), 1));
  const markScale = useTransform(p, (v) => zoom.i.max ** (1 - Math.min(Math.max((v - 0.45) / 0.3, 0), 1)));
  // visibility, not opacity: a hidden layer is redrawn fresh when it returns. With opacity, the name could stay
  // blank after scrolling back up from a deep zoom until the page was reloaded.
  const wordShown = useTransform(p, (v) => (v < 0.43 ? "visible" : "hidden"));
  const black = useTransform(p, [0.38, 0.42, 0.45, 0.451], [0, 1, 1, 0]);
  const markShown = useTransform(p, (v) => (v >= 0.45 ? "visible" : "hidden"));
  const markS = useTransform(p, [0.72, 0.82], [0, 1]);
  const markSx = useTransform(p, [0.72, 0.82], ["-0.25em", "0em"]);
  const cue = useTransform(p, [0, 0.05], [1, 0]);

  // While the screen is mostly black, the fixed bar switches to its dark look.
  useMotionValueEvent(p, "change", (v) => section.current?.closest(".pf")?.classList.toggle("pf-intro-dark", v > 0.38 && v < 0.5));

  // The intro already shows the name, so the bar's name waits until the intro hands over to the hero.
  // Read from the raw scroll (not the spring) so it never lags behind the page.
  const markIntro = (v: number) => section.current?.closest(".pf")?.classList.toggle("pf-intro-active", v < 0.99);
  useMotionValueEvent(scrollYProgress, "change", markIntro);
  useEffect(() => {
    if (!reduce) markIntro(scrollYProgress.get());
  });

  if (reduce) return null;
  return (
    <section ref={section} className="pf-intro" aria-hidden="true">
      <div className="pf-intro-stage">
        <motion.span className="pf-intro-glyphs" style={{ scale: wordScale, visibility: wordShown, transformOrigin: zoom.s.origin }}>
          Ivan Salina<span ref={wordBase} className="pf-intro-baseline" /><span ref={lastS}>s</span>
        </motion.span>
        <motion.span className="pf-intro-black" style={{ opacity: black }} />
        <motion.span className="pf-intro-glyphs" style={{ scale: markScale, visibility: markShown, transformOrigin: zoom.i.origin }}>
          <span ref={markBase} className="pf-intro-baseline" /><span ref={firstI}>I</span><motion.span className="pf-intro-mark-s" style={{ opacity: markS, x: markSx }}>S</motion.span>
        </motion.span>
        <motion.span className="pf-intro-cue" style={{ opacity: cue }}>Scroll ↓</motion.span>
      </div>
    </section>
  );
}
