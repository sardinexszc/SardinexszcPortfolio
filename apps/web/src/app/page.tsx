import { getPortfolio } from "@/lib/api";
import { PortfolioPage } from "@/components/portfolio-page";
import { VisitTracker } from "@/components/visit-tracker";
import { getSiteOrigin } from "@/lib/site-url";
import { profile } from "@/lib/profile";

export default async function Home() {
  const portfolio = await getPortfolio();
  const origin = getSiteOrigin();
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: origin,
    email: `mailto:${profile.email}`,
    image: `${origin}/opengraph-image`,
    address: { "@type": "PostalAddress", addressLocality: profile.locality, addressRegion: profile.region, addressCountry: profile.country },
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Central Luzon State University" }],
    knowsAbout: ["Full-stack web development", "Laravel", "PHP", "Next.js", "React", "TypeScript", "MySQL", "PostgreSQL", "REST APIs", "Workflow automation"],
    sameAs: [profile.githubUrl, profile.linkedinUrl],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\u003c") }} />
      <VisitTracker />
      <PortfolioPage portfolio={portfolio} />
    </>
  );
}
