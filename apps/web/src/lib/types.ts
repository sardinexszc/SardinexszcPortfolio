export type Project = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  role: string | null;
  problem: string | null;
  outcome: string | null;
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

export type PublicationStatus = "Published" | "Accepted" | "Under review";

export type Publication = {
  id: number;
  title: string;
  venue: string;
  status: PublicationStatus;
  doi: string | null;
  sort_order?: number;
};

export type IpItem = { id: number; title: string; detail: string; sort_order?: number };

export type CapabilityGroup = { id: number; title: string; tools: string[]; sort_order?: number };

export type ServiceIcon = "code" | "database" | "cpu";

// Page copy that is not a list of records. Stored as one JSON row in site_settings.
export type SiteSettings = {
  heroIntro: string;
  heroStack: string[];
  statusLine: string;
  statusSub: string;
  heroImage: string;
  portraitImage: string;
  aboutStatement: string;
  aboutStatementMuted: string;
  aboutCardTitle: string;
  strengths: string[];
  patentNote: string;
  services: { icon: ServiceIcon; title: string; text: string }[];
  portraitTitle: string;
  portraitSub: string;
  projectsIntro: string;
  capabilitiesStatement: string;
  capabilitiesStatementMuted: string;
  researchStatement: string;
  researchStatementMuted: string;
  training: string;
  contactLead: string;
  contactStrong: string;
  roleLine: string;
  // Optional picture for the hero practice card; empty shows the card itself.
  studioImage: string;
  institutions: string[];
};

export type Portfolio = {
  settings: SiteSettings;
  projects: Project[];
  timeline: TimelineEntry[];
  publications: Publication[];
  ipItems: IpItem[];
  capabilities: CapabilityGroup[];
};
