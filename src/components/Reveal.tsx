"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface RevealProps {
  readonly children: ReactNode;
  /** Stagger, in milliseconds, applied as a transition delay. */
  readonly delay?: number;
  readonly className?: string;
}

/**
 * Fades and lifts its children the first time they scroll into view.
 *
 * The visible flag is written straight to the DOM node rather than held in
 * React state: this is a one-way handoff to the CSS transition, and routing
 * it through state would re-render the subtree for a purely visual change.
 *
 * Observes once and then disconnects — there is no exit animation, and
 * re-animating on scroll-back is a well-known irritation. The matching CSS is
 * scoped to `.js`, so without JavaScript the content is simply visible.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node === null) return;

    const show = () => {
      node.dataset.visible = "true";
    };

    // Older engines without IntersectionObserver just get the content.
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
