import type { Project } from "@/lib/types";

export type ProjectCategory =
  | "Research Information System"
  | "Monitoring & Evaluation"
  | "CMS / E-Library"
  | "Full-Stack Web Application"
  | "AI / Automation"
  | "IoT / Smart Agriculture"
  | "Data Engineering";

export type ProjectStacks = {
  primary: string[];
  supporting: string[];
};

export function projectSlug(project: Project): string {
  const title = project.title.toLowerCase();

  if (title.includes("crops and resources research and development center")) {
    return "crops-and-resources-rd-center";
  }

  if (title.includes("real time monitoring system") || title.includes("rtms")) {
    return "claarrdec-real-time-monitoring-system";
  }

  if (title.trim() === "claarrdec") {
    return "claarrdec-cms-e-library";
  }

  return project.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function projectDisplayTitle(project: Project): string {
  const title = project.title.toLowerCase();
  if (title.includes("real time monitoring system") || title.includes("rtms")) {
    return "CLAARRDEC Real-Time Monitoring System";
  }
  if (title.trim() === "claarrdec") {
    return "CLAARRDEC CMS / E-Library";
  }
  return project.title;
}

export function inferCategory(project: Project): ProjectCategory {
  const title = project.title.toLowerCase();
  const description = project.description.toLowerCase();
  const stack = project.tech_stack.join(" ").toLowerCase();
  const haystack = `${title} ${description} ${stack}`;

  // Data engineering and IoT go first: their descriptions also mention monitoring and dashboards.
  if (/(warehouse|\bdbt\b|\betl\b)/.test(haystack)) return "Data Engineering";
  if (/(\biot\b|smart agriculture|esp32|sensor)/.test(haystack)) return "IoT / Smart Agriculture";
  if (/(monitoring|m&e|evaluation|rtms)/.test(haystack)) return "Monitoring & Evaluation";
  if (/(cms|content management|e-library|library)/.test(haystack)) return "CMS / E-Library";
  // Word boundaries matter: bare "rd" matched "dashboard" and bare "ai" matched "email".
  if (/(research|r&d|consortium)/.test(haystack)) return "Research Information System";
  if (/(\bai\b|automation|\bllm\b|n8n)/.test(haystack)) return "AI / Automation";
  return "Full-Stack Web Application";
}

export function splitStack(project: Project): ProjectStacks {
  const orderedPreference = [
    "Next.js",
    "React",
    "TypeScript",
    "Laravel",
    "PHP",
    "MySQL",
    "JavaScript",
    "Bootstrap",
    "Tailwind CSS",
  ];

  const uniqueStack = Array.from(new Set(project.tech_stack));
  const ranked = orderedPreference.filter((tech) => uniqueStack.includes(tech));
  const primary = (ranked.length > 0 ? ranked : uniqueStack).slice(0, 4);
  const supporting = uniqueStack.filter((tech) => !primary.includes(tech));

  return { primary, supporting };
}

export function getRoleSummary(project: Project): string {
  return project.role || "Full-stack developer involved across planning, implementation, testing, and delivery.";
}

// Images are local files or uploads in the CMS bucket; anything else (or nothing) shows the placeholder.
export const MEDIA_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-media/`;
export function isAllowedImage(src: string | null | undefined): src is string {
  return Boolean(src && ((src.startsWith("/") && !src.startsWith("//")) || src.startsWith(MEDIA_PREFIX)));
}
