import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SpotlightCard } from "@/components/SpotlightCard";
import { site } from "@/content/site";

export function Experience() {
  return (
    <Section id="experience" title="Work experience">
      <div className="space-y-4">
        {site.experience.map((role, index) => (
          <Reveal key={`${role.company}-${role.period}`} delay={index * 80}>
            <SpotlightCard className="p-6 sm:p-7">
              <div className="sm:grid sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                <p className="text-muted font-mono text-xs leading-relaxed sm:pt-1">
                  {role.period}
                  <span className="block">{role.location}</span>
                </p>

                <div className="mt-3 sm:mt-0">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {role.title}, {role.company}
                  </h3>

                  <p className="text-muted mt-2 max-w-[80ch] text-sm leading-relaxed">
                    {role.context}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {role.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex max-w-[86ch] gap-3 text-sm leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {role.tech.length > 0 ? (
                    <ul className="mt-6 flex flex-wrap gap-1.5">
                      {role.tech.map((tech) => (
                        <li key={tech} className="pill">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
