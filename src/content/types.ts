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
}

export interface Role {
  readonly company: string;
  readonly title: string;
  readonly period: string;
  // Still running, which is what earns the live dot on the card.
  readonly current?: boolean;
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

// Every entry renders the same. There is no prominence field, because a tier
// list of your own skills reads as a list of the ones you are apologising for.
export interface StackGroup {
  readonly label: string;
  readonly items: readonly string[];
}

// The shortlist the masthead leads with: the entries a hiring filter is
// actually scanning for, in the order they carry weight. Curated by hand and
// deliberately not derived from `stack` — the stack is the full inventory and
// ranks nothing, this is the pitch and is nothing but a ranking. Keep it short.
// A list of eight reads as a claim; a list of twenty reads as a hedge.
export type Focus = readonly string[];

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

export interface PipelineStage {
  readonly name: string;
  readonly command: string;
  readonly result: string;
}

// The loop under the estate readout: write it, build it, ship it. Three
// stages, because that is the cycle the job is; a longer list turns a rhythm
// into a diagram.
export interface Pipeline {
  readonly stages: readonly PipelineStage[];
  // The beat at the end, held while the run sits complete before it repeats.
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
  readonly focus: Focus;
  readonly location: string;
  // Home AWS region, used as the locality label in the console chrome.
  readonly region: string;
  // Absolute origin, used for canonical and Open Graph URLs.
  readonly url: string;
  readonly email: string;
  // ISO date of the first professional work, internship included, which is not
  // the same as the start of the current role. Only the manifest reads it.
  readonly careerSince: string;
  // Total time shipping, written out rather than counted from careerSince: the
  // masthead states a figure instead of running a clock, so this is the one
  // place it is set. Keep it in step with careerSince by hand.
  readonly experienceYears: string;
  readonly photo: Photo | null;
  readonly links: readonly ExternalLink[];
  readonly positioning: string;
  readonly philosophy: string;
  readonly pipeline: Pipeline;
  readonly credentials: readonly Credential[];
  readonly stack: readonly StackGroup[];
  readonly projects: readonly Project[];
  readonly experience: readonly Role[];
}
