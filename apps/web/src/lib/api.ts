import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { fallbackContent } from "./fallback-content";
import type { Portfolio } from "./types";

// CMS saves call updateTag(CONTENT_TAG) so the home page shows the edit on the next request.
export const CONTENT_TAG = "portfolio-content";

const loadContent =unstable_cache(async (): Promise<Portfolio> => {
  const db = createAdminClient();
  const ordered = (table: string) => db.from(table).select("*").order("sort_order").order("id");
  const results = await Promise.all([
    db.from("site_settings").select("content").eq("id", 1).maybeSingle(),
    ordered("projects"),
    ordered("timeline_entries"),
    ordered("publications"),
    ordered("ip_items"),
    ordered("capability_groups"),
  ]);
  const failed = results.find((result) => result.error);
  if (failed) throw failed.error;
  const [settings, projects, timeline, publications, ipItems, capabilities] = results;
  // No settings row means the seed has not run yet; once it has, an empty table is a deliberate edit.
  if (!settings.data) return fallbackContent;
  return {
    settings: { ...fallbackContent.settings, ...settings.data.content },
    projects: projects.data ?? [],
    timeline: timeline.data ?? [],
    publications: publications.data ?? [],
    ipItems: ipItems.data ?? [],
    capabilities: capabilities.data ?? [],
  };
}, [CONTENT_TAG], { tags: [CONTENT_TAG], revalidate: 3600 });

export async function getPortfolio(): Promise<Portfolio> {
  if (!process.env.SUPABASE_SECRET_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) return fallbackContent;
  try {
    return await loadContent();
  } catch (error) {
    console.error("Portfolio content could not be loaded; showing built-in copy", error);
    return fallbackContent;
  }
}
