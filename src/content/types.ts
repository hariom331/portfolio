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
  // ISO date the role started. Drives the live uptime readout; omit on a role
  // that has ended and nothing counts up.
  readonly since?: string;
  readonly location: string;
  readonly context: string;
  // The numbers the role is worth quoting for. They lead the card, ahead of
  // the detail that backs them up.
  readonly metrics: readonly Metric[];
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

// One tile in a role's impact readout. Kept to a short value so four sit on
// one row on a phone.
export interface Metric {
  readonly value: string;
  readonly label: string;
  readonly note: string;
}

// Rendered as a two-part build badge, so the label reads best in the
// lowercase dotted form a shields.io badge uses.
export interface Credential {
  readonly label: string;
  readonly value: string;
}

export interface DeployStep {
  readonly phase: string;
  readonly text: string;
  readonly result: string;
}

// The hero terminal transcript. Every line is a claim made elsewhere on the
// page — this is a restatement of the record, not decoration.
export interface Deploy {
  readonly command: string;
  readonly steps: readonly DeployStep[];
  readonly result: string;
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
  // Home AWS region, used as the locality label in the console chrome.
  readonly region: string;
  // Absolute origin, used for canonical and Open Graph URLs.
  readonly url: string;
  readonly email: string;
  readonly photo: Photo | null;
  readonly links: readonly ExternalLink[];
  readonly positioning: string;
  readonly philosophy: string;
  readonly deploy: Deploy;
  readonly credentials: readonly Credential[];
  readonly stack: readonly StackGroup[];
  readonly projects: readonly Project[];
  readonly experience: readonly Role[];
}
