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

    // Get the original text content (plain text without HTML)
    const originalText = 'Building software that solves\nreal-world problems.';

    // Use anime.js with scrambleText function
    animate(elementRef.current, {
      innerHTML: [
        {
          value: scrambleText({
            text: originalText,
          }),
        },
        {
          value: originalText,
        },
      ],
      duration: 1500,
      easing: 'easeInOutQuad',
    });
  }, []);

  return <h1 ref={elementRef} id="hero-title">{children}</h1>;
}
