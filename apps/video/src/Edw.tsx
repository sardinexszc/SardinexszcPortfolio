import { useContext } from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import voice from "../public/edw/voice/voice.json";
import { Caption, Embedded, ShowSignature } from "./Walkthrough";
import { color, label, mono, sans } from "./theme";

// 40s walkthrough of DRIW, the IT271 disaster-response data warehouse (NEUSTIT271_EDW_Project).
// Dashboard clips are filmed from the local XAMPP site (scripts/capture-site.mjs edw); figures in them are synthetic.
// Numbers on screen come from the project's docs/validation-report.md and README.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// Scene starts in seconds; voice line i starts just after scene i.
const SCENES = [0, 5.8, 15.6, 25, 32.6];
const LINE_AT = [0.3, 5.9, 15.8, 25.2, 33.0];

const useAppear = (at: number, rise = 24) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = at * fps;
  return { opacity: interpolate(frame, [f, f + 7], [0, 1], clamp), translate: `0 ${interpolate(frame, [f, f + 10], [rise, 0], clamp)}px` };
};

const Tag = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: "absolute", right: 48, top: 40, padding: "10px 18px", borderRadius: 4, backgroundColor: color.black, color: color.white, ...label, fontSize: 22 }}>
    <span style={{ color: color.accent }}>● </span>{children}
  </div>
);

