// A JSON module's inferred type is too wide to satisfy SiteContent (kind
// widens to string), so the shape is checked here instead. Failures name the
// bad path and throw at build time.

import type {
  Credential,
  ExternalLink,
  LinkKind,
  Metric,
  Photo,
  Pipeline,
  PipelineStage,
  Project,
  Role,
  SiteContent,
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

function link(value: unknown, path: string): ExternalLink {
  const f = fields(value, path);
  const href = str(f.href, `${path}.href`);

  // Every link on the page is followed, so one with nowhere to go is a
  // mistake rather than a placeholder: leave it out of the file entirely.
  if (href === "") {
    throw new Error(
      `content.json: ${path}.href is empty: give it a URL, or remove the link`,
    );
  }

  return {
    label: str(f.label, `${path}.label`),
    href,
    kind: optional(f.kind, `${path}.kind`, linkKind),
    srLabel: optional(f.srLabel, `${path}.srLabel`, str),
  };
}

function stackGroup(value: unknown, path: string): StackGroup {
  const f = fields(value, path);
  return {
    label: str(f.label, `${path}.label`),
    items: list(f.items, `${path}.items`, str),
  };
}

function metric(value: unknown, path: string): Metric {
  const f = fields(value, path);
  return {
    value: str(f.value, `${path}.value`),
    label: str(f.label, `${path}.label`),
    note: str(f.note, `${path}.note`),
  };
}

function credential(value: unknown, path: string): Credential {
  const f = fields(value, path);
  return {
    label: str(f.label, `${path}.label`),
    value: str(f.value, `${path}.value`),
  };
}

function pipelineStage(value: unknown, path: string): PipelineStage {
  const f = fields(value, path);
  return {
    name: str(f.name, `${path}.name`),
    command: str(f.command, `${path}.command`),
    result: str(f.result, `${path}.result`),
  };
}

function pipeline(value: unknown, path: string): Pipeline {
  const f = fields(value, path);
  return {
    stages: list(f.stages, `${path}.stages`, pipelineStage),
    result: str(f.result, `${path}.result`),
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
    current: optional(f.current, `${path}.current`, bool),
    location: str(f.location, `${path}.location`),
    context: str(f.context, `${path}.context`),
    metrics: list(f.metrics, `${path}.metrics`, metric),
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
    focus: list(f.focus, "focus", str),
    location: str(f.location, "location"),
    region: str(f.region, "region"),
    url: str(f.url, "url"),
    email: str(f.email, "email"),
    careerSince: str(f.careerSince, "careerSince"),
    experienceYears: str(f.experienceYears, "experienceYears"),
    photo: photo(f.photo, "photo"),
    links: list(f.links, "links", link),
    positioning: str(f.positioning, "positioning"),
    philosophy: str(f.philosophy, "philosophy"),
    pipeline: pipeline(f.pipeline, "pipeline"),
    credentials: list(f.credentials, "credentials", credential),
    stack: list(f.stack, "stack", stackGroup),
    projects: list(f.projects, "projects", project),
    experience: list(f.experience, "experience", role),
  };
}
