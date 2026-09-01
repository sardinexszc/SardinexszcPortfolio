import type { Project } from "@/lib/types";

export type ProjectCategory =
  | "Research Information System"
  | "Monitoring & Evaluation"
  | "CMS / E-Library"
  | "Full-Stack Web Application"
  | "AI / Automation"
  | "IoT / Smart Agriculture";

export type ProjectStacks = {
  primary: string[];
  supporting: string[];
};

export type ProjectArchitecture = {
  title: string;
  layers: string[];
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

  if (/(monitoring|m&e|evaluation|rtms)/.test(haystack)) return "Monitoring & Evaluation";
  if (/(cms|content management|e-library|library)/.test(haystack)) return "CMS / E-Library";
  if (/(research|rd|r&d|consortium)/.test(haystack)) return "Research Information System";
  if (/(iot|smart agriculture|esp32|sensor)/.test(haystack)) return "IoT / Smart Agriculture";
  if (/(ai|automation|llm|n8n)/.test(haystack)) return "AI / Automation";
  return "Full-Stack Web Application";
}

export function getProjectSummary(project: Project): string {
  const firstSentence = project.description.split(".")[0]?.trim();
  return firstSentence ? `${firstSentence}.` : project.description;
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

export function getRoleSummary(project?: Project): string {
  const configuredSummary = project?.role_summary?.trim();
  if (configuredSummary) {
    return configuredSummary;
  }

  if (!project) {
    return "Full-stack delivery across the application interface, workflow logic, and data-backed features documented for this project.";
  }

  const slug = projectSlug(project);
  if (slug === "crops-and-resources-rd-center") {
    return "Full-stack developer responsible for requirements, architecture, database design, implementation, integrations, deployment, and maintenance.";
  }
  if (slug === "claarrdec-real-time-monitoring-system") {
    return "Information systems developer translating monitoring and evaluation workflows into a centralized web platform.";
  }
  if (slug === "claarrdec-cms-e-library") {
    return "Full-stack developer for the public content, authenticated e-library, usage reporting, and administrative workflows.";
  }
  return "Full-stack developer involved across planning, implementation, testing, and delivery.";
}

export function getProblemStatement(project: Project): string | null {
  const marker = /,\s*built to\s+/i;
  if (marker.test(project.description)) {
    const value = project.description.split(marker)[0]?.trim();
    return value ? sentenceCase(value) : null;
  }
  const firstSentence = project.description.split(".")[0]?.trim();
  return firstSentence ? sentenceCase(firstSentence) : null;
}

export function getSolutionStatement(project: Project): string | null {
  const builtToMatch = project.description.match(/built to\s+(.+?)(?:\.|$)/i);
  if (!builtToMatch?.[1]) return null;
  return sentenceCase(builtToMatch[1]);
}

export function getOutcomeStatement(project: Project): string | null {
  if (project.outcome?.trim()) return project.outcome.trim();
  const improveMatch = project.description.match(/(improve\s+.+?)(?:\.|$)/i);
  if (improveMatch?.[1]) {
    return sentenceCase(improveMatch[1]);
  }
  const supportMatch = project.description.match(/(support\s+.+?)(?:\.|$)/i);
  if (supportMatch?.[1]) {
    return sentenceCase(supportMatch[1]);
  }
  return null;
}

export function getKeyFeatures(project: Project): string[] {
  if (project.highlights?.length) return project.highlights.filter(Boolean);
  return project.description
    .replace(/\.$/, "")
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map(sentenceCase);
}

export function getArchitecture(project: Project): ProjectArchitecture | null {
  const stack = project.tech_stack.map((item) => item.toLowerCase());
  const hasLaravel = stack.some((item) => item.includes("laravel") || item.includes("php"));
  const hasMySql = stack.some((item) => item.includes("mysql"));
  const hasNext = stack.some((item) => item.includes("next"));
  const hasReact = stack.some((item) => item.includes("react"));

  if (hasLaravel && hasMySql) {
    return {
      title: "Application architecture",
      layers: ["Frontend interface", "Application / API layer (Laravel / PHP)", "Database layer (MySQL)"],
    };
  }

  if (hasNext || hasReact) {
    return {
      title: "Application architecture",
      layers: ["Frontend application layer", "Service and integration layer"],
    };
  }

  return null;
}

export function projectHasScreenshot(project: Project): boolean {
  return Boolean(project.image_url && project.image_url.trim().length > 0);
}

function sentenceCase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed[0].toUpperCase() + trimmed.slice(1);
}
