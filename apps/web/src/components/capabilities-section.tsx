import type { Project, TimelineEntry } from "@/lib/types";

type Level = "Core" | "Experienced" | "Working knowledge" | "Familiar";

type CapabilityItem = {
  technology: string;
  level: Level;
  projectMatchers?: string[];
  timelineMatchers?: string[];
  projectEvidence: string;
  timelineEvidence?: string;
};

type CapabilityCategory = {
  title: string;
  items: CapabilityItem[];
};

const categories: CapabilityCategory[] = [
  {
    title: "Frontend",
    items: [
      { technology: "Next.js", level: "Core", projectMatchers: ["next.js"], projectEvidence: "Listed in production project stack." },
      { technology: "React", level: "Core", projectMatchers: ["react"], projectEvidence: "Used in production frontend implementation." },
      { technology: "TypeScript", level: "Core", projectMatchers: ["typescript"], projectEvidence: "Used for typed frontend application code." },
      { technology: "JavaScript", level: "Core", projectMatchers: ["javascript"], projectEvidence: "Used across frontend and backend project layers." },
      { technology: "HTML5", level: "Experienced", projectMatchers: ["html5"], projectEvidence: "Included in deployed web project stacks." },
      { technology: "CSS3", level: "Experienced", projectMatchers: ["css3"], projectEvidence: "Included in deployed web project stacks." },
      { technology: "Tailwind CSS", level: "Core", projectMatchers: ["tailwind css", "tailwind"], projectEvidence: "Applied in modern frontend UI implementation." },
      { technology: "Bootstrap", level: "Experienced", projectMatchers: ["bootstrap"], projectEvidence: "Used in institutional web platforms." },
    ],
  },
  {
    title: "Backend",
    items: [
      { technology: "Laravel", level: "Core", projectMatchers: ["laravel"], projectEvidence: "Used for backend application architecture and delivery." },
      { technology: "PHP", level: "Core", projectMatchers: ["php"], projectEvidence: "Used for server-side business logic in production projects." },
      { technology: "Node.js", level: "Working knowledge", projectMatchers: ["next.js"], projectEvidence: "Used as runtime environment for Next.js delivery workflows." },
      { technology: "REST APIs", level: "Experienced", projectMatchers: ["laravel", "next.js"], projectEvidence: "Portfolio architecture includes API-backed frontend and backend integration flows." },
      { technology: "Authentication", level: "Experienced", projectMatchers: ["laravel authentication", "authentication"], projectEvidence: "Explicitly documented in deployed project tech stack." },
      { technology: "Server-side development", level: "Core", projectMatchers: ["laravel", "php"], projectEvidence: "Implemented through backend-first project delivery." },
    ],
  },
  {
    title: "Database",
    items: [
      { technology: "PostgreSQL", level: "Working knowledge", timelineMatchers: ["postgresql"], projectEvidence: "No direct public project stack tag yet.", timelineEvidence: "Referenced in professional summary and timeline context." },
      { technology: "MySQL", level: "Core", projectMatchers: ["mysql"], projectEvidence: "Used in multiple deployed institutional systems." },
      { technology: "Supabase", level: "Working knowledge", timelineMatchers: ["supabase"], projectEvidence: "No direct public project stack tag yet.", timelineEvidence: "Referenced in current full-stack workflow description." },
      { technology: "Database design", level: "Experienced", projectMatchers: ["mysql", "laravel"], projectEvidence: "Required for research and monitoring data models." },
      { technology: "Data management", level: "Experienced", projectMatchers: ["monitoring", "database management", "data management"], projectEvidence: "Project outcomes explicitly mention data management improvements." },
    ],
  },
  {
    title: "AI and Automation",
    items: [
      { technology: "LLM APIs", level: "Working knowledge", timelineMatchers: ["llm", "llm-powered"], projectEvidence: "Not yet exposed in selected public project stacks.", timelineEvidence: "Current focus and timeline mention LLM-powered applications." },
      { technology: "AI applications", level: "Working knowledge", timelineMatchers: ["ai-powered", "ai"], projectEvidence: "Not yet exposed in selected public project stacks.", timelineEvidence: "Timeline describes AI-powered application work." },
      { technology: "AI agents", level: "Working knowledge", timelineMatchers: ["ai agents", "agent"], projectEvidence: "Not yet exposed in selected public project stacks.", timelineEvidence: "Current focus statement includes AI agent development." },
      { technology: "n8n", level: "Working knowledge", timelineMatchers: ["n8n"], projectEvidence: "Not yet exposed in selected public project stacks.", timelineEvidence: "Timeline references n8n automation workflows." },
      { technology: "Workflow automation", level: "Experienced", timelineMatchers: ["workflow automation", "automation workflows"], projectEvidence: "Project objectives include workflow streamlining outcomes.", timelineEvidence: "Timeline explicitly includes workflow automation delivery." },
      { technology: "API integrations", level: "Experienced", timelineMatchers: ["integration", "integrations"], projectEvidence: "System delivery includes integrated web-based workflows.", timelineEvidence: "Timeline and project descriptions include integration-oriented work." },
    ],
  },
  {
    title: "IoT and Embedded",
    items: [
      { technology: "ESP32", level: "Familiar", timelineMatchers: ["iot", "smart agriculture"], projectEvidence: "No explicit ESP32 tag in current public project stack data.", timelineEvidence: "Timeline includes IoT and smart agriculture platform work." },
      { technology: "Arduino", level: "Familiar", timelineMatchers: ["iot", "smart agriculture"], projectEvidence: "No explicit Arduino tag in current public project stack data.", timelineEvidence: "Timeline includes IoT and smart agriculture platform work." },
      { technology: "PlatformIO", level: "Familiar", timelineMatchers: ["iot", "smart agriculture"], projectEvidence: "No explicit PlatformIO tag in current public project stack data.", timelineEvidence: "Timeline includes IoT and smart agriculture platform work." },
      { technology: "Sensors", level: "Working knowledge", timelineMatchers: ["iot", "monitoring"], projectEvidence: "No explicit sensor stack tag in current public project data.", timelineEvidence: "Timeline includes monitoring and IoT platform delivery." },
      { technology: "IoT monitoring", level: "Experienced", timelineMatchers: ["iot monitoring", "real-time monitoring", "smart agriculture"], projectEvidence: "Public portfolio highlights monitoring system development.", timelineEvidence: "Timeline explicitly states IoT monitoring platform work." },
      { technology: "Embedded systems", level: "Working knowledge", timelineMatchers: ["iot", "smart agriculture"], projectEvidence: "No explicit embedded stack tag in selected project stack data.", timelineEvidence: "Timeline includes IoT and smart agriculture solutions." },
    ],
  },
  {
    title: "DevOps and Tools",
    items: [
      { technology: "Git", level: "Experienced", projectMatchers: ["github"], projectEvidence: "Used in project delivery and collaboration workflows." },
      { technology: "GitHub", level: "Experienced", projectMatchers: ["github"], projectEvidence: "Listed in production project stacks." },
      { technology: "Vercel", level: "Experienced", projectMatchers: ["vercel"], projectEvidence: "Production deployment target for public web applications." },
      { technology: "Cloud platforms", level: "Experienced", projectMatchers: ["vercel"], projectEvidence: "Public projects are deployed and accessible online." },
      { technology: "CI/CD", level: "Familiar", projectMatchers: ["github", "vercel"], projectEvidence: "Delivery workflow uses hosted platform deployment pipelines." },
      { technology: "API testing", level: "Familiar", projectEvidence: "No explicit public artifact currently listed in project data." },
    ],
  },
];

