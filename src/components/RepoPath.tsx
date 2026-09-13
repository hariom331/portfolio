import type { Project } from "@/content/types";

// "https://github.com/hariom331/spender-guardian" -> "hariom331/spender-guardian",
// so the card header reads the way the repository is actually addressed.
function repoPath(project: Project): string {
  const github = project.links.find((link) => link.kind === "github");
  if (github === undefined) return project.name;

  const path = github.href.replace(/^https?:\/\/github\.com\//, "");
  return path.replace(/\/$/, "") || project.name;
}

interface RepoPathProps {
  readonly project: Project;
}

// The opening of a project card's title strip: a repository mark and the
// address beside it. The strip's own end slot is left to the card.
export function RepoPath({ project }: RepoPathProps) {
  return (
    <>
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
    </>
  );
}
