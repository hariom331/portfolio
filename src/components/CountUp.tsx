"use client";

import { useEffect, useRef } from "react";

interface CountUpProps {
  readonly prefix: string;
  readonly to: number;
  readonly suffix: string;
  /** Full pre-rendered string, shown until the animation takes over. */
  readonly children: string;
}

const DURATION_MS = 1100;

/** Fast start, long settle. Standard ease-out cubic. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts a numeral up to its real value the first time it scrolls into view.
 *
 * The server renders the finished string, so the correct number is in the
 * HTML for crawlers and for anyone without JavaScript; the animation only
 * replaces it once it is actually going to run. Reduced motion skips it
 * entirely.
 *
 * `aria-hidden` is not used — instead the element carries the final value as
 * its accessible name throughout, so a screen reader never announces the
 * intermediate numbers.
 */
export function CountUp({ prefix, to, suffix, children }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node === null) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") return;

    const numeral = node.querySelector<HTMLElement>("[data-numeral]");
    if (numeral === null) return;

    let frame = 0;
    let safety = 0;
    let start = 0;
    let done = false;

    /**
     * Snap to the real figure and stop.
     *
     * The animation shows intermediate values that are not true, so anything
     * that interrupts it must land on the correct number rather than leave a
     * wrong one on screen. `requestAnimationFrame` does not run while the
     * page is hidden, so a visitor who backgrounds the tab mid-count would
     * otherwise return to a frozen, incorrect figure.
     */
    const settle = () => {
      done = true;
      cancelAnimationFrame(frame);
      clearTimeout(safety);
      numeral.textContent = String(to);
    };

    const step = (now: number) => {
      if (done) return;
      if (start === 0) start = now;
      const progress = Math.min(1, (now - start) / DURATION_MS);
      if (progress >= 1) {
        settle();
        return;
      }
      numeral.textContent = String(Math.round(easeOut(progress) * to));
      frame = requestAnimationFrame(step);
    };

    const onVisibilityChange = () => {
      if (document.hidden) settle();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          numeral.textContent = "0";
          frame = requestAnimationFrame(step);
          // Wall-clock backstop: fires even when rAF is throttled or paused.
          safety = window.setTimeout(settle, DURATION_MS + 400);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      settle();
    };
  }, [to]);

  return (
    <span ref={ref} aria-label={children}>
      <span aria-hidden="true">
        {prefix}
        <span data-numeral="">{to}</span>
        {suffix}
      </span>
    </span>
  );
}
