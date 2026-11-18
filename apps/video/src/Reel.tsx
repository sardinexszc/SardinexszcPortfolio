import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Carwash } from "./Carwash";
import { Crrdc } from "./Crrdc";
import { EmailAgent } from "./EmailAgent";
import { Edw } from "./Edw";
import { Tcehub } from "./Tcehub";
import { ShowSignature, Walkthrough } from "./Walkthrough";
import closingVoice from "../public/reel/voice/voice.json";
import { color, label, mono, sans } from "./theme";

// All six 40s project walkthroughs back to back, between an intro card and the "Let's talk" card from the site footer.
// Each keeps its own voice, captions, soundtrack and tech-stack outro; the name and URL appear only on the closing card.
export const INTRO_SECONDS = 3;
const PROJECTS = [Crrdc, Edw, EmailAgent, Carwash, Tcehub, Walkthrough];
export const PROJECT_FRAMES = 1200;
export const OUTRO_SECONDS = 15;
export const REEL_FRAMES = (INTRO_SECONDS + OUTRO_SECONDS) * 30 + PROJECTS.length * PROJECT_FRAMES;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// sub: the line under the role. Sizes shrink for the 9:16 cut.
export const Intro = ({ sub = "6 projects · 40 seconds each" }: { sub?: string }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const tall = height > width;
  const rise = (d: number) => ({ opacity: interpolate(frame, [d * fps, (d + 0.4) * fps], [0, 1], clamp), translate: `0 ${interpolate(frame, [d * fps, (d + 0.6) * fps], [40, 0], clamp)}px` });
  return (
    <AbsoluteFill style={{ backgroundColor: color.black, color: color.white, padding: tall ? "0 80px" : "0 120px", justifyContent: "center" }}>
      <Audio src={staticFile("soundtrack.wav")} volume={0.12} />
      <div style={{ fontFamily: sans, fontSize: tall ? 150 : 200, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.9, ...rise(0.1) }}>
        Ivan Salinas<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ marginTop: 40, fontFamily: mono, fontSize: 40, color: "#bdbdbd", ...rise(0.5) }}>Full-stack developer · Web, data & IoT</div>
      <div style={{ marginTop: 60, ...label, fontSize: 36, ...rise(0.9) }}>{sub}</div>
    </AbsoluteFill>
  );
};

// Closing card, styled on the portfolio's contact footer.
export const LetsTalk = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const tall = height > width;
  const rise = (d: number) => ({ opacity: interpolate(frame, [d * fps, (d + 0.4) * fps], [0, 1], clamp), translate: `0 ${interpolate(frame, [d * fps, (d + 0.6) * fps], [40, 0], clamp)}px` });
  return (
    <AbsoluteFill style={{ backgroundColor: color.black, color: color.white, padding: tall ? "0 80px" : "0 120px", justifyContent: "center" }}>
      <Audio src={staticFile("soundtrack.wav")} volume={(f) => interpolate(f, [0, (OUTRO_SECONDS - 3) * fps, OUTRO_SECONDS * fps], [0.12, 0.12, 0], clamp)} />
      {/* Spoken: full-stack developer, AI-assisted tools, then name and URL (scripts/voice.py reel). */}
      <Sequence from={Math.round(1.2 * fps)}><Audio src={staticFile(closingVoice[0].file)} /></Sequence>
      <div style={{ fontFamily: sans, fontSize: tall ? 170 : 200, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.9, ...rise(0.1) }}>
        Let’s talk<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ marginTop: 50, fontFamily: sans, fontSize: 60, fontWeight: 500, letterSpacing: "-0.02em", ...rise(0.5) }}>Hiring a remote full-stack developer?</div>
      <div style={{ marginTop: 18, fontFamily: mono, fontSize: 36, color: "#bdbdbd", ...rise(0.8) }}>Open to remote roles, freelance and project work.</div>
      {/* Same contact email as the site's "Let's talk" footer. */}
      <div style={{ marginTop: 30, alignSelf: "flex-start", fontFamily: sans, fontSize: 56, fontWeight: 500, letterSpacing: "-0.02em", borderBottom: `4px solid ${color.accent}`, ...rise(1.1) }}>banbansalinas@gmail.com</div>
      <div style={{ marginTop: 50, maxWidth: 1500, fontFamily: sans, fontSize: 40, lineHeight: 1.3, color: "#e6e6e6", ...rise(1.4) }}>
        I build with AI-assisted tools, and I review and test every change myself.
      </div>
      <div style={{ marginTop: 26, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {["Claude", "Codex", "GitHub Copilot", "GitHub"].map((tool, i) => (
          <span key={tool} style={{ padding: "10px 22px", borderRadius: 999, border: "2px solid #555", ...label, fontSize: 24, ...rise(2.4 + i * 0.4) }}>{tool}</span>
        ))}
      </div>
      <div style={{ position: "absolute", left: tall ? 80 : 120, right: tall ? 80 : 120, bottom: tall ? 160 : 90, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", paddingTop: 30, borderTop: "1px solid #333", ...label, fontSize: 32, ...rise(4.5) }}>
        <span>Ivan Salinas · Full-stack developer</span>
        <span style={{ color: color.accent }}>ivansalinas.vercel.app</span>
      </div>
    </AbsoluteFill>
  );
};

export const Reel = () => (
  <Series>
    <Series.Sequence durationInFrames={INTRO_SECONDS * 30} name="Intro"><Intro /></Series.Sequence>
    {PROJECTS.map((Project) => (
      <Series.Sequence key={Project.name} durationInFrames={PROJECT_FRAMES} name={Project.name}>
        <ShowSignature.Provider value={false}><Project /></ShowSignature.Provider>
      </Series.Sequence>
    ))}
    <Series.Sequence durationInFrames={OUTRO_SECONDS * 30} name="Let's talk"><LetsTalk /></Series.Sequence>
  </Series>
);
