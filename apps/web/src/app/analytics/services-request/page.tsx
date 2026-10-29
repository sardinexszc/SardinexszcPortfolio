import { Inbox, Mail } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { profile } from "@/lib/profile";
import { PageHeader } from "@/components/dashboard-page-header";

export default async function ServicesRequestPage() {
  await requireAdmin();
  return (
    <div className="dashboard-content">
      <PageHeader eyebrow="/ Requests (03)" title="Requests" lede="Enquiries from recruiters and clients." />
      <div className="db-grid">
        <section className="analytics-card db-card db-span-8 db-empty">
          <Inbox size={28} strokeWidth={1.6} aria-hidden="true" />
          <h2>No requests in the workspace yet</h2>
          <p>The site has no request form. Enquiries arrive by email from the Contact section on the home page, so check your inbox for them.</p>
          <div className="db-empty-actions">
            <a className="db-button" href={`mailto:${profile.email}`}><Mail size={16} aria-hidden="true" /> Open {profile.email}</a>
            <a className="db-button db-button-ghost" href="/#contact" target="_blank" rel="noopener noreferrer">See the Contact section<span className="visually-hidden"> (opens in a new tab)</span></a>
          </div>
        </section>
        <section className="analytics-card db-card db-span-4">
          <div className="db-card-head"><div><p className="analytics-eyebrow">HOW IT WORKS</p><h2>Where enquiries go</h2></div></div>
          <ol className="db-steps">
            <li>A visitor clicks your email in the Contact section.</li>
            <li>Their mail app opens a message to {profile.email}.</li>
            <li>You reply from your inbox. Nothing is stored here.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
