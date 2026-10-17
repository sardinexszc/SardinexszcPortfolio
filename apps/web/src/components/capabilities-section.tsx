import { Code2, Database, GitBranch, Radio, Workflow, Wrench, type LucideIcon } from "lucide-react";
import { TechChip } from "./tech-icon";

type CapabilityGroup = {
  icon: LucideIcon;
  title: string;
  description: string;
  technologies: string[];
};

const capabilityGroups: CapabilityGroup[] = [
  {
    icon: Code2,
    title: "Full-Stack Web Development",
    description: "Interfaces and applications for everyday use.",
    technologies: ["PHP", "JavaScript", "TypeScript", "Java", "React", "Next.js", "Laravel"],
  },
  {
    icon: Database,
    title: "Backend APIs and Databases",
    description: "Data models, APIs, and application logic.",
    technologies: ["SQL", "MySQL", "PostgreSQL", "Supabase", "REST APIs"],
  },
  {
    icon: Workflow,
    title: "Automation and Integration",
    description: "Webhooks, chatbots, and connected workflows.",
    technologies: ["n8n"],
  },
  {
    icon: Radio,
    title: "IoT and Monitoring Systems",
    description: "Field data collection and mapping tools.",
    technologies: ["ESP32", "Arduino", "PlatformIO", "ArcGIS", "QGIS"],
  },
  {
    icon: GitBranch,
    title: "Delivery and Collaboration",
    description: "Version control and deployment.",
    technologies: ["Git", "GitHub", "Vercel"],
  },
];

export function CapabilitiesSection() {
  return (
    <section id="skills" className="content-section capabilities-section capabilities-v2" aria-labelledby="skills-title">
      <div className="section-title capabilities-title-block">
        <span><Wrench size={18} aria-hidden="true" /> Capabilities</span>
        <div className="capabilities-heading-wrap">
          <h2 id="skills-title">Technical capabilities and tools.</h2>
          <p>Tools I use to build and deliver software.</p>
        </div>
      </div>

      <div className="capability-category-grid">
        {capabilityGroups.map(({ icon: Icon, ...group }) => (
          <article key={group.title} className="capability-category-card">
            <header>
              <span className="capability-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.7} /></span>
              <h3>{group.title}</h3>
              <p className="capability-category-description">{group.description}</p>
            </header>
            <ul className="capability-tag-list" aria-label={`${group.title} technologies`}>
              {group.technologies.map((technology) => <li key={technology}><TechChip name={technology} /></li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
