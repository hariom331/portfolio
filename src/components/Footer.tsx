import { site } from "@/content/site";
import { anchorProps } from "@/lib/links";
import { SECTIONS } from "@/lib/sections";

// The line a CI run prints when it finishes, then the small print.
export function Footer() {
  // A server component in a static export, so this is the build year.
  const year = new Date().getFullYear();
  const github = site.links.find((link) => link.kind === "github");

  return (
    <footer className="border-line mt-24 border-t pt-6 pb-12 sm:mt-32">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem]">
        <span className="text-ok">✔ run complete</span>
        <span aria-hidden="true" className="bg-line-2 h-3 w-px" />
        <span className="text-faint tnum">
          {SECTIONS.length} stages · 0 failed
        </span>
        <span
          aria-hidden="true"
          className="bg-line-2 hidden h-3 w-px sm:block"
        />
        <span className="text-faint hidden sm:inline">
          next.js · tailwind css · static export
        </span>

        <a
          href="#top"
          className="text-muted hover:text-accent ml-auto transition-colors"
        >
          ↑ back to top
        </a>
      </div>

      <p className="text-faint mt-4 text-xs">
        © {year} {site.name}. Built and deployed by hand
        {github ? (
          <>
            {" — the source is on "}
            <a
              href={github.href}
              {...anchorProps(github.href)}
              className="hover:text-accent underline underline-offset-4 transition-colors"
            >
              GitHub
            </a>
          </>
        ) : null}
        .
      </p>
    </footer>
  );
}
