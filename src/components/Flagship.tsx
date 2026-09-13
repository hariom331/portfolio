import { Lit } from "@/components/Lit";
import { LinkList } from "@/components/LinkList";
import { RepoPath } from "@/components/RepoPath";
import { StatGrid } from "@/components/StatGrid";
import type { FlagshipProject, Milestone } from "@/content/types";

type Standing = "done" | "next" | "queued";

// The page's own vocabulary for a run: green for what passed, the unfinished
// colour for what the work is on, and faint for what waits behind it.
const STANDING = {
  done: { mark: "✔", tone: "text-ok", fill: "bg-ok" },
  next: { mark: "❯", tone: "text-warn", fill: "bg-warn" },
  queued: { mark: "·", tone: "text-faint", fill: "bg-line-2" },
} as const satisfies Record<
  Standing,
  { mark: string; tone: string; fill: string }
>;

// Only the first unfinished milestone is next; the rest queue behind it, which
// is how a build plan actually runs.
function standingOf(milestones: readonly Milestone[], index: number): Standing {
  if (milestones[index].done) return "done";
  return milestones.findIndex((milestone) => !milestone.done) === index
    ? "next"
    : "queued";
}

interface FlagshipProps {
  readonly project: FlagshipProject;
}

// The project still being built. On the page it is cut like the cards beside
// it — name, description, stack, links — and marked out only by its badge and
// a one-line read of the build plan. The design behind it folds under the card
// the way a CI log folds a step: there for whoever opens it, and not pushing
// the rest of the section down the page for everyone who doesn't.
export function Flagship({ project }: FlagshipProps) {
  const { milestones, lifecycle } = project;
  const landed = milestones.filter((milestone) => milestone.done).length;
  const shipped = landed === milestones.length;
  const next = milestones.find((milestone) => !milestone.done);

  return (
    <Lit>
      <div className="panel-head">
        <RepoPath project={project} />
        <span
          className={`panel-head-end flex shrink-0 items-center gap-2 ${shipped ? "text-ok" : "text-warn"}`}
        >
          <span
            aria-hidden="true"
            className={shipped ? "live-dot" : "live-dot live-dot-warn"}
          />
          {shipped ? "shipped" : "building"}
        </span>
      </div>

      <div className="panel-body">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10">
          <div>
            <h3 className="font-mono text-base font-medium tracking-tight">
              {project.name}
            </h3>

            <p className="text-muted mt-3 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {milestones.length > 0 ? (
            <div className="self-start lg:pt-1">
              <p className="flex items-baseline justify-between gap-3">
                <span className="mono-label">build plan</span>
                <span className="text-faint tnum font-mono text-[0.6875rem]">
                  {landed} / {milestones.length} landed
                </span>
              </p>

              <div
                aria-hidden="true"
                className="mt-2.5 grid auto-cols-fr grid-flow-col gap-[3px]"
              >
                {milestones.map((milestone, index) => (
                  <span
                    key={milestone.label}
                    className={`h-1 rounded-[1px] ${STANDING[standingOf(milestones, index)].fill}`}
                  />
                ))}
              </div>

              {next ? (
                <p className="mt-3 grid grid-cols-[0.9rem_minmax(0,1fr)] items-baseline gap-1.5 font-mono">
                  <span aria-hidden="true" className="text-warn text-xs">
                    {STANDING.next.mark}
                  </span>
                  <span>
                    <span className="sr-only">Next: </span>
                    <span className="text-fg block text-[0.8125rem]">
                      {next.label}
                    </span>
                    <span className="text-faint mt-0.5 block text-[0.6875rem]">
                      {next.detail}
                    </span>
                  </span>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
          <ul
            aria-label={`Built with, for ${project.name}`}
            className="flex flex-wrap gap-1.5"
          >
            {project.stack.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>

          <LinkList links={project.links} label={`Links for ${project.name}`} />
        </div>
      </div>

      <details className="fold">
        <summary>
          <span aria-hidden="true" className="fold-caret">
            ▸
          </span>
          design notes
          <span className="text-faint hidden tracking-normal normal-case sm:inline">
            — escalation, decisions, full build plan
          </span>
        </summary>

        <div className="panel-body">
          <p className="border-accent max-w-3xl border-l-2 pl-3">
            <span className="mono-label block">design rule</span>
            <span className="text-fg mt-1 block text-[0.9375rem] leading-relaxed">
              {project.principle}
            </span>
          </p>

          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-6">
            <div>
              <StatGrid metrics={project.metrics} />

              <h4 className="mono-label mt-8">escalation · per resource</h4>
              <ol className="ladder mt-3">
                {lifecycle.steps.map((step) => (
                  <li key={step.state} className="rung">
                    <p className="flex items-baseline justify-between gap-3 font-mono">
                      <span className="rung-state">{step.state}</span>
                      <span className="text-faint tnum text-[0.6875rem]">
                        {step.at}
                      </span>
                    </p>
                    <p className="text-muted mt-2 text-[0.8125rem] leading-snug">
                      {step.action}
                    </p>
                  </li>
                ))}
              </ol>

              <p className="text-faint mt-3 font-mono text-[0.6875rem] leading-relaxed">
                <span aria-hidden="true" className="text-accent">
                  ⟳
                </span>{" "}
                {lifecycle.note}
              </p>
            </div>

            {milestones.length > 0 ? (
              <div className="panel bg-bg/40 self-start overflow-hidden">
                <div className="panel-head">
                  <span>build plan</span>
                  <span className="panel-head-end tnum">
                    {landed} / {milestones.length} landed
                  </span>
                </div>

                <ol aria-label={`Build plan for ${project.name}`}>
                  {milestones.map((milestone, index) => {
                    const standing = standingOf(milestones, index);
                    const { mark, tone } = STANDING[standing];

                    return (
                      <li
                        key={milestone.label}
                        className={`plan-row ${standing === "next" ? "plan-next" : ""}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`plan-mark ${tone}`}
                        >
                          {mark}
                        </span>
                        <span className="min-w-0">
                          <span className="text-fg block text-[0.8125rem]">
                            {milestone.label}
                          </span>
                          <span className="text-faint mt-0.5 block text-[0.6875rem]">
                            {milestone.detail}
                          </span>
                        </span>
                        <span className={`plan-word ${tone}`}>{standing}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : null}
          </div>

          <h4 className="mono-label mt-9">design decisions</h4>
          <ul className="mt-3 -ml-1 space-y-0.5">
            {project.decisions.map((decision) => (
              <li key={decision} className="diff">
                <span aria-hidden="true" className="diff-mark">
                  +
                </span>
                <span className="text-fg text-[0.875rem] leading-relaxed">
                  {decision}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </Lit>
  );
}
