import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { SERVICE_SLOTS, settingsGroups } from "@/lib/cms";
import { fallbackContent } from "@/lib/fallback-content";
import type { SiteSettings } from "@/lib/types";
import { CmsField, CmsStatus, CmsTabs } from "@/components/cms-fields";
import { CmsSaveBar, DisciplineCard } from "@/components/cms-client";
import { PageHeader } from "@/components/dashboard-page-header";
import { saveSettings } from "./actions";

const anchor = (title: string) => `group-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`;

export default async function ContentSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const { saved, error } = await searchParams;
  const { data, error: loadError } = await createAdminClient().from("site_settings").select("content").eq("id", 1).maybeSingle();
  if (loadError) console.error("Site copy could not be loaded", loadError);
  const settings: SiteSettings = { ...fallbackContent.settings, ...(data?.content ?? {}) };
  const groups = [...settingsGroups.map((group) => group.title), "Disciplines"];

  return (
    <div className="dashboard-content">
      <PageHeader eyebrow="/ Content (02)" title="Content" lede="Everything the home page shows. Saving publishes immediately." />
      <CmsTabs active="" />
      <CmsStatus saved={saved} error={error ?? (loadError ? "Saved copy could not be loaded; the form shows the built-in text." : undefined)} />
      <div className="cms-layout">
        <nav className="cms-toc" aria-label="Site copy groups">
          <p className="analytics-eyebrow">ON THIS PAGE</p>
          {groups.map((title) => <a key={title} href={`#${anchor(title)}`}>{title}</a>)}
        </nav>
        <form action={saveSettings} className="cms-form">
          {settingsGroups.map((group) => (
            <fieldset key={group.title} id={anchor(group.title)} className="analytics-card cms-group">
              <legend>{group.title}</legend>
              <div className="cms-grid">
                {group.fields.map((field) => <CmsField key={field.name} field={field} value={settings[field.name as keyof SiteSettings]} prefix="settings" />)}
              </div>
            </fieldset>
          ))}
          <fieldset id={anchor("Disciplines")} className="analytics-card cms-group">
            <legend>Disciplines</legend>
            <p className="audience-note cms-group-note">The three columns under Disciplines. Leave a title empty to hide that column.</p>
            <div className="cms-services">
              {Array.from({ length: SERVICE_SLOTS }, (_, index) => <DisciplineCard key={index} index={index} service={settings.services[index]} />)}
            </div>
          </fieldset>
          <CmsSaveBar>Save site copy</CmsSaveBar>
        </form>
      </div>
    </div>
  );
}
