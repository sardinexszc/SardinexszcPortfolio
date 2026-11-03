import { useEffect, useRef, useState } from "react";
import { continueRender, delayRender, Easing, Img, interpolate, Interactive, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { color, fontsReady, label, sans } from "./theme";

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const glyphText = { fontFamily: sans, fontSize: 300, fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 1, whiteSpace: "nowrap" as const };

type Zoom = { origin: string; max: number };

// Same idea as the site's glyph intro: the ink centre of one letter from the font metrics, and the scale
// at which that letter just covers the frame.
function measure(glyph: HTMLElement, baseline: HTMLElement, letter: "s" | "I", width: number, height: number): Zoom {
  const wrapper = glyph.offsetParent as HTMLElement;
  const context = document.createElement("canvas").getContext("2d")!;
  const style = getComputedStyle(glyph);
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const ink = context.measureText(letter);
  const x = glyph.offsetLeft + (ink.actualBoundingBoxRight - ink.actualBoundingBoxLeft) / 2;
  const y = baseline.offsetTop - (ink.actualBoundingBoxAscent - ink.actualBoundingBoxDescent) / 2;
  const reachX = Math.max(wrapper.offsetLeft + x, width - wrapper.offsetLeft - x);
  const reachY = Math.max(wrapper.offsetTop + y, height - wrapper.offsetTop - y);
  const max = letter === "I"
    ? Math.max(reachX / ((ink.actualBoundingBoxRight + ink.actualBoundingBoxLeft) / 2), reachY / ((ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent) / 2))
    : (1.2 * Math.hypot(reachX, reachY)) / (parseFloat(style.fontSize) * 0.06);
  return { origin: `${x}px ${y}px`, max: max * 1.02 };
}

// 1. "Ivan Salinas" dives into its last s, goes black, and a giant I backs out into the IS mark.
const GlyphInner = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wordBase = useRef<HTMLSpanElement>(null), lastS = useRef<HTMLSpanElement>(null);
  const markBase = useRef<HTMLSpanElement>(null), firstI = useRef<HTMLSpanElement>(null);
  const [handle] = useState(() => delayRender("Measuring glyphs"));
  const [zoom, setZoom] = useState<{ s: Zoom; i: Zoom } | null>(null);
  useEffect(() => {
    fontsReady.then(() => {
      setZoom({ s: measure(lastS.current!, wordBase.current!, "s", width, height), i: measure(firstI.current!, markBase.current!, "I", width, height) });
      continueRender(handle);
    });
  }, [handle, width, height]);

  const dive = interpolate(frame, [0.6 * fps, 2.4 * fps], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const backOut = interpolate(frame, [2.7 * fps, 3.8 * fps], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const black = interpolate(frame, [2.2 * fps, 2.4 * fps, 2.7 * fps, 2.7 * fps + 1], [0, 1, 1, 0], clamp);
  return (
    <>
      <span style={{ ...glyphText, position: "absolute", opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], clamp), translate: `0 ${interpolate(frame, [0, 0.5 * fps], [40, 0], { ...clamp, easing: ease })}px`, scale: zoom ? zoom.s.max ** dive : 1, transformOrigin: zoom?.s.origin, visibility: frame < 2.4 * fps ? "visible" : "hidden" }}>
        Ivan Salina<span ref={wordBase} style={{ display: "inline-block", width: 0, height: 0 }} /><span ref={lastS}>s</span>
      </span>
      <div style={{ position: "absolute", inset: 0, backgroundColor: color.black, opacity: black }} />
      <span style={{ ...glyphText, position: "absolute", scale: zoom ? zoom.i.max ** backOut : 1, transformOrigin: zoom?.i.origin, visibility: frame >= 2.7 * fps ? "visible" : "hidden" }}>
        <span ref={markBase} style={{ display: "inline-block", width: 0, height: 0 }} /><span ref={firstI}>I</span>
        <span style={{ display: "inline-block", color: color.accent, opacity: interpolate(frame, [3.6 * fps, 4.1 * fps], [0, 1], clamp), translate: `${interpolate(frame, [3.6 * fps, 4.1 * fps], [-60, 0], { ...clamp, easing: ease })}px 0` }}>S</span>
      </span>
    </>
  );
};
export const Glyph = Interactive.create({ Component: GlyphInner, layout: "absolute-fill" });