// 1. Hook: five agencies, five formats, the same place spelled five ways.
const SOURCES = [
  ["NDRRMC sitreps", "CSV", "Sta. Cruz, Laguna"],
  ["DSWD DROMIC", "Excel", "SANTA CRUZ (Capital)"],
  ["NGO distribution", "JSON", "\"sta cruz\""],
  ["PAGASA bulletins", "CSV", "Region IV-A"],
  ["LGU response logs", "CSV", "Brgy. Poblacion, Sta Cruz"],
];
const Hook = () => (
  <AbsoluteFill style={{ backgroundColor: color.bg, padding: "110px 120px", gap: 50 }}>
    <div style={{ fontFamily: sans, fontSize: 84, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1, ...useAppear(0.1) }}>
      31 typhoons and floods<span style={{ color: color.accent }}>.</span> 5 agencies<span style={{ color: color.accent }}>.</span>
    </div>
    <div style={{ display: "flex", gap: 24 }}>
      {SOURCES.map(([who, fmt, place], i) => (
        <div key={who} style={{ flex: 1, padding: "26px 26px", borderRadius: 8, backgroundColor: color.white, border: `2px solid ${color.black}`, rotate: `${[-3, 2, -1.5, 3, -2][i]}deg`, ...useAppear(0.9 + i * 0.4) }}>
          <div style={{ ...label, fontSize: 20, color: color.accent }}>{fmt}</div>
          <div style={{ marginTop: 8, fontFamily: sans, fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em" }}>{who}</div>
          <div style={{ marginTop: 18, fontFamily: mono, fontSize: 20, color: color.body }}>{place}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

// 2. The pipeline, layer by layer.
const Arrow = ({ at }: { at: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at * fps, (at + 0.4) * fps], [0, 1], clamp);
  return <div style={{ width: 50, height: 4, backgroundColor: color.black, scale: `${p} 1`, transformOrigin: "left" }} />;
};
const LAYERS = [["raw", "landing zone", "Python"], ["staging", "cleansed, typed", "dbt"], ["dw", "star schema", "dbt"], ["mart", "ROLAP aggregates", "dbt"]];
const Pipeline = () => (
  <AbsoluteFill style={{ backgroundColor: color.bg, justifyContent: "center", alignItems: "center", gap: 60, paddingBottom: 150 }}>
    <Tag>PostgreSQL 17 · dbt</Tag>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {LAYERS.map(([schema, what, tool], i) => (
        <div key={schema} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {i > 0 ? <Arrow at={0.6 + i * 1.3} /> : null}
          <div style={{ width: 330, padding: "28px 30px", borderRadius: 8, backgroundColor: color.white, border: `2px solid ${color.black}`, ...useAppear(0.3 + i * 1.3) }}>
            <div style={{ ...label, fontSize: 20, color: color.accent }}>{tool}</div>
            <div style={{ marginTop: 8, fontFamily: mono, fontSize: 48, fontWeight: 600 }}>{schema}</div>
            <div style={{ marginTop: 6, fontFamily: sans, fontSize: 26, color: color.body }}>{what}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 20 }}>
      {[["41", "data-quality rules"], ["19 / 19", "planted defect types caught"], ["83,442", "fact rows · SCD Type 2"]].map(([n, t], i) => (
        <div key={t} style={{ padding: "18px 28px", borderRadius: 4, backgroundColor: color.black, color: color.white, ...useAppear(6 + i * 0.6) }}>
          <div style={{ fontFamily: sans, fontSize: 52, fontWeight: 600, letterSpacing: "-0.03em" }}>{n}</div>
          <div style={{ ...label, fontSize: 18, color: "#bdbdbd" }}>{t}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

// 3. Dashboards, filmed from the running site.
const CLIPS: [string, number, string][] = [["executive", 4.4, "Executive"], ["operations", 2.6, "Operations"], ["logistics", 2.4, "Logistics"]];
const Clip = ({ name, tag }: { name: string; tag: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", opacity: interpolate(frame, [0, 0.2 * fps], [0, 1], clamp) }}>
      <Video src={staticFile(`edw/${name}.mp4`)} muted />
      <Tag>{tag} · live from the warehouse</Tag>
    </AbsoluteFill>
  );
};
const Dashboards = () => {
  const { fps } = useVideoConfig();
  let at = 0;
  return (
    <AbsoluteFill>
      {CLIPS.map(([name, secs, tag]) => {
        const from = Math.round(at * fps);
        at += secs;
        return <Sequence key={name} name={name} from={from} durationInFrames={Math.round(secs * fps)}><Clip name={name} tag={tag} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};

// 4. Validation: every suite from docs/validation-report.md.
const SUITES = [["dbt build (models + data tests)", "99"], ["end-to-end", "28"], ["governance / row-level security", "21"], ["PHP API", "13"], ["data exchange", "13"]];
const Tests = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cmd = "python -m pytest tests";
  const typed = Math.floor(interpolate(frame, [0.3 * fps, 1.2 * fps], [0, cmd.length], clamp));
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg, flexDirection: "row", alignItems: "center", gap: 60, padding: "0 120px 160px" }}>
      <Tag>Tested from a fresh database</Tag>
      <div style={{ flex: 1.4, padding: "40px 44px", borderRadius: 10, backgroundColor: "#161615", color: color.white, fontFamily: mono, fontSize: 28, lineHeight: 1.6 }}>
        <div><span style={{ color: "#8a8a8a" }}>driw $ </span>{cmd.slice(0, typed)}</div>
        {SUITES.map(([name, n], i) => (
          <div key={name} style={{ display: "flex", justifyContent: "space-between", opacity: frame > (1.5 + i * 0.3) * fps ? 1 : 0 }}>
            <span style={{ color: "#bdbdbd" }}>{name}</span><span style={{ color: "#a3c98f" }}>{n} pass</span>
          </div>
        ))}
        <div style={{ marginTop: 14, color: "#a3c98f", opacity: frame > 3.2 * fps ? 1 : 0 }}>174 checks · all pass</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {[["0", "false place matches · ~63k rows"], ["32 ms", "slowest of 14 queries · 1 s budget"]].map(([n, t], i) => (
          <div key={t} style={{ padding: "22px 30px", borderRadius: 8, backgroundColor: color.white, border: `2px solid ${color.black}`, ...useAppear(3.4 + i * 0.5) }}>
            <div style={{ fontFamily: sans, fontSize: 64, fontWeight: 600, letterSpacing: "-0.04em" }}>{n}</div>
            <div style={{ ...label, fontSize: 22, color: color.body }}>{t}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Outro = () => {
  const a = useAppear(0.1, 40), b = useAppear(0.5, 40), c = useAppear(0.9, 40);
  return (
    <AbsoluteFill style={{ backgroundColor: color.black, color: color.white, padding: "0 120px", justifyContent: "center" }}>
      <div style={{ fontFamily: sans, fontSize: 140, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.95, ...a }}>
        Disaster Response<br />Intelligence Warehouse<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ marginTop: 40, fontFamily: mono, fontSize: 40, color: "#bdbdbd", ...b }}>PostgreSQL · dbt · Python · Next.js · PHP</div>
      {useContext(ShowSignature) ? <div style={{ marginTop: 60, ...label, fontSize: 36, ...c }}>Ivan Salinas · ivansalinas.vercel.app</div> : null}
    </AbsoluteFill>
  );
};

export const Edw = () => {
  const { fps } = useVideoConfig();
  const embedded = useContext(Embedded);
  const f = (s: number) => Math.round(s * fps);
  const parts = [Hook, Pipeline, Dashboards, Tests, Outro];
  return (
    <AbsoluteFill style={{ backgroundColor: color.black }}>
      {parts.map((Part, i) => (
        <Sequence key={i} name={Part.name} from={f(SCENES[i])} durationInFrames={i < parts.length - 1 ? f(SCENES[i + 1] - SCENES[i]) : undefined}>
          <Part />
        </Sequence>
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
