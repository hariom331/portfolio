import type { ReactNode } from "react";

interface CardProps {
  readonly children: ReactNode;
  /** Adds the lift-and-glow hover treatment. Off for non-interactive blocks. */
  readonly interactive?: boolean;
  readonly className?: string;
}

/** The frosted-glass surface every content block sits on. */
export function Card({
  children,
  interactive = false,
  className = "",
}: CardProps) {
  return (
    <div
      className={`glass ${interactive ? "glass-hover" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
