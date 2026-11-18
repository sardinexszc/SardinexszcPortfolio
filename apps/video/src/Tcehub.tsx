import { useContext } from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import voice from "../public/tcehub/voice/voice.json";
import { Caption, Embedded, ShowSignature } from "./Walkthrough";
import { color, label, mono, sans } from "./theme";

// 40s walkthrough of TCEHub, a site still being built: every scene carries an "In development" bar.
// Clips are filmed from the live preview, https://tcehub-alpha.vercel.app (scripts/capture-site.mjs tcehub); content there is mock data.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WIP = "#ffb020";
const LINE_AT = [0.4, 6.8, 16.8, 25.3, 34.2];
// [clip, seconds, page label]: the desktop clips play back to back from 0s.
const PAGES: [string, number, string][] = [["home", 6.5, "Home"], ["shops", 5.5, "Shop directory"], ["events", 2.25, "Events"], ["galleries", 2.25, "Galleries"]];
const MOBILE_AT = 16.5, ADMIN_AT = 25, OUTRO_AT = 33.5;

const useAppear = (at: number, rise = 24) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = at * fps;
  return { opacity: interpolate(frame, [f, f + 7], [0, 1], clamp), translate: `0 ${interpolate(frame, [f, f + 10], [rise, 0], clamp)}px` };
};

// Pulsing amber dot + label, shown on every scene so no viewer mistakes this for a finished product.
const WipBadge = ({ dark = false }: { dark?: boolean }) => {
  const frame = useCurrentFrame();
  const pulse = 0.4 + 0.6 * Math.abs(Math.sin(frame / 12));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 18px", borderRadius: 999, border: `2px solid ${WIP}`, color: dark ? WIP : color.black, backgroundColor: dark ? "transparent" : WIP, ...label, fontSize: 22, fontWeight: 600 }}>
      <span style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: dark ? WIP : color.black, opacity: pulse }} />
      In development
    </div>
  );
};

