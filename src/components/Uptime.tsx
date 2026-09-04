"use client";

import { useEffect, useRef } from "react";

import { site } from "@/content/site";
import { elapsedSince, formatUptime } from "@/lib/time";

// Time in the current role, printed the way `uptime` prints it. Written to the
// DOM after mount rather than during render: the site is a static export, so a
// value computed at render time would be frozen at the build date.
export function Uptime() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node === null) return;

    const since = site.experience.find((role) => role.since)?.since;
    if (since === undefined) return;

    const elapsed = elapsedSince(since, new Date());
    if (elapsed !== null) node.textContent = formatUptime(elapsed);
  }, []);

  return (
    <>
      {/* The dash holds the line's width while the value is worked out, so the
          row does not jump when it lands. */}
      <span ref={ref} className="text-fg tnum">
        —
      </span>
      <span className="text-faint">in production</span>
    </>
  );
}
