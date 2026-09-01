'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { smoothScrollToId } from '@/lib/smooth-scroll';

export function SiteHeader() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    smoothScrollToId(sectionId);
  };

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Ivan Christian Salinas home">
        I<span>S</span>
      </Link>
      <nav className="header-nav" aria-label="Primary navigation">
        <a href="#work" onClick={(e) => handleNavClick(e, 'work')} aria-label="Go to selected work section">
          Work
        </a>
        <a href="#about" onClick={(e) => handleNavClick(e, 'about')} aria-label="Go to about section">
          About
        </a>
        <a href="#contact" className="nav-contact" onClick={(e) => handleNavClick(e, 'contact')} aria-label="Go to contact section">
          Let&apos;s talk <ArrowUpRight size={15} />
        </a>
      </nav>
    </header>
  );
}
