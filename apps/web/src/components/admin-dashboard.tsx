"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Project, Skill, TimelineEntry } from "@/lib/types";

type Resource = "projects" | "skills" | "timeline_entries";

export function AdminDashboard({ projects, skills, timeline }: {
  projects: Project[];
  skills: Skill[];
  timeline: TimelineEntry[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function request(resource: Resource, method: "POST" | "PATCH" | "DELETE", body?: Record<string, unknown>, id?: number) {
    const supabase = createSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/loginauthentication");
      return;
    }

    const query = new URLSearchParams({ resource });
    if (id) query.set("id", String(id));
    const response = await fetch(`/api/admin.php?${query}`, {
      method,
      headers: {
        authorization: `Bearer ${session.access_token}`,
        ...(body ? { "content-type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) throw new Error("The change was not saved. Confirm your account is authorized and try again.");
    router.refresh();
  }

  async function save(event: React.FormEvent<HTMLFormElement>, resource: Resource, id?: number) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries()) as Record<string, unknown>;

    if (resource === "projects") {
      values.tech_stack = String(values.tech_stack ?? "").split(",").map((item) => item.trim()).filter(Boolean);
      values.featured = values.featured === "on";
      if (!values.image_url) values.image_url = null;
      if (!values.live_url) values.live_url = null;
      if (!values.github_url) values.github_url = null;
      values.sort_order = Number(values.sort_order || 0);
    } else if (resource === "skills") {
      values.proficiency = Number(values.proficiency || 0);
      values.sort_order = Number(values.sort_order || 0);
      if (!values.icon) values.icon = null;
    } else {
      values.sort_order = Number(values.sort_order || 0);
      if (!values.end_date) values.end_date = null;
    }

    try {
      await request(resource, id ? "PATCH" : "POST", values, id);
      setMessage("Saved.");
      if (!id) form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save this item.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(resource: Resource, id: number) {
    if (!window.confirm("Delete this item?")) return;
    setBusy(true);
    setMessage("");
    try {
      await request(resource, "DELETE", undefined, id);
      setMessage("Deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete this item.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    router.replace("/loginauthentication");
    router.refresh();
  }

  return (
    <main className="admin-page" id="main-content">
      <header className="admin-header">
        <div><p className="admin-eyebrow">PORTFOLIO / ADMIN</p><h1>Content dashboard</h1></div>
        <button className="admin-secondary" onClick={signOut}>Sign out</button>
      </header>
      {message ? <p className="admin-message" role="status">{message}</p> : null}

      <section className="admin-section">
        <h2>Projects</h2>
        <ProjectForm onSave={save} busy={busy} />
        {projects.map((item) => <article className="admin-item" key={item.id}>
          <ProjectForm item={item} onSave={save} onDelete={() => remove("projects", item.id)} busy={busy} />
        </article>)}
      </section>

      <section className="admin-section">
        <h2>Skills</h2>
        <SkillForm onSave={save} busy={busy} />
        {skills.map((item) => <article className="admin-item" key={item.id}>
          <SkillForm item={item} onSave={save} onDelete={() => remove("skills", item.id)} busy={busy} />
        </article>)}
      </section>

      <section className="admin-section">
        <h2>Experience &amp; education</h2>
        <TimelineForm onSave={save} busy={busy} />
        {timeline.map((item) => <article className="admin-item" key={item.id}>
          <TimelineForm item={item} onSave={save} onDelete={() => remove("timeline_entries", item.id)} busy={busy} />
        </article>)}
      </section>
    </main>
  );
}

function ProjectForm({ item, onSave, onDelete, busy }: {
  item?: Project;
  onSave: (event: React.FormEvent<HTMLFormElement>, resource: Resource, id?: number) => void;
  onDelete?: () => void;
  busy: boolean;
}) {
  return <form className="admin-form" onSubmit={(event) => onSave(event, "projects", item?.id)}>
    <div className="admin-grid">
      <Field label="Title" name="title" value={item?.title} required />
      <Field label="Tech stack (comma separated)" name="tech_stack" value={item?.tech_stack.join(", ")} required />
      <Field label="Description" name="description" value={item?.description} wide required multiline />
      <Field label="Image URL" name="image_url" value={item?.image_url} type="url" />
      <Field label="Live URL" name="live_url" value={item?.live_url} type="url" />
      <Field label="GitHub URL" name="github_url" value={item?.github_url} type="url" />
      <Field label="Sort order" name="sort_order" value={item?.sort_order ?? 0} type="number" />
    </div>
    <label className="admin-check"><input name="featured" type="checkbox" defaultChecked={item?.featured ?? true} /> Show on portfolio</label>
    <div className="admin-actions"><button disabled={busy}>{item ? "Save project" : "Add project"}</button>{onDelete ? <button className="admin-danger" type="button" disabled={busy} onClick={onDelete}>Delete</button> : null}</div>
  </form>;
}

function SkillForm({ item, onSave, onDelete, busy }: {
  item?: Skill;
  onSave: (event: React.FormEvent<HTMLFormElement>, resource: Resource, id?: number) => void;
  onDelete?: () => void;
  busy: boolean;
}) {
  return <form className="admin-form" onSubmit={(event) => onSave(event, "skills", item?.id)}>
    <div className="admin-grid">
      <Field label="Name" name="name" value={item?.name} required />
      <Field label="Proficiency (0–100)" name="proficiency" value={item?.proficiency ?? 0} type="number" required />
      <Field label="Icon" name="icon" value={item?.icon} />
      <Field label="Sort order" name="sort_order" value={item?.sort_order ?? 0} type="number" />
    </div>
    <div className="admin-actions"><button disabled={busy}>{item ? "Save skill" : "Add skill"}</button>{onDelete ? <button className="admin-danger" type="button" disabled={busy} onClick={onDelete}>Delete</button> : null}</div>
  </form>;
}

function TimelineForm({ item, onSave, onDelete, busy }: {
  item?: TimelineEntry;
  onSave: (event: React.FormEvent<HTMLFormElement>, resource: Resource, id?: number) => void;
  onDelete?: () => void;
  busy: boolean;
}) {
  return <form className="admin-form" onSubmit={(event) => onSave(event, "timeline_entries", item?.id)}>
    <div className="admin-grid">
      <label>Type<select name="type" defaultValue={item?.type ?? "experience"}><option value="experience">Experience</option><option value="education">Education</option></select></label>
      <Field label="Organization" name="organization" value={item?.organization} required />
      <Field label="Role / qualification" name="role" value={item?.role} required />
      <Field label="Start date" name="start_date" value={item?.start_date} required />
      <Field label="End date" name="end_date" value={item?.end_date} />
      <Field label="Sort order" name="sort_order" value={item?.sort_order ?? 0} type="number" />
      <Field label="Description" name="description" value={item?.description} wide required multiline />
    </div>
    <div className="admin-actions"><button disabled={busy}>{item ? "Save entry" : "Add entry"}</button>{onDelete ? <button className="admin-danger" type="button" disabled={busy} onClick={onDelete}>Delete</button> : null}</div>
  </form>;
}

function Field({ label, name, value, type = "text", required = false, wide = false, multiline = false }: {
  label: string;
  name: string;
  value?: string | number | null;
  type?: string;
  required?: boolean;
  wide?: boolean;
  multiline?: boolean;
}) {
  const className = wide ? "admin-field admin-wide" : "admin-field";
  return <label className={className}>{label}{multiline
    ? <textarea name={name} defaultValue={value ?? ""} required={required} />
    : <input name={name} type={type} defaultValue={value ?? ""} required={required} />}</label>;
}
