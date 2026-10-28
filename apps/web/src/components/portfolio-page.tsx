import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Portfolio, Project } from "@/lib/types";
import { profile } from "@/lib/profile";
import { inferCategory, isAllowedImage, projectDisplayTitle, projectSlug } from "@/lib/work-projects";
import { ClipReveal, Parallax, ProjectLinks, Reveal, SiteMenu, Wordmark } from "./home-parts";
import { TrackedLink } from "./tracked-elements";
import "./portfolio-page.css";

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

// The page says little on purpose; the résumé carries the detail, so every section ends on it.
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

export function PortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  const { settings: s, projects } = portfolio;
  const featured = projects.find((project) => isAllowedImage(project.image_url));

  return (
    <div className="pf">
      {/* Column guides. Decorative; hidden on phones. */}
      <div className="pf-guides" aria-hidden="true"><span /><span /></div>

      <header className="pf-bar">
        <a className="pf-brand" href="#top" aria-label="Ivan Salinas, back to top"><span className="pf-mark" aria-hidden="true">I<span>S</span></span>Ivan Salinas</a>
        <SiteMenu>
          <ul>
            <li><a href="#work">Work</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href={profile.resumeUrl} download={profile.resumeFilename}>Résumé</a></li>
            <SocialLinks />
          </ul>
        </SiteMenu>
      </header>

      <main id="main-content">
        <section id="top" className="pf-hero" aria-labelledby="pf-title">
          <h1 id="pf-title" className="visually-hidden">Ivan Salinas, {profile.role}</h1>
          <Wordmark text="Salinas" className="pf-word pf-word-hero" onLoad />
          {isAllowedImage(s.heroImage) ? (
            <ClipReveal className="pf-hero-tall" delay={0.25}><Parallax><Image src={s.heroImage} alt="Ivan Salinas by the sea" fill preload sizes="(max-width: 800px) 100vw, 33vw" /></Parallax></ClipReveal>
          ) : null}
          {featured ? (
            <ClipReveal className="pf-hero-small" delay={0.4}>
              <a href="#work" aria-label={`Selected work, starting with ${projectDisplayTitle(featured)}`}>
                <Image src={featured.image_url!} alt="" fill sizes="(max-width: 800px) 100vw, 30vw" />
              </a>
            </ClipReveal>
          ) : null}
          <Reveal className="pf-hero-copy" delay={0.55}>
            <p>{s.aboutCardTitle}</p>
            <ResumeButton />
          </Reveal>
        </section>

        <section id="about" className="pf-about" aria-labelledby="about-title">
          <h2 id="about-title" className="visually-hidden">About</h2>
          <div className="pf-about-photo">
            {isAllowedImage(s.portraitImage) ? <Parallax><Image src={s.portraitImage} alt="Ivan Salinas in formal attire" fill sizes="(max-width: 800px) 100vw, 66vw" /></Parallax> : null}
            <Wordmark text="Ivan" className="pf-word pf-word-about" />
          </div>
          <Reveal className="pf-about-side">
            <p className="pf-status"><span aria-hidden="true" />{s.statusLine}</p>
            <p>{s.heroIntro}</p>
            <ResumeButton />
          </Reveal>
          <Reveal className="pf-statement"><p>{s.aboutStatement}.</p></Reveal>
        </section>

        <section id="work" className="pf-work" aria-labelledby="work-title">
          <div className="pf-label-row">
            <h2 id="work-title">Selected work</h2>
            <span>({projects.length})</span>
          </div>
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
            <span>© 2026 {profile.name}</span>
            <span>{profile.location}</span>
            <a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer">View source<span className="visually-hidden"> (opens in a new tab)</span></a>
          </footer>
        </section>
      </main>
    </div>
  );
}
