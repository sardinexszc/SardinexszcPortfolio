import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { findSection, type Section } from "@/lib/cms";
import { CmsField, CmsStatus, CmsTabs } from "@/components/cms-fields";
import { ConfirmSubmit } from "@/components/cms-confirm";
import { deleteRow, saveRow } from "../actions";

type Row = Record<string, unknown> & { id: number };

function RowForm({ section, row }: { section: Section; row?: Row }) {
  const prefix = `${section.slug}-${row?.id ?? "new"}`;
  return (
    <form action={saveRow} className="cms-form">
      <input type="hidden" name="section" value={section.slug} />
      {row ? <input type="hidden" name="id" value={row.id} /> : null}
      <div className="cms-grid">
        {section.fields.map((field) => <CmsField key={field.name} field={field} value={row?.[field.name] ?? (field.kind === "bool" ? true : undefined)} prefix={prefix} />)}
      </div>
      <div className="cms-actions">
        <ConfirmSubmit className="db-button">{row ? "Save changes" : `Add ${section.singular}`}</ConfirmSubmit>
        {row ? <ConfirmSubmit className="db-button db-button-ghost" formAction={deleteRow} confirm={`Delete this ${section.singular}? This cannot be undone.`}>Delete</ConfirmSubmit> : null}
      </div>
    </form>
  );
}

export default async function ContentSectionPage({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const [{ section: slug }, { saved, error }] = await Promise.all([params, searchParams]);
  const section = findSection(slug);
  if (!section) notFound();
  const { data, error: loadError } = await createAdminClient().from(section.table).select("*").order("sort_order").order("id");
  if (loadError) console.error(`${section.title} could not be loaded`, loadError);
  const rows = (data ?? []) as Row[];

  return (
    <div className="dashboard-content">
      <header className="dashboard-page-header">
        <p className="analytics-eyebrow">/ Content (02)</p>
        <h1>{section.title}<span className="db-dot">.</span></h1>
        <p>{section.description} Saving publishes immediately.</p>
      </header>
      <CmsTabs active={section.slug} />
      <CmsStatus saved={saved} error={error ?? (loadError ? `${section.title} could not be loaded. Reload to try again.` : undefined)} />
      <ol className="cms-rows">
        {rows.map((row) => (
          <li key={row.id}>
            <details className="analytics-card cms-row">
              <summary><span className="cms-row-order">{String(row.sort_order ?? "")}</span><span>{section.rowLabel(row)}</span></summary>
              <RowForm section={section} row={row} />
            </details>
          </li>
        ))}
      </ol>
      {!loadError ? (
        <details className="analytics-card cms-row cms-row-new">
          <summary><span className="cms-row-order">+</span><span>Add a new {section.singular}</span></summary>
          <RowForm section={section} />
        </details>
      ) : null}
    </div>
  );
}
