export type Project = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  sort_order?: number;
};

export type Skill = {
  id: number;
  name: string;
  proficiency: number;
  icon: string | null;
  sort_order?: number;
};

export type TimelineEntry = {
  id: number;
  type: "experience" | "education";
  organization: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string | null;
  sort_order?: number;
};

export type Portfolio = {
  projects: Project[];
  skills: Skill[];
  timeline: TimelineEntry[];
};
