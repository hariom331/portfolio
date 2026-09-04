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
  /**
   * The artefact does not exist yet. The button still renders — so a card
   * shows the shape of what is coming — but as an inert, dimmed control
   * marked "soon", never as a link that leads nowhere. `href` is ignored
   * while this is true, so a placeholder can carry the intended URL.
   */
  readonly pending?: boolean;
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

export interface Project {
  readonly name: string;
  readonly stack: readonly string[];
  readonly description: string;
  readonly links: readonly ExternalLink[];
}

/**
 * One skill in the skills grid.
 *
 * `weight` is editorial prominence, 1 (peripheral) to 3 (core) — what he
 * wants read first, not a self-assessed proficiency score. Weight 3 items are
 * highlighted; nothing on the page shows a percentage.
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
 * The hero portrait.
 *
 * `src` is a path under `public/`. While this is null the hero simply leaves
 * that half of the row empty, so dropping a real photo in later fills the slot
 * without moving anything else.
 */
export interface Photo {
  readonly src: string;
  readonly alt: string;
  /** Intrinsic size, so the browser reserves the space before it loads. */
  readonly width: number;
  readonly height: number;
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
  readonly photo: Photo | null;
  readonly links: readonly ExternalLink[];
  readonly positioning: string;
  readonly credentials: string;
  readonly stack: readonly StackGroup[];
  readonly projects: readonly Project[];
  readonly experience: readonly Role[];
}
