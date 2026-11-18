import { useContext } from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import chat from "../public/carwash/chat.json";
import voice from "../public/carwash/voice/voice.json";
import { Caption, Embedded, ShowSignature } from "./Walkthrough";
import { color, label, mono, sans } from "./theme";

// 40s demo of carwash-booking (Google Form + Sheets + n8n + Telegram). Not deployed yet, so the system is drawn,
// but every chat message is real bot output from lib/booking.js on demo bookings (scripts/carwash-demo.js).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// Scene starts in seconds; voice line i starts just after scene i.
const SCENES = [0, 4.6, 13.8, 25.2, 34.2];
const LINE_AT = [0.3, 4.7, 14.0, 25.4, 34.6];

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

// 1. Hook: bookings by text, two people want the same slot.
const TEXTS = ["Hi! Can I book a full detail tomorrow at 10?", "Is 10:00 tomorrow still free? Basic wash po", "Booked 10am for my Vios, thanks!", "On my way for my 10:00 wash 🚗"];
const Sms = ({ text, i }: { text: string; i: number }) => (
  <div style={{ alignSelf: i % 2 ? "flex-end" : "flex-start", maxWidth: 900, padding: "20px 30px", borderRadius: 26, backgroundColor: i % 2 ? "#d9d9d9" : color.white, fontFamily: sans, fontSize: 44, ...useAppear(0.2 + i * 0.6) }}>{text}</div>
);
const Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = interpolate(frame, [2.9 * fps, 3.1 * fps], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg, padding: "90px 220px", gap: 26 }}>
      {TEXTS.map((t, i) => <Sms key={t} text={t} i={i} />)}
      <div style={{ position: "absolute", left: "50%", top: "42%", translate: "-50% -50%", rotate: "-8deg", scale: interpolate(stamp, [0, 1], [1.6, 1]), opacity: stamp, padding: "18px 44px", border: `10px solid ${color.accent}`, color: color.accent, fontFamily: sans, fontSize: 120, fontWeight: 700, letterSpacing: "-0.03em" }}>
        DOUBLE BOOKED
      </div>
    </AbsoluteFill>
  );
};

