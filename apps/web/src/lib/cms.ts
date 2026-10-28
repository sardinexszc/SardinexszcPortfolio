// Field definitions shared by the CMS editor pages (rendering) and its Server Actions (parsing).
// The actions only ever write the fields listed here, to the table listed here.

export type FieldKind = "text" | "textarea" | "url" | "list" | "lines" | "bool" | "select" | "image" | "number";
export type Field = { name: string; label: string; kind: FieldKind; required?: boolean; options?: readonly string[]; hint?: string };

export type Section = {
  slug: string;
  table: string;
  title: string;
  singular: string;
  description: string;
  fields: Field[];
  rowLabel: (row: Record<string, unknown>) => string;
};

const sortField: Field = { name: "sort_order", label: "Order", kind: "number", hint: "Lower numbers show first." };

export const sections: Section[] = [
  {
    slug: "projects",
    table: "projects",
    title: "Projects",
    singular: "project",
    description: "Cards in the Projects grid and their case-study pop-ups.",
    rowLabel: (row) => String(row.title),
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "description", label: "Card description", kind: "textarea", required: true },
      { name: "image_url", label: "Screenshot", kind: "image", hint: "Upload a WebP, JPEG, PNG or AVIF up to 4 MB, or keep a /images/… path." },
      { name: "tech_stack", label: "Tech stack", kind: "list", hint: "Comma-separated, e.g. Next.js, Supabase, PostgreSQL." },
      { name: "live_url", label: "Live URL", kind: "url" },
      { name: "github_url", label: "GitHub URL", kind: "url" },
      { name: "role", label: "My role", kind: "textarea" },
      { name: "problem", label: "Challenge", kind: "textarea" },
      { name: "outcome", label: "Result", kind: "textarea" },
      { name: "featured", label: "Featured", kind: "bool" },
      sortField,
    ],
  },
  {
    slug: "experience",
    table: "timeline_entries",
    title: "Experience & education",
    singular: "entry",
    description: "The dark Experience panel. Each line of the description becomes a bullet for experience entries.",
    rowLabel: (row) => `${row.role} · ${row.organization}`,
    fields: [
      { name: "type", label: "Type", kind: "select", options: ["experience", "education"], required: true },
      { name: "role", label: "Role or degree", kind: "text", required: true },
      { name: "organization", label: "Organization", kind: "text", required: true },
      { name: "start_date", label: "Start", kind: "text", required: true, hint: "Shown as typed, e.g. Aug 2019." },
      { name: "end_date", label: "End", kind: "text", hint: "Leave empty for “Present”." },
      { name: "description", label: "Description", kind: "textarea" },
      sortField,
    ],
  },
  {
    slug: "publications",
    table: "publications",
    title: "Publications",
    singular: "publication",
    description: "Research list with status tags. The About card counts these by status.",
    rowLabel: (row) => String(row.title),
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "venue", label: "Venue and year", kind: "text", required: true },
      { name: "status", label: "Status", kind: "select", options: ["Published", "Accepted", "Under review"], required: true },
      { name: "doi", label: "DOI", kind: "text", hint: "Only the identifier, e.g. 10.1145/3670105.3670120." },
      sortField,
    ],
  },
  {
    slug: "intellectual-property",
    table: "ip_items",
    title: "Intellectual property",
    singular: "item",
    description: "Patents, copyrights and filings under Research & IP.",
    rowLabel: (row) => String(row.title),
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "detail", label: "Detail", kind: "text" },
      sortField,
    ],
  },
  {
    slug: "capabilities",
    table: "capability_groups",
    title: "Capabilities",
    singular: "group",
    description: "Rows of tool chips in the Capabilities section.",
    rowLabel: (row) => String(row.title),
    fields: [
      { name: "title", label: "Group title", kind: "text", required: true },
      { name: "tools", label: "Tools", kind: "list", hint: "Comma-separated." },
      sortField,
    ],
  },
];

export const findSection = (slug: string) => sections.find((section) => section.slug === slug);

// Site copy stored in site_settings.content. Only the fields the home page shows are edited here;
// saving merges over the stored copy, so older fields (research quotes) are kept, not wiped.
// Disciplines are edited separately as three fixed cards.
export const settingsGroups: { title: string; fields: Field[] }[] = [
  {
    title: "Hero",
    fields: [
      { name: "roleLine", label: "Role line", kind: "text", required: true },
      { name: "aboutCardTitle", label: "Intro above the résumé button", kind: "text", required: true },
      { name: "heroImage", label: "Tall photo (right column)", kind: "image", hint: "Keep the top third plain (sky, wall): the big name crosses it." },
      { name: "studioImage", label: "Middle picture (optional)", kind: "image", hint: "Leave empty to show the black practice card." },
    ],
  },
  {
    title: "Practice",
    fields: [
      { name: "portraitImage", label: "Wide photo", kind: "image" },
      { name: "statusLine", label: "Availability", kind: "text" },
      { name: "heroIntro", label: "Short paragraph", kind: "textarea", required: true },
      { name: "aboutStatement", label: "Big italic statement", kind: "text", required: true, hint: "A full stop is added at the end." },
      { name: "heroStack", label: "Everyday stack icons", kind: "list", hint: "Comma-separated tool names." },
    ],
  },
  {
    title: "Worked with and contact",
    fields: [
      { name: "institutions", label: "Institutions worked with", kind: "list", hint: "Comma-separated." },
      { name: "contactLead", label: "Line above the email", kind: "text" },
    ],
  },
];

export const SERVICE_ICONS = ["code", "database", "cpu"] as const;
export const SERVICE_SLOTS = 3;

// Value shown in an input for a stored value.
export function formValue(field: Field, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(field.kind === "lines" ? "\n" : ", ");
  return String(value);
}
