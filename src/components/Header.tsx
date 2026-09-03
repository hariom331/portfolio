import { LinkList } from "@/components/LinkList";
import { site } from "@/content/site";

/**
 * The identity block: name, role, where, links, credentials.
 *
 * On desktop this is the sticky left rail, so it stays on screen for the
 * whole scroll — the contact links are never more than a glance away. On
 * mobile it is simply the top of the page.
 */
export function Header() {
  return (
    <header>
      <p className="text-muted font-mono text-xs tracking-[0.22em] uppercase">
        {site.location}
      </p>

      <h1 className="mt-5 text-5xl font-semibold tracking-tight xl:text-6xl">
        <span className="gradient-text">{site.name}</span>
      </h1>

      <p className="mt-4 text-lg font-medium">{site.role}</p>
      <p className="text-muted mt-1.5 font-mono text-sm">{site.tagline}</p>

      <div className="mt-8">
        <LinkList links={site.links} label="Contact and profiles" />
      </div>

      <p className="border-rule text-muted mt-8 border-t pt-6 text-sm leading-relaxed">
        {site.credentials}
      </p>
    </header>
  );
}
