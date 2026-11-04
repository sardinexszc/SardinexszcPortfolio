import Link from "next/link";
import { MessageSquareQuote } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { PageHeader } from "@/components/dashboard-page-header";
import { ConfirmSubmit } from "@/components/cms-confirm";
import { approveTestimonial, deleteTestimonial, hideTestimonial } from "./actions";

type Row = { id: number; name: string; role: string | null; relationship: string; quote: string; email: string | null; status: "pending" | "approved" | "hidden"; source: string; created_at: string };

const notices: Record<string, string> = { approved: "Approved. It now shows on the home page.", hidden: "Hidden. It no longer shows on the home page.", deleted: "Deleted." };
const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" });

function Card({ row }: { row: Row }) {
  return (
    <li className="tq-card">
      <blockquote>“{row.quote}”</blockquote>
      <p className="tq-who"><strong>{row.name}</strong>{row.role ? ` · ${row.role}` : ""} · {row.relationship}</p>
      <p className="tq-meta">
        {dateFormat.format(new Date(row.created_at))} · {row.source === "form" ? "Submitted on the site" : "Added in the CMS"}
        {row.email ? <> · <a href={`mailto:${row.email}`}>{row.email}</a> (private)</> : " · no email given"}
      </p>
      <form className="tq-actions">
        <input type="hidden" name="id" value={row.id} />
        {row.status !== "approved" && <ConfirmSubmit className="db-button" formAction={approveTestimonial}>Approve</ConfirmSubmit>}
        {row.status === "pending" && <ConfirmSubmit className="db-button db-button-ghost" formAction={hideTestimonial}>Reject</ConfirmSubmit>}
        {row.status === "approved" && <ConfirmSubmit className="db-button db-button-ghost" formAction={hideTestimonial}>Unpublish</ConfirmSubmit>}
        {row.status === "approved" && <Link className="db-button db-button-ghost" href="/analytics/content/testimonials">Edit wording or order</Link>}
        <ConfirmSubmit className="db-button db-button-ghost" formAction={deleteTestimonial} confirm={`Delete the testimonial from ${row.name}? This cannot be undone.`}>Delete</ConfirmSubmit>
      </form>
    </li>
  );
}

// Review queue: visitor submissions wait here as 'pending' and reach the home page only when approved.
export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<{ notice?: string; error?: string }> }) {
  await requireAdmin();
  const { notice, error } = await searchParams;
  const { data, error: loadError } = await createAdminClient().from("testimonials")
    .select("id,name,role,relationship,quote,email,status,source,created_at").order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];
  const groups = [
    { status: "pending", title: "Awaiting review", empty: "Nothing waiting. New submissions from the site appear here first." },
    { status: "approved", title: "Approved · on the site", empty: "None approved yet, so the home page shows only the invitation to leave one." },
    { status: "hidden", title: "Hidden", empty: "Nothing hidden." },
  ] as const;
  return (
    <div className="dashboard-content">
      <PageHeader eyebrow="/ Testimonials" title="Testimonials" lede="Approve what visitors send before it appears on the home page." />
      {notice && notices[notice] && <p role="status" className="analytics-success">{notices[notice]}</p>}
      {(error || loadError) && <p role="alert" className="analytics-error">{loadError ? "Testimonials could not be loaded." : "That change could not be saved. Please try again."}</p>}
      <div className="db-grid">
        {groups.map((group) => {
          const items = rows.filter((row) => row.status === group.status);
          return (
            <section key={group.status} className="analytics-card db-card db-span-12">
              <div className="db-card-head"><div><p className="analytics-eyebrow">{group.status.toUpperCase()}</p><h2>{group.title}</h2></div><span>{items.length}</span></div>
              {items.length ? <ol className="tq-list">{items.map((row) => <Card key={row.id} row={row} />)}</ol>
                : <p className="tq-empty"><MessageSquareQuote size={18} aria-hidden="true" /> {group.empty}</p>}
            </section>
          );
        })}
      </div>
    </div>
  );
}
