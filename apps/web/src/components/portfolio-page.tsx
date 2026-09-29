'use client';

import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { smoothScrollToId } from "@/lib/smooth-scroll";
import type { Portfolio } from "@/lib/types";
import { CapabilitiesSection } from "./capabilities-section";
import { SelectedWorkSection } from "./selected-work-section";
import { SiteHeader } from "./site-header";
import { ResumeDownloadLink } from "./resume-download-link";
import { trackEngagement } from "@/lib/track-engagement";
import { projectDisplayTitle, projectSlug } from "@/lib/work-projects";

function SectionTitle({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return <div className="section-title"><span>{eyebrow}</span><h2 id={id}>{title}</h2></div>;
}

const aboutHighlights = [
  "Build research and institutional web systems, from requirements to deployment.",
  "Lead small teams and work directly with researchers and administrators.",
  "Bring experience in teaching, published research, and government-funded projects.",
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
            <div className="hero-kicker"><span className="status-dot" /> Available for full-time, contract, and remote software roles</div>
            <p className="hero-identity">Ivan Christian L. Salinas</p>
            <h1 id="hero-title">Full-stack engineer for research and institutional systems.</h1>
            <p className="hero-support">I build web applications, monitoring tools, and workflow automation for research teams—from requirements through deployment.</p>
            <div className="hero-actions">
              <a className="hero-cta hero-cta-primary" href="#work" onClick={(event) => { event.preventDefault(); smoothScrollToId("work"); }}>View selected work <ArrowDown size={16} /></a>
              <ResumeDownloadLink className="hero-cta hero-cta-secondary">Download resume <ArrowUpRight size={16} /></ResumeDownloadLink>
              <a className="hero-cta hero-cta-secondary" href="#contact" onClick={(event) => { event.preventDefault(); smoothScrollToId("contact"); }}>Contact Ivan <ArrowUpRight size={16} /></a>
            </div>
            <div className="hero-proof-links" aria-label="Selected project shortcuts"><p>Selected projects:</p><div>{strongestProjects.map((project) => <a key={project.id} href="#work">{projectSlug(project) === "crops-and-resources-rd-center" ? "CRRDC web platform" : projectDisplayTitle(project)}</a>)}</div></div>
          </div>
          <aside className="hire-panel" aria-label="Engineering capabilities">
            <p className="hire-panel-label">Work focus</p>
            <ol>
              <li><span>01</span><div><strong>Systems</strong><p>Web applications and databases built for daily use.</p></div></li>
              <li><span>02</span><div><strong>Research</strong><p>Project records, reporting, and monitoring.</p></div></li>
              <li><span>03</span><div><strong>Automation</strong><p>Connected tools that reduce manual work.</p></div></li>
            </ol>
            <a href="mailto:banbansalinas@gmail.com?subject=Opportunity%20for%20Ivan%20Salinas">Discuss a project <ArrowUpRight size={16} /></a>
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
            <div><p className="subsection-label">Professional experience</p><ol className="timeline">{experience.map((entry) => <li className="timeline-item" key={entry.id}><time dateTime={entry.start_date}>{entry.start_date} — {entry.end_date ?? "Present"}</time><div><h3>{entry.role}</h3><p>{entry.organization}</p>{entry.description.includes("\n") ? <ul className="experience-highlights">{entry.description.split("\n").map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : <small>{entry.description}</small>}</div></li>)}</ol></div>
          </div>
        </section>

        <section className="content-section research-education-section" aria-labelledby="research-education-title">
          <SectionTitle id="research-education-title" eyebrow="03 / Research and education" title="Research and education." />
          <div className="research-education-grid">
            <div><p className="subsection-label">Research</p><p className="research-intro">My published work explores research data systems and how people use technology.</p><ol className="publication-list">{research.map((publication) => <li key={publication.doi}><h3>{publication.title}</h3><p>Published {publication.published}</p><a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">View publication via DOI {publication.doi} <ArrowUpRight size={15} /></a></li>)}</ol></div>
            <div><p className="subsection-label">Education</p><ol className="timeline">{education.map((entry) => <li className="timeline-item" key={entry.id}><time dateTime={entry.start_date}>{entry.start_date} — {entry.end_date ?? "Present"}</time><div><h3>{entry.role}</h3><p>{entry.organization}</p></div></li>)}</ol></div>
          </div>
        </section>

        <CapabilitiesSection />

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <p className="contact-eyebrow">Available for remote software roles and collaborations</p>
          <h2 id="contact-title">Let&apos;s discuss<br /><em>research systems and software work.</em></h2>
          <div className="contact-links"><a className="contact-link" href="mailto:banbansalinas@gmail.com"><Mail size={19} /> banbansalinas@gmail.com <ArrowUpRight size={19} /></a><ResumeDownloadLink className="contact-link"><ArrowUpRight size={19} /> Download resume (PDF)</ResumeDownloadLink></div>
          <div className="social-row"><a href="https://github.com/sardinexszc" target="_blank" rel="noopener noreferrer" onClick={() => trackEngagement({ type: "outbound_click", linkKind: "github_profile" })}><Github size={17} /> GitHub</a><a href="https://www.linkedin.com/in/banbansalinas/" target="_blank" rel="noopener noreferrer" onClick={() => trackEngagement({ type: "outbound_click", linkKind: "linkedin_profile" })}><Linkedin size={17} /> LinkedIn</a></div>
        </section>
      </main>
      <footer><span>© 2026 Ivan Christian L. Salinas</span><span>Designed and built with care</span></footer>
    </div>
  );
}