function toHaystack(project: Project): string {
  return `${project.title} ${project.description} ${project.tech_stack.join(" ")}`.toLowerCase();
}

function findProjectForCapability(projects: Project[], item: CapabilityItem): Project | null {
  if (!item.projectMatchers || item.projectMatchers.length === 0) return null;

  for (const project of projects) {
    const haystack = toHaystack(project);
    if (item.projectMatchers.some((matcher) => haystack.includes(matcher.toLowerCase()))) {
      return project;
    }
  }

  return null;
}

function findTimelineEvidence(timeline: TimelineEntry[], item: CapabilityItem): boolean {
  if (!item.timelineMatchers || item.timelineMatchers.length === 0) return false;

  const timelineText = timeline
    .map((entry) => `${entry.role} ${entry.organization} ${entry.description}`)
    .join(" ")
    .toLowerCase();

  return item.timelineMatchers.some((matcher) => timelineText.includes(matcher.toLowerCase()));
}

export function CapabilitiesSection({ projects, timeline }: { projects: Project[]; timeline: TimelineEntry[] }) {
  return (
    <section className="content-section capabilities-section capabilities-v2" aria-labelledby="skills-title">
      <div className="section-title capabilities-title-block">
        <span>03 / Capabilities</span>
        <div className="capabilities-heading-wrap">
          <h2 id="skills-title">What I build and what I use.</h2>
          <p>Each technology is connected to project context and public evidence. Proficiency is shown as Core, Experienced, Working knowledge, or Familiar.</p>
        </div>
      </div>

      <div className="capability-level-legend" aria-label="Capability level legend">
        <span className="cap-level cap-level-core">Core</span>
        <span className="cap-level cap-level-experienced">Experienced</span>
        <span className="cap-level cap-level-working">Working knowledge</span>
        <span className="cap-level cap-level-familiar">Familiar</span>
      </div>

      <div className="capability-category-grid">
        {categories.map((category) => (
          <article key={category.title} className="capability-category-card">
            <header>
              <p className="capability-category-eyebrow">Category</p>
              <h3>{category.title}</h3>
            </header>

            <ul className="capability-tech-list" role="list">
              {category.items.map((item) => {
                const project = findProjectForCapability(projects, item);
                const timelineHit = findTimelineEvidence(timeline, item);

                return (
                  <li key={`${category.title}-${item.technology}`} className="capability-tech-item">
                    <div className="capability-tech-top">
                      <p className="capability-tech-name">{item.technology}</p>
                      <span className={`cap-level ${
                        item.level === "Core"
                          ? "cap-level-core"
                          : item.level === "Experienced"
                            ? "cap-level-experienced"
                            : item.level === "Working knowledge"
                              ? "cap-level-working"
                              : "cap-level-familiar"
                      }`}>{item.level}</span>
                    </div>

                    <div className="capability-evidence-map" aria-label="Technology to project evidence mapping">
                      <p className="capability-map-line">
                        <span className="cap-map-label">Technology</span>
                        <span className="cap-map-arrow">→</span>
                        <span className="cap-map-value">{item.technology}</span>
                      </p>
                      <p className="capability-map-line">
                        <span className="cap-map-label">Project</span>
                        <span className="cap-map-arrow">→</span>
                        <span className="cap-map-value">{project ? project.title : "No direct public project tag yet"}</span>
                      </p>
                      <p className="capability-map-line">
                        <span className="cap-map-label">Evidence</span>
                        <span className="cap-map-arrow">→</span>
                        <span className="cap-map-value">{project ? item.projectEvidence : timelineHit && item.timelineEvidence ? item.timelineEvidence : item.projectEvidence}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}