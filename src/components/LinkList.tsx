import { LinkIcon } from "@/components/LinkIcon";
import { anchorProps } from "@/lib/links";
import type { ExternalLink } from "@/content/types";

interface LinkListProps {
  readonly links: readonly ExternalLink[];
  readonly label: string;
}

// A list rather than a nav landmark: pending entries are not links, and the
// console bar is the real navigation.
export function LinkList({ links, label }: LinkListProps) {
  if (links.length === 0) return null;

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {links.map((link) => (
        <li key={`${link.kind ?? "link"}-${link.label}`}>
          {link.pending ? (
            <span className="btn btn-pending !px-2.5 !py-1.5">
              {link.kind ? <LinkIcon kind={link.kind} /> : null}
              <span>{link.label.toLowerCase()}</span>
              <span className="btn-soon">soon</span>
            </span>
          ) : (
            <a
              href={link.href}
              {...anchorProps(link.href)}
              className="btn btn-ghost !px-2.5 !py-1.5"
            >
              {link.kind ? <LinkIcon kind={link.kind} /> : null}
              <span>{link.label.toLowerCase()}</span>
              {link.srLabel ? (
                <span className="sr-only"> {link.srLabel}</span>
              ) : null}
              <span aria-hidden="true" className="btn-arrow">
                →
              </span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
