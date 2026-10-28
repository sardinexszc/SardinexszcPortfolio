import Image from "next/image";
import { ArrowUpRight, Code2, Cpu, Database } from "lucide-react";
import type { Portfolio } from "@/lib/types";
import { profile } from "@/lib/profile";
import { isAllowedImage } from "@/lib/work-projects";
import { ChapterNav, ProjectSpreads, Reveal, RiseText } from "./home-parts";
import { TechChip, TechIcon } from "./tech-icon";
import { TrackedLink } from "./tracked-elements";
import "./portfolio-page.css";

const serviceIcons = { code: Code2, database: Database, cpu: Cpu };
const chapters = [
  { id: "profile", label: "Profile" },
  { id: "systems", label: "Systems" },
  { id: "toolkit", label: "Toolkit" },
  { id: "career", label: "Career" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];
const ordinals = ["one", "two", "three", "four", "five", "six"];

function ChapterHead({ index }: { index: number }) {
  return (
    <div className="pf-chapter-head">
      <span className="pf-chapter-num">Chapter {ordinals[index]}</span>
      <h2 id={`${chapters[index].id}-title`}>{chapters[index].label}</h2>
    </div>
  );
}

const dates = (start: string, end: string | null) => `${start} – ${end ?? "Present"}`;

export function PortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  const experience = portfolio.timeline.filter((entry) => entry.type === "experience");
  const education = portfolio.timeline.filter((entry) => entry.type === "education");
  const { settings: s, publications, ipItems: intellectualProperty, capabilities } = portfolio;
  const statusCounts = (["Published", "Accepted", "Under review"] as const)
    .map((status) => [status, publications.filter((publication) => publication.status === status).length] as const)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${count} ${status.toLowerCase()}`).join(", ");
  const featuredPublication = publications.find((publication) => publication.status === "Published") ?? publications[0];

  return (
    <div className="pf">
      <header className="pf-side">
        <div className="pf-side-photo">
          {isAllowedImage(s.heroImage) ? <Image src={s.heroImage} alt="Portrait of Ivan Salinas" fill preload sizes="(max-width: 1000px) 100vw, 40vw" /> : null}        </div>
        <div className="pf-side-body">
          <h1 id="pf-title">Ivan Salinas</h1>
          <p className="pf-tagline">{s.aboutCardTitle}</p>
          <p className="pf-availability"><span className="pf-live" aria-hidden="true" />{s.statusLine}<span>{s.statusSub}</span></p>
          <ChapterNav chapters={chapters} />
          <ul className="pf-side-links">
            <li><a href={`mailto:${profile.email}`}>Email</a></li>
            <li><a href={profile.resumeUrl} download={profile.resumeFilename}>Resume</a></li>
            <li><TrackedLink href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", linkKind: "linkedin_profile" }}>LinkedIn<span className="visually-hidden"> (opens in a new tab)</span></TrackedLink></li>
            <li><TrackedLink href={profile.githubUrl} target="_blank" rel="noopener noreferrer" event={{ type: "outbound_click", linkKind: "github_profile" }}>GitHub<span className="visually-hidden"> (opens in a new tab)</span></TrackedLink></li>
          </ul>
        </div>
      </header>

      <main id="main-content" className="pf-main">
        <section id="profile" className="pf-chapter" aria-labelledby="profile-title">
          <ChapterHead index={0} />
          <p className="pf-pull"><RiseText text={[s.aboutStatement, s.aboutStatementMuted].filter(Boolean).join(" ")} onLoad /></p>
          <Reveal className="pf-profile">
            <div>
              <p className="pf-lede">{s.heroIntro}</p>
              <ol className="pf-strengths">{s.strengths.map((item) => <li key={item}>{item}</li>)}</ol>
            </div>
            <aside className="pf-margin" aria-label="Research at a glance">
              <p className="pf-margin-figure">{publications.length}</p>
              <p>publications{statusCounts ? `: ${statusCounts}` : ""}</p>
              {s.patentNote ? <p>{s.patentNote}</p> : null}
              {featuredPublication ? <p className="pf-margin-cite">“{featuredPublication.title}”, <em>{featuredPublication.venue}</em></p> : null}
            </aside>
          </Reveal>
        </section>

        <section id="systems" className="pf-chapter" aria-labelledby="systems-title">
          <ChapterHead index={1} />
          <Reveal><p className="pf-lede pf-lede-wide">{s.projectsIntro}</p></Reveal>
          <ProjectSpreads projects={portfolio.projects} />
        </section>

        <section id="toolkit" className="pf-chapter" aria-labelledby="toolkit-title">
          <ChapterHead index={2} />
          <p className="pf-pull"><RiseText text={[s.capabilitiesStatement, s.capabilitiesStatementMuted].filter(Boolean).join(" ")} /></p>
          <Reveal className="pf-services">
            {s.services.map(({ icon, title, text }) => {
              const Icon = serviceIcons[icon] ?? Code2;
              return <div key={title}><Icon size={18} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>;
            })}
          </Reveal>
          <Reveal>
            <dl className="pf-caps">
              {capabilities.map((group) => (
                <div key={group.id}>
                  <dt>{group.title}</dt>
                  <dd>{group.tools.map((tool) => <TechChip key={tool} name={tool} />)}</dd>
                </div>
              ))}
            </dl>
            <div className="pf-everyday">
              <span>Everyday stack</span>
              <ul aria-label="Everyday stack">
                {s.heroStack.map((tech) => <li key={tech} title={tech}><TechIcon name={tech} size={20} /><span className="visually-hidden">{tech}</span></li>)}
              </ul>
            </div>
          </Reveal>
        </section>

        <section id="career" className="pf-chapter" aria-labelledby="career-title">
          <ChapterHead index={3} />
          <Reveal>
            <ol className="pf-career">
              {experience.map((entry) => (
                <li key={entry.id}>
                  <p className="pf-career-dates">{dates(entry.start_date, entry.end_date)}</p>
                  <div>
                    <h3>{entry.role}</h3>
                    <p className="pf-career-org">{entry.organization}</p>
                    {entry.description ? <ul>{entry.description.split("\n").map((line) => <li key={line}>{line}</li>)}</ul> : null}
                  </div>
                </li>
              ))}
            </ol>
            <h3 className="pf-subhead">Education</h3>
            <ol className="pf-career">
              {education.map((entry) => (
                <li key={entry.id}>
                  <p className="pf-career-dates">{dates(entry.start_date, entry.end_date)}</p>
                  <div>
                    <h3>{entry.role}</h3>
                    <p className="pf-career-org">{entry.organization}</p>
                    {entry.description ? <p className="pf-note">{entry.description}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
            {s.training ? <p className="pf-footnote"><span>Training.</span> {s.training}</p> : null}
          </Reveal>
        </section>

        <section id="research" className="pf-chapter" aria-labelledby="research-title">
          <ChapterHead index={4} />
          <p className="pf-pull"><RiseText text={[s.researchStatement, s.researchStatementMuted].filter(Boolean).join(" ")} /></p>
          <Reveal>
            <ol className="pf-citations">
              {publications.map((publication, i) => (
                <li key={publication.id}>
                  <span className="pf-cite-num" aria-hidden="true">[{i + 1}]</span>
                  <div>
                    <h3>{publication.title}</h3>
                    <p><em>{publication.venue}</em> · <span className="pf-status" data-status={publication.status}>{publication.status}</span></p>
                  </div>
                  {publication.doi ? <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">DOI <ArrowUpRight size={14} aria-hidden="true" /><span className="visually-hidden">{publication.doi} (opens in a new tab)</span></a> : <span aria-hidden="true" />}
                </li>
              ))}
            </ol>
            {intellectualProperty.length ? <>
              <h3 className="pf-subhead">Intellectual property</h3>
              <ul className="pf-ip">
                {intellectualProperty.map((item) => <li key={item.id}><h4>{item.title}</h4><p>{item.detail}</p></li>)}
              </ul>
            </> : null}
          </Reveal>
        </section>

        <section id="contact" className="pf-chapter pf-colophon" aria-labelledby="contact-title">
          <ChapterHead index={5} />
          <Reveal className="pf-contact">
            <div>
              <p className="pf-contact-line">{s.contactLead} <em>{s.contactStrong}</em></p>
              <a className="pf-contact-mail" href={`mailto:${profile.email}`}>{profile.email}</a>
              <p className="pf-note">{profile.location}</p>
            </div>
            {isAllowedImage(s.portraitImage) ? (
              <figure className="pf-figure">
                <div><Image src={s.portraitImage} alt="Ivan Salinas in formal attire" fill sizes="(max-width: 1000px) 60vw, 18vw" /></div>
                <figcaption>{s.portraitTitle} <span>{s.portraitSub}</span></figcaption>
              </figure>
            ) : null}
          </Reveal>
          <div className="pf-smallprint">
            <span>© 2026 {profile.name}</span>
            <a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer">Built with Next.js · View source<span className="visually-hidden"> (opens in a new tab)</span></a>
          </div>
        </section>
      </main>
    </div>
  );
}
