'use client';

import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { CapabilitiesSection } from "./capabilities-section";
import { smoothScrollToId } from "@/lib/smooth-scroll";
import type { Portfolio } from "@/lib/types";
import { SiteHeader } from "./site-header";
import { PortfolioChatbot } from "./chatbot";
import { SelectedWorkSection } from "./selected-work-section";
import { projectSlug } from "@/lib/work-projects";

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2></div>;
}

const aboutParagraphs = [
  "I am a full-stack developer with experience building institutional web applications, research information systems, and automation workflows. My work covers requirements analysis, database design, frontend and backend development, integrations, deployment, and maintenance.",
  "My current focus is combining reliable web engineering with AI and workflow automation to reduce repetitive work and improve access to organizational information.",
];

const coreTechnologies = ["Next.js", "React", "TypeScript", "Laravel", "PostgreSQL", "Supabase", "n8n"];

export function PortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  const featuredProjects = portfolio.projects.filter((project) => project.featured);
  const strongestProjects = (featuredProjects.length > 0 ? featuredProjects : portfolio.projects).slice(0, 2);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main id="main-content">
        <PortfolioChatbot />
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="hero-kicker"><span className="status-dot" /> Open to remote full-time and contract work</div>
            <p className="hero-identity">Ivan Christian L. Salinas</p>
            <h1 id="hero-title">Full-Stack Developer &amp; <em>AI Automation Specialist</em></h1>
            <p className="hero-support">I&apos;m Ivan, a full-stack developer and AI automation specialist from the Philippines. I build secure web platforms, APIs, data systems, and automations for teams that have outgrown spreadsheets and manual work.</p>

            <div className="hero-scan" aria-label="Recruiter quick scan">
              <article>
                <p>Best fit</p>
                <h3>Full-Stack Developer · AI Automation Specialist</h3>
              </article>
              <article>
                <p>Delivery experience</p>
                <h3>Requirements to deployment — including architecture, databases, integrations, and support</h3>
              </article>
              <article>
                <p>Technologies in active project use</p>
                <h3>{coreTechnologies.join(" • ")}</h3>
              </article>
            </div>

            <div className="hero-actions">
              <a className="hero-cta hero-cta-primary" href="#work" onClick={(e) => { e.preventDefault(); smoothScrollToId('work'); }}>View My Work <ArrowDown size={16} /></a>
              <a className="hero-cta hero-cta-secondary" href="/files/2026_ICLSalinas_Resume.pdf" download="2026_ICLSalinas_Resume.pdf">Download Resume <ArrowUpRight size={16} /></a>
              <a className="hero-cta hero-cta-secondary" href="#contact" onClick={(e) => { e.preventDefault(); smoothScrollToId('contact'); }}>Contact Ivan <ArrowUpRight size={16} /></a>
            </div>

            <div className="hero-proof-links" aria-label="Strongest project shortcuts">
              <p>Strongest projects:</p>
              <div>
                {strongestProjects.map((project) => (
                  <a key={project.id} href={`/work/${projectSlug(project)}`}>
                    {project.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <aside className="hire-panel" aria-label="Reasons to hire Ivan">
            <p className="hire-panel-label">What I bring to a team</p>
            <ol>
              <li><span>01</span><div><strong>Ownership</strong><p>I can take a system from requirements and data modeling through deployment.</p></div></li>
              <li><span>02</span><div><strong>Operational thinking</strong><p>I build around the people, approvals, records, and reporting behind the interface.</p></div></li>
              <li><span>03</span><div><strong>Practical AI</strong><p>I use LLMs and n8n where they reduce real work—not as decoration.</p></div></li>
            </ol>
            <a href="mailto:banbansalinas@gmail.com?subject=Opportunity%20for%20Ivan%20Salinas">Discuss an opportunity <ArrowUpRight size={16} /></a>
          </aside>
        </section>

        <section id="work" className="content-section" aria-labelledby="work-title">
          <SectionTitle eyebrow="01 / Selected work" title="Real systems for real organizations." />
          <SelectedWorkSection projects={portfolio.projects} />
        </section>

        <section id="about" className="content-section about-section" aria-labelledby="about-title">
          <SectionTitle eyebrow="02 / About and experience" title="A developer who understands the operation behind the software." />
          <div className="about-grid">
            <div className="about-copy">
              <p className="about-lead">I design and build systems that make research, operations, and automation easier to run in the real world.</p>
              {aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="about-note">
                <span>Current focus</span>
                <p>AI agents, LLM-powered applications, workflow automation, and human-centered systems that scale without adding unnecessary complexity.</p>
              </div>
            </div>
            <ol className="timeline">{portfolio.timeline.map((entry) => <li className="timeline-item" key={entry.id}><time dateTime={entry.start_date}>{entry.start_date} — {entry.end_date ?? "Present"}</time><div><h3>{entry.role}</h3><p>{entry.organization}</p><small>{entry.description}</small></div></li>)}</ol>
          </div>
        </section>

        <CapabilitiesSection projects={portfolio.projects} timeline={portfolio.timeline} />

        <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="contact-eyebrow">Available for remote software roles and collaborations</p><h2 id="contact-title">Hire me for<br /><em>real systems delivery.</em></h2><div className="contact-links"><a className="contact-link" href="mailto:banbansalinas@gmail.com"><Mail size={19} /> banbansalinas@gmail.com <ArrowUpRight size={19} /></a><a className="contact-link" href="/files/2026_ICLSalinas_Resume.pdf" download="2026_ICLSalinas_Resume.pdf"><ArrowUpRight size={19} /> Download my resume (PDF)</a></div><div className="social-row"><a href="https://github.com/sardinexszc" target="_blank" rel="noopener noreferrer"><Github size={17} /> GitHub</a><a href="https://www.linkedin.com/in/banbansalinas/" target="_blank" rel="noopener noreferrer"><Linkedin size={17} /> LinkedIn</a></div></section>
      </main>
      <footer><span>© 2026 Ivan Christian L. Salinas</span><span>Designed and built with care</span></footer>
    </div>
  );
}
