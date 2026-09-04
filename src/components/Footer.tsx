import { site } from "@/content/site";

/**
 * The year is evaluated at build time — this is a static export, so it moves
 * when the site is rebuilt, not when the visitor's clock rolls over.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-rule mt-20 border-t pt-8 pb-14">
      <div className="text-muted flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name} · Built with Next.js and Tailwind
        </p>

        <a href="#top" className="hover:text-foreground transition-colors">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
