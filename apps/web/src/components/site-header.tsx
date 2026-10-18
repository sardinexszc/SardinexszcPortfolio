import { FolderGit2, MessageCircle, UserRound, Wrench } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="IS — Ivan Christian Salinas, home">
        I<span>S</span>
      </Link>
      <nav className="header-nav" aria-label="Primary">
        <a href="#work"><FolderGit2 size={16} aria-hidden="true" /> Work</a>
        <a href="#about"><UserRound size={16} aria-hidden="true" /> About</a>
        <a href="#skills" className="nav-optional"><Wrench size={16} aria-hidden="true" /> Skills</a>
        <a href="#contact" className="nav-contact">
          <MessageCircle size={16} aria-hidden="true" /> Let&apos;s talk
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
