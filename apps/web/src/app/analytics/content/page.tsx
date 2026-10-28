import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { SERVICE_ICONS, SERVICE_SLOTS, settingsGroups } from "@/lib/cms";
import { fallbackContent } from "@/lib/fallback-content";
import type { SiteSettings } from "@/lib/types";
import { CmsField, CmsStatus, CmsTabs } from "@/components/cms-fields";
import { ConfirmSubmit } from "@/components/cms-confirm";
import { saveSettings } from "./actions";

export default async function ContentSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const { saved, error } = await searchParams;
  const { data, error: loadError } = await createAdminClient().from("site_settings").select("content").eq("id", 1).maybeSingle();
  if (loadError) console.error("Site copy could not be loaded", loadError);
  const settings: SiteSettings = { ...fallbackContent.settings, ...(data?.content ?? {}) };

  return (
    <div className="dashboard-content">
      <header className="dashboard-page-header">
        <p className="analytics-eyebrow">/ Content (02)</p>
        <h1>Site copy<span className="db-dot">.</span></h1>
        <p>Headlines, intros and photos on the home page. Saving publishes immediately.</p>
      </header>
      <CmsTabs active="" />
      <CmsStatus saved={saved} error={error ?? (loadError ? "Saved copy could not be loaded; the form shows the built-in text." : undefined)} />
      <form action={saveSettings} className="cms-form">
        {settingsGroups.map((group) => (
          <fieldset key={group.title} className="analytics-card cms-group">
            <legend>{group.title}</legend>
            <div className="cms-grid">
              {group.fields.map((field) => <CmsField key={field.name} field={field} value={settings[field.name as keyof SiteSettings]} prefix="settings" />)}
            </div>
          </fieldset>
        ))}
        <fieldset className="analytics-card cms-group">
          <legend>Toolkit services</legend>
          <div className="cms-services">
            {Array.from({ length: SERVICE_SLOTS }, (_, index) => {
              const service = settings.services[index];
              return (
                <div key={index} className="cms-service">
                  <label htmlFor={`service-${index}-title`}>Column {index + 1} title</label>
                  <input id={`service-${index}-title`} name={`service_${index}_title`} defaultValue={service?.title ?? ""} />
                  <label htmlFor={`service-${index}-text`}>Text</label>
                  <textarea id={`service-${index}-text`} name={`service_${index}_text`} rows={3} defaultValue={service?.text ?? ""} />
                  <label htmlFor={`service-${index}-icon`}>Icon</label>
                  <select id={`service-${index}-icon`} name={`service_${index}_icon`} defaultValue={service?.icon ?? "code"}>
                    {SERVICE_ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
          <p className="audience-note">The three columns in chapter three. Leave a title empty to hide that column.</p>
        </fieldset>
        <div className="cms-actions"><ConfirmSubmit className="db-button">Save site copy</ConfirmSubmit></div>
      </form>
    </div>
  );
}
