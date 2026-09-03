import type { LinkKind } from "@/content/types";

/**
 * Inline SVG glyphs for link buttons.
 *
 * Inline rather than an icon package: eight small paths do not justify a
 * dependency, and they inherit `currentColor` so they follow the theme for
 * free. Every glyph is decorative — the adjacent text label carries the
 * meaning — so they are all `aria-hidden`.
 */

const paths: Record<LinkKind, string> = {
  github:
    "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
  demo: "M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  docs: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5",
  video: "M10 8.64 15.27 12 10 15.36zM3 5h18v14H3z",
  writeup: "M4 20h16M4 20V4h9l5 5v11M13 4v5h5",
  resume: "M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.75-1.95 4 0 4.4 2.5 4.4 5.8V21h-4v-5.6c0-1.35-.03-3.1-1.95-3.1-1.95 0-2.25 1.48-2.25 3v5.7h-4z",
  email: "M3 6h18v12H3zM3 7l9 6 9-6",
};

/** Paths that are outlines rather than solid shapes. */
const stroked: ReadonlySet<LinkKind> = new Set<LinkKind>([
  "demo",
  "docs",
  "writeup",
  "resume",
  "email",
]);

interface LinkIconProps {
  readonly kind: LinkKind;
}

export function LinkIcon({ kind }: LinkIconProps) {
  const isStroked = stroked.has(kind);

  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
      fill={isStroked ? "none" : "currentColor"}
      stroke={isStroked ? "currentColor" : "none"}
      strokeWidth={isStroked ? 1.8 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[kind]} />
    </svg>
  );
}
