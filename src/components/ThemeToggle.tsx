"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/** Local subscribers, so a click in this tab updates the control immediately. */
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

/**
 * The theme actually being painted right now.
 *
 * An explicit choice is recorded as `data-theme` on the root element by
 * `write` below, and re-applied before first paint by the boot script in the
 * layout. With no choice recorded the page follows the OS, so that is what
 * the control has to report — the visitor never picks "system", they simply
 * have not overridden it yet.
 */
function read(): Theme {
  const attribute = document.documentElement.getAttribute("data-theme");
  if (attribute === "light" || attribute === "dark") return attribute;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function write(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage. The choice still applies to this page,
    // it just will not survive a reload. Not worth surfacing to the visitor.
  }

  notify();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  // `storage` fires in *other* tabs, keeping them in sync with this one.
  window.addEventListener("storage", onChange);

  // While no explicit choice is stored the page tracks the OS, so a sunset
  // switch has to move this control too.
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", onChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
    query.removeEventListener("change", onChange);
  };
}

/** The server cannot know the OS preference, so it assumes the light default. */
function serverSnapshot(): Theme {
  return "light";
}

/**
 * Light/dark switch.
 *
 * Two states only, as asked. Nothing is stored until the visitor clicks, so
 * the default is whatever the OS reports and a first-time visitor at night
 * gets a dark page without touching anything.
 *
 * The value lives on the root element and in `localStorage`, not in React, so
 * it is read through `useSyncExternalStore` — the supported way to render a
 * client-only value. React hydrates with the server snapshot and re-renders
 * with the real one. The theme itself is applied before first paint by the
 * boot script in the layout; this control only reflects and changes it.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, serverSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => write(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="nav-icon-button inline-flex shrink-0 items-center justify-center"
    >
      {/* Both glyphs ship; CSS shows whichever matches the active theme, so
          the icon is correct on the very first paint — before this component
          has hydrated and learned what the theme is. */}
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        aria-hidden="true"
        focusable="false"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon-sun"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>

      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        aria-hidden="true"
        focusable="false"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon-moon"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
