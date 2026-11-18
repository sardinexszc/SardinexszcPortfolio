import { useContext } from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import voice from "../public/crrdc/voice/voice.json";
import { Caption, Embedded, ShowSignature } from "./Walkthrough";
import { color, label, mono, sans } from "./theme";

// 40s walkthrough of the CRRDC information system (crrdc.vercel.app), built while heading CRRDC's ICT division at CLSU.
// Clips are filmed from the live app after a manual sign-in (scripts/capture-site.mjs crrdc). Names, emails and phones are blurred.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LINE_AT = [0.3, 8.3, 17.6, 25.6, 32.8];
const TRIM = 0.5; // first half second of each clip is still loading

// Blur boxes in 1920x1080 frame px. The signed-in user's name and email sit in the header of every admin page.
type Box = [x: number, y: number, w: number, h: number];
const HEADER: Box = [1515, 0, 405, 62];
const DRIVE_EMAIL = (x: number): Box => [x, 150, 165, 45];
const BLUR: Record<string, Box[]> = {
  home: [],
  dashboard: [HEADER],
  projects: [HEADER],
  documents: [HEADER, DRIVE_EMAIL(985), [1130, 862, 430, 70]],
  approvals: [HEADER, [375, 405, 525, 255], [1485, 405, 180, 255]],
  staff: [HEADER, DRIVE_EMAIL(825), [400, 735, 470, 280]],
  settings: [HEADER, [790, 370, 330, 50], [790, 480, 330, 55]],
};

const useAppear = (at: number, rise = 24) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = at * fps;
  return { opacity: interpolate(frame, [f, f + 7], [0, 1], clamp), translate: `0 ${interpolate(frame, [f, f + 10], [rise, 0], clamp)}px` };
};

const Tag = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: "absolute", right: 48, bottom: 230, padding: "10px 18px", borderRadius: 4, backgroundColor: color.black, color: color.white, ...label, fontSize: 22 }}>
    <span style={{ color: color.accent }}>● </span>{children}
  </div>
);

const Clip = ({ name, tag }: { name: string; tag: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: color.white, opacity: interpolate(frame, [0, 0.2 * fps], [0, 1], clamp) }}>
      <Video src={staticFile(`crrdc/${name}.mp4`)} muted trimBefore={Math.round(TRIM * fps)} />
      {BLUR[name].map(([x, y, w, h]) => (
        <div key={`${x},${y}`} style={{ position: "absolute", left: x, top: y, width: w, height: h, backdropFilter: "blur(14px)", backgroundColor: "rgba(240,240,240,0.25)", borderRadius: 6 }} />
      ))}
      <Tag>{tag}</Tag>
    </AbsoluteFill>
  );
};

const Title = () => (
  <AbsoluteFill style={{ backgroundColor: color.bg, padding: "0 120px", justifyContent: "center" }}>
    <div style={{ ...label, fontSize: 26, color: color.accent, ...useAppear(0.1) }}>CLSU · Crops and Resources Research and Development Center</div>
    <div style={{ marginTop: 20, fontFamily: sans, fontSize: 130, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.95, ...useAppear(0.3) }}>
      CRRDC information system<span style={{ color: color.accent }}>.</span>
    </div>
    <div style={{ marginTop: 30, fontFamily: mono, fontSize: 32, color: color.body, ...useAppear(0.7) }}>Built end to end · as ICT Division Head, 2024–2025</div>
  </AbsoluteFill>
);

// Drawn cards for what the screens can't show.
const Facts = ({ tag, items }: { tag: string; items: [string, string][] }) => (
  <AbsoluteFill style={{ backgroundColor: color.bg, justifyContent: "center", padding: "0 160px 180px", gap: 22 }}>
    <div style={{ ...label, fontSize: 24, color: color.body, ...useAppear(0.1) }}>{tag}</div>
    {items.map(([n, t], i) => (
      <div key={n} style={{ display: "flex", alignItems: "baseline", gap: 30, padding: "24px 34px", borderRadius: 8, backgroundColor: color.white, border: `2px solid ${color.black}`, ...useAppear(0.3 + i * 0.5) }}>
        <div style={{ fontFamily: sans, fontSize: 52, fontWeight: 600, letterSpacing: "-0.03em" }}>{n}</div>
        <div style={{ ...label, fontSize: 22, color: color.body }}>{t}</div>
      </div>
    ))}
  </AbsoluteFill>
);

const Outro = () => {
  const a = useAppear(0.1, 40), b = useAppear(0.5, 40), c = useAppear(0.9, 40);
  return (
    <AbsoluteFill style={{ backgroundColor: color.black, color: color.white, padding: "0 120px", justifyContent: "center" }}>
      <div style={{ fontFamily: sans, fontSize: 200, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.9, ...a }}>
        CRRDC<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ marginTop: 40, fontFamily: mono, fontSize: 40, color: "#bdbdbd", ...b }}>Next.js · Supabase (PostgreSQL) · Google Drive API · Vercel</div>
      {useContext(ShowSignature) ? <div style={{ marginTop: 60, ...label, fontSize: 36, ...c }}>Ivan Salinas · ivansalinas.vercel.app</div> : null}
    </AbsoluteFill>
  );
};

// [start s, end s, scene]
const SCENES: [number, number, React.ReactNode][] = [
  [0, 2.6, <Title />],
  [2.6, 8.1, <Clip name="home" tag="Public site" />],
  [8.1, 12.6, <Clip name="dashboard" tag="Admin dashboard" />],
  [12.6, 15.1, <Clip name="projects" tag="Research projects" />],
  [15.1, 17.4, <Clip name="documents" tag="Documents" />],
  [17.4, 20.0, <Clip name="approvals" tag="Email whitelist" />],
  [20.0, 22.4, <Clip name="staff" tag="People" />],
  [22.4, 25.4, <Facts tag="Access control" items={[["Approval queue", "new accounts start as pending"], ["Whitelisted sign-in", "Google or magic link, listed emails only"], ["Row-level security", "Supabase policies per module and owner"]]} />],
  [25.4, 27.9, <Clip name="settings" tag="Super Admin settings" />],
  [27.9, 32.3, <Facts tag="Operations" items={[["Google Drive", "document storage"], ["Audit log", "admin actions recorded"], ["Backup & restore", "run from the dashboard"]]} />],
  [32.3, 40, <Outro />],
];

export const Crrdc = () => {
  const { fps } = useVideoConfig();
  const embedded = useContext(Embedded);
  const f = (s: number) => Math.round(s * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: color.black }}>
      {SCENES.map(([from, to, node], i) => (
        <Sequence key={i} from={f(from)} durationInFrames={f(to) - f(from)}>{node}</Sequence>
      ))}
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