// 2. How it fits together.
const Box = ({ at, title, sub, children, w = 330 }: { at: number; title: string; sub: string; children?: React.ReactNode; w?: number }) => (
  <div style={{ width: w, padding: "28px 30px", borderRadius: 8, backgroundColor: color.white, border: `2px solid ${color.black}`, ...useAppear(at) }}>
    <div style={{ ...label, fontSize: 20, color: color.accent }}>{sub}</div>
    <div style={{ marginTop: 8, fontFamily: sans, fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em" }}>{title}</div>
    {children}
  </div>
);
const Arrow = ({ at }: { at: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at * fps, (at + 0.4) * fps], [0, 1], clamp);
  return <div style={{ width: 70, height: 4, backgroundColor: color.black, scale: `${p} 1`, transformOrigin: "left" }} />;
};
const WORKFLOWS = [["1", "Booking intake", "every minute"], ["2", "Telegram bot", "on message"], ["3", "Reminders", "daily 18:00"], ["4", "No-show check", "every 15 min"]];
const Flow = () => (
  <AbsoluteFill style={{ backgroundColor: color.bg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 20, paddingBottom: 140 }}>
    <Tag>How it works</Tag>
    <Box at={0.3} sub="Customer" title="Google Form" />
    <Arrow at={1.1} />
    <Box at={1.4} sub="Data" title="Google Sheet" />
    <Arrow at={2.4} />
    <Box at={2.7} sub="Automation" title="n8n" w={470}>
      {WORKFLOWS.map(([n, name, when], i) => (
        <div key={n} style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid #d9ddd9", fontFamily: sans, fontSize: 26, ...useAppear(3.2 + i * 0.35, 10) }}>
          <span>{n}. {name}</span><span style={{ fontFamily: mono, fontSize: 20, color: color.body }}>{when}</span>
        </div>
      ))}
    </Box>
    <Arrow at={5} />
    <Box at={5.3} sub="Owner + customer" title="Telegram" />
  </AbsoluteFill>
);

// 3. The chat, both sides. Times are seconds into the scene, one per chat.json entry.
const CHAT_AT = [0.3, 2.0, 3.6, 4.2, 6.8, 7.3, 7.6, 9.3];
const Bubble = ({ m, at }: { m: (typeof chat)[number]; at: number }) => (
  <div style={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", maxWidth: "88%", padding: "14px 20px", borderRadius: 14, backgroundColor: m.from === "user" ? color.black : color.white, color: m.from === "user" ? color.white : color.black, fontFamily: sans, fontSize: 21, lineHeight: 1.3, whiteSpace: "pre-wrap", ...useAppear(at, 16) }}>
    {m.text}
  </div>
);
const Pane = ({ who, title }: { who: string; title: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRadius: 10, overflow: "hidden", border: `2px solid ${color.black}` }}>
      <div style={{ padding: "16px 24px", backgroundColor: color.black, color: color.white, ...label, fontSize: 22 }}>{title}</div>
      {/* Newest message sits at the bottom; older ones scroll off the top. */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12, padding: 20, overflow: "hidden", backgroundColor: "#e2e5e2" }}>
        {chat.map((m, i) => {
          if (m.chat !== who || frame < CHAT_AT[i] * fps) return null;
          return (
            <div key={i} style={{ display: "contents" }}>
              {i === chat.length - 1 ? <div style={{ alignSelf: "center", ...label, fontSize: 18, color: color.body }}>Next day · 18:00</div> : null}
              <Bubble m={m} at={CHAT_AT[i]} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
const Chat = () => (
  <AbsoluteFill style={{ backgroundColor: color.bg, flexDirection: "row", gap: 40, padding: "100px 120px 350px" }}>
    <Tag>Demo bookings · real bot output</Tag>
    <Pane who="owner" title="Owner · shop chat" />
    <Pane who="customer" title="Customer · Maria" />
  </AbsoluteFill>
);

// 4. Plain rules, tested, one-click install.
const Tests = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cmd = "node test/booking.test.js";
  const typed = Math.floor(interpolate(frame, [0.4 * fps, 1.6 * fps], [0, cmd.length], clamp));
  const facts = [["4", "n8n workflows"], ["0", "AI calls · fixed rules"], ["1-click", "Windows installer"]];
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg, flexDirection: "row", alignItems: "center", gap: 60, padding: "0 120px 160px" }}>
      <Tag>Tested and installable</Tag>
      <div style={{ flex: 1.3, padding: "40px 44px", borderRadius: 10, backgroundColor: "#161615", color: color.white, fontFamily: mono, fontSize: 30, lineHeight: 1.6 }}>
        <div><span style={{ color: "#8a8a8a" }}>carwash-booking $ </span>{cmd.slice(0, typed)}</div>
        <div style={{ color: "#a3c98f", opacity: frame > 2.1 * fps ? 1 : 0 }}>all tests passed</div>
        <div style={{ marginTop: 20, color: "#8a8a8a", fontSize: 24, opacity: frame > 2.6 * fps ? 1 : 0 }}>slots · clashes · phone matching · reschedule · no-show · reminders</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {facts.map(([n, t], i) => (
          <div key={t} style={{ padding: "22px 30px", borderRadius: 8, backgroundColor: color.white, border: `2px solid ${color.black}`, ...useAppear(2.8 + i * 0.5) }}>
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
      <div style={{ fontFamily: sans, fontSize: 200, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.9, ...a }}>
        Carwash booking<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ marginTop: 40, fontFamily: mono, fontSize: 40, color: "#bdbdbd", ...b }}>n8n · Google Forms + Sheets · Telegram bot</div>
      {useContext(ShowSignature) ? <div style={{ marginTop: 60, ...label, fontSize: 36, ...c }}>Ivan Salinas · ivansalinas.vercel.app</div> : null}
    </AbsoluteFill>
  );
};

export const Carwash = () => {
  const { fps } = useVideoConfig();
  const embedded = useContext(Embedded);
  const f = (s: number) => Math.round(s * fps);
  const parts = [Hook, Flow, Chat, Tests, Outro];
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
