"use client";

import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/content/site";

interface NavItem {
  readonly id: string;
  readonly label: string;
}

/**
 * Ids must match the `id` each section renders, or the link scrolls nowhere
 * and the scroll-spy never lights up.
 */
const SECTIONS: readonly NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

/** First letter of each word: "Hariom Joshi" becomes "HJ". */
function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("");
}

/**
 * The sticky top bar: brand, section links, theme control.
 *
 * Links are plain hash anchors, so they work before hydration and without
 * JavaScript at all — the scroll-spy below only decorates them. Sections
 * carry `scroll-margin-top` in `globals.css` so a jump does not land the
 * heading underneath this bar.
 *
 * Below `md` the links collapse into a disclosure panel. It is a plain
 * expanding block rather than a full-screen overlay: the page is short, and
 * an overlay that traps focus is a lot of machinery for five links.
 */
export function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Highlights whichever section occupies the middle band of the viewport.
  // The negative `rootMargin` collapses the observation area to a strip
  // around the vertical centre, which avoids the usual bug where a tall
  // section and a short one both count as visible and the marker flickers.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    const observed = SECTIONS.map((item) =>
      document.getElementById(item.id),
    ).filter((node): node is HTMLElement => node !== null);

    for (const node of observed) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Escape closes the panel, matching every other disclosure on the web.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Widening past the breakpoint reveals the desktop links, at which point a
  // panel left open would be a second copy of them stuck under the bar.
  useEffect(() => {
    if (!open) return;

    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (query.matches) setOpen(false);
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open]);

  const linkClass = (id: string) =>
    `nav-link ${id === active ? "is-active" : ""}`.trim();

  return (
    <header className="nav-shell">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5 font-medium">
          <span className="nav-monogram">{initials(site.name)}</span>
          {/* Measured: name, five links and the theme control come to 557px of
              the 753px available at `md`, so nothing has to give way. Hidden
              below `sm` only because the monogram alone reads better there. */}
          <span className="hidden text-sm tracking-tight sm:inline">
            {site.name}
          </span>
        </a>

        <nav aria-label="Sections" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {SECTIONS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={item.id === active ? "true" : undefined}
                  className={`${linkClass(item.id)} inline-block`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((wasOpen) => !wasOpen)}
            className="nav-icon-button inline-flex shrink-0 items-center justify-center md:hidden"
          >
            {/* Two bars that cross into an X. One element per bar so the
                transform is a plain rotate rather than a path morph. */}
            <span aria-hidden="true" className="nav-burger">
              <span className={open ? "translate-y-[3px] rotate-45" : ""} />
              <span className={open ? "-translate-y-[3px] -rotate-45" : ""} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="nav-panel"
        hidden={!open}
        className="border-rule border-t md:hidden"
      >
        <nav
          aria-label="Sections"
          className="mx-auto w-full max-w-6xl px-5 py-3"
        >
          <ul className="flex flex-col">
            {SECTIONS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={item.id === active ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  className={`${linkClass(item.id)} block py-2.5 text-base`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
