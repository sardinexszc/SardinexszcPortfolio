import { ImageResponse } from "next/og";

export const alt = "Ivan Christian L. Salinas — Full-Stack Software Engineer. Laravel, Next.js, React, TypeScript, MySQL, PostgreSQL.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function renderShareImage() {
  return new ImageResponse(
    (
      <div style={{ background: "#171716", color: "#f4f4f0", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "72px 80px", width: "100%" }}>
        <div style={{ alignItems: "center", display: "flex", fontSize: 30, gap: 18, letterSpacing: 4 }}>
          <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: -4 }}>I<span style={{ color: "#ff0000" }}>S</span></span>
          <span style={{ color: "#b8b8b1" }}>IVANSALINAS.VERCEL.APP</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ color: "#ff0000", fontSize: 32, letterSpacing: 3 }}>IVAN CHRISTIAN L. SALINAS</div>
          <div style={{ fontSize: 84, letterSpacing: -4, lineHeight: 1 }}>Full-stack software engineer</div>
          <div style={{ color: "#c8c8c2", fontSize: 34 }}>Laravel · Next.js · React · TypeScript · MySQL · PostgreSQL</div>
        </div>
        <div style={{ color: "#b8b8b1", display: "flex", fontSize: 28 }}>Philippines · Open to full-time, contract, and remote roles</div>
      </div>
    ),
    size,
  );
}

export default function Image() {
  return renderShareImage();
}
