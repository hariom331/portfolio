import { LinkList } from "@/components/LinkList";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SpotlightCard } from "@/components/SpotlightCard";
import { site } from "@/content/site";

/**
 * Personal projects, one card each.
 *
 * Every card ends in a button row. Artefacts that do not exist yet still get
 * a chip, marked "soon" and inert — the card shows what is coming without
 * handing anyone a dead link.
 */
export function Projects() {
  if (site.projects.length === 0) return null;

  // A single project in a two-column grid leaves a conspicuous empty cell, so
  // it takes the full width instead.
  const columns = site.projects.length > 1 ? "md:grid-cols-2" : "";

  return (
    <Section id="projects" title="Personal projects">
      <div className={`grid gap-4 ${columns}`.trim()}>
        {site.projects.map((project, index) => (
          <Reveal key={project.name} delay={index * 90} className="h-full">
            <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
              <h3 className="text-lg font-semibold tracking-tight">
                {project.name}
              </h3>

              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech} className="pill">
                    {tech}
                  </li>
                ))}
              </ul>

              <p className="text-muted mt-4 text-sm leading-relaxed">
                {project.description}
              </p>

              {project.links.length > 0 ? (
                // `mt-auto` pins the button row to the bottom so cards of
                // different text lengths still line up.
                <div className="mt-auto pt-6">
                  <LinkList
                    links={project.links}
                    label={`${project.name} links`}
                    compact
                  />
                </div>
              ) : null}
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
