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
      <Link className="wordmark" href="/" aria-label="Sardinexszc home">
        S<span>.</span>
      </Link>
      <nav className="header-nav" aria-label="Primary navigation">
        <a href="#work" onClick={(e) => handleNavClick(e, 'work')}>
          Work
        </a>
        <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>
          About
        </a>
        <a href="#contact" className="nav-contact" onClick={(e) => handleNavClick(e, 'contact')}>
          Let&apos;s talk <ArrowUpRight size={15} />
        </a>
      </nav>
    </header>
  );
}