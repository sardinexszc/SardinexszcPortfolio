"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FilePenLine, Inbox, Settings } from "lucide-react";

const items = [
  { href: "/analytics", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics/content", label: "Content", icon: FilePenLine },
  { href: "/analytics/services-request", label: "Services Request", icon: Inbox },
  { href: "/analytics/account-settings", label: "Account Settings", icon: Settings },
];

export function DashboardNavigation() {
  const pathname = usePathname();
  // Content has sub-pages, so it stays active for every /analytics/content/… path.
  const isActive = (href: string) => pathname === href || (href === "/analytics/content" && pathname.startsWith(`${href}/`));
  return (
    <nav id="dashboard-modules" className="dashboard-nav" aria-label="Dashboard modules">
      <span className="dashboard-nav-label">Modules</span>
      {items.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} title={label} className={`dashboard-nav-link${isActive(href) ? " dashboard-nav-link-active" : ""}`} aria-current={isActive(href) ? "page" : undefined}>
          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
