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

  const glyphSize = { fontSize: height > width ? 190 : 300 };
  const dive = interpolate(frame, [0.6 * fps, 2.4 * fps], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const backOut = interpolate(frame, [2.7 * fps, 3.8 * fps], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const black = interpolate(frame, [2.2 * fps, 2.4 * fps, 2.7 * fps, 2.7 * fps + 1], [0, 1, 1, 0], clamp);
  return (
    <>
      <span style={{ ...glyphText, ...glyphSize, position: "absolute", opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], clamp), translate: `0 ${interpolate(frame, [0, 0.5 * fps], [40, 0], { ...clamp, easing: ease })}px`, scale: zoom ? zoom.s.max ** dive : 1, transformOrigin: zoom?.s.origin, visibility: frame < 2.4 * fps ? "visible" : "hidden" }}>
        Ivan Salina<span ref={wordBase} style={{ display: "inline-block", width: 0, height: 0 }} /><span ref={lastS}>s</span>
      </span>
      <div style={{ position: "absolute", inset: 0, backgroundColor: color.black, opacity: black }} />
      <span style={{ ...glyphText, ...glyphSize, position: "absolute", scale: zoom ? zoom.i.max ** backOut : 1, transformOrigin: zoom?.i.origin, visibility: frame >= 2.7 * fps ? "visible" : "hidden" }}>
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
  const { fps, width, height } = useVideoConfig();
  // Phone (portrait): word on top, photo across the middle, pitch underneath.
  const v = height > width;
  return (
    <>
      <div style={{ position: "absolute", ...(v ? { left: 80, right: 80, top: 520, height: 820 } : { right: 80, top: 300, width: 620, height: 700 }), overflow: "hidden", clipPath: `inset(${interpolate(frame, [0.2 * fps, 1.2 * fps], [100, 0], { ...clamp, easing: ease })}% 0 0 0)` }}>
        <Img src={staticFile("images/ivan-hero-sea.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)", scale: interpolate(frame, [0, 4 * fps], [1.15, 1.02], clamp) }} />
      </div>
      <div style={{ position: "absolute", left: v ? 50 : 60, top: v ? 260 : 40, overflow: "hidden", fontFamily: sans, fontSize: v ? 270 : 470, fontWeight: 600, letterSpacing: "-0.065em", lineHeight: 0.82, color: color.white, mixBlendMode: "difference" }}>
        <div style={{ paddingBottom: 20, translate: `0 ${interpolate(frame, [0, 1 * fps], [105, 0], { ...clamp, easing: ease })}%` }}>Salinas</div>
      </div>
      <div style={{ position: "absolute", left: 80, bottom: v ? 180 : 140, width: v ? 920 : 1000, opacity: interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 1], clamp), translate: `0 ${interpolate(frame, [0.8 * fps, 1.4 * fps], [30, 0], { ...clamp, easing: ease })}px` }}>
        <div style={{ ...label, color: color.black }}>Full-stack developer · Web, data &amp; IoT</div>
        <div style={{ marginTop: 24, fontFamily: sans, fontSize: v ? 56 : 64, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1, color: color.black }}>I design, build and ship production web systems, from database to deployed UI.</div>
      </div>
    </>
  );
};
export const Hero = Interactive.create({ Component: HeroInner, layout: "absolute-fill" });

const facts = [
  { value: 9, label: "Years building systems" },
  { value: 5, label: "Live in production" },
  { value: 4, label: "Publications" },
];

// 3. Facts: each number rolls up like an odometer through every value and eases to a stop.
const FactsInner = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  // Phone (portrait): the three facts stack as rows instead of columns.
  const v = height > width;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: v ? 280 : 330, display: "grid", gridTemplateColumns: v ? "1fr" : "repeat(3, 1fr)", gap: v ? 70 : 40 }}>
      {facts.map((fact, index) => {
        const start = (0.2 + index * 0.25) * fps;
        const progress = interpolate(frame, [start, start + 2 * fps], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div key={fact.label} style={{ borderTop: `2px solid ${color.black}`, paddingTop: 24, opacity: interpolate(frame, [start - 0.2 * fps, start], [0, 1], clamp) }}>
            <div style={{ height: "1.05em", overflow: "hidden", fontFamily: sans, fontSize: v ? 260 : 300, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 1.05 }}>
              <div style={{ translate: `0 ${-progress * fact.value * 1.05}em` }}>
                {Array.from({ length: fact.value + 1 }, (_, n) => <div key={n}>{n}</div>)}
              </div>
            </div>
            <div style={{ ...label, marginTop: 24, color: color.body }}>{fact.label}</div>
          </div>
        );
      })}
    </div>
  );
};
export const Facts = Interactive.create({ Component: FactsInner, layout: "absolute-fill" });

// The résumé pill, placed absolutely so the cursor and blob can target its centre. On a phone it sits
// centred under the email; the cursor enters from the bottom right in both.
const pills = {
  wide: { x: 1570, y: 835, w: 540, h: 110, font: 40, from: [1830, 1110] },
  tall: { x: 540, y: 1330, w: 640, h: 120, font: 44, from: [960, 1900] },
};
const sparkAngles = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

