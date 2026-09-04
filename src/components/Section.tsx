"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { SECTIONS, STAGE_COUNT, sectionIndex } from "@/lib/sections";

interface SectionProps {
  readonly id: string;
  readonly title: string;
  readonly lead?: string;
  readonly children: ReactNode;
}

// A section is a stage of the run. It watches itself cross a band at the middle
// of the viewport and reports queued, running or passed — which is what colours
// its node on the rail and what the reveal transition hangs off.
//
// The state is written straight onto the element rather than held in React:
// nothing but CSS reads it, so a render per scroll event would buy nothing.
export function Section({ id, title, lead, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node === null) return;

    // Without an observer nothing can be staged, so show it all as run.
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.state = "passed";
      node.dataset.visible = "true";
      return;
    }

    // Two different questions, so two different observers. Which stage is
    // running is about the middle of the viewport — a band narrow enough that
    // a tall and a short stage cannot both claim it. Whether a stage has been
    // revealed is about its top edge reaching the bottom of the viewport,
    // which happens much earlier; sharing the band would leave whole sections
    // blank until they were half read.
    const staging = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.dataset.state = "running";
          } else {
            // Above the band means read; below it means not reached yet.
            node.dataset.state =
              entry.boundingClientRect.top < 0 ? "passed" : "pending";
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    let delivered = false;

    const reveal = new IntersectionObserver(
      (entries) => {
        delivered = true;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          node.dataset.visible = "true";
          reveal.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    staging.observe(node);
    reveal.observe(node);

    // An observer reports on its target as soon as it starts watching it, so a
    // silent one is a broken one — and a broken one would leave the section at
    // opacity zero for good. The reveal is an ornament and the writing is the
    // point, so if nothing has arrived by now, show it and stop trying.
    const watchdog = window.setTimeout(() => {
      if (delivered) return;

      node.dataset.visible = "true";
      reveal.disconnect();
      staging.disconnect();
    }, 1200);

    return () => {
      window.clearTimeout(watchdog);
      staging.disconnect();
      reveal.disconnect();
    };
  }, []);

  const headingId = `${id}-heading`;
  const index = sectionIndex(id);
  const command = SECTIONS.find((section) => section.id === id)?.command;

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={headingId}
      data-state="pending"
      data-reveal=""
      data-visible="false"
      // Positions the stage node against the rail in the left gutter.
      className="relative scroll-mt-24"
    >
      {/* Ornament, not content: the number is already implied by the order, so
          the node stays out of the accessibility tree. */}
      {index ? (
        <span aria-hidden="true" className="node">
          <span className="node-num">{index}</span>
          <svg
            viewBox="0 0 24 24"
            width="11"
            height="11"
            className="node-tick"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m4 12.5 5.5 5.5L20 6.5" />
          </svg>
        </span>
      ) : null}

      <header className="mb-7 sm:mb-9">
        {index ? (
          <p className="stage-status tnum" aria-hidden="true">
            <span>
              stage {index} / {STAGE_COUNT}
            </span>
            <span>·</span>
            <span>
              <span className="stage-word stage-word-pending">queued</span>
              <span className="stage-word stage-word-running">running</span>
              <span className="stage-word stage-word-passed">passed</span>
            </span>
          </p>
        ) : null}

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
          <h2
            id={headingId}
            className="display text-2xl leading-tight sm:text-[1.75rem]"
          >
            {title}
          </h2>

          {command ? (
            <code className="text-faint font-mono text-xs">
              <span className="text-accent">$</span> {command}
            </code>
          ) : null}

          <span
            aria-hidden="true"
            className="from-line-2 hidden h-px flex-1 bg-gradient-to-r to-transparent sm:block"
          />
        </div>

        {lead ? (
          <p className="text-muted mt-4 max-w-2xl text-sm leading-relaxed">
            {lead}
          </p>
        ) : null}
      </header>

      {children}
    </section>
  );
}
