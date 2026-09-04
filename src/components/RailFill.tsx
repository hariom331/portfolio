"use client";

import { useEffect, useRef } from "react";

// The green length of the pipeline spine — how much of the run is behind you.
// It measures the rail it sits in, so the fill tracks the section stack rather
// than the document, and stops at the last stage instead of at the footer.
export function RailFill() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fill = ref.current;
    const rail = fill?.parentElement;
    if (!fill || !rail) return;

    let pending = false;

    const flush = () => {
      pending = false;
      const rect = rail.getBoundingClientRect();
      if (rect.height === 0) return;

      // The waterline sits at the middle of the viewport: a stage counts as
      // run once it has passed the point you are actually reading at.
      const waterline = window.innerHeight / 2;
      const ratio = (waterline - rect.top) / rect.height;
      fill.style.setProperty(
        "--run",
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
    };
  }, []);

  return <div ref={ref} className="rail-fill" aria-hidden="true" />;
}
