'use client';

import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MessageCircle, Send } from "lucide-react";
import { CapabilitiesSection } from "./capabilities-section";
import { smoothScrollToId } from "@/lib/smooth-scroll";
import type { Portfolio } from "@/lib/types";
import { buildTelegramLink, buildWhatsAppLink } from "@/lib/contact";
import { SiteHeader } from "./site-header";
import { SelectedWorkSection } from "./selected-work-section";
import { EngineeringEcosystemVisual } from "./engineering-ecosystem-visual";
import { motionTokens } from "@/lib/motion-tokens";

const PortfolioChatbot = dynamic(
  () => import("./chatbot").then((module) => module.PortfolioChatbot),
  { ssr: false },
);

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2></div>;
}

const aboutParagraphs = [
  "I build software that connects research, automation, and real-world operations. My work spans full-stack web development, AI-powered applications, workflow automation, and IoT systems, creating tools that solve practical problems rather than simply demonstrating technology.",
  "Over the past few years, I've developed production systems for government-funded research institutions, including content management systems, research information systems, real-time monitoring platforms, and smart agriculture solutions. I enjoy turning complex workflows into software that is reliable, intuitive, and scalable.",
  "Currently, I'm exploring AI agents, LLM applications, and intelligent automation to build systems that work alongside people instead of replacing them.",
];

