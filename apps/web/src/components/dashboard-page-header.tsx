import type { ReactNode } from "react";

// Compact module header: eyebrow, title and lede on the left, optional actions on the right.
export function PageHeader({ eyebrow, title, lede, actions }: { eyebrow: string; title: string; lede?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="dashboard-page-header">
      <div>
        <p className="analytics-eyebrow">{eyebrow}</p>
        <h1>{title}<span className="db-dot">.</span></h1>
        {lede ? <p>{lede}</p> : null}
      </div>
      {actions ? <div className="dashboard-page-actions">{actions}</div> : null}
    </header>
  );
}
