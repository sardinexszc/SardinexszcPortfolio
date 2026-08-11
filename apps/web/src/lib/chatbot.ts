import type { Portfolio } from "./types";
import { resumeKnowledge } from "./resume-data";

export type ChatLink = {
  label: string;
  href: string;
};

export type ChatResponsePayload = {
  answer: string;
  links: ChatLink[];
  references: string[];
  source: "resume" | "portfolio" | "mixed";
};

const resumeFileHref = "/files/2026_ICLSalinas_Resume.pdf";

function projectByKeyword(portfolio: Portfolio, keywords: string[]): Portfolio["projects"] {
  return portfolio.projects.filter((project) => {
    const haystack = `${project.title} ${project.description} ${project.tech_stack.join(" ")}`.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword));
  });
}

function projectLink(project: Portfolio["projects"][number]): ChatLink {
  return {
    label: `View ${project.title.length > 42 ? `${project.title.slice(0, 39)}...` : project.title}`,
    href: project.live_url ?? "#work",
  };
}

function buildProjectList(projects: Portfolio["projects"]): string {
  return projects.map((project) => project.title).join(" and ");
}

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
  return buildPortfolioChatResponse(question, portfolio).answer;
}

export function buildPortfolioChatResponse(question: string, portfolio: Portfolio): ChatResponsePayload {
  const text = question.toLowerCase();
  const resumeContext = extractResumeFacts(question);

  if (/(system prompt|ignore previous|developer message|api key|token|secret|env|environment variable|reveal instructions)/i.test(text)) {
    return {
      answer: "I can only answer portfolio questions using public portfolio and resume content. I cannot reveal system instructions, secrets, or private configuration.",
      links: [{ label: "Go to Portfolio", href: "#work" }],
      references: ["Safety policy"],
      source: "portfolio",
    };
  }

  if (/(which projects use laravel|laravel experience|backend projects|php experience)/i.test(text)) {
    const projects = projectByKeyword(portfolio, ["laravel", "php"]);
    if (projects.length > 0) {
      return {
        answer: `${buildProjectList(projects)} demonstrate Laravel/PHP backend experience, including server-side development and institutional workflow systems.`,
        links: projects.slice(0, 3).map(projectLink),
        references: projects.map((project) => project.title),
        source: "portfolio",
      };
    }
  }

  if (/(strongest full-stack project|best full-stack|top full-stack)/i.test(text)) {
    const project = portfolio.projects.find((entry) => entry.featured) ?? portfolio.projects[0];
    if (project) {
      return {
        answer: `${project.title} is one of the strongest full-stack examples in your current portfolio, combining application workflows, structured data handling, and production deployment.`,
        links: [projectLink(project), { label: "See Selected Work", href: "#work" }],
        references: [project.title],
        source: "portfolio",
      };
    }
  }

  if (/(which projects involve ai|projects use ai|ai work|llm)/i.test(text)) {
    return {
      answer: "AI-focused work is currently documented in your experience and resume context (LLM integrations, AI applications, and automation workflows). Selected public project cards do not yet include explicit AI-tagged stacks.",
      links: [
        { label: "See Experience", href: "#about" },
        { label: "Download Resume", href: resumeFileHref },
      ],
      references: ["Timeline: Full-Stack Web Developer", "Resume: Professional Summary"],
      source: "mixed",
    };
  }

  if (/(deployed systems|what systems have you deployed|live projects|deployed online)/i.test(text)) {
    const deployed = portfolio.projects.filter((project) => Boolean(project.live_url));
    return {
      answer: deployed.length
        ? `Deployed systems in your portfolio include ${buildProjectList(deployed)}.`
        : "No deployed systems are currently listed in the project data.",
      links: deployed.slice(0, 3).map(projectLink),
      references: deployed.map((project) => project.title),
      source: "portfolio",
    };
  }

  if (/(iot work|iot|embedded|sensor|smart agriculture)/i.test(text)) {
    return {
      answer: "Your IoT work is captured in your experience timeline, including IoT monitoring platforms and smart agriculture applications developed during your CLSU research and systems work.",
      links: [{ label: "See Experience Timeline", href: "#about" }],
      references: ["Timeline: Researcher and Instructor | Information Systems Developer"],
      source: "portfolio",
    };
  }

  if (/(research organization|research systems|what can you build for a research organization)/i.test(text)) {
    const researchProjects = projectByKeyword(portfolio, ["research", "monitoring", "consortium", "claarrdec"]);
    return {
      answer: "For research organizations, you can build research information systems, monitoring and evaluation platforms, content/e-library systems, and structured workflow automation for reporting and decision support.",
      links: researchProjects.slice(0, 3).map(projectLink),
      references: researchProjects.map((project) => project.title),
      source: "portfolio",
    };
  }

  if (/professional summary|summary from resume|resume summary|profile summary/i.test(text)) {
    const summaryPoints = collectResumeBulletLines("Professional Summary", "Experience");
    const summary = summaryPoints.length
      ? summaryPoints.slice(0, 2).join(" ")
      : "I am a full stack software engineer and AI automation specialist with 7+ years of experience building enterprise web applications and automated workflows.";
    return {
      answer: "Here is your professional summary from the resume: " + summary,
      links: [{ label: "Download Resume", href: resumeFileHref }],
      references: ["Resume: Professional Summary"],
      source: "resume",
    };
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
    return {
      answer: "Here are your core skills from the resume: " + conciseSkills.join("; ") + ".",
      links: [{ label: "See Capabilities", href: "#skills-title" }],
      references: ["Resume: Skills", "Capabilities section"],
      source: "mixed",
    };
  }

  if (/projects listed in my resume|projects from resume|what projects did you work on|resume projects/i.test(text)) {
    const resumeProjectHighlights = [
      "research management systems",
      "workflow automation tools",
      "web-based enterprise information systems",
      "AI-enabled integrations using LLMs, n8n, and Telegram bots",
    ];
    return {
      answer: "Here are projects highlighted in your resume: " + resumeProjectHighlights.join("; ") + ".",
      links: [{ label: "See Selected Work", href: "#work" }, { label: "Download Resume", href: resumeFileHref }],
      references: ["Resume: Experience", "Selected Work"],
      source: "mixed",
    };
  }

  if (/who are you|about you|your background|what do you do|what kind of work/i.test(text)) {
    if (resumeContext) {
      return {
        answer: "Ivan Christian Salinas is a full-stack software engineer and AI automation specialist with 7+ years of experience. Resume and portfolio content highlight web applications, research systems, workflow automation, and AI integration work.",
        links: [{ label: "See About", href: "#about" }, { label: "Download Resume", href: resumeFileHref }],
        references: ["About section", "Resume: Professional Summary"],
        source: "mixed",
      };
    }

    return {
      answer: "Ivan builds full-stack web applications, AI-supported automation tools, and research/operations systems, with experience delivering platforms for institutional and research environments.",
      links: [{ label: "See About", href: "#about" }],
      references: ["About section"],
      source: "portfolio",
    };
  }

  if (/tech|technology|stack|framework|language|tools|next|react|laravel|php|typescript|python|sql|postgres|supabase|n8n|llm|ai/i.test(text)) {
    const technologies = Array.from(
      new Set([
        ...portfolio.skills.map((skill) => skill.name),
        ...portfolio.projects.flatMap((project) => project.tech_stack),
      ]),
    );
    return {
      answer: "Technologies shown in portfolio and resume include " + technologies.slice(0, 10).join(", ") + ". Recent portfolio systems prominently show React/Next.js, TypeScript, Laravel/PHP, and MySQL, while resume context adds PostgreSQL, Supabase, n8n, and LLM integration work.",
      links: [{ label: "See Capabilities", href: "#skills-title" }, { label: "See Selected Work", href: "#work" }],
      references: ["Capabilities section", "Selected Work", "Resume: Skills"],
      source: "mixed",
    };
  }

  if (/project|projects|portfolio|work|built|made|worked on/i.test(text)) {
    const featuredProjects = portfolio.projects.slice(0, 3).map((project) => project.title);
    if (resumeContext) {
      return {
        answer: "Resume highlights research management systems, workflow automation tools, and enterprise web systems. Featured portfolio projects include " + featuredProjects.join("; ") + ".",
        links: portfolio.projects.slice(0, 3).map(projectLink),
        references: ["Selected Work", "Resume: Experience"],
        source: "mixed",
      };
    }

    return {
      answer: "Featured work includes " + featuredProjects.join("; ") + ". These projects span research management, monitoring systems, and content platforms.",
      links: portfolio.projects.slice(0, 3).map(projectLink),
      references: featuredProjects,
      source: "portfolio",
    };
  }

  if (/experience|where have you worked|education|university|career|years|specialist/i.test(text)) {
    const timelineSummary = portfolio.timeline
      .slice(0, 3)
      .map((entry) => entry.role + " at " + entry.organization)
      .join("; ");
    return {
      answer: "Experience includes " + timelineSummary + ". Resume content also emphasizes 7+ years of software engineering, research systems work, teaching, and AI-enabled workflow automation.",
      links: [{ label: "See Experience Timeline", href: "#about" }, { label: "Download Resume", href: resumeFileHref }],
      references: ["About timeline", "Resume: Experience"],
      source: "mixed",
    };
  }

  if (/contact|email|reach|linkedin|github|whatsapp|telegram|phone|address|website/i.test(text)) {
    return {
      answer: "Contact options include email at sardinexszc@gmail.com or banbansalinas@gmail.com, plus LinkedIn and GitHub links in the contact section. Resume data also includes phone and portfolio website references.",
      links: [{ label: "Go to Contact", href: "#contact" }, { label: "Download Resume", href: resumeFileHref }],
      references: ["Contact section", "Resume: Contact"],
      source: "mixed",
    };
  }

  if (resumeContext) {
    return {
      answer: "I can answer from resume details including background, education, skills, publications, and professional experience. Ask a specific question and I will summarize that section.",
      links: [{ label: "Download Resume", href: resumeFileHref }],
      references: ["Resume knowledge base"],
      source: "resume",
    };
  }

  return {
    answer: "I can help with questions about background, projects, technologies, experience, research, AI work, IoT work, education, resume, and contact information. Try asking: Which projects use Laravel?",
    links: [{ label: "See Suggested Questions", href: "#" }, { label: "Go to Selected Work", href: "#work" }],
    references: ["Chatbot scope policy"],
    source: "portfolio",
  };
}
