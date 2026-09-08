"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";

import { LinkIcon } from "@/components/LinkIcon";
import { anchorProps, isExternal } from "@/lib/links";
import { RESUME_FILENAME } from "@/lib/resume";

interface ResumeActionProps {
  readonly href: string;
}

// A modified click is an instruction the reader has already given — open it in
// a tab, open it in a window, save it. Asking them again would be answering a
// question with the same question.
function isPlainClick(event: ReactMouseEvent): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * The masthead's resume link, and the choice it opens: read it here or take a
 * copy. Both are plain anchors — the dialog only asks which one, it does not
 * perform either — so the browser's own open-in-tab and save behaviour, and
 * the right-click menu, all still work on the answer.
 *
 * The trigger is an anchor to the file itself rather than a button, so with
 * scripting off the click still lands on the PDF instead of on nothing.
 */
export function ResumeAction({ href }: ResumeActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // A resume hosted elsewhere cannot be saved by us — `download` is ignored
  // cross-origin — so there is no choice to offer and the link stays a link.
  const isHosted = isExternal(href);

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const firstRef = useRef<HTMLAnchorElement>(null);

  const timer = useRef<number | undefined>(undefined);

  const close = useCallback(() => setIsOpen(false), []);

  // A pending timeout would otherwise close a dialog that is already gone.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Answering closes the dialog a tick later rather than inside the click:
  // unmounting an anchor during its own dispatch pulls the node out from
  // under a navigation the browser has not started yet.
  const closeAfterClick = () => {
    timer.current = window.setTimeout(close, 0);
  };

  // Opening takes focus and locks the page behind the dialog; closing hands
  // focus back to the link that was clicked, which is where the reader was.
  useEffect(() => {
    if (!isOpen) return;

    // Read now rather than in the cleanup: focus goes back to the link that
    // opened this dialog, not to whatever happens to be under the ref later.
    const trigger = triggerRef.current;
    firstRef.current?.focus();

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  const onTriggerClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(event)) return;

    event.preventDefault();
    setIsOpen(true);
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") return;

    const stops = panelRef.current?.querySelectorAll<HTMLElement>("a, button");
    if (stops === undefined || stops.length === 0) return;

    // Wraps at both ends, so tabbing cannot walk out of a modal dialog and
    // into the page it is covering.
    const first = stops[0];
    const last = stops[stops.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Rendered at the body rather than in place: a transformed ancestor would
  // otherwise become the containing block and pin `position: fixed` to the
  // hero instead of the viewport.
  const dialog = (
    <>
      {/* A click target for pointer users; keyboard users have Escape and the
          cancel button, which is why there is no role or handler on it. */}
      <div className="scrim" onClick={close} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-dialog-title"
        className="dialog pick-panel"
        onKeyDown={onKeyDown}
      >
        <h2 id="resume-dialog-title" className="panel-head">
          <span aria-hidden="true" className="text-accent">
            ›
          </span>
          resume.pdf
        </h2>

        <a
          ref={firstRef}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeAfterClick}
          className="pick-item"
        >
          <LinkIcon kind="demo" />
          <span>
            <span className="pick-name">view</span>
            <span className="pick-note">opens in a new tab</span>
          </span>
        </a>

        <a
          href={href}
          download={RESUME_FILENAME}
          onClick={closeAfterClick}
          className="pick-item"
        >
          <LinkIcon kind="resume" />
          <span>
            <span className="pick-name">download</span>
            <span className="pick-note">saves {RESUME_FILENAME}</span>
          </span>
        </a>

        <div className="pick-foot">
          <span>
            <span className="kbd">esc</span> close
          </span>
          <button type="button" onClick={close} className="pick-cancel">
            cancel
          </button>
        </div>
      </div>
    </>
  );

  if (isHosted) {
    return (
      <a href={href} {...anchorProps(href)} className="btn btn-primary">
        <LinkIcon kind="resume" />
        resume.pdf
      </a>
    );
  }

  return (
    <>
      <a
        ref={triggerRef}
        href={href}
        onClick={onTriggerClick}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="btn btn-primary"
      >
        <LinkIcon kind="resume" />
        resume.pdf
      </a>

      {isOpen ? createPortal(dialog, document.body) : null}
    </>
  );
}
