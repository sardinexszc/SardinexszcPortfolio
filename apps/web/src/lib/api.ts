import type { Portfolio } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const demoPortfolio: Portfolio = {
  projects: [
    {
      id: 1,
      title: "Crops and Resources Research and Development Center",
      description: "A centralized web platform for managing research, extension, personnel, and administrative records, built to improve knowledge access, streamline workflows, and support secure decision-making across the institution.",
      image_url: null,
      tech_stack: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Vercel", "GitHub"],
      live_url: "https://crrdc.vercel.app/",
      github_url: null,
      featured: true,
    },
    {
      id: 2,
      title: "Strengthening the M&E Capacity of CLAARRDEC in R&D through Database Management and Real Time Monitoring System (RTMS)",
      description: "A monitoring and evaluation system developed for CLAARRDEC to digitize reporting, improve project tracking, strengthen data management, and support faster oversight of research and development activities across member institutions.",
      image_url: null,
      tech_stack: ["Laravel", "PHP", "MySQL", "JavaScript", "Bootstrap", "HTML5", "CSS3", "jQuery", "AJAX", "GitHub"],
      live_url: "https://rtms.clsu.edu.ph/",
      github_url: null,
      featured: true,
    },
    {
      id: 3,
      title: "CLAARRDEC",
      description: "A content management and e-library platform with public and authenticated access, built to organize institutional content and provide visitor and user statistics for better engagement tracking and information delivery.",
      image_url: null,
      tech_stack: ["Laravel", "PHP", "MySQL", "JavaScript", "Bootstrap", "HTML5", "CSS3", "jQuery", "AJAX", "Laravel Authentication", "GitHub"],
      live_url: "https://claarrdec.clsu.edu.ph/",
      github_url: null,
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
      organization: "Independent and collaborative product work",
      role: "Full-Stack Web Developer",
      description: "Building AI-powered applications, automation workflows, and scalable web systems using Next.js, Laravel, React, Supabase, and n8n.",
      start_date: "2026",
      end_date: null,
    },
    {
      id: 2,
      type: "experience",
      organization: "Central Luzon State University",
      role: "Researcher and Instructor | Information Systems Developer",
      description: "Developed research information systems, IoT monitoring platforms, CMS solutions, and smart agriculture applications while teaching Information Technology.",
      start_date: "2019",
      end_date: "2026",
    },
    {
      id: 3,
      type: "experience",
      organization: "Central Luzon State University",
      role: "Project Technical Staff",
      description: "Handled administrative and ICT-related responsibilities in support of institutional operations and project execution.",
      start_date: "2017",
      end_date: "2019",
    },
    {
      id: 4,
      type: "education",
      organization: "Central Luzon State University",
      role: "BSIT – Systems Development",
      description: "Focused on software engineering, web technologies, database systems, and application development.",
      start_date: "2013",
      end_date: "2017",
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