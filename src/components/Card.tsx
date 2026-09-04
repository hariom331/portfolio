import type { ReactNode } from "react";

interface CardProps {
  readonly children: ReactNode;
  readonly interactive?: boolean;
  readonly className?: string;
}

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
