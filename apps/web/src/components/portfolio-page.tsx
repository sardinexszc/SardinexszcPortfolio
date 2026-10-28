import Image from "next/image";
import { ArrowDown, ArrowUpRight, Code2, Cpu, Database } from "lucide-react";
import type { Portfolio, Project } from "@/lib/types";
import { profile } from "@/lib/profile";
import { inferCategory, isAllowedImage, projectDisplayTitle, projectSlug } from "@/lib/work-projects";
import { ClipReveal, Parallax, ProjectLinks, Reveal, SiteMenu, Wordmark } from "./home-parts";
import { TechIcon } from "./tech-icon";
import { TrackedLink } from "./tracked-elements";
import "./portfolio-page.css";

const serviceIcons = { code: Code2, database: Database, cpu: Cpu };
// A plausible year only: "PH 12023050744, 2025" must give 2025, not 1202.
const firstYear = (text: string) => Number(text.match(/\b(?:19|20)\d{2}\b/)?.[0]) || null;
const ipStatus = (detail: string) => (/pending/i.test(detail) ? "Pending" : /published/i.test(detail) ? "Published" : "Registered");

// Tile picture: the screenshot, or a title card when there is none. The whole picture links to the
// live site (or the source when there is no live site) and shows a hint on hover.
function TileMedia({ project, title }: { project: Project; title: string }) {
  const media = isAllowedImage(project.image_url)
    ? <Image src={project.image_url!} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" />
    : <div className="pf-tile-card"><span>{inferCategory(project)}</span><strong>{title}</strong></div>;
  const href = project.live_url || project.github_url;
  if (!href) return <div className="pf-tile-media" aria-hidden="true">{media}</div>;
  const hint = project.live_url ? "View live" : "View source";
  return (
    <TrackedLink className="pf-tile-media" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${title}: ${hint.toLowerCase()} (opens in a new tab)`}
      event={{ type: "outbound_click", projectId: project.id, linkKind: project.live_url ? "live_project" : "github_repository" }}>
      {media}
      <span className="pf-tile-veil" aria-hidden="true"><span>{hint} <ArrowUpRight size={15} /></span></span>
    </TrackedLink>
  );
}

// The page says little on purpose; the résumé carries the detail. Shown once at the top and once at the end.
function ResumeButton() {
  return (
    <div className="pf-cta">
      <p>Want to know more about me?</p>
      <a className="pf-pill" href={profile.resumeUrl} download={profile.resumeFilename}>Download my résumé <ArrowDown size={15} aria-hidden="true" /></a>
    </div>
  );
}

function SocialLinks() {
  return (
    <>
      <li><TrackedLink href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", linkKind: "linkedin_profile" }}>LinkedIn<span className="visually-hidden"> (opens in a new tab)</span></TrackedLink></li>
      <li><TrackedLink href={profile.githubUrl} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", linkKind: "github_profile" }}>GitHub<span className="visually-hidden"> (opens in a new tab)</span></TrackedLink></li>
    </>
  );
}

function LabelRow({ id, title, aside }: { id: string; title: string; aside?: string }) {
  return <div className="pf-label-row"><h2 id={id}>{title}</h2>{aside ? <span>{aside}</span> : null}</div>;
}

export function PortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  const { settings: s, projects, timeline, publications, ipItems } = portfolio;
  // Facts are computed from the content, so they stay true as it changes.
  const startYears = timeline.filter((entry) => entry.type === "experience").map((entry) => firstYear(entry.start_date)).filter((year): year is number => year !== null);
  const since = startYears.length ? Math.min(...startYears) : null;
  const facts = [
    since ? { figure: `${new Date().getFullYear() - since}`, label: "Years building systems" } : null,
    { figure: `${projects.length}`, label: "Systems shipped" },
    { figure: `${publications.length}`, label: ipItems.length ? `Publications, plus ${ipItems.length} IP filings` : "Publications" },
    { figure: `${projects.filter((project) => project.live_url).length}`, label: "Live in production" },
  ].filter((fact) => fact !== null);
  const recognition = [
    ...publications.map((item) => ({ key: `p${item.id}`, year: firstYear(item.venue), venue: item.venue.replace(/,?\s*(?:19|20)\d{2}$/, ""), title: item.title, status: item.status as string, href: item.doi ? `https://doi.org/${item.doi}` : null, proof: "DOI" })),
    ...ipItems.map((item) => ({ key: `i${item.id}`, year: firstYear(item.detail), venue: "Intellectual property", title: item.title, status: ipStatus(item.detail), href: item.proof_url || null, proof: "official record" })),
  ];

  return (
    <div className="pf">
      {/* Column guides. Decorative; hidden on phones. */}
      <div className="pf-guides" aria-hidden="true"><span /><span /></div>

      <header className="pf-bar">
        <a className="pf-brand" href="#top" aria-label="Ivan Salinas, back to top"><span className="pf-mark" aria-hidden="true">I<span>S</span></span>Ivan Salinas</a>
        <SiteMenu>
          <ul>
            <li><a href="#practice">Practice</a></li>
            <li><a href="#disciplines">Disciplines</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#recognition">Recognition</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href={profile.resumeUrl} download={profile.resumeFilename}>Résumé</a></li>
            <SocialLinks />
          </ul>
        </SiteMenu>
      </header>

      <main id="main-content">
        <section id="top" className="pf-hero" aria-labelledby="pf-title">
          <h1 id="pf-title" className="visually-hidden">Ivan Salinas, {s.roleLine}</h1>
          <Wordmark text="Salinas" className="pf-word pf-word-hero" onLoad />
          {isAllowedImage(s.heroImage) ? (
            <ClipReveal className="pf-hero-tall" delay={0.25}><Parallax><Image src={s.heroImage} alt="Ivan Salinas by the sea" fill preload sizes="(max-width: 800px) 100vw, 33vw" /></Parallax></ClipReveal>
          ) : null}
          <ClipReveal className="pf-hero-small" delay={0.4}>
            {isAllowedImage(s.studioImage) ? <Image src={s.studioImage} alt="" fill sizes="(max-width: 800px) 100vw, 30vw" /> : (
              <div className="pf-practice-card">
                <span className="pf-mark" aria-hidden="true">I<span>S</span></span>
                <p><span>Independent software practice</span>Web, data &amp; IoT systems, built end to end.</p>
                <p className="pf-practice-meta">{since ? `Est. ${since} · ` : ""}Philippines · Remote</p>
              </div>
            )}
          </ClipReveal>
          <Reveal className="pf-hero-copy" delay={0.55}>
            <p className="pf-role">{s.roleLine}</p>
            <p>{s.aboutCardTitle}</p>
            <ResumeButton />
          </Reveal>
        </section>

        <section id="practice" className="pf-about" aria-labelledby="practice-title">
          <h2 id="practice-title" className="visually-hidden">Practice</h2>
          <div className="pf-about-photo">
            {isAllowedImage(s.portraitImage) ? <Parallax><Image src={s.portraitImage} alt="Ivan Salinas in formal attire" fill sizes="(max-width: 800px) 100vw, 66vw" /></Parallax> : null}
            <Wordmark text="Ivan" className="pf-word pf-word-about" />
          </div>
          <Reveal className="pf-about-side">
            <p className="pf-status"><span aria-hidden="true" />{s.statusLine}</p>
            <p>{s.heroIntro}</p>
          </Reveal>
          <Reveal className="pf-statement"><p>{s.aboutStatement}.</p></Reveal>
          <dl className="pf-facts">
            {facts.map((fact) => (
              <Reveal key={fact.label} className="pf-fact"><dt>{fact.label}</dt><dd>{fact.figure}</dd></Reveal>
            ))}
          </dl>
        </section>

        <section id="disciplines" className="pf-section" aria-labelledby="disciplines-title">
          <LabelRow id="disciplines-title" title="Disciplines" aside={`(${s.services.length})`} />
          <ol className="pf-disciplines">
            {s.services.map(({ icon, title, text }, i) => {
              const Icon = serviceIcons[icon] ?? Code2;
              return (
                <li key={title}>
                  <Reveal delay={i * 0.08}>
                    <span className="pf-index">{String(i + 1).padStart(2, "0")}</span>
                    <Icon size={20} aria-hidden="true" />
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
          {s.heroStack.length ? (
            <div className="pf-stack">
              <span>Everyday stack</span>
              <ul aria-label="Everyday stack">
                {s.heroStack.map((tech) => <li key={tech} title={tech}><TechIcon name={tech} size={20} /><span className="visually-hidden">{tech}</span></li>)}
              </ul>
            </div>
          ) : null}
        </section>

        <section id="work" className="pf-section" aria-labelledby="work-title">
          <LabelRow id="work-title" title="Selected work" aside={`(${projects.length})`} />
          <ul className="pf-tiles">
            {projects.map((project) => {
              const title = projectDisplayTitle(project);
              return (
                <li key={project.id} id={`project-${projectSlug(project)}`}>
                  <Reveal className="pf-tile">
                    <TileMedia project={project} title={title} />
                    <p className="pf-tile-kind">{inferCategory(project)}</p>
                    <h3>{title}</h3>
                    <ProjectLinks project={project} title={title} />
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </section>

        {s.institutions.length ? (
          <section className="pf-section" aria-labelledby="with-title">
            <LabelRow id="with-title" title="Worked with" />
            <Reveal><p className="pf-with">{s.institutions.map((name, i) => <span key={name}>{i ? <span aria-hidden="true"> / </span> : null}{name}</span>)}</p></Reveal>
          </section>
        ) : null}

        {recognition.length ? (
          <section id="recognition" className="pf-section" aria-labelledby="recognition-title">
            <LabelRow id="recognition-title" title="Recognition" aside={`(${recognition.length})`} />
            <ol className="pf-index-list">
              {recognition.map((item) => (
                <li key={item.key}>
                  <span className="pf-index-meta">{item.year ? `${item.year} · ` : ""}{item.venue}</span>
                  <h3>{item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer">{item.title} <ArrowUpRight size={15} aria-hidden="true" /><span className="visually-hidden"> ({item.proof}, opens in a new tab)</span></a> : item.title}</h3>
                  <span className="pf-index-status" data-status={item.status}>{item.status}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section id="contact" className="pf-contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="visually-hidden">Contact</h2>
          <Wordmark text="Let’s talk" className="pf-word pf-word-contact" />
          <div className="pf-contact-row">
            <div>
              <p>{s.contactLead}</p>
              <a className="pf-mail" href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
            <div className="pf-contact-side">
              <ResumeButton />
              <ul className="pf-socials"><SocialLinks /></ul>
            </div>
          </div>
          <footer className="pf-foot">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span>{profile.location}</span>
            <a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer">View source<span className="visually-hidden"> (opens in a new tab)</span></a>
          </footer>
        </section>
      </main>
    </div>
  );
}
