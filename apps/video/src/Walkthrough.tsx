import { createContext, useContext } from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import voice from "../public/voice/voice.json";
import { color, label, mono, sans } from "./theme";

// 40s job-application walkthrough: live site footage (scripts/capture-site.mjs), voice-over with
// word-synced captions (scripts/voice.py), personal data in the dashboard blurred.

// [x, y, w, h, shown from second] in 1920x1080 footage pixels.
type Box = [x: number, y: number, w: number, h: number, from?: number];
const EMAIL: Box = [16, 968, 228, 32]; // "Signed in as" in the dashboard sidebar
type Shot = { name: string; from: number; to: number; tag: string; blur?: Box[] };

// Seconds. Footage clips are at least as long as their slot.
const SHOTS: Shot[] = [
  { name: "site", from: 0, to: 19, tag: "Public site · Next.js + Supabase CMS" },
  { name: "login", from: 19, to: 23, tag: "Google-only admin sign-in" },
  { name: "analytics", from: 23, to: 29, tag: "Visitor analytics", blur: [EMAIL, [736, 1020, 350, 60, 4.3]] },
  { name: "content", from: 29, to: 32, tag: "Live CMS", blur: [EMAIL] },
  { name: "testimonials", from: 32, to: 34.5, tag: "Testimonial approvals", blur: [EMAIL] },
  { name: "requests", from: 34.5, to: 36.5, tag: "Recruiter enquiries", blur: [EMAIL, [342, 414, 320, 52], [1170, 382, 280, 48]] },
];
const OUTRO_FROM = 36.5;
// When each voice line starts, in seconds (line lengths are in voice.json).
const LINE_AT = [0.3, 7.0, 13.6, 19.2, 23.2, 29.2, 36.6];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Footage = ({ shot }: { shot: Shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: color.black, opacity: interpolate(frame, [0, 0.25 * fps], [0, 1], clamp) }}>
      <Video src={staticFile(`footage/${shot.name}.mp4`)} muted />
      {shot.blur?.map(([x, y, w, h, from = 0]) => (
        <div key={`${x},${y}`} style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: interpolate(frame, [from * fps, (from + 0.2) * fps], [0, 1], clamp), backdropFilter: "blur(14px)", backgroundColor: "rgba(240,240,240,0.25)", borderRadius: 6 }} />
      ))}
      <div style={{ position: "absolute", right: 48, top: 40, padding: "10px 18px", borderRadius: 4, backgroundColor: color.black, color: color.white, ...label, fontSize: 22 }}>
        <span style={{ color: color.accent }}>● </span>{shot.tag}
      </div>
    </AbsoluteFill>
  );
};

// Lower-third caption: the whole line, words lighting up as they are spoken.
// False inside the projects reel: only its closing card carries the name and URL.
export const ShowSignature = createContext(true);
// True when a scene is shown inside the short reel: the project's own voice, captions and music stay off.
export const Embedded = createContext(false);

export const Caption = ({ line }: { line: (typeof voice)[number] }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <div style={{ position: "absolute", left: "50%", bottom: 70, translate: "-50% 0", maxWidth: 1500, padding: "22px 34px", borderRadius: 6, backgroundColor: "rgba(0,0,0,0.82)", fontFamily: mono, fontSize: 38, lineHeight: 1.35, textAlign: "center", opacity: interpolate(t, [0, 0.2, line.duration, line.duration + 0.3], [0, 1, 1, 0], clamp) }}>
      {line.words.map((w, i) => (
        <span key={i} style={{ color: t >= w.start ? color.white : "#6b6b6b" }}>{w.text} </span>
      ))}
    </div>
  );
};

const Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const signed = useContext(ShowSignature);
  const rise = (d: number) => ({ opacity: interpolate(frame, [d * fps, (d + 0.4) * fps], [0, 1], clamp), translate: `0 ${interpolate(frame, [d * fps, (d + 0.6) * fps], [40, 0], clamp)}px` });
  return (
    <AbsoluteFill style={{ backgroundColor: color.black, color: color.white, padding: "0 120px", justifyContent: "center" }}>
      <div style={{ fontFamily: sans, fontSize: 220, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.9, ...rise(0.1) }}>
        {signed ? "Ivan Salinas" : "Portfolio"}<span style={{ color: color.accent }}>.</span>
      </div>
      {/* In the reel this is a project outro like the others: its stack instead of the name card. */}
      <div style={{ marginTop: 40, fontFamily: signed ? sans : mono, fontSize: signed ? 52 : 40, color: "#bdbdbd", ...rise(0.5) }}>{signed ? "Full-stack developer · Web, data & IoT" : "Next.js · Supabase · Google OAuth · Vercel"}</div>
      {signed ? <div style={{ marginTop: 60, ...label, fontSize: 40, ...rise(0.9) }}>ivansalinas.vercel.app</div> : null}
    </AbsoluteFill>
  );
};

export const Walkthrough = () => {
  const { fps } = useVideoConfig();
  // In the reel the spoken name and URL move to the closing "Let's talk" card.
  const embedded = useContext(Embedded), signed = useContext(ShowSignature);
  const lines = embedded ? [] : signed ? voice : voice.slice(0, -1);
  const f = (s: number) => Math.round(s * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: color.black }}>
      {SHOTS.map((s) => (
        <Sequence key={s.name} name={s.name} from={f(s.from)} durationInFrames={f(s.to - s.from)}>
          <Footage shot={s} />
        </Sequence>
      ))}
      <Sequence name="Outro" from={f(OUTRO_FROM)}>
        <Outro />
      </Sequence>
      {lines.map((line, i) => (
        <Sequence key={line.file} name={`Voice ${i}`} from={f(LINE_AT[i])} durationInFrames={f(line.duration + 0.5)}>
          <Audio src={staticFile(line.file)} />
          {/* The outro card already shows the name and URL. */}
          {i < voice.length - 1 ? <Caption line={line} /> : null}
        </Sequence>
      ))}
      {/* Existing site soundtrack, looped and ducked under the voice. */}
      {embedded ? null : <Audio name="Soundtrack" src={staticFile("soundtrack.wav")} loop volume={0.12} />}
    </AbsoluteFill>
  );
};
