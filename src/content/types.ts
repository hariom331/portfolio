// Shape of content.json. See parse.ts for the runtime check.

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
  readonly srLabel?: string;
  // Renders an inert "soon" chip instead of a link. href is ignored.
  readonly pending?: boolean;
}

export interface Role {
  readonly company: string;
  readonly title: string;
  readonly period: string;
  readonly location: string;
  readonly context: string;
  readonly bullets: readonly string[];
  readonly tech: readonly string[];
}

export interface Project {
  readonly name: string;
  readonly stack: readonly string[];
  readonly description: string;
  readonly links: readonly ExternalLink[];
}

export interface Skill {
  readonly name: string;
  // Prominence, not proficiency. 3 renders highlighted, 1 is peripheral.
  readonly weight: 1 | 2 | 3;
}

export interface StackGroup {
  readonly label: string;
  readonly items: readonly Skill[];
}

export interface Photo {
  // Path under public/.
  readonly src: string;
  readonly alt: string;
  // Intrinsic size, so the space is reserved before the image loads.
  readonly width: number;
  readonly height: number;
}

export interface SiteContent {
  readonly name: string;
  readonly role: string;
  readonly tagline: string;
  readonly location: string;
  // Absolute origin, used for canonical and Open Graph URLs.
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
