import type { Portfolio } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const demoPortfolio: Portfolio = {
  projects: [
    {
      id: 1,
      title: "Northstar Commerce",
      description: "A focused commerce platform that turns complex catalog data into a calm buying experience.",
      image_url: null,
      tech_stack: ["Next.js", "Laravel", "PostgreSQL"],
      live_url: "https://example.com",
      github_url: "https://github.com",
      featured: true,
    },
    {
      id: 2,
      title: "Field Notes",
      description: "A lightweight knowledge system for collecting observations, references, and useful connections.",
      image_url: null,
      tech_stack: ["React", "TypeScript", "SQLite"],
      live_url: "https://example.com",
      github_url: "https://github.com",
      featured: true,
    },
  ],
  skills: [
    { id: 1, name: "Product design", proficiency: 92, icon: "✦" },
    { id: 2, name: "TypeScript", proficiency: 88, icon: "TS" },
    { id: 3, name: "React / Next.js", proficiency: 90, icon: "R" },
    { id: 4, name: "Laravel / PHP", proficiency: 78, icon: "L" },
  ],
  timeline: [
    {
      id: 1,
      type: "experience",
      organization: "Independent practice",
      role: "Product designer & developer",
      description: "Helping teams turn uncertain product ideas into clear, useful digital tools.",
      start_date: "2021",
      end_date: null,
    },
    {
      id: 2,
      type: "education",
      organization: "Design and technology",
      role: "Continuous study",
      description: "A practical, lifelong curriculum across interaction design, systems, and software craft.",
      start_date: "2018",
      end_date: "2021",
    },
  ],
};

async function getResource<T>(resource: string): Promise<T> {
  const response = await fetch(`${apiUrl}/${resource}`, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`Unable to load ${resource}`);
  const body = (await response.json()) as { data: T };
  return body.data;
}

export async function getPortfolio(): Promise<Portfolio> {
  try {
    const [projects, skills, timeline] = await Promise.all([
      getResource<Portfolio["projects"]>("projects"),
      getResource<Portfolio["skills"]>("skills"),
      getResource<Portfolio["timeline"]>("timeline"),
    ]);
    return { projects, skills, timeline };
  } catch {
    return demoPortfolio;
  }
}