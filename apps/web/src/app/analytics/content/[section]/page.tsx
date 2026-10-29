import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { findSection, type Section } from "@/lib/cms";
import { CmsField, CmsStatus, CmsTabs } from "@/components/cms-fields";
import { ConfirmSubmit } from "@/components/cms-confirm";
import { PageHeader } from "@/components/dashboard-page-header";
import { isAllowedImage } from "@/lib/work-projects";
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
      <PageHeader eyebrow="/ Content (02)" title="Content" lede="Everything the home page shows. Saving publishes immediately." />
      <CmsTabs active={section.slug} />
      <div className="cms-section-intro"><h2>{section.title}</h2><p>{section.description}</p><span>{rows.length} {rows.length === 1 ? section.singular : `${section.singular}s`}</span></div>
      <CmsStatus saved={saved} error={error ?? (loadError ? `${section.title} could not be loaded. Reload to try again.` : undefined)} />
      {!loadError ? (
        <details className="analytics-card cms-row cms-row-new">
          <summary><span className="cms-row-order" aria-hidden="true">+</span><span className="cms-row-text"><strong>Add a new {section.singular}</strong></span></summary>
          <RowForm section={section} />
        </details>
      ) : null}
      <ol className="cms-rows">
        {rows.map((row) => {
          const image = section.rowImage?.(row);
          const meta = section.rowMeta?.(row);
          const link = section.rowLink?.(row);
          return (
            <li key={row.id} className="cms-row-item">
              <details className="analytics-card cms-row">
                <summary>
                  <span className="cms-row-order">{String(row.sort_order ?? "")}</span>
                  {section.rowImage ? (image && isAllowedImage(image)
                    ? <Image className="cms-row-thumb" src={image} alt="" width={72} height={45} sizes="72px" unoptimized={image.endsWith(".svg")} />
                    : <span className="cms-row-thumb cms-image-empty" aria-hidden="true" />) : null}
                  <span className="cms-row-text"><strong>{section.rowLabel(row)}</strong>{meta ? <small>{meta}</small> : null}</span>
                </summary>
                <RowForm section={section} row={row} />
              </details>
              {link ? <a className="cms-row-link" href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <ArrowUpRight size={13} aria-hidden="true" /><span className="visually-hidden"> (opens in a new tab)</span></a> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
