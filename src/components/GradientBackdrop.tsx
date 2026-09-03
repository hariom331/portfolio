/**
 * The drifting gradient mesh behind the page.
 *
 * Fixed, `z-index: -1`, `pointer-events: none` — it never participates in
 * layout or hit-testing. Marked `aria-hidden` because it carries no meaning.
 */
export function GradientBackdrop() {
  return (
    <div className="mesh" aria-hidden="true">
      <div className="mesh-blob mesh-blob-1" />
      <div className="mesh-blob mesh-blob-2" />
      <div className="mesh-blob mesh-blob-3" />
    </div>
  );
}
