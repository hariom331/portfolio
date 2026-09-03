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
 * The row of outbound links under the header, and the button rows inside
 * project cards. A nav/list so a screen reader announces the group and its
 * count rather than four loose links.
 */
export function LinkList({ links, label, compact = false }: LinkListProps) {
  if (links.length === 0) return null;

  const size = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              {...anchorProps(link.href)}
              className={`glass glass-hover link-button inline-flex items-center gap-2 rounded-full font-medium ${size}`}
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
          </li>
        ))}
      </ul>
    </nav>
  );
}
