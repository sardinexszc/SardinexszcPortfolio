import Image from "next/image";
import { ArrowUpRight, Code2, Cpu, Database, Plus } from "lucide-react";
import type { Portfolio } from "@/lib/types";
import { profile } from "@/lib/profile";
import { isAllowedImage } from "@/lib/work-projects";
import { LocalTime, Reveal, RiseText, WorkGrid } from "./home-parts";
import { TechChip, TechIcon } from "./tech-icon";
import { TrackedLink } from "./tracked-elements";
import "./portfolio-page.css";

const serviceIcons = { code: Code2, database: Database, cpu: Cpu };
function SectionLabel({ label, index }: { label: string; index: string }) {
  return <div className="pf-label"><span>/ {label}</span><span>({index})</span></div>;
}

export function PortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  const experience = portfolio.timeline.filter((entry) => entry.type === "experience");
  const education = portfolio.timeline.filter((entry) => entry.type === "education");
  const { settings: s, publications, ipItems: intellectualProperty, capabilities } = portfolio;
  const coverProject = portfolio.projects.find((project) => isAllowedImage(project.image_url));
  const statusCounts = (["Published", "Accepted", "Under review"] as const)
    .map((status) => [status, publications.filter((publication) => publication.status === status).length] as const)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${count} ${status.toLowerCase()}`).join(", ");
  const featuredPublication = publications.find((publication) => publication.status === "Published") ?? publications[0];

  return (
    <div className="pf">
      <header className="pf-bar">
        <div className="pf-bar-id"><a href="#top">Ivan Salinas</a><LocalTime /></div>
        <nav aria-label="Primary">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href={profile.resumeUrl} download={profile.resumeFilename}>Resume</a>
          <a className="pf-pill" href={`mailto:${profile.email}`}>Hire me</a>
        </nav>
      </header>

      <main id="main-content">
        <section id="top" className="pf-hero" aria-labelledby="pf-title">
          <div className="pf-hero-head">
            <h1 id="pf-title"><RiseText text="Ivan Salinas" onLoad /><span className="pf-dot">.</span></h1>
            <Reveal delay={0.5}><p>{s.heroIntro}</p></Reveal>
          </div>
          <Reveal delay={0.65} className="pf-hero-row">
            <ul className="pf-stack" aria-label="Core stack">
              {s.heroStack.map((tech) => <li key={tech} title={tech}><TechIcon name={tech} size={22} /><span className="visually-hidden">{tech}</span></li>)}
            </ul>
            <p className="pf-status"><span className="pf-live" aria-hidden="true" /> {s.statusLine}<br /><span>{s.statusSub}</span></p>
          </Reveal>
          <Reveal delay={0.8} className="pf-hero-media">
            {isAllowedImage(s.heroImage) ? <Image src={s.heroImage} alt="Portrait of Ivan Salinas" fill preload sizes="100vw" /> : null}
          </Reveal>
        </section>

        <section id="about" className="pf-section" aria-labelledby="pf-about-title">
          <SectionLabel label="About" index="01" />
          <h2 id="pf-about-title" className="pf-statement"><RiseText text={s.aboutStatement} /> <span><RiseText text={s.aboutStatementMuted} delay={0.3} /></span></h2>
          <div className="pf-bento">
            <Reveal className="pf-col">
              <div className="pf-card pf-card-image">
                {coverProject?.image_url ? <Image src={coverProject.image_url} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" /> : null}
                <p className="pf-card-title">{s.aboutCardTitle}</p>
                <div className="pf-card-foot"><span>© 2026</span><a className="pf-chip" href="#contact">Get in touch <Plus size={13} aria-hidden="true" /></a></div>
              </div>
              <ul className="pf-card pf-list">{s.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
            </Reveal>
            <Reveal delay={0.1} className="pf-card pf-card-soft">
              <div>
                <p className="pf-big">{publications.length} <span>publications · {statusCounts}</span></p>
                {s.patentNote ? <p className="pf-big-sub">{s.patentNote}</p> : null}
              </div>
              {featuredPublication ? <div className="pf-quote">
                <p>&ldquo;{featuredPublication.title}&rdquo;</p>
                <span>{featuredPublication.venue}</span>
              </div> : null}
            </Reveal>
            <Reveal delay={0.2} className="pf-col">
              {s.services.map(({ icon, title, text }) => {
                const Icon = serviceIcons[icon] ?? Code2;
                return <div className="pf-card pf-service" key={title}><Icon size={18} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>;
              })}
            </Reveal>
            <Reveal delay={0.3} className="pf-card pf-card-dark">
              {isAllowedImage(s.portraitImage) ? <Image src={s.portraitImage} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" /> : null}
              <span className="pf-card-mark">IS</span>
              <p className="pf-card-title">{s.portraitTitle}<span>{s.portraitSub}</span></p>
            </Reveal>
          </div>
        </section>

        <section id="work" className="pf-section" aria-labelledby="pf-work-title">
          <div className="pf-display-head">
            <h2 id="pf-work-title" className="pf-display"><RiseText text="Projects" /><span className="pf-dot">.</span></h2>
            <p>{s.projectsIntro}</p>
          </div>
          <WorkGrid projects={portfolio.projects} />
        </section>

        <section id="capabilities" className="pf-section" aria-labelledby="pf-caps-title">
          <SectionLabel label="Capabilities" index="02" />
          <h2 id="pf-caps-title" className="pf-statement"><RiseText text={s.capabilitiesStatement} /> <span><RiseText text={s.capabilitiesStatementMuted} delay={0.2} /></span></h2>
          <Reveal>
            <ul className="pf-caps">
              {capabilities.map((group) => (
                <li key={group.id}>
                  <h3>{group.title}</h3>
                  <div className="pf-chips">{group.tools.map((tool) => <TechChip key={tool} name={tool} />)}</div>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className="pf-section" aria-labelledby="pf-exp-title">
          <Reveal className="pf-dark-panel">
            <SectionLabel label="Experience" index="03" />
            <h2 id="pf-exp-title" className="visually-hidden">Experience and education</h2>
            <ol className="pf-timeline">
              {experience.map((entry) => (
                <li key={entry.id}>
                  <h3>{entry.role}</h3>
                  <p>{entry.organization} · {entry.start_date} – {entry.end_date ?? "Present"}</p>
                  {entry.description ? <ul>{entry.description.split("\n").map((line) => <li key={line}>{line}</li>)}</ul> : null}
                </li>
              ))}
            </ol>
            <h3 className="pf-sub">Education</h3>
            <ol className="pf-timeline pf-timeline-compact">
              {education.map((entry) => (
                <li key={entry.id}>
                  <h3>{entry.role}</h3>
                  <p>{entry.organization} · {entry.start_date} – {entry.end_date ?? "Present"}</p>
                  {entry.description ? <p className="pf-note">{entry.description}</p> : null}
                </li>
              ))}
            </ol>
            <h3 className="pf-sub">Training</h3>
            <p className="pf-note">{s.training}</p>
          </Reveal>
        </section>

        <section id="research" className="pf-section" aria-labelledby="pf-research-title">
          <SectionLabel label="Research & IP" index="04" />
          <h2 id="pf-research-title" className="pf-statement"><RiseText text={s.researchStatement} /> <span><RiseText text={s.researchStatementMuted} delay={0.25} /></span></h2>
          <ol className="pf-pubs">
            {publications.map((publication) => (
              <li key={publication.id}>
                <div><h3>{publication.title}</h3><p className="pf-pub-venue">{publication.venue}</p></div>
                <span className="pf-status-tag" data-status={publication.status}>{publication.status}</span>
                {publication.doi ? <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">DOI <ArrowUpRight size={14} aria-hidden="true" /><span className="visually-hidden">{publication.doi} (opens in a new tab)</span></a> : <span aria-hidden="true" />}
              </li>
            ))}
          </ol>
          <h3 className="pf-sub pf-sub-light">Intellectual property</h3>
          <ul className="pf-pubs pf-ip">
            {intellectualProperty.map((item) => (
              <li key={item.id}><div><h3>{item.title}</h3><p className="pf-pub-venue">{item.detail}</p></div></li>
            ))}
          </ul>
        </section>
      </main>

      <footer id="contact" className="pf-footer">
        <div className="pf-footer-top">
          <div>
            <p>{s.contactLead} <strong>{s.contactStrong}</strong></p>
            <a className="pf-footer-mail" href={`mailto:${profile.email}`}>{profile.email}</a>
            <p className="pf-footer-loc">{profile.location}</p>
          </div>
          <ul>
            <li><TrackedLink href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", linkKind: "linkedin_profile" }}>LinkedIn<span className="visually-hidden"> (opens in a new tab)</span></TrackedLink></li>
            <li><TrackedLink href={profile.githubUrl} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", linkKind: "github_profile" }}>GitHub<span className="visually-hidden"> (opens in a new tab)</span></TrackedLink></li>
            <li><a href={profile.resumeUrl} download={profile.resumeFilename}>Resume (PDF)</a></li>
          </ul>
        </div>
        <p className="pf-wordmark" aria-hidden="true"><RiseText text="Ivan Salinas" /></p>
        <div className="pf-footer-base"><span>© 2026 {profile.name}</span><a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer">Built with Next.js · View source<span className="visually-hidden"> (opens in a new tab)</span></a></div>
      </footer>
    </div>
  );
}
