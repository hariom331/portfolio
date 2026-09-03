/**
 * Content types for the site.
 *
 * Everything rendered on the page is described here and supplied by
 * `site.ts`. Components read this data and never hard-code copy, so editing
 * the site means editing one file.
 */

/** Picks the icon drawn beside a link label. */
export type LinkKind =
  | "github"
  | "demo"
  | "docs"
  | "video"
  | "writeup"
  | "resume"
  | "linkedin"
  | "email";

export interface ExternalLink {
  readonly label: string;
  readonly href: string;
  readonly kind?: LinkKind;
  /** Screen-reader-only clarification, when the label alone is ambiguous. */
  readonly srLabel?: string;
}

export interface Role {
  readonly company: string;
  readonly title: string;
  readonly period: string;
  readonly location: string;
  /** One line naming the engagement, so the bullets have somewhere to land. */
  readonly context: string;
  readonly bullets: readonly string[];
  /** Tech tags for the role, shown under the bullets. */
  readonly tech: readonly string[];
}

export interface Metric {
  readonly label: string;
  readonly value: string;
}

/**
 * The flagship project section — roughly half the page once it exists.
 *
 * `site.flagship` is `null` until the project is real. The section is omitted
 * entirely while it is null: a "coming soon" block is a worse signal than no
 * block at all.
 */
export interface Flagship {
  readonly name: string;
  readonly tagline: string;
  /** Three or four lines on the problem it solves. */
  readonly problem: string;
  /** The engineering named explicitly — this is what gets read. */
  readonly hardParts: readonly string[];
  /** Measured numbers only. Never estimates, never round guesses. */
  readonly metrics: readonly Metric[];
  readonly links: readonly ExternalLink[];
  /** A rendered architecture diagram in `public/`. Intrinsic size is required
   *  so the browser reserves the space and the page does not shift on load. */
  readonly diagram?: {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  };
}

export interface Project {
  readonly name: string;
  readonly stack: readonly string[];
  readonly description: string;
  readonly links: readonly ExternalLink[];
}

/**
 * One word in the skill cloud.
 *
 * `weight` drives type size and depth prominence, 1 (peripheral) to 3 (core).
 * It is an editorial judgement about what he wants read first, not a
 * self-assessed proficiency score — the cloud shows no percentages.
 */
export interface Skill {
  readonly name: string;
  readonly weight: 1 | 2 | 3;
}

export interface StackGroup {
  readonly label: string;
  readonly items: readonly Skill[];
}

/**
 * A headline number for the hero tiles.
 *
 * Same rule as everywhere else: every value here is measured and traceable to
 * the master resume. `context` carries the comparison that makes the number
 * mean something — a bare "2 min" says nothing without "down from 15-20".
 */
export interface Highlight {
  /** The full display string. This is what renders server-side. */
  readonly value: string;
  /**
   * Optional split of `value` for the count-up animation. `prefix + to +
   * suffix` must reproduce `value` exactly, or the animation will settle on
   * something different from what was server-rendered.
   */
  readonly count?: {
    readonly prefix: string;
    readonly to: number;
    readonly suffix: string;
  };
  readonly label: string;
  readonly context: string;
}

export interface SiteContent {
  readonly name: string;
  readonly role: string;
  /** The one-line stack summary under the name, e.g. "AWS · Java · Spring Boot". */
  readonly tagline: string;
  readonly location: string;
  /** Absolute origin, used for canonical and Open Graph URLs. */
  readonly url: string;
  readonly email: string;
  readonly links: readonly ExternalLink[];
  readonly positioning: string;
  readonly credentials: string;
  readonly highlights: readonly Highlight[];
  readonly stack: readonly StackGroup[];
  readonly flagship: Flagship | null;
  readonly projects: readonly Project[];
  readonly experience: readonly Role[];
}
