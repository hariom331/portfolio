"use client";

import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";

interface LitProps {
  readonly children: ReactNode;
  readonly className?: string;
}

// A panel whose top rule lights under the pointer, the way a readout tracks a
// finger. The position goes straight onto the element as a custom property —
// putting it in state would re-render the card on every pointer move.
export function Lit({ children, className = "" }: LitProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (node === null) return;

    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`panel lit ${className}`.trim()}
    >
      {children}
    </div>
  );
}
