import { site } from "@/content/site";

// Dial geometry, in viewBox units. The ring is inset far enough that the stage
// labels sitting outside it still land inside the box.
const CENTRE = 100;
const RING = 66;
const LABEL = 88;

// One slot per stage, plus a closing slot where the run sits complete before
// the ring resets. The keyframe percentages in globals.css are derived from
// this, so changing the stage count means changing those to match.
const CLOSING_SLOTS = 1;

// Clockwise from the top: the first stage sits at twelve o'clock and the rest
// divide the circle evenly.
function nodeAt(index: number, count: number, radius: number) {
  const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CENTRE + radius * Math.cos(angle),
    y: CENTRE + radius * Math.sin(angle),
  };
}

export function BuildLoop() {
  const { stages, result } = site.pipeline;
  const slots = stages.length + CLOSING_SLOTS;

  const startsAt = (index: number) => ({
    animationDelay: `calc(var(--cycle) * ${index} / ${slots})`,
  });

  return (
    <div className="loop panel">
      <div className="panel-head">
        <span aria-hidden="true" className="loop-spin">
          ⟳
        </span>
        <span>build loop</span>
        <span className="panel-head-end">main</span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="loop-dial">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <circle
              cx={CENTRE}
              cy={CENTRE}
              r={RING}
              className="loop-track-ring"
            />

            {/* Drawn by stroke-dashoffset rather than by a rotating wedge, so
                the arc grows from the twelve o'clock node instead of sweeping
                out of nowhere. pathLength normalises the circumference to 100,
                which lets the keyframes work in whole units. */}
            <circle
              cx={CENTRE}
              cy={CENTRE}
              r={RING}
              pathLength={100}
              className="loop-sweep"
            />

            <g className="loop-orbit">
              <circle cx={CENTRE} cy={CENTRE - RING} r={4} />
            </g>

            {stages.map((stage, index) => {
              const node = nodeAt(index, stages.length, RING);
              const label = nodeAt(index, stages.length, LABEL);

              return (
                <g key={stage.name}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={5.5}
                    className="loop-node"
                    style={startsAt(index)}
                  />
                  <text
                    x={label.x}
                    y={label.y}
                    className="loop-node-label"
                    style={startsAt(index)}
                  >
                    {stage.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Sits inside the ring rather than in the panel head: the loop is
              the thing that has been running, so the figure belongs at the
              middle of it. */}
          <p className="loop-centre">
            <span className="loop-centre-unit">shipping for</span>
            <span className="loop-centre-value">{site.experienceYears}</span>
          </p>
        </div>

        {/* Every line ships and each is shown for its own slot, so the log
            advances on a timer the browser owns rather than on a render. They
            are stacked rather than swapped, so the panel keeps one height. */}
        <div className="loop-log" aria-hidden="true">
          {stages.map((stage, index) => (
            <p key={stage.name} className="loop-line" style={startsAt(index)}>
              <span className="text-accent">❯</span>
              <span>{stage.command}</span>
              <span className="text-ok">{stage.result}</span>
            </p>
          ))}

          <p className="loop-line" style={startsAt(stages.length)}>
            <span className="text-ok">✔</span>
            <span className="text-fg">{result}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
