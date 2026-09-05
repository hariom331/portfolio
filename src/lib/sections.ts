export interface SectionMeta {
  readonly id: string;
  readonly label: string;
  // The command a section header prints above its title. Each one is a real
  // command that would produce roughly what the section shows.
  readonly command: string;
}

// The page order. Ids must match the id each section renders. The console bar,
// the command palette and the stage numbering all read this list, so the four
// cannot drift apart.
export const SECTIONS: readonly SectionMeta[] = [
  { id: "about", label: "About", command: "cat engineer.yaml" },
  { id: "stack", label: "Stack", command: "terraform state list" },
  { id: "experience", label: "Experience", command: "git log --stat --prod" },
  { id: "projects", label: "Projects", command: "gh repo list --source" },
  { id: "contact", label: "Contact", command: "curl -X POST /engagements" },
];

// Zero-padded position, or null for a section outside the run — the hero,
// which is numbered in neither the bar nor the headers.
export function sectionIndex(id: string): string | null {
  const position = SECTIONS.findIndex((section) => section.id === id);
  if (position === -1) return null;

  return String(position + 1).padStart(2, "0");
}

// Denominator for the "stage 02 / 05" readout.
export const STAGE_COUNT = String(SECTIONS.length).padStart(2, "0");
