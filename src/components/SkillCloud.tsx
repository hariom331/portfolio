"use client";

import { useEffect, useMemo, useRef } from "react";

import type { Skill } from "@/content/types";

interface SkillCloudProps {
  readonly skills: readonly Skill[];
}

/** Perspective distance, in px. Larger flattens the sphere; smaller exaggerates it. */
const PERSPECTIVE = 620;
/** Radians per frame at 60fps. Slow on purpose — this is ambient, not a carousel. */
const BASE_SPEED = 0.0016;

/**
 * Positions on a unit sphere via the Fibonacci lattice, which spaces n points
 * far more evenly than naive lat/long stepping (that clusters hard at the poles).
 */
function spherePoints(count: number): readonly [number, number, number][] {
  const points: [number, number, number][] = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle

  for (let i = 0; i < count; i += 1) {
    const y = i * offset - 1 + offset / 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * increment;
    points.push([Math.cos(phi) * radius, y, Math.sin(phi) * radius]);
  }

  return points;
}

/**
 * A rotating 3D tag sphere of the stack.
 *
 * The words are real DOM text, not canvas pixels — so they are selectable,
 * indexable and readable by a screen reader. The 3D layout is applied only
 * after mount by adding `is-3d` to the container; until then (and forever, if
 * JavaScript is off or the visitor prefers reduced motion) the same elements
 * render as an ordinary wrapped list of pills.
 *
 * Transforms are written straight to the nodes inside the animation frame.
 * Driving 40 elements through React state at 60fps would be pure waste.
 */
export function SkillCloud({ skills }: SkillCloudProps) {
  const containerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });

  const points = useMemo(() => spherePoints(skills.length), [skills.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    container.classList.add("is-3d");

    // An ellipsoid, not a sphere: the container is much wider than it is
    // tall, and a sphere sized to fit the height would leave most of the
    // width empty. Each axis is inset by roughly half the longest word so
    // nothing clips as it turns.
    let radiusX = 0;
    let radiusY = 0;
    let radiusZ = 0;
    const measure = () => {
      radiusX = Math.max(80, (container.clientWidth - 150) / 2);
      radiusY = Math.max(70, (container.clientHeight - 50) / 2);
      // Depth reads best keyed to the smaller axis; scaling it to the wide
      // one makes near words balloon.
      radiusZ = Math.min(radiusX, radiusY);
    };
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    const onPointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      // Normalised to roughly -1..1 from the centre of the cloud.
      pointer.current = {
        x: (event.clientX - (bounds.left + bounds.width / 2)) / bounds.width,
        y: (event.clientY - (bounds.top + bounds.height / 2)) / bounds.height,
      };
    };

    const onPointerLeave = () => {
      pointer.current = { x: 0, y: 0 };
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    let angleY = 0;
    let angleX = 0;
    let frame = 0;

    const render = () => {
      // Pointer nudges the spin; with the cursor away it drifts on its own.
      angleY += BASE_SPEED + pointer.current.x * 0.006;
      angleX += pointer.current.y * -0.004;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      for (let i = 0; i < points.length; i += 1) {
        const node = itemRefs.current[i];
        const point = points[i];
        if (!node || !point) continue;

        const [px, py, pz] = point;

        // Rotate about Y, then about X.
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const depth = PERSPECTIVE / (PERSPECTIVE - z2 * radiusZ);
        // Floor of 0.42 rather than near-zero: these are real words, and the
        // ones at the back should stay legible, not just implied.
        const opacity = 0.42 + 0.58 * ((z2 + 1) / 2);

        node.style.transform = `translate3d(${x1 * radiusX}px, ${y2 * radiusY}px, 0) scale(${depth.toFixed(3)})`;
        node.style.opacity = opacity.toFixed(3);
        // Nearer words must sit above farther ones.
        node.style.zIndex = String(Math.round((z2 + 1) * 100));
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.classList.remove("is-3d");
    };
  }, [points]);

  return (
    <ul ref={containerRef} className="skill-cloud">
      {skills.map((skill, index) => (
        <li
          key={skill.name}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          className="skill-cloud-item pill"
          data-weight={skill.weight}
        >
          {skill.name}
        </li>
      ))}
    </ul>
  );
}
