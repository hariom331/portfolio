/** True for anything that leaves the site and should open in a new tab. */
export function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

/**
 * Attributes for an anchor, derived from its href.
 *
 * `noreferrer` alongside `noopener` because there is nothing to gain from
 * leaking the referrer to GitHub or LinkedIn.
 */
export function anchorProps(href: string) {
  return isExternal(href)
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : ({} as const);
}
