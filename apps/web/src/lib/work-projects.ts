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
  const slug = projectSlug(project);
  if (slug === "crops-and-resources-rd-center") {
    return "Led requirements, database design, development, and deployment.";
  }
  if (slug === "claarrdec-real-time-monitoring-system") {
    return "Built the monitoring and reporting workflows.";
  }
  if (slug === "claarrdec-cms-e-library") {
    return "Built the public site, e-library, and admin tools.";
  }
  return "Full-stack developer involved across planning, implementation, testing, and delivery.";
}

export function projectHasScreenshot(project: Project): boolean {
  return Boolean(project.image_url && project.image_url.trim().length > 0);
}
