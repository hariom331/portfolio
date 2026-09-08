import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/**
 * Web app manifest, emitted at `/manifest.webmanifest` and linked from the
 * document head automatically. It exists for the icon set more than for
 * installability — Android pulls the home-screen icon from here, not from the
 * `<link rel="icon">` tags.
 *
 * The maskable pair lives in `public/` rather than as `app/icon*.png` because
 * the manifest needs stable, hand-written URLs, and the file convention owns
 * the hashed ones.
 */
// The manifest is a Route Handler under the hood, and `output: "export"` will
// not prerender one unless it says so.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.name,
    description: `${site.role} in ${site.location}.`,
    start_url: "/",
    display: "standalone",
    // Matches `--bg` in globals.css: the splash screen should be the same
    // console dark as the page, not a white flash before it.
    background_color: "#0a0c0f",
    theme_color: "#0a0c0f",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
