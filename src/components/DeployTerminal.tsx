import { site } from "@/content/site";

import { Uptime } from "@/components/Uptime";

// How long a step waits behind the one above it, and how long its result waits
// behind its own line. Both in milliseconds.
const STEP_STAGGER = 190;
const RESULT_LAG = 130;

// The transcript of a run that actually happened: every line restates a claim
// the rest of the page backs up. It plays itself with CSS alone, so it works
// with scripting off and costs no JavaScript.
export function DeployTerminal() {
  const { deploy } = site;
  const settled = deploy.steps.length * STEP_STAGGER + RESULT_LAG;

  return (
    <div className="term">
      <div className="term-bar">
        <span aria-hidden="true" className="term-dot" />
        <span aria-hidden="true" className="term-dot" />
        <span aria-hidden="true" className="term-dot" />
        <span className="term-title">— zsh — {site.region}</span>
      </div>

      <div className="term-body">
        <p className="term-cmd">
          <span className="text-accent">❯</span>
          <span className="text-fg">{deploy.command}</span>
        </p>

        <div className="mt-2 space-y-0.5">
          {deploy.steps.map((step, index) => (
            <p
              key={step.phase}
              className="term-row term-in"
              style={{ animationDelay: `${index * STEP_STAGGER}ms` }}
            >
              <span className="term-phase">{step.phase}</span>
              <span>{step.text}</span>
              <span aria-hidden="true" className="term-lead" />
              <span
                className="term-ok term-mark"
                style={{
                  animationDelay: `${index * STEP_STAGGER + RESULT_LAG}ms`,
                }}
              >
                {step.result}
              </span>
            </p>
          ))}
        </div>

        <p
          className="term-in mt-3 flex items-baseline gap-2 whitespace-nowrap"
          style={{ animationDelay: `${settled}ms` }}
        >
          <span aria-hidden="true" className="term-ok">
            ✔
          </span>
          <span className="text-fg">{deploy.result}</span>
        </p>

        <p
          className="term-in mt-2 flex flex-wrap items-baseline gap-x-2"
          style={{ animationDelay: `${settled + 160}ms` }}
        >
          <span className="text-accent">❯</span>
          <span className="text-faint">uptime</span>
          <Uptime />
          <span aria-hidden="true" className="caret" />
        </p>
      </div>
    </div>
  );
}
