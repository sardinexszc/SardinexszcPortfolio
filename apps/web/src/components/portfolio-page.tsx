import Image from "next/image";
import { ArrowDown, Menu } from "lucide-react";
import type { Portfolio, Project } from "@/lib/types";
import { profile } from "@/lib/profile";
import { inferCategory, isAllowedImage, projectDisplayTitle, projectSlug } from "@/lib/work-projects";
import { ProjectLinks, Reveal, Wordmark } from "./home-parts";
import { TrackedLink } from "./tracked-elements";
import "./portfolio-page.css";

const PLACEHOLDER = "/images/placeholder/project.svg";
const projectImage = (project: Project) => (isAllowedImage(project.image_url) ? project.image_url! : PLACEHOLDER);

// The page says little on purpose; the résumé carries the detail, so every section ends on it.
function ResumeButton() {
  return <a className="pf-pill" href={profile.resumeUrl} download={profile.resumeFilename}>Download résumé <ArrowDown size={15} aria-hidden="true" /></a>;
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
        <details className="pf-menu">
          <summary aria-label="Menu"><Menu size={18} aria-hidden="true" /></summary>
          <nav aria-label="Main">
            <ul>
              <li><a href="#work">Work</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href={profile.resumeUrl} download={profile.resumeFilename}>Résumé</a></li>
              <SocialLinks />
            </ul>
          </nav>
        </details>
      </header>

      <main id="main-content">
        <section id="top" className="pf-hero" aria-labelledby="pf-title">
          <h1 id="pf-title" className="visually-hidden">Ivan Salinas, {profile.role}</h1>
          <Wordmark text="Salinas" className="pf-word pf-word-hero" onLoad />
          {isAllowedImage(s.heroImage) ? (
            <div className="pf-hero-tall"><Image src={s.heroImage} alt="Ivan Salinas by the sea" fill preload sizes="(max-width: 800px) 100vw, 33vw" /></div>
          ) : null}
          {featured ? (
            <a className="pf-hero-small" href="#work" aria-label={`Selected work, starting with ${projectDisplayTitle(featured)}`}>
              <Image src={projectImage(featured)} alt="" fill sizes="(max-width: 800px) 100vw, 30vw" />
            </a>
          ) : null}
          <div className="pf-hero-copy">
            <ResumeButton />
            <p>{s.aboutCardTitle}</p>
          </div>
        </section>

        <section id="about" className="pf-about" aria-labelledby="about-title">
          <h2 id="about-title" className="visually-hidden">About</h2>
          <div className="pf-about-photo">
            {isAllowedImage(s.portraitImage) ? <Image src={s.portraitImage} alt="Ivan Salinas in formal attire" fill sizes="(max-width: 800px) 100vw, 66vw" /> : null}
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
              const image = projectImage(project);
              return (
                <li key={project.id} id={`project-${projectSlug(project)}`}>
                  <Reveal>
                    <div className="pf-tile-media"><Image src={image} alt={`${title} screenshot`} fill sizes="(max-width: 800px) 100vw, 33vw" unoptimized={image.endsWith(".svg")} /></div>
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
