"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { site } from "@/content/site";
import { SECTIONS } from "@/lib/sections";

const OPEN_EVENT = "cmdk:open";

// The console bar's ⌘K button and the palette itself live in different
// branches of the tree, and one event is a lighter join than a context.
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

interface Command {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  // Extra words that should match the command without being shown.
  readonly keywords: string;
  readonly run: () => void;
}

function jump(id: string) {
  const target = document.getElementById(id);
  if (target === null) return;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  // Moves the keyboard's place to match the viewport's, so tabbing on from
  // here continues inside the section rather than back at the top.
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

function openTab(href: string) {
  window.open(href, "_blank", "noopener,noreferrer");
}

function useCommands(close: () => void): readonly Command[] {
  return useMemo(() => {
    const wrap = (run: () => void) => () => {
      close();
      run();
    };

    const byKind = (kind: string) =>
      site.links.find((link) => link.kind === kind);

    const resume = byKind("resume");
    const github = byKind("github");
    const linkedin = byKind("linkedin");

    const commands: Command[] = SECTIONS.map((section) => ({
      id: `go-${section.id}`,
      label: `goto ${section.id}`,
      hint: "jump",
      keywords: `${section.label} ${section.command}`,
      run: wrap(() => jump(section.id)),
    }));

    commands.push({
      id: "copy-email",
      label: "copy email address",
      hint: "clipboard",
      keywords: `mail contact ${site.email}`,
      run: wrap(() => {
        void navigator.clipboard?.writeText(site.email);
      }),
    });

    if (resume) {
      commands.push({
        id: "open-resume",
        label: "open resume.pdf",
        hint: "download",
        keywords: "cv curriculum vitae",
        run: wrap(() => openTab(resume.href)),
      });
    }

    if (github) {
      commands.push({
        id: "open-github",
        label: "open github profile",
        hint: "external",
        keywords: "code repositories source",
        run: wrap(() => openTab(github.href)),
      });
    }

    if (linkedin) {
      commands.push({
        id: "open-linkedin",
        label: "open linkedin profile",
        hint: "external",
        keywords: "hire recruiter network",
        run: wrap(() => openTab(linkedin.href)),
      });
    }

    commands.push({
      id: "go-top",
      label: "back to top",
      hint: "jump",
      keywords: "home hero start",
      run: wrap(() => window.scrollTo({ top: 0, behavior: "smooth" })),
    });

    return commands;
  }, [close]);
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  // Whatever had focus before the palette took it, so Escape can give it back.
  const restoreRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const commands = useCommands(close);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return commands;

    return commands.filter((command) =>
      `${command.label} ${command.keywords}`.toLowerCase().includes(needle),
    );
  }, [commands, query]);

  // Typing can shorten the list out from under the cursor. Clamping on read
  // rather than storing a corrected value keeps the two from disagreeing for
  // a render.
  const index = Math.min(cursor, Math.max(0, matches.length - 1));

  // ⌘K from anywhere, plus the event the console bar's button fires. Both
  // reset the search themselves, so opening never inherits an old query.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isShortcut) return;

      event.preventDefault();
      setQuery("");
      setCursor(0);
      setIsOpen((wasOpen) => !wasOpen);
    };

    const onOpen = () => {
      setQuery("");
      setCursor(0);
      setIsOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  // Opening takes focus and locks the page behind the dialog; closing hands
  // focus back to whatever had it.
  useEffect(() => {
    if (!isOpen) {
      restoreRef.current?.focus();
      restoreRef.current = null;
      return;
    }

    restoreRef.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (matches.length === 0) return;

      // Wraps, so holding one arrow key cycles rather than sticking at an end.
      const step = event.key === "ArrowDown" ? 1 : -1;
      setCursor((index + step + matches.length) % matches.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      matches[index]?.run();
    }
  };

  return (
    <>
      {/* A click target for pointer users; keyboard users have Escape, which
          is why there is no role or handler on it. */}
      <div className="cmdk-scrim" onClick={close} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="cmdk-panel"
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="run a command…"
          autoComplete="off"
          spellCheck={false}
          aria-label="Search commands"
          aria-controls="cmdk-list"
          aria-activedescendant={matches[index]?.id}
          className="cmdk-input"
        />

        <ul id="cmdk-list" role="listbox" className="max-h-72 overflow-y-auto">
          {matches.map((command, position) => (
            <li key={command.id} role="presentation">
              <button
                type="button"
                id={command.id}
                role="option"
                aria-selected={position === index}
                data-active={position === index}
                onClick={command.run}
                onPointerMove={() => setCursor(position)}
                className="cmdk-item"
              >
                <span aria-hidden="true" className="text-accent">
                  ›
                </span>
                <span>{command.label}</span>
                <span className="cmdk-hint">{command.hint}</span>
              </button>
            </li>
          ))}

          {matches.length === 0 ? (
            <li className="text-faint px-4 py-6 text-center font-mono text-xs">
              no command matches “{query}”
            </li>
          ) : null}
        </ul>

        <footer className="border-line text-faint flex items-center gap-3 border-t px-4 py-2.5 font-mono text-[0.625rem]">
          <span>
            <span className="kbd">↑</span> <span className="kbd">↓</span> move
          </span>
          <span>
            <span className="kbd">↵</span> run
          </span>
          <span>
            <span className="kbd">esc</span> close
          </span>
        </footer>
      </div>
    </>
  );
}
