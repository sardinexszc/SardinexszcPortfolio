import type { Portfolio } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const verifiedTechnologies = ["PHP", "JavaScript", "TypeScript", "SQL", "Java", "React", "Next.js", "Laravel", "MySQL", "PostgreSQL", "Supabase", "n8n", "REST APIs", "Git", "GitHub", "Vercel", "ESP32", "Arduino", "PlatformIO", "ArcGIS", "QGIS"];

const demoPortfolio: Portfolio = {
  projects: [
    {
      id: 1,
      title: "Crops and Resources Research and Development Center",
      description: "A centralized web platform for research, extension, personnel, and administrative records, supporting institutional information access and operational workflows.",
      image_url: null,
      tech_stack: ["Next.js", "React", "TypeScript", "JavaScript", "Vercel", "GitHub"],
      live_url: "https://crrdc.vercel.app/",
      github_url: null,
      featured: true,
    },
    {
      id: 2,
      title: "Strengthening the M&E Capacity of CLAARRDEC in R&D through Database Management and Real Time Monitoring System (RTMS)",
      description: "A centralized monitoring and evaluation system for CLAARRDEC reporting, research and development project tracking, data management, and oversight workflows across member institutions.",
      image_url: null,
      tech_stack: ["Laravel", "PHP", "MySQL", "JavaScript", "GitHub"],
      live_url: "https://rtms.clsu.edu.ph/",
      github_url: null,
      featured: true,
    },
    {
      id: 3,
      title: "CLAARRDEC",
      description: "A content management and e-library platform for public information delivery, authenticated access, library functions, administration, and visitor and user usage reporting.",
      image_url: null,
      tech_stack: ["Laravel", "PHP", "MySQL", "JavaScript", "GitHub"],
      live_url: "https://claarrdec.clsu.edu.ph/",
      github_url: null,
      featured: true,
    },
  ],
  skills: verifiedTechnologies.map((name, index) => ({ id: index + 1, name, proficiency: 0, icon: null })),
  timeline: [
    {
      id: 1,
      type: "experience",
      organization: "Independent and collaborative product work",
      role: "Full-Stack Web Developer",
      description: "Building web applications, APIs, databases, and n8n automation workflows using Next.js, Laravel, React, and Supabase.",
      start_date: "2026",
      end_date: null,
    },
    {
      id: 2,
      type: "experience",
      organization: "Central Luzon State University",
      role: "Researcher, Instructor, and Information Systems Developer",
      description: "Developed research information systems, IoT monitoring platforms, content management systems, and smart agriculture applications while teaching Information Technology.",
      start_date: "2019",
      end_date: "2026",
    },
    {
      id: 3,
      type: "experience",
      organization: "Central Luzon State University",
      role: "Project Technical Staff",
      description: "Handled administrative and ICT responsibilities supporting institutional operations and project execution.",
      start_date: "2017",
      end_date: "2019",
    },
    {
      id: 4,
      type: "education",
      organization: "Nueva Ecija University of Science and Technology",
      role: "Master of Science in Information Technology, Major in Data Science",
      description: "Graduate study in Information Technology with a major in Data Science.",
      start_date: "2026",
      end_date: null,
    },
    {
      id: 5,
      type: "education",
      organization: "Central Luzon State University",
      role: "Bachelor of Science in Information Technology, Major in Systems Development",
      description: "Undergraduate degree in Information Technology with a major in Systems Development.",
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
