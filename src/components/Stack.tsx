import { Lit } from "@/components/Lit";
import { Section } from "@/components/Section";
import { site } from "@/content/site";

// "Cloud & Infrastructure" -> "cloud-infrastructure", so the panel is titled
// the way the namespace would be addressed rather than the way prose reads.
function key(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pad(count: number): string {
  return String(count).padStart(2, "0");
}

export function Stack() {
  const total = site.stack.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <Section
      id="stack"
      title="Stack"
      lead="Grouped the way the account is. Everything on this list is something I have run in production — provisioned, broken and fixed. There is no aspirational tier."
    >
      {/* items-start, not stretch: the groups differ enough in size that a
          stretched panel leaves a hole inside its own border, which reads as
          content that failed to load. Ragged bottoms read as a card grid. */}
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {site.stack.map((group) => (
          <Lit key={group.label} className="flex flex-col">
            <div className="panel-head">
              <span className="normal-case">{key(group.label)}</span>
              <span className="panel-head-end tnum">
                {pad(group.items.length)} resources
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <ul className="skill-grid">
                {group.items.map((name) => (
                  <li key={name} className="skill">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </Lit>
        ))}
      </div>

      <p className="text-faint mt-4 flex flex-wrap items-center gap-x-2 font-mono text-[0.6875rem]">
        <span aria-hidden="true" className="text-accent">
          ▸
        </span>
        <span className="tnum">
          {total} resources across {site.stack.length} parts of the estate
        </span>
      </p>
    </Section>
  );
}