function collectTopTechnologies(portfolio: Portfolio): string[] {
  const counts = new Map<string, number>();

  portfolio.projects.forEach((project) => {
    project.tech_stack.forEach((tech) => {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name]) => name);
}

export function PortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  const reduceMotion = useReducedMotion();
  const deployedProjects = portfolio.projects.filter((project) => Boolean(project.live_url));
  const featuredProjects = portfolio.projects.filter((project) => project.featured);
  const strongestProjects = (featuredProjects.length > 0 ? featuredProjects : portfolio.projects).slice(0, 2);
  const topTechnologies = collectTopTechnologies(portfolio);

  const revealInitial = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: motionTokens.distance.subtle };
  const revealAnimate = { opacity: 1, y: 0 };
  const revealTransition = {
    duration: motionTokens.duration.normal,
    ease: motionTokens.ease.standard,
  };

  return (
    <div className="page-shell">
      <SiteHeader />
      <main id="main-content">
        <PortfolioChatbot />
        <section className="hero" aria-labelledby="hero-title">
          <motion.div
            className="hero-content"
            initial={revealInitial}
            animate={revealAnimate}
            transition={{ ...revealTransition, delay: motionTokens.delay.short }}
          >
            <motion.div className="hero-kicker" initial={revealInitial} animate={revealAnimate} transition={{ ...revealTransition, delay: motionTokens.delay.short }}><span className="status-dot" /> Available for Remote Opportunities</motion.div>
            <motion.h1 id="hero-title" initial={revealInitial} animate={revealAnimate} transition={{ ...revealTransition, delay: motionTokens.delay.short + motionTokens.delay.staggerStep }}>Ivan Christian Salinas<br /><em>Full-Stack Software Engineer</em></motion.h1>
            <motion.p className="hero-support" initial={revealInitial} animate={revealAnimate} transition={{ ...revealTransition, delay: motionTokens.delay.short + motionTokens.delay.staggerStep * 2 }}>I specialize in production software for research and operational environments: full-stack web applications, backend APIs, data systems, AI automation workflows, and IoT-enabled monitoring solutions.</motion.p>

            <div className="hero-scan" aria-label="Recruiter quick scan">
              <motion.article initial={revealInitial} animate={revealAnimate} transition={{ ...revealTransition, delay: motionTokens.delay.short + motionTokens.delay.staggerStep * 3 }}>
                <p>What I specialize in</p>
                <h3>Full-stack systems, AI automation, and research platforms</h3>
              </motion.article>
              <motion.article initial={revealInitial} animate={revealAnimate} transition={{ ...revealTransition, delay: motionTokens.delay.short + motionTokens.delay.staggerStep * 4 }}>
                <p>What I have built</p>
                <h3>{deployedProjects.length} live public systems shown in selected work</h3>
              </motion.article>
              <motion.article initial={revealInitial} animate={revealAnimate} transition={{ ...revealTransition, delay: motionTokens.delay.short + motionTokens.delay.staggerStep * 5 }}>
                <p>Technologies in active project use</p>
                <h3>{topTechnologies.join(" • ")}</h3>
              </motion.article>
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
                  <a key={project.id} href={project.live_url ?? "#work"} target={project.live_url ? "_blank" : undefined} rel={project.live_url ? "noopener noreferrer" : undefined}>
                    {project.title}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
          <EngineeringEcosystemVisual portfolio={portfolio} />
        </section>

        <section className="disclosure-map" aria-label="How to read this portfolio quickly">
          <motion.article
            initial={revealInitial}
            whileInView={revealAnimate}
            viewport={{ once: true, amount: 0.35 }}
            transition={revealTransition}
          >
            <p>Level 1</p>
            <h3>Quick understanding</h3>
            <span>Hero + availability + strongest project links + resume and contact access.</span>
          </motion.article>
          <motion.article
            initial={revealInitial}
            whileInView={revealAnimate}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ ...revealTransition, delay: motionTokens.delay.staggerStep }}
          >
            <p>Level 2</p>
            <h3>Project summaries</h3>
            <span>Selected Work cards outline problem, solution, stack, and outcomes.</span>
          </motion.article>
          <motion.article
            initial={revealInitial}
            whileInView={revealAnimate}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ ...revealTransition, delay: motionTokens.delay.staggerStep * 2 }}
          >
            <p>Level 3</p>
            <h3>Detailed case studies</h3>
            <span>Open each case study for structured breakdown and technical context.</span>
          </motion.article>
          <motion.article
            initial={revealInitial}
            whileInView={revealAnimate}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ ...revealTransition, delay: motionTokens.delay.staggerStep * 3 }}
          >
            <p>Level 4</p>
            <h3>Implementation depth</h3>
            <span>Architecture details and evidence mapping in project and capability sections.</span>
          </motion.article>
        </section>

        <motion.section
          id="work"
          className="content-section"
          aria-labelledby="work-title"
          initial={revealInitial}
          whileInView={revealAnimate}
          viewport={{ once: true, amount: 0.2 }}
          transition={revealTransition}
        >
          <SectionTitle eyebrow="01 / Selected work (Level 2-4)" title="Systems I&apos;ve built and shipped." />
          <SelectedWorkSection projects={portfolio.projects} />
        </motion.section>

        <motion.section
          id="about"
          className="content-section about-section"
          aria-labelledby="about-title"
          initial={revealInitial}
          whileInView={revealAnimate}
          viewport={{ once: true, amount: 0.2 }}
          transition={revealTransition}
        >
          <SectionTitle eyebrow="02 / About and experience" title="Professional background with implementation context." />
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
        </motion.section>

        <CapabilitiesSection projects={portfolio.projects} timeline={portfolio.timeline} />

        <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="contact-eyebrow">Available for remote software roles and collaborations</p><h2 id="contact-title">Hire me for<br /><em>real systems delivery.</em></h2><div className="contact-links"><a className="contact-link" href="mailto:sardinexszc@gmail.com"><Mail size={19} /> sardinexszc@gmail.com <ArrowUpRight size={19} /></a><a className="contact-link" href="mailto:banbansalinas@gmail.com"><Mail size={19} /> banbansalinas@gmail.com <ArrowUpRight size={19} /></a><a className="contact-link" href="/files/2026_ICLSalinas_Resume.pdf" download="2026_ICLSalinas_Resume.pdf"><ArrowUpRight size={19} /> Download my resume (PDF)</a></div><div className="social-row"><a href={buildWhatsAppLink('+63 926 745 9456', 'Hi Ivan, I saw your portfolio and would like to discuss a project.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp</a><a href={buildTelegramLink('@Sardinexszc')} target="_blank" rel="noopener noreferrer"><Send size={17} /> Telegram</a><a href="https://github.com/sardinexszc" target="_blank" rel="noopener noreferrer"><Github size={17} /> GitHub</a><a href="https://www.linkedin.com/in/banbansalinas/" target="_blank" rel="noopener noreferrer"><Linkedin size={17} /> LinkedIn</a></div></section>
      </main>
      <footer><span>© 2026 Sardinexszc</span><span>Designed and built with care</span></footer>
    </div>
  );
}
