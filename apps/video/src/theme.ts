import { loadFont as loadSans } from "@remotion/google-fonts/InstrumentSans";
import { loadFont as loadMono } from "@remotion/google-fonts/DMMono";

// Same type and palette as the website (apps/web), so the video reads as the site in motion.
const sansFont = loadSans("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const monoFont = loadMono("normal", { weights: ["400"], subsets: ["latin"] });
export const sans = sansFont.fontFamily;
export const mono = monoFont.fontFamily;
// Glyph measurements need the real font, not the fallback it replaces.
export const fontsReady = Promise.all([sansFont.waitUntilDone(), monoFont.waitUntilDone()]);

export const color = { black: "#000", white: "#fff", accent: "#ff0000", bg: "#f0f0f0", body: "#5c5c5c", dot: "#b9bdb9" };

// The site's dot-matrix sheet: 18 dots across the content width.
export const dotGrid = {
  backgroundColor: color.bg,
  backgroundImage: `radial-gradient(circle, ${color.dot} 2px, transparent 2.5px)`,
  backgroundSize: "98px 98px",
  backgroundPosition: "80px 40px",
};

export const label = { fontFamily: mono, fontSize: 30, letterSpacing: "0.06em", textTransform: "uppercase" as const };
