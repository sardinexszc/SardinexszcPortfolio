import { Database, Webhook, type LucideIcon } from "lucide-react";
import {
  siArcgis,
  siArduino,
  siBootstrap,
  siEspressif,
  siGit,
  siGithub,
  siJavascript,
  siLaravel,
  siMysql,
  siN8n,
  siNextdotjs,
  siOpenjdk,
  siPhp,
  siPlatformio,
  siPostgresql,
  siQgis,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

// Logos are drawn in currentColor so they sit quietly with the text instead of
// turning every stack list into a row of brand colours.
const brandIcons: Record<string, SimpleIcon> = {
  PHP: siPhp,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  Java: siOpenjdk,
  React: siReact,
  "Next.js": siNextdotjs,
  Laravel: siLaravel,
  MySQL: siMysql,
  PostgreSQL: siPostgresql,
  Supabase: siSupabase,
  n8n: siN8n,
  Git: siGit,
  GitHub: siGithub,
  Vercel: siVercel,
  ESP32: siEspressif,
  Arduino: siArduino,
  PlatformIO: siPlatformio,
  ArcGIS: siArcgis,
  QGIS: siQgis,
  Bootstrap: siBootstrap,
  "Tailwind CSS": siTailwindcss,
};

const genericIcons: Record<string, LucideIcon> = {
  SQL: Database,
  "REST APIs": Webhook,
};

export function TechIcon({ name, size = 16 }: { name: string; size?: number }) {
  const brand = brandIcons[name];
  if (brand) {
    return (
      <svg className="tech-icon" role="img" aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d={brand.path} />
      </svg>
    );
  }

  const Generic = genericIcons[name] ?? Database;
  return <Generic className="tech-icon" size={size} strokeWidth={1.8} aria-hidden="true" />;
}

export function TechChip({ name }: { name: string }) {
  return (
    <span className="tech-chip">
      <TechIcon name={name} size={14} />
      {name}
    </span>
  );
}
