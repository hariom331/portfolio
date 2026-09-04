import { Lit } from "@/components/Lit";
import { Manifest } from "@/components/Manifest";
import { Section } from "@/components/Section";
import { site } from "@/content/site";

export function About() {
  const current = site.experience[0];

  return (
    <Section id="about" title="About">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div className="flex flex-col gap-5">
          <p className="text-fg text-[0.9375rem] leading-relaxed sm:text-base">
            {site.positioning}
          </p>

          {current ? (
            <div className="border-line border-t pt-5">
              <p className="mono-label">Current engagement</p>
              <p className="text-muted mt-2.5 text-sm leading-relaxed">
                {current.context}
              </p>
            </div>
          ) : null}

          <div className="border-line border-t pt-5">
            <p className="mono-label">How I work</p>
            <p className="text-muted mt-2.5 text-sm leading-relaxed">
              {site.philosophy}
            </p>
          </div>
        </div>

        <Lit>
          <div className="panel-head">
            <span>engineer.yaml</span>
            <span className="panel-head-end">read-only</span>
          </div>

          <div className="p-4 sm:p-5">
            <Manifest />
          </div>
        </Lit>
      </div>
    </Section>
  );
}
