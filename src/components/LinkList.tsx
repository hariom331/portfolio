import { LinkIcon } from "@/components/LinkIcon";
import { anchorProps } from "@/lib/links";
import type { ExternalLink } from "@/content/types";

interface LinkListProps {
  readonly links: readonly ExternalLink[];
  readonly label: string;
  /** Smaller pill sizing, for use inside project cards. */
  readonly compact?: boolean;
}

/**
 * The row of outbound buttons under the name, and the button rows inside
 * project cards.
 *
 * A labelled list, so a screen reader announces the group and its count
 * rather than four loose links. Not a `nav` landmark: a `pending` entry is
 * not a link at all, and the top bar is the page's actual navigation.
 *
 * A `pending` entry renders as an inert chip marked "soon" — dimmed, not
 * focusable, going nowhere. That is the honest way to show a demo that does
 * not exist yet: a button that leads nowhere is worse than no button.
 */
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
