import { Flagship } from "@/components/Flagship";
import { Lit } from "@/components/Lit";
import { LinkList } from "@/components/LinkList";
import { RepoPath } from "@/components/RepoPath";
import { Section } from "@/components/Section";
import { site } from "@/content/site";

export function Projects() {
  return (
    <Section
      id="projects"
      title="Projects"
      lead="Things built outside the engagement, all of them public — the links go to the source, not to a screenshot."
    >
      <div className="space-y-5">
        {site.flagship ? <Flagship project={site.flagship} /> : null}

        <div className="grid gap-5 lg:grid-cols-2">
          {site.projects.map((project) => (
            <Lit key={project.name} className="flex flex-col">
              <div className="panel-head">
                <RepoPath project={project} />
                <span className="panel-head-end shrink-0">public</span>
              </div>

              <div className="panel-body flex flex-1 flex-col">
                <h3 className="font-mono text-base font-medium tracking-tight">
                  {project.name}
                </h3>

                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {project.description}
                </p>

                <ul
                  aria-label={`Built with, for ${project.name}`}
                  className="mt-5 flex flex-wrap gap-1.5"
                >
                  {project.stack.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <LinkList
                    links={project.links}
                    label={`Links for ${project.name}`}
                  />
                </div>
              </div>
            </Lit>
          ))}
        </div>
      </div>
    </Section>
  );
}
