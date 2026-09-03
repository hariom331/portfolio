import Image from "next/image";

import { Card } from "@/components/Card";
import { LinkList } from "@/components/LinkList";
import { Section } from "@/components/Section";
import { site } from "@/content/site";

/**
 * The section the page exists for — roughly half of it, once there is a
 * project to put here.
 *
 * Renders nothing while `site.flagship` is null. That is deliberate: an empty
 * "flagship coming soon" block is a worse signal to a recruiter than a page
 * that does not claim to have one yet.
 */
export function Flagship() {
  const { flagship } = site;
  if (flagship === null) return null;

  return (
    <Section id="flagship" title="Flagship project">
      <Card className="overflow-hidden p-6 sm:p-8">
        <h3 className="text-2xl font-semibold tracking-tight">
          <span className="gradient-text">{flagship.name}</span>
        </h3>
        <p className="text-muted mt-2">{flagship.tagline}</p>

        {flagship.diagram ? (
          <Image
            src={flagship.diagram.src}
            alt={flagship.diagram.alt}
            width={flagship.diagram.width}
            height={flagship.diagram.height}
            className="border-rule mt-7 h-auto w-full rounded-xl border"
            priority
          />
        ) : null}

        <p className="mt-7 leading-relaxed">{flagship.problem}</p>

        <h4 className="text-muted mt-9 font-mono text-xs font-medium tracking-[0.18em] uppercase">
          The hard parts
        </h4>
        <ul className="mt-4 space-y-3">
          {flagship.hardParts.map((part) => (
            <li key={part} className="flex gap-3 text-sm leading-relaxed">
              <span
                aria-hidden="true"
                className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              />
              <span>{part}</span>
            </li>
          ))}
        </ul>

        {flagship.metrics.length > 0 ? (
          <dl className="border-rule mt-9 grid grid-cols-1 gap-6 border-t pt-7 sm:grid-cols-3">
            {flagship.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-muted text-xs tracking-wide uppercase">
                  {metric.label}
                </dt>
                <dd className="gradient-text mt-1.5 text-3xl font-semibold tabular-nums">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-8">
          <LinkList links={flagship.links} label={`${flagship.name} links`} />
        </div>
      </Card>
    </Section>
  );
}
