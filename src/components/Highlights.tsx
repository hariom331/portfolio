import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { site } from "@/content/site";

/**
 * The headline numbers, as a tile grid.
 *
 * A list rather than a `dl`: the reveal and card wrappers each contribute a
 * div, and `dl > div > div > dt` is not valid content. `ul`/`li` says the
 * same thing to a screen reader without the nesting constraint.
 */
export function Highlights() {
  if (site.highlights.length === 0) return null;

  return (
    // Two across for most of the range: in the content column beside the
    // sticky rail, four tiles only stop wrapping their captions at xl.
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {site.highlights.map((highlight, index) => (
        <li key={highlight.label} className="h-full">
          <Reveal delay={index * 70} className="h-full">
            <SpotlightCard className="h-full p-5">
              <p className="gradient-text text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                {highlight.count ? (
                  <CountUp
                    prefix={highlight.count.prefix}
                    to={highlight.count.to}
                    suffix={highlight.count.suffix}
                  >
                    {highlight.value}
                  </CountUp>
                ) : (
                  highlight.value
                )}
              </p>
              <p className="mt-2 text-sm font-medium">{highlight.label}</p>
              <p className="text-muted mt-1 text-xs leading-relaxed">
                {highlight.context}
              </p>
            </SpotlightCard>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
