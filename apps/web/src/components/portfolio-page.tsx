import { ArrowDown, ArrowUpRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import type { Portfolio } from "@/lib/types";
import { profile } from "@/lib/profile";
import { CapabilitiesSection } from "./capabilities-section";
import { SelectedWorkSection, projectAnchor } from "./selected-work-section";
import { SiteHeader } from "./site-header";
import { TrackedLink } from "./tracked-elements";
import { projectDisplayTitle, projectSlug } from "@/lib/work-projects";

function SectionTitle({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return <div className="section-title"><span>{eyebrow}</span><h2 id={id}>{title}</h2></div>;
}

const aboutHighlights = [
  "Build research and institutional web systems, from requirements to deployment.",
  "Lead small teams and work directly with researchers and administrators.",
  "Bring experience in teaching, published research, and government-funded projects.",
];

const atAGlance = [
  { label: "Focus", value: "Full-stack web development: Laravel and Next.js apps backed by SQL databases" },
  { label: "Experience", value: "Information systems developer at Central Luzon State University, 2019–2026" },
  { label: "Core stack", value: "PHP · Laravel · TypeScript · React · Next.js · MySQL · PostgreSQL" },
  { label: "Education", value: "BS Information Technology; MS IT (Data Science) in progress" },
  { label: "Location", value: "Nueva Ecija, Philippines · open to remote" },
];

const research = [
  { title: "Development of a Web-based Research Consortium Database Management System: Advancing Data-driven and Knowledge-based Project Management", published: "May 24, 2024", doi: "10.1145/3670105.3670120" },
  { title: "Senior Digital World: Social Media Usage and Online Identity Expression Among Senior Citizens in Selected Barangays of Talavera, Nueva Ecija", published: "March 11, 2025", doi: "10.70059/nv6q0j65" },
];

export function PortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  const featuredProjects = portfolio.projects.filter((project) => project.featured);
  const strongestProjects = (featuredProjects.length > 0 ? featuredProjects : portfolio.projects).slice(0, 2);
  const experience = portfolio.timeline.filter((entry) => entry.type === "experience");
  const education = portfolio.timeline.filter((entry) => entry.type === "education");

  return (
    <div className="page-shell">
      <SiteHeader />
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="hero-kicker"><span className="status-dot" aria-hidden="true" /> Available for full-time, contract, and remote software roles</div>
            <p className="hero-identity">{profile.name}</p>
            <h1 id="hero-title">Full-stack web developer building systems teams use every day.</h1>
            <p className="hero-support">I build database-backed web applications with Laravel, Next.js, and SQL. At Central Luzon State University I delivered research information, monitoring, and e-library platforms—from requirements and database design through deployment.</p>
            <div className="hero-actions">
              <a className="hero-cta hero-cta-primary" href="#work">View selected work <ArrowDown size={16} aria-hidden="true" /></a>
              <a className="hero-cta hero-cta-secondary" href={profile.resumeUrl} download={profile.resumeFilename}>Download resume <span className="visually-hidden">(PDF)</span><Download size={16} aria-hidden="true" /></a>
              <a className="hero-cta hero-cta-secondary" href="#contact">Contact Ivan <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <div className="hero-proof-links"><p id="hero-projects-label">Selected projects:</p><ul aria-labelledby="hero-projects-label">{strongestProjects.map((project) => <li key={project.id}><a href={`#${projectAnchor(project)}`}>{projectSlug(project) === "crops-and-resources-rd-center" ? "CRRDC web platform" : projectDisplayTitle(project)}</a></li>)}</ul></div>
          </div>
          <aside className="hire-panel" aria-labelledby="glance-title">
            <h2 id="glance-title" className="hire-panel-label">At a glance</h2>
            <dl className="glance-list">
              {atAGlance.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
            <a href={`mailto:${profile.email}?subject=Opportunity%20for%20Ivan%20Salinas`}>Email Ivan <ArrowUpRight size={16} aria-hidden="true" /></a>
          </aside>
        </section>

        <section id="work" className="content-section" aria-labelledby="work-title">
          <SectionTitle id="work-title" eyebrow="01 / Selected work" title="Selected projects." />
          <SelectedWorkSection projects={portfolio.projects} />
        </section>

        <section id="about" className="content-section about-section" aria-labelledby="about-title">
          <SectionTitle id="about-title" eyebrow="02 / About and experience" title="Experience across software, research, and teaching." />
          <div className="about-grid">
            <div className="about-copy">
              <p className="about-lead">I turn research and operational needs into software teams can use every day.</p>
              <ul className="about-highlights">{aboutHighlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            </div>
            <div><h3 className="subsection-label">Professional experience</h3><ol className="timeline">{experience.map((entry) => <li className="timeline-item" key={entry.id}><p className="timeline-dates"><time dateTime={entry.start_date}>{entry.start_date}</time> — {entry.end_date ? <time dateTime={entry.end_date}>{entry.end_date}</time> : "Present"}</p><div><h4>{entry.role}</h4><p>{entry.organization}</p>{entry.description.includes("\n") ? <ul className="experience-highlights">{entry.description.split("\n").map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : <small>{entry.description}</small>}</div></li>)}</ol></div>
          </div>
        </section>

        <section id="research" className="content-section research-education-section" aria-labelledby="research-education-title">
          <SectionTitle id="research-education-title" eyebrow="03 / Research and education" title="Research and education." />
          <div className="research-education-grid">
            <div><h3 className="subsection-label">Research</h3><p className="research-intro">My published work explores research data systems and how people use technology.</p><ol className="publication-list">{research.map((publication) => <li key={publication.doi}><h4>{publication.title}</h4><p>Published {publication.published}</p><a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">View publication via DOI {publication.doi} <span className="visually-hidden">(opens in a new tab)</span><ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ol></div>
            <div><h3 className="subsection-label">Education</h3><ol className="timeline">{education.map((entry) => <li className="timeline-item" key={entry.id}><p className="timeline-dates"><time dateTime={entry.start_date}>{entry.start_date}</time> — {entry.end_date ? <time dateTime={entry.end_date}>{entry.end_date}</time> : "Present"}</p><div><h4>{entry.role}</h4><p>{entry.organization}</p></div></li>)}</ol></div>
          </div>
        </section>

        <CapabilitiesSection />

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <p className="contact-eyebrow">Available for full-time, contract, and remote software roles</p>
          <h2 id="contact-title">Let&apos;s discuss<br /><em>your next web role or project.</em></h2>
          <div className="contact-links">
            <a className="contact-link" href={`mailto:${profile.email}`}><Mail size={19} aria-hidden="true" /> {profile.email} <ArrowUpRight size={19} aria-hidden="true" /></a>
            <TrackedLink className="contact-link" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", linkKind: "linkedin_profile" }}><Linkedin size={19} aria-hidden="true" /> Connect on LinkedIn <span className="visually-hidden">(opens in a new tab)</span><ArrowUpRight size={19} aria-hidden="true" /></TrackedLink>
            <a className="contact-link" href={profile.resumeUrl} download={profile.resumeFilename}><Download size={19} aria-hidden="true" /> Download resume (PDF)</a>
          </div>
          <div className="social-row">
            <TrackedLink href={profile.githubUrl} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", linkKind: "github_profile" }}><Github size={17} aria-hidden="true" /> GitHub <span className="visually-hidden">(opens in a new tab)</span></TrackedLink>
            <p><MapPin size={17} aria-hidden="true" /> {profile.location}</p>
          </div>
        </section>
      </main>
      <footer><span>© 2026 {profile.name}</span><a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer">Built with Next.js · View source <span className="visually-hidden">(opens in a new tab)</span></a></footer>
    </div>
  );
}
