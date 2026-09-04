import { Fragment } from "react";

import { site } from "@/content/site";

// "Cloud & Infrastructure" -> "cloud-infrastructure". Manifest keys are
// lowercase and hyphenated; the group labels are prose.
function key(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function slug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// Two spaces per level, as YAML wants.
function pad(level: number): string {
  return "  ".repeat(level);
}

interface EntryProps {
  readonly level: number;
  readonly name: string;
  readonly value?: string;
  readonly comment?: string;
}

// A pre element takes phrasing content, so every line is a block span rather
// than a div.
function Entry({ level, name, value, comment }: EntryProps) {
  return (
    <span className="block">
      {pad(level)}
      <span className="yaml-k">{name}:</span>
      {value ? <span className="yaml-s"> {value}</span> : null}
      {comment ? <span className="yaml-c">{`  # ${comment}`}</span> : null}
    </span>
  );
}

interface ItemProps {
  readonly level: number;
  readonly value: string;
}

function Item({ level, value }: ItemProps) {
  return (
    <span className="block">
      {pad(level)}
      <span className="yaml-n">- </span>
      <span className="yaml-s">{value}</span>
    </span>
  );
}

// The same facts the prose states, restated as the resource they describe.
// Every value is read out of the content file, so the manifest cannot drift
// out of step with the rest of the page.
export function Manifest() {
  const role = site.experience.find((entry) => entry.since);

  return (
    <pre className="yaml" aria-label="Profile as a manifest">
      <code>
        <Entry level={0} name="apiVersion" value="engineer.dev/v1" />
        <Entry level={0} name="kind" value="CloudEngineer" />
        <Entry level={0} name="metadata" />
        <Entry level={1} name="name" value={slug(site.name)} />
        <Entry level={1} name="location" value={`"${site.location}"`} />
        <Entry level={1} name="region" value={site.region} />
        <Entry level={0} name="spec" />
        <Entry level={1} name="role" value={`"${site.role}"`} />

        {site.stack.map((group) => {
          // Only the load-bearing entries; the full inventory is the next
          // stage down the page.
          const core = group.items.filter((item) => item.weight === 3);
          if (core.length === 0) return null;

          return (
            <Fragment key={group.label}>
              <Entry level={1} name={key(group.label)} />
              {core.map((item) => (
                <Item key={item.name} level={2} value={item.name} />
              ))}
            </Fragment>
          );
        })}

        <Entry level={0} name="status" />
        <Entry level={1} name="phase" value="Running" />
        {role?.since ? (
          <Entry level={1} name="since" value={role.since} />
        ) : null}
        <Entry
          level={1}
          name="replicas"
          value="1"
          comment="does not scale horizontally"
        />
      </code>
    </pre>
  );
}
