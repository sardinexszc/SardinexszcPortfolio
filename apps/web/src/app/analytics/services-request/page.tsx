import { requireAdmin } from "@/lib/supabase/require-admin";

export default async function ServicesRequestPage() {
  await requireAdmin();
  return (
    <div className="dashboard-content">
      <header className="dashboard-page-header">
        <p className="analytics-eyebrow">WORKSPACE / 02</p>
        <h1>Services Request</h1>
        <p>A dedicated space for service requests.</p>
      </header>
      <section className="analytics-card dashboard-placeholder">
        <span className="dashboard-placeholder-mark" aria-hidden="true">02 / 03</span>
        <h2>Service requests are coming next.</h2>
        <p>This module is ready for its request form and management tools in the next development stage.</p>
      </section>
    </div>
  );
}
