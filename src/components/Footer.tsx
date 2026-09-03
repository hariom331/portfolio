import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-rule mt-20 border-t pt-8 pb-14">
      <p className="text-muted text-sm">
        Built with Next.js and Tailwind. Say hello —{" "}
        <a
          href={`mailto:${site.email}`}
          className="text-accent font-medium underline-offset-4 hover:underline"
        >
          {site.email}
        </a>
      </p>
    </footer>
  );
}
