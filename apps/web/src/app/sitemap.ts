import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/api";
import { getSiteOrigin } from "@/lib/site-url";
import { projectSlug } from "@/lib/work-projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  if (!origin) return [];

  const portfolio = await getPortfolio();
  const lastModified = new Date();

  return [
    { url: origin, lastModified, changeFrequency: "monthly", priority: 1 },
    ...portfolio.projects.map((project) => ({
      url: `${origin}/work/${projectSlug(project)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
