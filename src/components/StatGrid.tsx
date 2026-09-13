import type { Metric } from "@/content/types";

interface StatGridProps {
  readonly metrics: readonly Metric[];
  readonly className?: string;
}

// The readout a card leads with. An empty list renders nothing, so a card with
// no numbers to quote closes up rather than showing an empty frame.
export function StatGrid({ metrics, className = "" }: StatGridProps) {
  if (metrics.length === 0) return null;

  return (
    <dl className={`stat-grid ${className}`.trim()}>
      {metrics.map((metric) => (
        // The number leads visually, but the label is still the term the value
        // describes, so the order is swapped in CSS rather than in the markup.
        <div key={metric.label} className="stat flex flex-col">
          <dt className="order-2 mt-3">
            <span className="text-fg block text-[0.8125rem] leading-snug font-medium">
              {metric.label}
            </span>
            <span className="text-faint mt-1 block font-mono text-[0.6875rem]">
              {metric.note}
            </span>
          </dt>
          <dd className="stat-value order-1">{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}
