"use client";

import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";

interface SpotlightCardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

// Position goes out as CSS custom properties, so a move costs two writes
// and no render.
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
