"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

// With no explicit choice recorded the page follows the OS, so that is what
// the control reports.
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
    // Blocked storage. The choice still applies, it just will not survive a reload.
  }

  notify();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  // Fires in other tabs, keeping them in sync.
  window.addEventListener("storage", onChange);

  // Track the OS while nothing is stored.
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", onChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
    query.removeEventListener("change", onChange);
  };
}

function serverSnapshot(): Theme {
  return "light";
}

// The value lives on the root element and in localStorage rather than in
// React, hence useSyncExternalStore.
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
      {/* Both ship; CSS picks one, so the first paint is already correct. */}
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
