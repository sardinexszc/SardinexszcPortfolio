"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Code2, Cpu, Database } from "lucide-react";
import { SERVICE_ICONS } from "@/lib/cms";
import { ConfirmSubmit } from "@/components/cms-confirm";

// Sticky save bar for a long CMS form: Save stays in reach and says when there are unsaved edits.
export function CmsSaveBar({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const markDirty = () => setDirty(true);
    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    return () => { form.removeEventListener("input", markDirty); form.removeEventListener("change", markDirty); };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    // Ask before closing the tab or reloading with unsaved edits.
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  return (
    <div ref={ref} className="cms-savebar" data-dirty={dirty || undefined}>
      <span role="status">{dirty ? "Unsaved changes" : "No unsaved changes"}</span>
      <ConfirmSubmit className="db-button">{children}</ConfirmSubmit>
    </div>
  );
}

const icons = { code: Code2, database: Database, cpu: Cpu };

// One Disciplines column; the icon preview follows the select, as the home page draws it.
export function DisciplineCard({ index, service }: { index: number; service?: { title: string; text: string; icon: string } }) {
  const [icon, setIcon] = useState(service?.icon ?? "code");
  const Icon = icons[icon as keyof typeof icons] ?? Code2;
  return (
    <div className="cms-service">
      <div className="cms-service-head">
        <span className="cms-service-icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
        <span className="analytics-eyebrow">DISCIPLINE {index + 1}</span>
      </div>
      <label htmlFor={`service-${index}-title`}>Title</label>
      <input id={`service-${index}-title`} name={`service_${index}_title`} defaultValue={service?.title ?? ""} />
      <label htmlFor={`service-${index}-text`}>One line</label>
      <textarea id={`service-${index}-text`} name={`service_${index}_text`} rows={3} defaultValue={service?.text ?? ""} />
      <label htmlFor={`service-${index}-icon`}>Icon</label>
      <select id={`service-${index}-icon`} name={`service_${index}_icon`} value={icon} onChange={(event) => setIcon(event.target.value)}>
        {SERVICE_ICONS.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>
    </div>
  );
}
