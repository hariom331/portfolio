import { site } from "@/content/site";

// What the file is called once it leaves the site. A folder of downloads with
// four files called resume.pdf in it is a folder with none, so the name it
// lands under has to carry whose resume it is.
export const RESUME_FILENAME = `${site.name.trim().replace(/\s+/g, "-")}-Resume.pdf`;

// A save with no click to attach the `download` attribute to — the command
// palette's version of the same action. This is a static export with no server
// to send Content-Disposition, so a same-origin anchor is the whole mechanism.
export function saveResume(href: string): void {
  const anchor = document.createElement("a");

  anchor.href = href;
  anchor.download = RESUME_FILENAME;
  anchor.rel = "noopener";

  // Firefox will not act on a click at a node outside the document.
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}
