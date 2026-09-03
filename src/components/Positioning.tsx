import { Card } from "@/components/Card";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

/**
 * The most-read text on the page. Not wrapped in a `Section` — it opens the
 * content column rather than being one titled block among several.
 */
export function Positioning() {
  return (
    <Reveal>
      <Card className="p-6 sm:p-8">
        {/* The column is wide; a paragraph running its full width would be
            an unreadable measure, so the text caps at ~70 characters. */}
        <p className="max-w-[70ch] text-base leading-relaxed sm:text-[1.0625rem]">
          {site.positioning}
        </p>
      </Card>
    </Reveal>
  );
}
