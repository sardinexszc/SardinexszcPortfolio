import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="IS — Ivan Christian Salinas, home">
        I<span>S</span>
      </Link>
      <nav className="header-nav" aria-label="Primary">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#skills" className="nav-optional">Skills</a>
        <a href="#contact" className="nav-contact">
          Let&apos;s talk <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