// 4. Contact: the black footer the page lifts off. A cursor glides to the résumé pill, the site's white
// difference blob swells into it (red reads cyan, white text reads black), and the click pops sparks.
const ContactInner = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const v = height > width;
  const pill = v ? pills.tall : pills.wide;
  const rise = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 0.4 * fps], [0, 1], clamp),
    translate: `0 ${interpolate(frame, [delay, delay + 0.6 * fps], [40, 0], { ...clamp, easing: ease })}px`,
  });
  const arrive = 2 * fps, click = 2.6 * fps;
  const travel = interpolate(frame, [1.2 * fps, arrive], [0, 1], { ...clamp, easing: ease });
  const cursorX = interpolate(travel, [0, 1], [pill.from[0], pill.x + 60]), cursorY = interpolate(travel, [0, 1], [pill.from[1], pill.y + 25]);
  const hover = interpolate(frame, [arrive - 0.15 * fps, arrive + 0.25 * fps], [0, 1], { ...clamp, easing: ease });
  const press = interpolate(frame, [click, click + 3, click + 0.3 * fps], [1, 0.94, 1], clamp);
  const burst = interpolate(frame, [click, click + 0.6 * fps], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  // Magnetic pull: the pill leans 30% of the way toward the pointer while hovered.
  const pullX = hover * 60 * 0.3, pullY = hover * 25 * 0.3;
  const shown = interpolate(frame, [1.2 * fps, 1.4 * fps], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: v ? 55 : 70, top: v ? 320 : 120, fontFamily: sans, fontSize: v ? 225 : 400, fontWeight: 600, letterSpacing: "-0.065em", lineHeight: 0.82, whiteSpace: "nowrap", color: color.white, ...rise(0.2 * fps) }}>
        Let’s talk<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ position: "absolute", left: 80, ...(v ? { top: 820 } : { bottom: 120 }), color: color.white, ...rise(0.6 * fps) }}>
        <div style={{ fontFamily: sans, fontSize: v ? 40 : 44, color: "#bdbdbd" }}>Hiring a remote full-stack developer?</div>
        <div style={{ marginTop: 12, fontFamily: sans, fontSize: v ? 64 : 84, fontWeight: 600, letterSpacing: "-0.04em", borderBottom: `4px solid ${color.white}`, width: "fit-content" }}>banbansalinas@gmail.com</div>
      </div>
      <div style={{ position: "absolute", right: 80, bottom: v ? 180 : 120, ...(v && { left: 80, textAlign: "center" as const }), ...label, color: "#8a8a8a", ...rise(0.9 * fps) }}>ivansalinas.vercel.app</div>
      <div style={{ position: "absolute", left: pill.x - pill.w / 2, top: pill.y - pill.h / 2, width: pill.w, height: pill.h, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 999, backgroundColor: color.accent, color: color.white, fontFamily: sans, fontSize: pill.font, fontWeight: 500, opacity: interpolate(frame, [0.9 * fps, 1.3 * fps], [0, 1], clamp), translate: `${pullX}px ${pullY + interpolate(frame, [0.9 * fps, 1.5 * fps], [40, 0], { ...clamp, easing: ease })}px`, scale: press }}>
        Download my résumé ↓
      </div>
      <div style={{ position: "absolute", left: interpolate(hover, [0, 1], [cursorX, pill.x + pullX]), top: interpolate(hover, [0, 1], [cursorY, pill.y + pullY]), width: interpolate(hover, [0, 1], [36, pill.w + 10]), height: interpolate(hover, [0, 1], [36, pill.h + 10]), translate: "-50% -50%", borderRadius: 999, backgroundColor: color.white, mixBlendMode: "difference", scale: press, opacity: shown }} />
      {sparkAngles.map((angle) => (
        <div key={angle} style={{ position: "absolute", left: cursorX + Math.cos((angle * Math.PI) / 180) * 160 * burst, top: cursorY + Math.sin((angle * Math.PI) / 180) * 160 * burst, width: 16, height: 16, translate: "-50% -50%", borderRadius: "50%", backgroundColor: color.accent, opacity: frame < click ? 0 : 1 - burst, scale: 1 - 0.6 * burst }} />
      ))}
      <svg width="44" height="44" viewBox="0 0 24 24" style={{ position: "absolute", left: cursorX - 6, top: cursorY - 4, opacity: shown, scale: interpolate(frame, [click, click + 3, click + 0.25 * fps], [1, 0.85, 1], clamp) }}>
        <path d="M4 2l16 9.5-7 1.5 4 7.5-3 1.5-4-7.5-6 5z" fill={color.white} stroke={color.black} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", ...(v ? { left: pill.x } : { right: 80 }), whiteSpace: "nowrap", top: pill.y - pill.h / 2 - 90, padding: "14px 26px", borderRadius: 14, backgroundColor: "#1c1c1c", color: color.white, ...label, fontSize: 26, opacity: interpolate(frame, [click + 0.3 * fps, click + 0.6 * fps], [0, 1], clamp), translate: `${v ? "-50%" : "0"} ${interpolate(frame, [click + 0.3 * fps, click + 0.7 * fps], [20, 0], { ...clamp, easing: ease })}px` }}>
        ↓ 2026_ICLSalinas_Resume.pdf
      </div>
    </>
  );
};
export const Contact = Interactive.create({ Component: ContactInner, layout: "absolute-fill" });
