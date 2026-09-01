type CapabilityGroup = {
  title: string;
  description: string;
  technologies: string[];
};

const capabilityGroups: CapabilityGroup[] = [
  {
    title: "Full-Stack Web Development",
    description: "Web applications and institutional information systems from interface to deployment.",
    technologies: ["PHP", "JavaScript", "TypeScript", "Java", "React", "Next.js", "Laravel"],
  },
  {
    title: "Backend APIs and Databases",
    description: "Application logic, integrations, relational data models, and data access.",
    technologies: ["SQL", "MySQL", "PostgreSQL", "Supabase", "REST APIs"],
  },
  {
    title: "Automation and AI Integration",
    description: "Workflow automation using webhooks, chatbots, LLM integrations, and external APIs.",
    technologies: ["n8n", "REST APIs"],
  },
  {
    title: "IoT and Monitoring Systems",
    description: "Connected monitoring and data-collection systems for institutional and field use.",
    technologies: ["ESP32", "Arduino", "PlatformIO", "ArcGIS", "QGIS"],
  },
  {
    title: "Delivery and Collaboration Tools",
    description: "Source control, collaborative development, and web application deployment.",
    technologies: ["Git", "GitHub", "Vercel"],
  },
];

export function CapabilitiesSection() {
  return (
    <section className="content-section capabilities-section capabilities-v2" aria-labelledby="skills-title">
      <div className="section-title capabilities-title-block">
        <span>04 / Capabilities</span>
        <div className="capabilities-heading-wrap">
          <h2 id="skills-title">Technical capabilities and tools.</h2>
          <p>Technologies used across web applications, data systems, automation, monitoring, and delivery.</p>
        </div>
      </div>

      <div className="capability-category-grid">
        {capabilityGroups.map((group) => (
          <article key={group.title} className="capability-category-card">
            <header>
              <p className="capability-category-eyebrow">Capability</p>
              <h3>{group.title}</h3>
              <p className="capability-category-description">{group.description}</p>
            </header>
            <ul className="capability-tag-list" aria-label={`${group.title} technologies`}>
              {group.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
