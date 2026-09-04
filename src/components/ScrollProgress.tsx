"use client";

import { useEffect } from "react";

// Writes how far down the document you are onto the root element, where the
// build bar in the console chrome reads it. A custom property rather than
// React state: it drives one CSS width, so a re-render per frame would be
// wasted work.
export function ScrollProgress() {
  useEffect(() => {
    const root = document.documentElement;
    let pending = false;

    const flush = () => {
      pending = false;
      const scrollable = root.scrollHeight - window.innerHeight;
      // A document shorter than the viewport has nothing to run through.
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      root.style.setProperty(
        "--progress",
        `${Math.min(100, Math.max(0, ratio * 100))}%`,
      );
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(flush);
    };

    flush();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.style.removeProperty("--progress");
    };
  }, []);

  return null;
}
