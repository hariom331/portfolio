import { parseSiteContent } from "./parse";
import type { SiteContent } from "./types";
import raw from "./content.json";

// Static import rather than a file read: this is a static export and two
// consumers are client components, so the JSON has to be bundled.
export const site: SiteContent = parseSiteContent(raw);
