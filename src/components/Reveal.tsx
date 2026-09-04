"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface RevealProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
}

// Writes the flag to the DOM instead of React state: it only drives a CSS
// transition, so a re-render would be wasted work.
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node === null) return;

    const show = () => {
      node.dataset.visible = "true";
    };

    // No IntersectionObserver: just show it.
    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-visible="false"
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
