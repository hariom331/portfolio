import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";

interface SectionProps {
  readonly id: string;
  readonly title: string;
  readonly lead?: string;
  readonly children: ReactNode;
}

export function Section({ id, title, lead, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <Reveal>
      <section id={id} aria-labelledby={headingId} className="scroll-mt-24">
        <div className="mb-7 sm:mb-9">
          <div className="flex items-center gap-4">
            <h2
              id={headingId}
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {title}
            </h2>
            <span
              aria-hidden="true"
              className="from-rule h-px flex-1 bg-gradient-to-r to-transparent"
            />
          </div>

          {lead ? (
            <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed">
              {lead}
            </p>
          ) : null}
        </div>

        {children}
      </section>
    </Reveal>
  );
}
