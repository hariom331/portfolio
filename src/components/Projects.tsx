import { Lit } from "@/components/Lit";
import { LinkList } from "@/components/LinkList";
import { Section } from "@/components/Section";
import { site } from "@/content/site";
import type { Project } from "@/content/types";

// "https://github.com/hariom331/spender-guardian" -> "hariom331/spender-guardian",
// so the card header reads the way the repository is actually addressed.
function repoPath(project: Project): string {
  const github = project.links.find(
    (link) => link.kind === "github" && !link.pending,
  );
  if (github === undefined) return project.name;

  const path = github.href.replace(/^https?:\/\/github\.com\//, "");
  return path.replace(/\/$/, "") || project.name;
}

export function Projects() {
  return (
    <Section
      id="projects"
      title="Projects"
      lead="Things built outside the engagement. Both are public — the links go to the source, not to a screenshot."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {site.projects.map((project) => (
          <Lit key={project.name} className="flex flex-col">
            <div className="panel-head">
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                aria-hidden="true"
                focusable="false"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M4 19.5V6a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 1.5ZM19 20H6a2 2 0 0 1 0-4h13" />
              </svg>
              <span className="truncate normal-case">{repoPath(project)}</span>
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
    </Section>
  );
}
