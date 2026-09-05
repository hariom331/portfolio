import { BuildLoop } from "@/components/BuildLoop";
import { CopyEmail } from "@/components/CopyEmail";
import { LinkIcon } from "@/components/LinkIcon";
import { site } from "@/content/site";
import { anchorProps } from "@/lib/links";

// "Hariom Joshi" becomes a two-line masthead: given name filled, family name
// drawn. A single-word name keeps its one line.
function mastheadLines(name: string): readonly string[] {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return parts;

  return [parts[0], parts.slice(1).join(" ")];
}

export function Hero() {
  const [first, ...rest] = mastheadLines(site.name);
  const resume = site.links.find((link) => link.kind === "resume");
  const profiles = site.links.filter(
    (link) => link.kind === "github" || link.kind === "linkedin",
  );

  return (
    <section id="top" aria-labelledby="hero-heading" className="pt-10 sm:pt-16">
      <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 xl:gap-16">
        <div>
          {/* Where the operator is, in the form a status line takes. */}
          <p className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="live-dot" />
              <span className="text-ok">available</span>
            </span>
            <span aria-hidden="true" className="bg-line-2 h-3 w-px" />
            <span>{site.location}</span>
          </p>

          <h1
            id="hero-heading"
            className="display mt-5 text-[clamp(2.85rem,10.5vw,4.9rem)]"
          >
            {first}
            {rest.length > 0 ? (
              <>
                <br />
                <span className="outline-word">{rest[0]}</span>
              </>
            ) : null}
          </h1>

          <p className="text-accent mt-6 font-mono text-sm font-medium tracking-tight">
            {site.role}
          </p>

          {/* The keywords a hiring filter is scanning for, set as the loudest
              thing under the name. The full inventory is the stack section and
              ranks nothing; this is the shortlist and is nothing but a rank.
              site.tagline said the same words in prose and now only feeds the
              meta description, so the two do not compete here. */}
          <ul aria-label="Core tooling" className="mt-5 flex flex-wrap gap-1.5">
            {site.focus.map((name) => (
              <li key={name} className="skill skill-lead">
                {name}
              </li>
            ))}
          </ul>

          {/* The record, as the badges across the top of a README. */}
          <ul aria-label="Credentials" className="mt-7 flex flex-wrap gap-2">
            {site.credentials.map((credential) => (
              <li key={credential.label} className="shield">
                <span className="shield-k">{credential.label}</span>
                <span className="shield-v">{credential.value}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {resume ? (
              <a
                href={resume.href}
                {...anchorProps(resume.href)}
                className="btn btn-primary"
              >
                <LinkIcon kind="resume" />
                resume.pdf
              </a>
            ) : null}

            <CopyEmail />

            {/* Grouped, so the pair wraps as a pair rather than leaving one
                icon stranded on a line of its own. */}
            <div className="flex items-center gap-2">
              {profiles.map((link) => (
                <a
                  key={link.kind}
                  href={link.href}
                  {...anchorProps(link.href)}
                  aria-label={link.label}
                  title={link.label}
                  className="icon-btn"
                >
                  {link.kind ? <LinkIcon kind={link.kind} /> : null}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Centred rather than top-aligned: it is now the only thing in this
            column and the masthead beside it is taller, so pinning it to the
            top would hang it off the shoulder of the name. */}
        <div className="lg:self-center">
          <BuildLoop />
        </div>
      </div>
    </section>
  );
}
