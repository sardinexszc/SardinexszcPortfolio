import { renderShareImage } from "./opengraph-image";

export const alt = "Ivan Christian L. Salinas — Full-Stack Software Engineer. Laravel, Next.js, React, TypeScript, MySQL, PostgreSQL.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderShareImage();
}
