import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";

interface SectionProps {
  /** Also used to derive the heading's id, so the section is labelled. */
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
}

/**
 * A titled page section. The heading stays quiet — this is a one-page
 * document, so headings are signposts, not banners. The gradient rule beside
 * each one is what carries the visual rhythm down the page.
 */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <Reveal>
      <section id={id} aria-labelledby={headingId}>
        <div className="mb-6 flex items-center gap-3">
          <h2
            id={headingId}
            className="text-muted font-mono text-xs font-medium tracking-[0.18em] uppercase"
          >
            {title}
          </h2>
          <span
            aria-hidden="true"
            className="from-rule h-px flex-1 bg-gradient-to-r to-transparent"
          />
        </div>
        {children}
      </section>
    </Reveal>
  );
}
