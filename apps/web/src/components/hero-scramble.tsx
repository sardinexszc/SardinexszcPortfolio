'use client';

import { useEffect, useRef } from 'react';
import { animate, scrambleText } from 'animejs';

interface HeroScrambleProps {
  children: React.ReactNode;
}

export function HeroScrambleText({ children }: HeroScrambleProps) {
  const elementRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Use anime.js scrambleText function to animate the heading
    // scrambleText() returns a function-based tween value that reveals text through scrambling
    animate(elementRef.current, {
      innerHTML: scrambleText({
        text: 'Building software that solves<br /><em>real-world problems.</em>',
        duration: 2000,
        revealDelay: 100,
      }),
    });
  }, []);

  return <h1 ref={elementRef} id="hero-title">{children}</h1>;
}
