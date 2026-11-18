import { useContext } from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import voice from "../public/email-agent/voice/voice.json";
import { Caption, Embedded, ShowSignature } from "./Walkthrough";
import { color, label, mono, sans } from "./theme";

// 40s walkthrough of the n8n "Email summary agent v2" workflow, replaying the 7 AM scheduled run (#74, 12 Nov 2026).
// editor.png / run.png are screenshots from n8n; digest.mp4 is the run's real summary email (scripts/capture-site.mjs).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// When each voice line starts, in seconds (line lengths are in voice.json).
const LINE_AT = [0.4, 5.2, 13.8, 23.8, 34.3];
// Real subject lines from run #74's digest, for the opening "flooded inbox".
const SUBJECTS = [
  "New jobs similar to Full Stack Developer at Gorilla Commerce",
  "Ascendion has viewed your application for Full Stack Developer",
  "Indeed Application: Full Stack and AI Developer",
  "AI Automation Engineer at Nextgen Pest Solutions + 12 more",
  "4 job search filters that give you an edge",
  "Odoo FullStack Developer at myEZcare + 7 more",
  "Scheduler | Work From Home at ClearDesk",
  "MicroSourcing is hiring an AI & Automation Engineer",
  "Assistant Software/Web Developer at My Creative Panda + 21 more",
  "Python Developer – AI & eCommerce Automation + 11 new jobs",
  "New jobs in Muñoz, Nueva Ecija. Apply now.",
];

const Tag = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: "absolute", right: 48, top: 40, padding: "10px 18px", borderRadius: 4, backgroundColor: color.black, color: color.white, ...label, fontSize: 22 }}>
    <span style={{ color: color.accent }}>● </span>{children}
  </div>
);

const fadeIn = (frame: number, fps: number) => interpolate(frame, [0, 0.3 * fps], [0, 1], clamp);

// 1. Hook: subject lines pile up faster than anyone reads them.
const Inbox = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg, padding: "70px 120px", gap: 14 }}>
      {SUBJECTS.map((s, i) => {
        const at = 0.15 * fps + i * 0.32 * fps;
        return (
          <div key={s} style={{ display: "flex", gap: 28, alignItems: "baseline", padding: "12px 24px", borderRadius: 4, backgroundColor: color.white, fontFamily: sans, fontSize: 34, color: color.black, opacity: interpolate(frame, [at, at + 6], [0, 1], clamp), translate: `0 ${interpolate(frame, [at, at + 10], [-30, 0], clamp)}px` }}>
            <span style={{ ...label, fontSize: 20, color: color.accent, width: 70 }}>new</span>{s}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 2–3. n8n screenshots with a slow push-in.
// Whole screenshot fits the frame (n8n grey fills the bars); origin aims the push-in at the nodes.
const Still = ({ src, tag, zoom, origin = "50% 50%" }: { src: string; tag: string; zoom: [number, number]; origin?: string }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#262626", opacity: fadeIn(frame, fps), overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain", transformOrigin: origin, scale: interpolate(frame, [0, durationInFrames], zoom) }} />
      <Tag>{tag}</Tag>
    </AbsoluteFill>
  );
};

const RunStats = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stats = [["13", "job emails fetched"], ["13 s", "classified by local Qwen 2.5"], ["20 s", "whole run, no paid API"]];
  return (
    <div style={{ position: "absolute", right: 60, top: 250, display: "flex", gap: 16 }}>
      {stats.map(([n, t], i) => {
        const at = (2 + i * 1.2) * fps;
        return (
          <div key={t} style={{ padding: "14px 22px", borderRadius: 4, backgroundColor: color.black, color: color.white, opacity: interpolate(frame, [at, at + 8], [0, 1], clamp), translate: `0 ${interpolate(frame, [at, at + 10], [20, 0], clamp)}px` }}>
            <div style={{ fontFamily: sans, fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em" }}>{n}</div>
            <div style={{ ...label, fontSize: 18, color: "#bdbdbd" }}>{t}</div>
          </div>
        );
      })}
    </div>
  );
};

// 4. The real digest that landed in Gmail.
const Digest = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: color.white, opacity: fadeIn(frame, fps) }}>
      <Video src={staticFile("email-agent/digest.mp4")} muted />
      <Tag>Digest emailed at 7:00 AM</Tag>
    </AbsoluteFill>
  );
};

const Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = (d: number) => ({ opacity: interpolate(frame, [d * fps, (d + 0.4) * fps], [0, 1], clamp), translate: `0 ${interpolate(frame, [d * fps, (d + 0.6) * fps], [40, 0], clamp)}px` });
  return (
    <AbsoluteFill style={{ backgroundColor: color.black, color: color.white, padding: "0 120px", justifyContent: "center" }}>
      <div style={{ fontFamily: sans, fontSize: 170, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.9, ...rise(0.1) }}>
        Email summary agent<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ marginTop: 40, fontFamily: mono, fontSize: 40, color: "#bdbdbd", ...rise(0.5) }}>n8n · Ollama (Qwen 2.5 3B) · Gmail API</div>
      {useContext(ShowSignature) ? <div style={{ marginTop: 60, ...label, fontSize: 36, ...rise(0.9) }}>Ivan Salinas · ivansalinas.vercel.app</div> : null}
    </AbsoluteFill>
  );
};

export const EmailAgent = () => {
  const { fps } = useVideoConfig();
  const embedded = useContext(Embedded);
  const f = (s: number) => Math.round(s * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: color.black }}>
      <Sequence name="Inbox" durationInFrames={f(5)}><Inbox /></Sequence>
      <Sequence name="Editor" from={f(5)} durationInFrames={f(8.5)}>
        <Still src="email-agent/editor.png" tag="n8n workflow · runs daily at 7 AM" zoom={[1, 1.08]} origin="52% 45%" />
      </Sequence>
      <Sequence name="Run" from={f(13.5)} durationInFrames={f(10)}>
        <Still src="email-agent/run.png" tag="Run #74 · scheduled, 12 Nov" zoom={[1, 1.1]} origin="68% 45%" />
        <RunStats />
      </Sequence>
      <Sequence name="Digest" from={f(23.5)} durationInFrames={f(10)}><Digest /></Sequence>
      <Sequence name="Outro" from={f(33.5)}><Outro /></Sequence>
      {(embedded ? [] : voice).map((line, i) => (
        <Sequence key={line.file} name={`Voice ${i}`} from={f(LINE_AT[i])} durationInFrames={f(line.duration + 0.5)}>
          <Audio src={staticFile(line.file)} />
          {i < voice.length - 1 ? <Caption line={line} /> : null}
        </Sequence>
      ))}
      {embedded ? null : <Audio name="Soundtrack" src={staticFile("soundtrack.wav")} loop volume={0.12} />}
    </AbsoluteFill>
  );
};
