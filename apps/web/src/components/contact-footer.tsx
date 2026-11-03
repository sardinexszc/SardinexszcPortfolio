"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Black contact footer held under the page (CSS sticky), so the page lifts off it like a curtain.
export function ContactFooter({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  // Darken the fixed bar once the page has slid past it and only the black footer is behind it.
  useEffect(() => {
    const page = ref.current?.closest(".pf"), main = document.getElementById("main-content"), bar = page?.querySelector(".pf-bar");
    if (!page || !main || !bar) return;
    const update = () => page.classList.toggle("pf-bar-dark", main.getBoundingClientRect().bottom <= bar.getBoundingClientRect().bottom);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <footer ref={ref} id="contact" className="pf-mf" aria-labelledby="contact-title">
      <h2 id="contact-title" className="visually-hidden">Contact</h2>
      <p className="pf-mf-title" aria-hidden="true">Let’s talk<span className="pf-mf-dot">.</span></p>
      {children}
    </footer>
  );
}
