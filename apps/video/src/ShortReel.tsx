import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import voice from "../public/short/voice/voice.json";
import { Carwash } from "./Carwash";
import { Crrdc } from "./Crrdc";
import { EmailAgent } from "./EmailAgent";
import { Edw } from "./Edw";
import { Intro, LetsTalk, OUTRO_SECONDS } from "./Reel";
import { Tcehub } from "./Tcehub";
import { Embedded, ShowSignature, Walkthrough } from "./Walkthrough";
import { color, label, mono, sans } from "./theme";

// ~70s cut of the six walkthroughs for applications, in 16:9 and 9:16 (same component, layout follows the frame).
// Each project: a numbered opener, then its best scene from the 40s video (no voice, captions or music of its own)
// with a slow push-in, one narration line from scripts/voice.py short, and captions in a strip that never covers the UI.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FPS = 30;
const INTRO = 2.5, OPENER = 1.6, FADE = 0.4, SLIDE = 0.5;

// from: second in the 40s composition where the scene starts. Clip length follows the narration.
const PROJECTS = [
  { Scene: Crrdc, from: 8.1, title: "CRRDC", what: "Research center information system", stack: "Next.js · Supabase · Google Drive API" },
  { Scene: Edw, from: 15.6, title: "DRIW", what: "Disaster-response data warehouse", stack: "PostgreSQL · dbt · Python · Next.js" },
  { Scene: EmailAgent, from: 13.5, title: "Email summary agent", what: "AI digest of job emails", stack: "n8n · Ollama (Qwen 2.5) · Gmail API" },
  { Scene: Carwash, from: 14.0, title: "Carwash booking", what: "Booking bot with clash detection", stack: "n8n · Google Sheets · Telegram" },
  { Scene: Tcehub, from: 0, title: "TCEHub", what: "Community site · in development", stack: "Next.js · TypeScript · Tailwind" },
  { Scene: Walkthrough, from: 23.0, title: "Portfolio", what: "This site, with CMS and analytics", stack: "Next.js · Supabase · Vercel" },
];
const clipSeconds = (i: number) => Math.max(7.5, voice[i].duration + 1.6);
const f = (s: number) => Math.round(s * FPS);

// Seconds from the start of the reel to the closing card, after transition overlaps.
const BEFORE_OUTRO = INTRO + PROJECTS.reduce((t, _, i) => t + OPENER + clipSeconds(i), 0) - (PROJECTS.length * (FADE + SLIDE));
export const SHORT_FRAMES = f(BEFORE_OUTRO) + f(OUTRO_SECONDS);

const Opener = ({ i }: { i: number }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tall = height > width;
  const p = PROJECTS[i];
  const rise = (d: number) => ({ opacity: interpolate(frame, [f(d), f(d + 0.3)], [0, 1], clamp), translate: `0 ${interpolate(frame, [f(d), f(d + 0.5)], [30, 0], clamp)}px` });
  return (
    <AbsoluteFill style={{ backgroundColor: color.black, color: color.white, padding: tall ? "0 80px" : "0 160px", justifyContent: "center" }}>
      <div style={{ ...label, fontSize: 34, color: color.accent, ...rise(0) }}>{String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</div>
      <div style={{ marginTop: 16, fontFamily: sans, fontSize: tall ? 120 : 150, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.95, ...rise(0.1) }}>
        {p.title}<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ marginTop: 24, fontFamily: sans, fontSize: tall ? 46 : 52, color: "#e6e6e6", ...rise(0.25) }}>{p.what}</div>
      <div style={{ marginTop: 18, fontFamily: mono, fontSize: tall ? 30 : 34, color: "#9a9a9a", ...rise(0.4) }}>{p.stack}</div>
    </AbsoluteFill>
  );
};

// Captions sit in their own strip under the footage, words lighting up as they are spoken.
const StripCaption = ({ line, style }: { line: (typeof voice)[number]; style: React.CSSProperties }) => {
  const t = useCurrentFrame() / FPS;
  return (
    <div style={{ position: "absolute", textAlign: "center", fontFamily: mono, lineHeight: 1.35, opacity: interpolate(t, [0, 0.2, line.duration, line.duration + 0.3], [0, 1, 1, 0], clamp), ...style }}>
      {line.words.map((w, k) => <span key={k} style={{ color: t >= w.start ? color.white : "#5e5e5e" }}>{w.text} </span>)}
    </div>
  );
};

const Clip = ({ i }: { i: number }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const tall = height > width;
  const p = PROJECTS[i];
  // Footage box: 16:9 shrinks to leave a caption strip; 9:16 runs full width with a title above and captions below.
  const w = tall ? width : 1600, h = (w * 9) / 16;
  const top = tall ? 560 : 24;
  const push = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d" }}>
      {tall ? (
        <div style={{ position: "absolute", left: 80, right: 80, top: 260, color: color.white }}>
          <div style={{ ...label, fontSize: 30, color: color.accent }}>{String(i + 1).padStart(2, "0")} · {p.what}</div>
          <div style={{ marginTop: 10, fontFamily: sans, fontSize: 96, fontWeight: 600, letterSpacing: "-0.04em" }}>{p.title}<span style={{ color: color.accent }}>.</span></div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: (width - w) / 2, top, width: w, height: h, overflow: "hidden", borderRadius: tall ? 0 : 10 }}>
        {/* The 40s scene renders at its own 1920x1080 (blur boxes included) and is scaled into the box. */}
        <div style={{ width: 1920, height: 1080, transformOrigin: "0 0", scale: String((w / 1920) * push), translate: `${(-(push - 1) * w) / 2}px ${(-(push - 1) * h) / 2}px` }}>
          <Embedded.Provider value>
            <ShowSignature.Provider value={false}>
              <Sequence from={-f(p.from)}><p.Scene /></Sequence>
            </ShowSignature.Provider>
          </Embedded.Provider>
        </div>
      </div>
      <Sequence from={f(0.3)}>
        <Audio src={staticFile(voice[i].file)} />
        <StripCaption line={voice[i]} style={tall ? { left: 80, right: 80, top: top + h + 90, fontSize: 44 } : { left: 160, right: 160, top: top + h + 22, fontSize: 32 }} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const ShortReel = () => (
  <AbsoluteFill style={{ backgroundColor: color.black }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={f(INTRO)}><Intro sub="6 projects in 70 seconds" /></TransitionSeries.Sequence>
      {PROJECTS.flatMap((p, i) => [
        <TransitionSeries.Transition key={`s${i}`} presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: f(SLIDE) })} />,
        <TransitionSeries.Sequence key={`o${i}`} durationInFrames={f(OPENER)}><Opener i={i} /></TransitionSeries.Sequence>,
        <TransitionSeries.Transition key={`f${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: f(FADE) })} />,
        <TransitionSeries.Sequence key={`c${i}`} durationInFrames={f(clipSeconds(i))}><Clip i={i} /></TransitionSeries.Sequence>,
      ])}
      <TransitionSeries.Sequence durationInFrames={f(OUTRO_SECONDS)}><LetsTalk /></TransitionSeries.Sequence>
    </TransitionSeries>
    {/* One soundtrack under the projects, picking up where the intro's copy stops. */}
    <Sequence from={f(INTRO)} durationInFrames={f(BEFORE_OUTRO - INTRO)}>
      <Audio src={staticFile("soundtrack.wav")} loop volume={0.12} trimBefore={f(INTRO)} />
    </Sequence>
  </AbsoluteFill>
);
