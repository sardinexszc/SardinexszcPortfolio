import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MessageCircle, Send } from "lucide-react";
import { CapabilitiesSection } from "./capabilities-section";
import { HeroScrambleText } from "./hero-scramble";
import type { Portfolio } from "@/lib/types";
import { buildTelegramLink, buildWhatsAppLink } from "@/lib/contact";
import { SiteHeader } from "./site-header";

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2></div>;
}

function getProjectDomain(url: string | null): string {
  if (!url) return "Private deployment";

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const aboutParagraphs = [
  "I build software that connects research, automation, and real-world operations. My work spans full-stack web development, AI-powered applications, workflow automation, and IoT systems, creating tools that solve practical problems rather than simply demonstrating technology.",
  "Over the past few years, I've developed production systems for government-funded research institutions, including content management systems, research information systems, real-time monitoring platforms, and smart agriculture solutions. I enjoy turning complex workflows into software that is reliable, intuitive, and scalable.",
  "Currently, I'm exploring AI agents, LLM applications, and intelligent automation to build systems that work alongside people instead of replacing them.",
];

export function PortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img src="/images/hero-photo.jpg" alt="Ivan Christian Salinas" className="hero-photo-mobile" />
          <div className="hero-kicker"><span className="status-dot" /> Available for Remote Opportunities</div>
          <HeroScrambleText>Building software that solves<br /><em>real-world problems.</em></HeroScrambleText>
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
                <div className="project-visual">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div className="browser-preview">
                    <div className="browser-chrome">
                      <div className="browser-dots"><i /><i /><i /></div>
                      <div className="browser-address">{getProjectDomain(project.live_url)}</div>
                    </div>
                    <div className="browser-body">
                      <div className="browser-badge">Live project</div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="browser-stack">
                        {project.tech_stack.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tag-row">{project.tech_stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
                {(project.live_url || project.github_url) ? <div className="project-links">{project.live_url ? <a href={project.live_url} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={16} /></a> : null}{project.github_url ? <a href={project.github_url} target="_blank" rel="noreferrer">Source <ArrowUpRight size={16} /></a> : null}</div> : null}
              </article>
            ))}
            <article className="project-card project-card-1">
              <div className="project-visual">
                <span>04</span>
                <div className="browser-preview">
                  <div className="browser-chrome">
                    <div className="browser-dots"><i /><i /><i /></div>
                    <div className="browser-address">linkedin.com/in/banbansalinas</div>
                  </div>
                  <div className="browser-body">
                    <div className="browser-badge">More projects</div>
                    <h3>See additional work on LinkedIn</h3>
                    <p>Visit my LinkedIn profile to explore more shipped projects, experience highlights, and ongoing work beyond the featured portfolio cards.</p>
                    <div className="browser-stack">
                      <span>LinkedIn</span>
                      <span>Case Studies</span>
                      <span>More Projects</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tag-row"><span>Professional Profile</span><span>Project Archive</span><span>Experience</span></div>
              <div className="project-links"><a href="https://www.linkedin.com/in/banbansalinas/" target="_blank" rel="noreferrer">View LinkedIn <ArrowUpRight size={16} /></a></div>
            </article>
          </div>
        </section>

        <section id="about" className="content-section about-section" aria-labelledby="about-title">
          <SectionTitle eyebrow="02 / About" title="Software shaped by real work." />
          <div className="about-grid">
            <div className="about-copy">
              <p className="about-lead">I design and build systems that make research, operations, and automation easier to run in the real world.</p>
              {aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="about-note">
                <span>Current focus</span>
                <p>AI agents, LLM-powered applications, workflow automation, and human-centered systems that scale without adding unnecessary complexity.</p>
              </div>
            </div>
            <div className="timeline">{portfolio.timeline.map((entry) => <div className="timeline-item" key={entry.id}><span>{entry.start_date} — {entry.end_date ?? "Present"}</span><div><h3>{entry.role}</h3><p>{entry.organization}</p><small>{entry.description}</small></div></div>)}</div>
          </div>
        </section>

        <CapabilitiesSection />

        <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="contact-eyebrow">Have a good problem?</p><h2 id="contact-title">Let&apos;s make<br /><em>something clear.</em></h2><div className="contact-links"><a className="contact-link" href="mailto:sardinexszc@gmail.com"><Mail size={19} /> sardinexszc@gmail.com <ArrowUpRight size={19} /></a><a className="contact-link" href="mailto:banbansalinas@gmail.com"><Mail size={19} /> banbansalinas@gmail.com <ArrowUpRight size={19} /></a></div><div className="social-row"><a href={buildWhatsAppLink('+63 926 745 9456', 'Hi Ivan, I saw your portfolio and would like to discuss a project.')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a><a href={buildTelegramLink('@Sardinexszc')} target="_blank" rel="noreferrer"><Send size={17} /> Telegram</a><a href="https://github.com/sardinexszc" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href="https://www.linkedin.com/in/banbansalinas/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a></div></section>
      </main>
      <footer><span>© 2026 Sardinexszc</span><span>Designed and built with care</span></footer>
    </div>
  );
}