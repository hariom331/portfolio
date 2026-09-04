export function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function anchorProps(href: string) {
  return isExternal(href)
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : ({} as const);
}
