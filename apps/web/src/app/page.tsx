import { getPortfolio } from "@/lib/api";
import { PortfolioPage } from "@/components/portfolio-page";
import { VisitTracker } from "@/components/visit-tracker";
import { getSiteOrigin } from "@/lib/site-url";
import { profile } from "@/lib/profile";

export default async function Home() {
  const portfolio = await getPortfolio();
  const origin = getSiteOrigin();
  const { settings } = portfolio;
  const portrait = settings.portraitImage?.startsWith("/") ? `${origin}${settings.portraitImage}` : settings.portraitImage || `${origin}/opengraph-image`;
  const person = {
    "@type": "Person",
    "@id": `${origin}/#person`,
    name: profile.name,
    alternateName: "Ivan Salinas",
    jobTitle: settings.roleLine || profile.role,
    description: settings.heroIntro,
    url: origin,
    email: `mailto:${profile.email}`,
    image: portrait,
    address: { "@type": "PostalAddress", addressLocality: profile.locality, addressRegion: profile.region, addressCountry: profile.country },
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Central Luzon State University" }],
    knowsAbout: [...settings.services.map((service) => service.title), ...settings.heroStack],
    sameAs: [profile.githubUrl, profile.linkedinUrl],
  };
  const personJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", "@id": `${origin}/#page`, url: origin, name: `${profile.shortName} — ${settings.roleLine}`, mainEntity: { "@id": `${origin}/#person` } },
      { "@type": "WebSite", "@id": `${origin}/#website`, url: origin, name: `${profile.shortName} Portfolio`, publisher: { "@id": `${origin}/#person` } },
      person,
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\u003c") }} />
      <VisitTracker />
      <PortfolioPage portfolio={portfolio} />
    </>
  );
}
