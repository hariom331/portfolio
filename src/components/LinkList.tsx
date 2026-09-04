import { LinkIcon } from "@/components/LinkIcon";
import { anchorProps } from "@/lib/links";
import type { ExternalLink } from "@/content/types";

interface LinkListProps {
  readonly links: readonly ExternalLink[];
  readonly label: string;
  readonly compact?: boolean;
}

// A list rather than a nav landmark: pending entries are not links, and the
// top bar is the real navigation.
export function LinkList({ links, label, compact = false }: LinkListProps) {
  if (links.length === 0) return null;

  const size = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const shared = `inline-flex items-center gap-2 rounded-full font-medium ${size}`;

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2.5">
      {links.map((link) => (
        <li key={`${link.kind ?? "link"}-${link.label}`}>
          {link.pending ? (
            <span className={`link-pending ${shared}`}>
              {link.kind ? <LinkIcon kind={link.kind} /> : null}
              <span>{link.label}</span>
              <span className="link-soon">soon</span>
            </span>
          ) : (
            <a
              href={link.href}
              {...anchorProps(link.href)}
              className={`glass glass-hover link-button ${shared}`}
            >
              {link.kind ? <LinkIcon kind={link.kind} /> : null}
              <span>{link.label}</span>
              {link.srLabel ? (
                <span className="sr-only"> {link.srLabel}</span>
              ) : null}
              <span aria-hidden="true" className="link-button-arrow">
                →
              </span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
