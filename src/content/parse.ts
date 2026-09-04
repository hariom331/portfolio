// A JSON module's inferred type is too wide to satisfy SiteContent (weight
// widens to number, kind to string), so the shape is checked here instead.
// Failures name the bad path and throw at build time.

import type {
  ExternalLink,
  LinkKind,
  Photo,
  Project,
  Role,
  SiteContent,
  Skill,
  StackGroup,
} from "./types";

const LINK_KINDS = [
  "github",
  "demo",
  "docs",
  "video",
  "writeup",
  "resume",
  "linkedin",
  "email",
] as const satisfies readonly LinkKind[];

// Primitives print verbatim so a typo is visible; objects and arrays are
// named by shape.
function describe(value: unknown): string {
  if (value === undefined) return "nothing";
  if (value === null) return "null";
  if (Array.isArray(value)) return "an array";
  if (typeof value === "object") return "an object";
  return JSON.stringify(value);
}

function fail(path: string, expected: string, value: unknown): never {
  throw new Error(
    `content.json: ${path} must be ${expected}, got ${describe(value)}`,
  );
}

function str(value: unknown, path: string): string {
  return typeof value === "string" ? value : fail(path, "a string", value);
}

function num(value: unknown, path: string): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fail(path, "a number", value);
}

function bool(value: unknown, path: string): boolean {
  return typeof value === "boolean"
    ? value
    : fail(path, "true or false", value);
}

function fields(value: unknown, path: string): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : fail(path, "an object", value);
}

function list<T>(
  value: unknown,
  path: string,
  parse: (value: unknown, path: string) => T,
): T[] {
  if (!Array.isArray(value)) fail(path, "an array", value);
  return value.map((item, i) => parse(item, `${path}[${i}]`));
}

function optional<T>(
  value: unknown,
  path: string,
  parse: (value: unknown, path: string) => T,
): T | undefined {
  return value === undefined ? undefined : parse(value, path);
}

function linkKind(value: unknown, path: string): LinkKind {
  for (const kind of LINK_KINDS) if (value === kind) return kind;
  return fail(path, `one of ${LINK_KINDS.join(", ")}`, value);
}

function weight(value: unknown, path: string): 1 | 2 | 3 {
  if (value === 1 || value === 2 || value === 3) return value;
  return fail(path, "1, 2 or 3", value);
}

function link(value: unknown, path: string): ExternalLink {
  const f = fields(value, path);
  const pending = optional(f.pending, `${path}.pending`, bool);
  const href = str(f.href, `${path}.href`);

  // Blank href is only valid on a pending link.
  if (href === "" && pending !== true) {
    throw new Error(
      `content.json: ${path}.href is empty: give it a URL, or mark the link "pending": true`,
    );
  }

  return {
    label: str(f.label, `${path}.label`),
    href,
    kind: optional(f.kind, `${path}.kind`, linkKind),
    srLabel: optional(f.srLabel, `${path}.srLabel`, str),
    pending,
  };
}

function skill(value: unknown, path: string): Skill {
  const f = fields(value, path);
  return {
    name: str(f.name, `${path}.name`),
    weight: weight(f.weight, `${path}.weight`),
  };
}

function stackGroup(value: unknown, path: string): StackGroup {
  const f = fields(value, path);
  return {
    label: str(f.label, `${path}.label`),
    items: list(f.items, `${path}.items`, skill),
  };
}

function project(value: unknown, path: string): Project {
  const f = fields(value, path);
  return {
    name: str(f.name, `${path}.name`),
    stack: list(f.stack, `${path}.stack`, str),
    description: str(f.description, `${path}.description`),
    links: list(f.links, `${path}.links`, link),
  };
}

function role(value: unknown, path: string): Role {
  const f = fields(value, path);
  return {
    company: str(f.company, `${path}.company`),
    title: str(f.title, `${path}.title`),
    period: str(f.period, `${path}.period`),
    location: str(f.location, `${path}.location`),
    context: str(f.context, `${path}.context`),
    bullets: list(f.bullets, `${path}.bullets`, str),
    tech: list(f.tech, `${path}.tech`, str),
  };
}

function photo(value: unknown, path: string): Photo | null {
  if (value === null) return null;
  if (value === undefined) fail(path, "an object or null", value);
  const f = fields(value, path);
  return {
    src: str(f.src, `${path}.src`),
    alt: str(f.alt, `${path}.alt`),
    width: num(f.width, `${path}.width`),
    height: num(f.height, `${path}.height`),
  };
}

export function parseSiteContent(value: unknown): SiteContent {
  const f = fields(value, "the file");
  return {
    name: str(f.name, "name"),
    role: str(f.role, "role"),
    tagline: str(f.tagline, "tagline"),
    location: str(f.location, "location"),
    url: str(f.url, "url"),
    email: str(f.email, "email"),
    photo: photo(f.photo, "photo"),
    links: list(f.links, "links", link),
    positioning: str(f.positioning, "positioning"),
    credentials: str(f.credentials, "credentials"),
    stack: list(f.stack, "stack", stackGroup),
    projects: list(f.projects, "projects", project),
    experience: list(f.experience, "experience", role),
  };
}
