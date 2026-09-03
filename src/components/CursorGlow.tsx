"use client";

import { useEffect } from "react";

/**
 * A soft glow that follows the cursor across the whole page.
 *
 * Position is published as two custom properties on `<html>` and consumed by
 * a fixed gradient layer in CSS, so a mouse move costs two property writes
 * and no React render.
 *
 * Only mounts its listener for a fine pointer that is not asking for reduced
 * motion — on touch there is no cursor to follow, and the effect is pure
 * decoration nobody should have forced on them.
 */
export function CursorGlow() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!finePointer || reduceMotion) return;

    const root = document.documentElement;
    root.classList.add("has-cursor-glow");

    let pending = false;
    let lastX = 0;
    let lastY = 0;

    const flush = () => {
      pending = false;
      root.style.setProperty("--cursor-x", `${lastX}px`);
      root.style.setProperty("--cursor-y", `${lastY}px`);
    };

    // Coalesce to one write per frame; pointermove can fire far more often.
    const onPointerMove = (event: PointerEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      root.classList.remove("has-cursor-glow");
    };
  }, []);

  return <div className="cursor-glow" aria-hidden="true" />;
}
