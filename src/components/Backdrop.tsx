// Four inert layers behind everything: the hairline lattice the whole layout
// is measured against, two colour blooms that keep the page from reading as a
// flat fill, and a film of grain over the lot.
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-grid" />
      <div className="backdrop-bloom" />
      <div className="backdrop-bloom-2" />
      <div className="backdrop-grain" />
    </div>
  );
}
