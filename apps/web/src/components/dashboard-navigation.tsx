"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, Settings } from "lucide-react";

const items = [
  { href: "/analytics", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics/services-request", label: "Services Request", icon: Inbox },
  { href: "/analytics/account-settings", label: "Account Settings", icon: Settings },
];

export function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <nav className="dashboard-nav" aria-label="Dashboard modules">
      <span className="dashboard-nav-label">Modules</span>
      {items.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={`dashboard-nav-link${pathname === href ? " dashboard-nav-link-active" : ""}`} aria-current={pathname === href ? "page" : undefined}>
          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
