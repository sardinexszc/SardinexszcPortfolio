import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Sardinexszc home">
        S<span>.</span>
      </Link>
      <nav className="header-nav" aria-label="Primary navigation">
        <Link href="#work">Work</Link>
        <Link href="#about">About</Link>
        <Link href="#contact" className="nav-contact">Let&apos;s talk <ArrowUpRight size={15} /></Link>
      </nav>
    </header>
  );
}