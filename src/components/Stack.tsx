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
  const groups = site.stack.map((group) => ({
    label: group.label,
    // Weight 3 is the claim worth making; everything else is a run of names.
    core: group.items.filter((item) => item.weight === 3),
    rest: group.items.filter((item) => item.weight !== 3),
  }));

  const owned = groups.reduce((sum, group) => sum + group.core.length, 0);

  return (
    <Section
      id="stack"
      title="Stack"
      lead="Grouped the way the account is. The highlighted entries are the ones I own end to end — provisioned, broken and fixed by me. The rest I have worked with and would not claim more than that."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <Lit key={group.label} className="flex flex-col">
            <div className="panel-head">
              <span className="normal-case">{key(group.label)}</span>
              <span className="panel-head-end tnum">
                {pad(group.core.length)} core / {pad(group.rest.length)}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
              <ul className="space-y-1.5">
                {group.core.map((item) => (
                  <li key={item.name} className="core">
                    {item.name}
                  </li>
                ))}
              </ul>

              {/* Tight under the core rows rather than pushed to the panel
                  floor: the panels are stretched to a common height by the
                  grid, and pinning this to the bottom would open a hole in the
                  middle of the shorter ones. */}
              {group.rest.length > 0 ? (
                <div>
                  <p className="tier mb-2.5">also</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.rest.map((item) => (
                      <li
                        key={item.name}
                        // Weight 2 is a working tool and weight 1 is an
                        // acquaintance; the second sits back a step.
                        className={`chip ${item.weight === 1 ? "opacity-65" : ""}`.trim()}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Lit>
        ))}
      </div>

      <p className="text-faint mt-4 flex flex-wrap items-center gap-x-2 font-mono text-[0.6875rem]">
        <span aria-hidden="true" className="text-accent">
          ▸
        </span>
        <span className="tnum">
          {owned} owned end to end, across {groups.length} parts of the estate
        </span>
      </p>
    </Section>
  );
}
