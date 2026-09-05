"use client";

import { useEffect, useRef, useState } from "react";

import { site } from "@/content/site";

interface CopyEmailProps {
  readonly className?: string;
}

export function CopyEmail({ className = "" }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // A pending timeout would otherwise call setState on an unmounted button.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      // Blocked clipboard. The address is a mailto link elsewhere on the page,
      // so there is still a way through.
      return;
    }

    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`btn btn-ghost ${className}`.trim()}
    >
      {/* The label is swapped rather than announced separately, so a screen
          reader hears the confirmation on the control that caused it. */}
      <span aria-live="polite">{copied ? "copied ✓" : "copy email"}</span>
    </button>
  );
}
