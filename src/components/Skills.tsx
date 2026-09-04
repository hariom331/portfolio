import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SpotlightCard } from "@/components/SpotlightCard";
import { site } from "@/content/site";

export function Skills() {
  if (site.stack.length === 0) return null;

  return (
    <Section
      id="skills"
      title="Skills"
      lead="Highlighted items are the tools I work in daily; the rest I have shipped with."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {site.stack.map((group, index) => (
          <Reveal key={group.label} delay={index * 70} className="h-full">
            <SpotlightCard className="flex h-full flex-col p-5 sm:p-6">
              <h3 className="text-muted font-mono text-xs tracking-[0.18em] uppercase">
                {group.label}
              </h3>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((skill) => (
                  <li
                    key={skill.name}
                    className={`pill ${skill.weight === 3 ? "pill-core" : ""}`.trim()}
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
