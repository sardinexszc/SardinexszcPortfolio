import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/api";
import { projectSlug, projectDisplayTitle } from "@/lib/work-projects";
import { ProjectCaseStudy } from "@/components/project-case-study";

export async function generateStaticParams() {
  const portfolio = await getPortfolio();
  return portfolio.projects.map((project) => ({ slug: projectSlug(project) }));
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
