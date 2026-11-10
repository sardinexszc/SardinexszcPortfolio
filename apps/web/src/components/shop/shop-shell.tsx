import Link from "next/link";
import type { ReactNode } from "react";
import { profile } from "@/lib/profile";
import "../portfolio-page.css";
import "./shop.css";

// Frame for the shop and its policy pages: the portfolio's palette and type, a slim bar, and policy links.
export function ShopShell({ children }: { children: ReactNode }) {
  return (
    <div className="pf shop">
      <header className="shop-bar">
        <Link className="pf-brand" href="/" aria-label="Ivan Salinas portfolio home"><span className="pf-mark" aria-hidden="true">I<span>S</span></span></Link>
        <nav aria-label="Shop">
          <Link href="/shop">Shop</Link>
          <Link href="/">Portfolio</Link>
        </nav>
      </header>
      <main id="main-content" className="shop-main">{children}</main>
      <footer className="shop-foot">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <Link href="/shop/terms">Terms</Link>
        <Link href="/shop/refunds">Refunds</Link>
        <Link href="/privacy">Privacy</Link>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </footer>
    </div>
  );
}
