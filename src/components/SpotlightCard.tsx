"use client";

import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";

interface SpotlightCardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * A glass card with a soft highlight that tracks the cursor.
 *
 * Position is published as two CSS custom properties and consumed by a
 * `radial-gradient` overlay, so the only per-move work is writing two strings
 * — no React render, no layout read beyond the one `getBoundingClientRect`.
 *
 * Pointer events cover mouse, pen and touch; on touch there is no hover state
 * so the highlight simply never shows, which is the right outcome.
 */
export function SpotlightCard({
  children,
  className = "",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (node === null) return;

    const bounds = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className={`glass glass-hover spotlight ${className}`.trim()}
    >
      {children}
    </div>
  );
}
