"use client";

import { useEffect, useState } from "react";

import { openCommandPalette } from "@/components/CommandPalette";
import { site } from "@/content/site";
import { SECTIONS, sectionIndex } from "@/lib/sections";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("");
}

// The user half of the prompt. Read off the name rather than written down, so
// the chrome follows whoever the content file describes.
function user(name: string): string {
  return (name.trim().split(/\s+/)[0] ?? "user").toLowerCase();
}

// The chrome of the console: who you are looking at, where in the run you are,
// and the two controls that matter.
export function TopBar() {
  const [active, setActive] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // The negative rootMargin narrows the observed area to a strip at the
  // vertical centre, so a tall and a short section cannot both count as
  // visible and flicker the marker.
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

    const observed = SECTIONS.map((item) => document.getElementById(item.id));
    for (const node of observed) if (node !== null) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    // Past the breakpoint the inline links are back, so the sheet closes.
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (query.matches) setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    query.addEventListener("change", onChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      query.removeEventListener("change", onChange);
    };
  }, [isOpen]);

  const linkClass = (id: string) =>
    `bar-link ${id === active ? "is-active" : ""}`.trim();

  return (
    <header className="bar">
      <div aria-hidden="true" className="bar-progress" />

      <div className="mx-auto flex h-14 w-full max-w-[78rem] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span className="brand-mark">{initials(site.name)}</span>
          <span className="ctx">
            <b>{user(site.name)}</b>@<i>prod</i>
            <span className="text-faint">:~$</span>
          </span>
        </a>

        <nav aria-label="Sections" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {SECTIONS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={item.id === active ? "true" : undefined}
                  className={linkClass(item.id)}
                >
                  <em className="tnum">{sectionIndex(item.id)}</em>
                  {item.label.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          {/* Wide enough to spell out what the key does; on a phone there is
              no keyboard to press it with, so the button is hidden. */}
          <button
            type="button"
            onClick={openCommandPalette}
            className="btn btn-ghost hidden !py-1.5 !pr-1.5 !pl-3 sm:inline-flex"
          >
            <span className="text-faint">run command</span>
            <kbd className="kbd">⌘K</kbd>
          </button>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="bar-sheet"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((wasOpen) => !wasOpen)}
            className="icon-btn shrink-0 lg:hidden"
          >
            {/* One element per bar, so the transform is a plain rotate. */}
            <span aria-hidden="true" className="burger">
              <span className={isOpen ? "translate-y-[3px] rotate-45" : ""} />
              <span className={isOpen ? "-translate-y-[3px] -rotate-45" : ""} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="bar-sheet"
        hidden={!isOpen}
        className="border-line border-t lg:hidden"
      >
        <nav
          aria-label="Sections"
          className="mx-auto w-full max-w-[78rem] px-4 py-2 sm:px-6"
        >
          <ul className="flex flex-col">
            {SECTIONS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={item.id === active ? "true" : undefined}
                  onClick={() => setIsOpen(false)}
                  // Width, not display: .bar-link is inline-flex, and turning
                  // it into a block would drop the gap between the stage
                  // number and its label.
                  className={`${linkClass(item.id)} w-full py-2.5 text-sm`}
                >
                  <em className="tnum">{sectionIndex(item.id)}</em>
                  {item.label.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
