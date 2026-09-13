import { Lit } from "@/components/Lit";
import { Section } from "@/components/Section";
import { StatGrid } from "@/components/StatGrid";
import { site } from "@/content/site";

export function Experience() {
  return (
    <Section
      id="experience"
      title="Experience"
      lead="Where I have shipped, most recent first. The numbers lead, because they are what changed by my being there; the detail underneath is what backs them up."
    >
      <div className="space-y-5">
        {site.experience.map((role) => (
          <Lit key={`${role.company}-${role.period}`}>
            <div className="panel-head">
              {role.current ? (
                <span aria-hidden="true" className="live-dot" />
              ) : null}
              <span className="text-fg">{role.company}</span>
              <span aria-hidden="true">/</span>
              <span>{role.title}</span>
              <span className="panel-head-end tnum hidden sm:inline">
                {role.period}
              </span>
            </div>

            <div className="panel-body">
              <p className="text-faint mb-4 font-mono text-[0.6875rem] tracking-wider uppercase sm:hidden">
                {role.period} · {role.location}
              </p>

              <p className="text-muted max-w-3xl text-sm leading-relaxed">
                {role.context}
              </p>

              {/* The numbers a recruiter is scanning for, on the role that
                  earned them. */}
              <StatGrid metrics={role.metrics} className="mt-6" />

              <ul className="mt-7 -ml-1 space-y-0.5">
                {role.bullets.map((bullet) => (
                  <li key={bullet} className="diff">
                    <span aria-hidden="true" className="diff-mark">
                      +
                    </span>
                    <span className="text-fg text-[0.875rem] leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>

              <ul
                aria-label={`Technologies used at ${role.company}`}
                className="mt-6 flex flex-wrap gap-1.5"
              >
                {role.tech.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-faint mt-5 hidden font-mono text-[0.6875rem] sm:block">
                {role.location}
              </p>
            </div>
          </Lit>
        ))}
      </div>
    </Section>
  );
}