// 2. The hero: surname rising over the dot grid, the sea portrait opening upward, the one-line pitch.
const HeroInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <div style={{ position: "absolute", right: 80, top: 300, width: 620, height: 700, overflow: "hidden", clipPath: `inset(${interpolate(frame, [0.2 * fps, 1.2 * fps], [100, 0], { ...clamp, easing: ease })}% 0 0 0)` }}>
        <Img src={staticFile("images/ivan-hero-sea.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)", scale: interpolate(frame, [0, 4 * fps], [1.15, 1.02], clamp) }} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 40, overflow: "hidden", fontFamily: sans, fontSize: 470, fontWeight: 600, letterSpacing: "-0.065em", lineHeight: 0.82, color: color.white, mixBlendMode: "difference" }}>
        <div style={{ paddingBottom: 20, translate: `0 ${interpolate(frame, [0, 1 * fps], [105, 0], { ...clamp, easing: ease })}%` }}>Salinas</div>
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 140, width: 1000, opacity: interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 1], clamp), translate: `0 ${interpolate(frame, [0.8 * fps, 1.4 * fps], [30, 0], { ...clamp, easing: ease })}px` }}>
        <div style={{ ...label, color: color.black }}>Full-stack developer · Web, data &amp; IoT</div>
        <div style={{ marginTop: 24, fontFamily: sans, fontSize: 64, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1, color: color.black }}>I design, build and ship production web systems, from database to deployed UI.</div>
      </div>
    </>
  );
};
export const Hero = Interactive.create({ Component: HeroInner, layout: "absolute-fill" });

const projects = [
  { image: "rtms.webp", name: "CLAARRDEC RTMS", tag: "Live · Laravel" },
  { image: "crrdc.webp", name: "CRRDC", tag: "Live · Next.js" },
  { image: "smart-farm-login.webp", name: "Smart Indoor Farming", tag: "Live · IoT" },
  { image: "tcehub.webp", name: "TCEHub", tag: "Live · Next.js" },
];

// 3. Selected work: four live systems slide up one after another.
const WorkInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <div style={{ position: "absolute", left: 80, right: 80, top: 100, display: "flex", justifyContent: "space-between", paddingTop: 20, borderTop: `2px solid ${color.black}`, ...label }}>
        <span>Selected work</span><span>Live in production</span>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 220, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 40 }}>
        {projects.map((project, index) => {
          const start = (0.3 + index * 0.35) * fps;
          return (
            <div key={project.name} style={{ opacity: interpolate(frame, [start, start + 0.5 * fps], [0, 1], clamp), translate: `0 ${interpolate(frame, [start, start + 0.7 * fps], [80, 0], { ...clamp, easing: ease })}px` }}>
              <Img src={staticFile(`images/${project.image}`)} style={{ width: "100%", height: 300, objectFit: "cover", objectPosition: "top", borderRadius: 4 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}>
                <span style={{ fontFamily: sans, fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em" }}>{project.name}</span>
                <span style={{ ...label, fontSize: 26, color: color.body }}>{project.tag}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export const Work = Interactive.create({ Component: WorkInner, layout: "absolute-fill" });

const facts = [
  { value: 9, label: "Years building systems" },
  { value: 5, label: "Live in production" },
  { value: 4, label: "Publications" },
];

// 4. Facts: three numbers count up under black rules, like the site's facts row.
const FactsInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 330, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
      {facts.map((fact, index) => {
        const start = index * 0.2 * fps;
        const progress = interpolate(frame, [start, start + 1.2 * fps], [0, 1], { ...clamp, easing: ease });
        return (
          <div key={fact.label} style={{ borderTop: `2px solid ${color.black}`, paddingTop: 24, opacity: interpolate(frame, [start, start + 0.3 * fps], [0, 1], clamp) }}>
            <div style={{ fontFamily: sans, fontSize: 300, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.9 }}>{Math.round(fact.value * progress)}</div>
            <div style={{ ...label, marginTop: 24, color: color.body }}>{fact.label}</div>
          </div>
        );
      })}
    </div>
  );
};
export const Facts = Interactive.create({ Component: FactsInner, layout: "absolute-fill" });

// 5. Contact: the black footer the page lifts off, with the email and the résumé pill.
const ContactInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 0.4 * fps], [0, 1], clamp),
    translate: `0 ${interpolate(frame, [delay, delay + 0.6 * fps], [40, 0], { ...clamp, easing: ease })}px`,
  });
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 120, fontFamily: sans, fontSize: 400, fontWeight: 600, letterSpacing: "-0.065em", lineHeight: 0.82, whiteSpace: "nowrap", color: color.white, ...rise(0.2 * fps) }}>
        Let’s talk<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 120, display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: color.white }}>
        <div style={rise(0.6 * fps)}>
          <div style={{ fontFamily: sans, fontSize: 44, color: "#bdbdbd" }}>Hiring a remote full-stack developer?</div>
          <div style={{ marginTop: 12, fontFamily: sans, fontSize: 84, fontWeight: 600, letterSpacing: "-0.04em", borderBottom: `4px solid ${color.white}`, width: "fit-content" }}>banbansalinas@gmail.com</div>
        </div>
        <div style={{ ...rise(0.9 * fps), display: "grid", justifyItems: "end", gap: 20 }}>
          <div style={{ padding: "22px 40px", borderRadius: 999, backgroundColor: color.accent, fontFamily: sans, fontSize: 40, fontWeight: 500 }}>Download my résumé ↓</div>
          <div style={{ ...label, color: "#8a8a8a" }}>ivansalinas.vercel.app</div>
        </div>
      </div>
    </>
  );
};
export const Contact = Interactive.create({ Component: ContactInner, layout: "absolute-fill" });