// Browser-style frame: a bar with the badge and page name, the clip underneath.
const BAR = 76;
const Framed = ({ src, page }: { src: string; page: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#111", opacity: interpolate(frame, [0, 0.2 * fps], [0, 1], clamp) }}>
      <div style={{ height: BAR, display: "flex", alignItems: "center", gap: 24, padding: "0 40px", color: color.white }}>
        <WipBadge dark />
        <span style={{ fontFamily: mono, fontSize: 24, color: "#bdbdbd" }}>tcehub-alpha.vercel.app</span>
        <span style={{ marginLeft: "auto", ...label, fontSize: 22 }}>{page} · preview build, mock data</span>
      </div>
      <div style={{ position: "absolute", top: BAR, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center" }}>
        <Video src={staticFile(`tcehub/${src}.mp4`)} muted style={{ height: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};

// Mobile first: the phone clip beside the stack.
const STACK = [["Next.js 16", "App Router, static pages"], ["TypeScript", "typed content contracts"], ["Tailwind", "mobile-first layouts"], ["React Hook Form + Zod", "validated contact form"]];
const Mobile = () => (
  <AbsoluteFill style={{ backgroundColor: color.bg, flexDirection: "row", alignItems: "center", gap: 100, padding: "60px 160px 200px" }}>
    <div style={{ position: "absolute", left: 48, top: 40 }}><WipBadge /></div>
    <div style={{ height: 760, aspectRatio: "390 / 844", borderRadius: 48, border: "14px solid #111", overflow: "hidden", backgroundColor: color.white, ...useAppear(0.1, 40) }}>
      <Video src={staticFile("tcehub/phone.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ fontFamily: sans, fontSize: 72, fontWeight: 600, letterSpacing: "-0.04em", ...useAppear(0.4) }}>Mobile first<span style={{ color: color.accent }}>.</span></div>
      {STACK.map(([n, t], i) => (
        <div key={n} style={{ padding: "18px 26px", borderRadius: 8, backgroundColor: color.white, border: `2px solid ${color.black}`, ...useAppear(1.4 + i * 0.6) }}>
          <div style={{ fontFamily: sans, fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em" }}>{n}</div>
          <div style={{ ...label, fontSize: 18, color: color.body }}>{t}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

// Admin preview and what is left to build.
const ROADMAP: [string, string, "done" | "now" | "next"][] = [
  ["Public site", "19 routes, filters, lightbox", "done"],
  ["Admin dashboard", "tables in place, editing off", "now"],
  ["Supabase", "real listings and content", "next"],
  ["Sign-in", "protected admin", "next"],
  ["Live map", "shops by location", "next"],
];
const MARK = { done: ["✓", "#2e9e5b", "Done"], now: ["●", WIP, "Building"], next: ["○", "#8a8a8a", "Next"] } as const;
const Admin = () => (
  <AbsoluteFill style={{ backgroundColor: color.bg, flexDirection: "row", alignItems: "center", gap: 60, padding: "110px 100px 220px" }}>
    <div style={{ position: "absolute", left: 48, top: 40 }}><WipBadge /></div>
    <div style={{ flex: 1.5, height: "100%", borderRadius: 10, overflow: "hidden", border: "2px solid #111", backgroundColor: color.white, ...useAppear(0.1) }}>
      <Video src={staticFile("tcehub/admin.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left top" }} />
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...label, fontSize: 24, color: color.body, ...useAppear(0.4) }}>Roadmap</div>
      {ROADMAP.map(([n, t, s], i) => {
        const [icon, c, word] = MARK[s];
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 22px", borderRadius: 8, backgroundColor: color.white, border: `2px solid ${s === "now" ? WIP : color.black}`, ...useAppear(0.8 + i * 0.7) }}>
            <span style={{ fontFamily: sans, fontSize: 34, color: c, width: 30 }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: sans, fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>{n}</div>
              <div style={{ fontFamily: mono, fontSize: 18, color: color.body }}>{t}</div>
            </div>
            <span style={{ ...label, fontSize: 18, color: c }}>{word}</span>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

const Outro = () => {
  const a = useAppear(0.1, 40), b = useAppear(0.5, 40), c = useAppear(0.9, 40);
  return (
    <AbsoluteFill style={{ backgroundColor: color.black, color: color.white, padding: "0 120px", justifyContent: "center" }}>
      <div style={{ alignSelf: "flex-start", ...useAppear(0.1) }}><WipBadge dark /></div>
      <div style={{ marginTop: 30, fontFamily: sans, fontSize: 200, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.9, ...a }}>
        TCEHub<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ marginTop: 40, fontFamily: mono, fontSize: 40, color: "#bdbdbd", ...b }}>Preview · tcehub-alpha.vercel.app</div>
      {useContext(ShowSignature) ? <div style={{ marginTop: 60, ...label, fontSize: 36, ...c }}>Ivan Salinas · ivansalinas.vercel.app</div> : null}
    </AbsoluteFill>
  );
};

export const Tcehub = () => {
  const { fps } = useVideoConfig();
  const embedded = useContext(Embedded);
  const f = (s: number) => Math.round(s * fps);
  let at = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: color.black }}>
      {PAGES.map(([src, secs, page]) => {
        const from = at;
        at += secs;
        return <Sequence key={src} name={page} from={f(from)} durationInFrames={f(secs)}><Framed src={src} page={page} /></Sequence>;
      })}
      <Sequence name="Mobile" from={f(MOBILE_AT)} durationInFrames={f(ADMIN_AT - MOBILE_AT)}><Mobile /></Sequence>
      <Sequence name="Admin" from={f(ADMIN_AT)} durationInFrames={f(OUTRO_AT - ADMIN_AT)}><Admin /></Sequence>
      <Sequence name="Outro" from={f(OUTRO_AT)}><Outro /></Sequence>
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
