import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MessageCircle, Send } from "lucide-react";
import type { Portfolio } from "@/lib/types";
import { buildTelegramLink, buildWhatsAppLink } from "@/lib/contact";
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
          <div className="hero-kicker"><span className="status-dot" /> Available for Remote Opportunities</div>
          <h1 id="hero-title">Building software that solves<br /><em>real-world problems.</em></h1>
          <div className="hero-bottom">
            <p>I&apos;m Ivan Christian Salinas, a Full Stack Software Engineer specializing in web applications, AI automation, and business process digitalization.</p>
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

        <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="contact-eyebrow">Have a good problem?</p><h2 id="contact-title">Let&apos;s make<br /><em>something clear.</em></h2><div className="contact-links"><a className="contact-link" href="mailto:sardinexszc@gmail.com"><Mail size={19} /> sardinexszc@gmail.com <ArrowUpRight size={19} /></a><a className="contact-link" href="mailto:banbansalinas@gmail.com"><Mail size={19} /> banbansalinas@gmail.com <ArrowUpRight size={19} /></a></div><div className="social-row"><a href={buildWhatsAppLink('+63 926 745 9456', 'Hi Ivan, I saw your portfolio and would like to discuss a project.')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a><a href={buildTelegramLink('@Sardinexszc')} target="_blank" rel="noreferrer"><Send size={17} /> Telegram</a><a href="https://github.com/sardinexszc" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href="https://www.linkedin.com/in/banbansalinas/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a></div></section>
      </main>
      <footer><span>© 2026 Sardinexszc</span><span>Designed and built with care</span></footer>
    </div>
  );
}