import { ArrowDown, ArrowUpRight, Github, Mail } from "lucide-react";
import type { Portfolio } from "@/lib/types";
import { SiteHeader } from "./site-header";

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2></div>;
}

export function PortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-kicker"><span className="status-dot" /> Available for thoughtful work</div>
          <h1 id="hero-title">Digital products with<br /><em>room to breathe.</em></h1>
          <div className="hero-bottom">
            <p>I&apos;m Sardinexszc, a product designer and developer building clear, useful experiences for the web.</p>
            <a className="scroll-cue" href="#work">Scroll to explore <ArrowDown size={16} /></a>
          </div>
        </section>

        <section id="work" className="content-section" aria-labelledby="work-title">
          <SectionTitle eyebrow="01 / Selected work" title="A few things I&apos;ve made." />
          <div className="project-grid">
            {portfolio.projects.map((project, index) => (
              <article className={`project-card project-card-${index % 2}`} key={project.id}>
                <div className="project-visual"><span>{String(index + 1).padStart(2, "0")}</span><div className="visual-mark">{project.title.slice(0, 1)}</div></div>
                <div className="project-meta"><div><h3>{project.title}</h3><p>{project.description}</p></div><ArrowUpRight size={20} /></div>
                <div className="tag-row">{project.tech_stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="content-section about-section" aria-labelledby="about-title">
          <SectionTitle eyebrow="02 / About" title="Curious by default." />
          <div className="about-grid"><p className="about-lead">I care about the space between an idea and the moment it becomes useful. My work combines systems thinking, visual restraint, and a little stubbornness about the details.</p><div className="timeline">{portfolio.timeline.map((entry) => <div className="timeline-item" key={entry.id}><span>{entry.start_date} — {entry.end_date ?? "Now"}</span><div><h3>{entry.role}</h3><p>{entry.organization}</p><small>{entry.description}</small></div></div>)}</div></div>
        </section>

        <section className="content-section skills-section" aria-labelledby="skills-title"><SectionTitle eyebrow="03 / Capabilities" title="Useful from first sketch to final detail." /><div className="skills-grid">{portfolio.skills.map((skill) => <div className="skill" key={skill.id}><div className="skill-top"><span className="skill-icon">{skill.icon ?? "•"}</span><h3>{skill.name}</h3><span>{skill.proficiency}%</span></div><div className="skill-bar"><span style={{ width: `${skill.proficiency}%` }} /></div></div>)}</div></section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="contact-eyebrow">Have a good problem?</p><h2 id="contact-title">Let&apos;s make<br /><em>something clear.</em></h2><a className="contact-link" href="mailto:hello@example.com"><Mail size={19} /> hello@example.com <ArrowUpRight size={19} /></a><div className="social-row"><a href="https://github.com" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} /></a></div></section>
      </main>
      <footer><span>© 2026 Sardinexszc</span><span>Designed and built with care</span></footer>
    </div>
  );
}