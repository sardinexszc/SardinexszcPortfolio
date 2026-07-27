import type { Portfolio } from "./types";
import { resumeKnowledge } from "./resume-data";

function collectResumeBulletLines(startLabel: string, endLabel: string): string[] {
  const start = resumeKnowledge.indexOf(startLabel);
  const end = resumeKnowledge.indexOf(endLabel);

  if (start === -1 || end === -1 || end <= start) return [];

  const section = resumeKnowledge.slice(start + startLabel.length, end);
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^-\s*/, ""));
}

function extractResumeFacts(question: string): string | null {
  const lowerQuestion = question.toLowerCase();
  const resume = resumeKnowledge.toLowerCase();

  const patterns: Array<RegExp> = [
    /education|bachelor|master|university|study|graduate/i,
    /publication|published|doi|paper/i,
    /skill|skills|technolog|stack|framework|php|react|next|typescript|python|sql|postgres|supabase|n8n|llm|ai/i,
    /experience|worked|years|developer|engineer|specialist|professional/i,
    /contact|email|phone|address|linkedin|github|website|portfolio/i,
    /project|projects|worked on|built|made/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(lowerQuestion)) {
      return resume;
    }
  }

  return null;
}

export function answerPortfolioQuestion(question: string, portfolio: Portfolio): string {
  const text = question.toLowerCase();
  const resumeContext = extractResumeFacts(question);

  if (/professional summary|summary from resume|resume summary|profile summary/i.test(text)) {
    const summaryPoints = collectResumeBulletLines("Professional Summary", "Experience");
    const summary = summaryPoints.length
      ? summaryPoints.slice(0, 2).join(" ")
      : "I am a full stack software engineer and AI automation specialist with 7+ years of experience building enterprise web applications and automated workflows.";
    return "Here is my professional summary from the resume: " + summary;
  }

  if (/core skills|skills from resume|resume skills|what are your skills/i.test(text)) {
    const resumeSkills = collectResumeBulletLines("Skills", "Publications");
    const conciseSkills = resumeSkills.length
      ? resumeSkills.slice(0, 4)
      : [
          "PHP, JavaScript, TypeScript, SQL, Java",
          "React.js, Next.js, Tailwind CSS, REST APIs",
          "PostgreSQL, Supabase, MySQL",
          "n8n, AI agent integration, LLM integration",
        ];
    return "Here are my core skills from the resume: " + conciseSkills.join("; ") + ".";
  }

  if (/projects listed in my resume|projects from resume|what projects did you work on|resume projects/i.test(text)) {
    const resumeProjectHighlights = [
      "research management systems",
      "workflow automation tools",
      "web-based enterprise information systems",
      "AI-enabled integrations using LLMs, n8n, and Telegram bots",
    ];
    return "Here are the projects listed in my resume: " + resumeProjectHighlights.join("; ") + ".";
  }

  if (/who are you|about you|your background|what do you do|what kind of work/i.test(text)) {
    if (resumeContext) {
      return "I am Ivan Christian Salinas, a full-stack software engineer and AI automation specialist with 7+ years of experience. My resume highlights work in web applications, research systems, workflow automation, and AI integrations across research and education sectors.";
    }

    return "I am Ivan Christian Salinas, a full-stack software engineer who builds web applications, AI-powered automation tools, and systems for research and operations. I have worked on platforms for government-backed institutions and enjoy turning complex workflows into practical software.";
  }

  if (/tech|technology|stack|framework|language|tools|next|react|laravel|php|typescript|python|sql|postgres|supabase|n8n|llm|ai/i.test(text)) {
    const technologies = Array.from(
      new Set([
        ...portfolio.skills.map((skill) => skill.name),
        ...portfolio.projects.flatMap((project) => project.tech_stack),
      ]),
    );
    return "I work with a mix of technologies such as " + technologies.slice(0, 8).join(", ") + ". My recent work often combines React/Next.js, TypeScript, Laravel/PHP, and modern workflow automation, and my resume also lists PostgreSQL, Supabase, n8n, and LLM integrations.";
  }

  if (/project|projects|portfolio|work|built|made|worked on/i.test(text)) {
    const featuredProjects = portfolio.projects.slice(0, 3).map((project) => project.title);
    if (resumeContext) {
      return "Here are the projects listed in my resume: research management systems; workflow automation tools; web-based enterprise information systems; AI-enabled integrations with LLMs and n8n. Some featured portfolio projects include " + featuredProjects.join("; ") + ".";
    }

    return "Some of my featured work includes " + featuredProjects.join("; ") + ". These projects span research management, monitoring systems, and content platforms.";
  }

  if (/experience|where have you worked|education|university|career|years|specialist/i.test(text)) {
    const timelineSummary = portfolio.timeline
      .slice(0, 3)
      .map((entry) => entry.role + " at " + entry.organization)
      .join("; ");
    return "My experience includes " + timelineSummary + ". My resume also emphasizes 7+ years of software engineering work, research systems development, teaching, and AI-enabled workflow automation.";
  }

  if (/contact|email|reach|linkedin|github|whatsapp|telegram|phone|address|website/i.test(text)) {
    return "You can reach me through email at sardinexszc@gmail.com or banbansalinas@gmail.com, and you can also connect with me on LinkedIn or GitHub via the links on this page. My resume also includes my phone number and portfolio website.";
  }

  if (resumeContext) {
    return "I can answer from your resume details, including my background, education, skills, publications, and professional experience. Ask me about any of those topics and I’ll summarize what’s in the resume.";
  }

  return "I can help with questions about my background, projects, technologies, and experience. Ask me about my work, the tools I use, or the kinds of problems I solve.";
}
