import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static HTML export. `next build` writes a plain `out/` directory that any
   * static host serves as-is — Cloudflare Pages, GitHub Pages, S3. Nothing on
   * this site needs a server, and this keeps the output indexable and free to
   * host.
   *
   * Note: the private-repo caveat. GitHub Pages will not publish from a
   * private repository on the free plan; Cloudflare Pages will.
   */
  output: "export",

  /** Required by `output: "export"` — there is no image optimiser at runtime. */
  images: { unoptimized: true },

  /** Emits `path/index.html` instead of `path.html`, which static hosts prefer. */
  trailingSlash: true,

  /** Fail the production build on a type error rather than shipping it. */
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
