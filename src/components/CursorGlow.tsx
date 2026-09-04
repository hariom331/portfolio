"use client";

import { useEffect } from "react";

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

    // One write per frame; pointermove fires far more often than that.
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

  return <div className="cursor-grid" aria-hidden="true" />;
}
