import Image from "next/image";
import Link from "next/link";
import { formValue, sections, type Field } from "@/lib/cms";
import { isAllowedImage } from "@/lib/work-projects";

export function CmsField({ field, value, prefix }: { field: Field; value: unknown; prefix: string }) {
  const id = `${prefix}-${field.name}`;
  const text = formValue(field, value);
  const hint = field.hint ? <small id={`${id}-hint`}>{field.hint}</small> : null;
  const describedBy = field.hint ? `${id}-hint` : undefined;

  if (field.kind === "bool") {
    return <label className="cms-check" htmlFor={id}><input id={id} name={field.name} type="checkbox" defaultChecked={Boolean(value)} /> {field.label}</label>;
  }
  return (
    <div className={`cms-field${field.kind === "textarea" || field.kind === "lines" || field.kind === "image" ? " cms-field-wide" : ""}`}>
      <label htmlFor={id}>{field.label}{field.required ? <span aria-hidden="true"> *</span> : null}</label>
      {field.kind === "textarea" || field.kind === "lines" ? (
        <textarea id={id} name={field.name} defaultValue={text} required={field.required} rows={Math.min(8, Math.max(3, text.split("\n").length + 1))} aria-describedby={describedBy} />
      ) : field.kind === "select" ? (
        <select id={id} name={field.name} defaultValue={text} required={field.required}>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : field.kind === "image" ? (
        <div className="cms-image">
          {isAllowedImage(text) ? <Image src={text} alt="" width={160} height={100} sizes="160px" unoptimized={text.endsWith(".svg")} /> : <span className="cms-image-empty">No image</span>}
          <div>
            <input id={id} name={field.name} type="text" defaultValue={text} placeholder="/images/… or uploaded URL" aria-describedby={describedBy} />
            <input name={`${field.name}__file`} type="file" accept="image/webp,image/jpeg,image/png,image/avif" aria-label={`Upload ${field.label.toLowerCase()}`} />
          </div>
        </div>
      ) : (
        <input id={id} name={field.name} type={field.kind === "number" ? "number" : field.kind === "url" ? "url" : "text"} defaultValue={text} required={field.required} aria-describedby={describedBy} />
      )}
      {hint}
    </div>
  );
}

export function CmsStatus({ saved, error }: { saved?: string; error?: string }) {
  if (error) return <p role="alert" className="cms-status cms-status-error">{error}</p>;
  if (saved) return <p role="status" className="cms-status">Done: {saved}. The home page now shows it.</p>;
  return null;
}

export function CmsTabs({ active }: { active: string }) {
  const tabs = [{ slug: "", title: "Site copy" }, ...sections];
  return (
    <nav className="cms-tabs" aria-label="Content sections">
      {tabs.map((tab) => {
        const current = tab.slug === active;
        return <Link key={tab.slug} href={`/analytics/content${tab.slug ? `/${tab.slug}` : ""}`} aria-current={current ? "page" : undefined}>{tab.title}</Link>;
      })}
    </nav>
  );
}
