import { LinkIcon } from "@/components/LinkIcon";
import { anchorProps } from "@/lib/links";
import type { ExternalLink } from "@/content/types";

interface LinkListProps {
  readonly links: readonly ExternalLink[];
  readonly label: string;
}

// A list rather than a nav landmark: the console bar is the real navigation.
// Every entry here goes somewhere — a link with nothing behind it is left out
// of the content file rather than shown as a promise.
export function LinkList({ links, label }: LinkListProps) {
  if (links.length === 0) return null;

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {links.map((link) => (
        <li key={`${link.kind ?? "link"}-${link.label}`}>
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
        </li>
      ))}
    </ul>
  );
}
