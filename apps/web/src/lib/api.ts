import type { Portfolio } from "./types";

const verifiedTechnologies = ["PHP", "JavaScript", "TypeScript", "SQL", "Java", "React", "Next.js", "Laravel", "MySQL", "PostgreSQL", "Supabase", "n8n", "REST APIs", "Git", "GitHub", "Vercel", "ESP32", "Arduino", "PlatformIO", "ArcGIS", "QGIS"];

const demoPortfolio: Portfolio = {
  projects: [
    {
      id: 1,
      title: "Crops and Resources Research and Development Center",
      description: "One place for CRRDC research, extension, personnel, and administrative records.",
      image_url: null,
      tech_stack: ["Next.js", "React", "TypeScript", "JavaScript", "Vercel", "GitHub"],
      live_url: "https://crrdc.vercel.app/",
      github_url: null,
      featured: true,
    },
    {
      id: 2,
      title: "Strengthening the M&E Capacity of CLAARRDEC in R&D through Database Management and Real Time Monitoring System (RTMS)",
      description: "A shared system for CLAARRDEC project reporting and oversight across member institutions.",
      image_url: null,
      tech_stack: ["Laravel", "PHP", "MySQL", "JavaScript", "GitHub"],
      live_url: "https://rtms.clsu.edu.ph/",
      github_url: null,
      featured: true,
    },
    {
      id: 3,
      title: "CLAARRDEC",
      description: "A public website and e-library with controlled access, administration, and usage reporting.",
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
      description: "Building web applications and automation workflows with Next.js, Laravel, and Supabase.",
      start_date: "2026",
      end_date: null,
    },
    {
      id: 2,
      type: "experience",
      organization: "Central Luzon State University",
      role: "Researcher, Instructor, and Information Systems Developer",
      description: "Delivered research information, monitoring, and content systems for institutional projects.\nLed small teams and worked with researchers and stakeholders to define requirements and coordinate delivery.\nTaught undergraduate programming and supervised capstone projects.",
      start_date: "2019",
      end_date: "2026",
    },
    {
      id: 3,
      type: "experience",
      organization: "Central Luzon State University",
      role: "Project Technical Staff",
      description: "Maintained project records and technical reports for research initiatives.\nSupported requirements gathering and coordination across project teams.",
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

export async function getPortfolio(): Promise<Portfolio> {
  return demoPortfolio;
}
