import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/api";
import { projectSlug, projectDisplayTitle } from "@/lib/work-projects";
import { ProjectCaseStudy } from "@/components/project-case-study";

export async function generateStaticParams() {
  const portfolio = await getPortfolio();
  return portfolio.projects.map((project) => ({ slug: projectSlug(project) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolio();
  const project = portfolio.projects.find((item) => projectSlug(item) === slug);

  if (!project) return {};

  const title = `${projectDisplayTitle(project)} | Ivan Christian Salinas`;
  const description = project.description;
  const path = `/work/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      images: project.image_url ? [{ url: project.image_url, alt: `${projectDisplayTitle(project)} project screenshot` }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function WorkCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const portfolio = await getPortfolio();
  const project = portfolio.projects.find((item) => projectSlug(item) === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="case-study-page">
      <div className="case-study-page-head">
        <Link href="/#work" className="case-study-back-link">Back to selected work</Link>
        <p className="case-study-page-kicker">Engineering case study</p>
        <h1>{projectDisplayTitle(project)}</h1>
      </div>
      <ProjectCaseStudy project={project} />
    </main>
  );
}
