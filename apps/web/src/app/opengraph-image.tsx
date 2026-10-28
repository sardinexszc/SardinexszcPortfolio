import { ImageResponse } from "next/og";

export const alt = "Ivan Christian L. Salinas — Full-stack developer: web, data and IoT. Laravel, Next.js, PostgreSQL.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Matches the home page: light grey, the name set huge, red accents.
export function renderShareImage() {
  return new ImageResponse(
    (
      <div style={{ background: "#f0f0f0", color: "#000", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "56px 64px", width: "100%" }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", fontSize: 26 }}>
          <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
            <div style={{ alignItems: "center", background: "#000", borderRadius: 12, color: "#fff", display: "flex", fontSize: 30, fontWeight: 700, height: 56, justifyContent: "center", width: 56 }}>I<span style={{ color: "#ff0000" }}>S</span></div>
            <span>Ivan Christian L. Salinas</span>
          </div>
          <span style={{ color: "#707070" }}>Open to remote roles</span>
        </div>
        <div style={{ display: "flex", fontSize: 340, fontWeight: 700, letterSpacing: -22, lineHeight: 0.85 }}>Salinas</div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 32, fontSize: 26 }}>
          <span>Full-stack developer · Web, data &amp; IoT</span>
          <span style={{ color: "#ff0000" }}>Laravel · Next.js · PostgreSQL</span>
        </div>
      </div>
    ),
    size,
  );
}

export default function Image() {
  return renderShareImage();
}
