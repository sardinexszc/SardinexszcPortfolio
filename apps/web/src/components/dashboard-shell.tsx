"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { signOut } from "@/app/loginauthentication/actions";
import { AuthSubmitButton } from "@/components/auth-feedback";
import { DashboardNavigation } from "@/components/dashboard-navigation";

export function DashboardShell({ children, email }: { children: ReactNode; email: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleLabel = collapsed ? "Expand sidebar" : "Collapse sidebar";

  return (
    <div className={`dashboard-layout${collapsed ? " dashboard-layout-collapsed" : ""}`}>
      <aside className="dashboard-sidebar" aria-label="Dashboard sidebar">
        <div className="dashboard-sidebar-top">
          <div className="dashboard-sidebar-identity">
            <Link href="/" className="dashboard-brand" aria-label="Ivan Salinas portfolio home">IS<span>.</span></Link>
            <div className="dashboard-sidebar-heading">
              <p className="dashboard-sidebar-eyebrow">PORTFOLIO / ADMIN</p>
              <p className="dashboard-sidebar-title">Workspace</p>
            </div>
          </div>
          <button type="button" className="dashboard-sidebar-toggle" onClick={() => setCollapsed(!collapsed)} aria-label={toggleLabel} title={toggleLabel}>
            {collapsed ? <PanelLeftOpen size={20} aria-hidden="true" /> : <PanelLeftClose size={20} aria-hidden="true" />}
          </button>
        </div>
        <DashboardNavigation />
        <div className="dashboard-sidebar-footer">
          <span className="dashboard-account-label">Signed in as</span>
          <span className="dashboard-account-email" title={email}>{email}</span>
          <form action={signOut}><AuthSubmitButton action="sign-out" /></form>
        </div>
      </aside>
      <main id="main-content" className="dashboard-main">{children}</main>
    </div>
  );
}
