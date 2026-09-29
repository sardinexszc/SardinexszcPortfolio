type CapabilityGroup = {
  title: string;
  description: string;
  technologies: string[];
};

const capabilityGroups: CapabilityGroup[] = [
  {
    title: "Full-Stack Web Development",
    description: "Interfaces and applications for everyday use.",
    technologies: ["PHP", "JavaScript", "TypeScript", "Java", "React", "Next.js", "Laravel"],
  },
  {
    title: "Backend APIs and Databases",
    description: "Data models, APIs, and application logic.",
    technologies: ["SQL", "MySQL", "PostgreSQL", "Supabase", "REST APIs"],
  },
  {
    title: "Automation and Integration",
    description: "Webhooks, chatbots, and connected workflows.",
    technologies: ["n8n"],
  },
  {
    title: "IoT and Monitoring Systems",
    description: "Field data collection and mapping tools.",
    technologies: ["ESP32", "Arduino", "PlatformIO", "ArcGIS", "QGIS"],
  },
  {
    title: "Delivery and Collaboration",
    description: "Version control and deployment.",
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
          <p>Tools I use to build and deliver software.</p>
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
