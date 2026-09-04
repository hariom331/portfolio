import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { site } from "@/content/site";

export function Summary() {
  return (
    <Section id="about" title="Professional summary">
      <Card className="p-6 sm:p-8">
        {/* Caps the measure at ~72 characters. */}
        <p className="max-w-[72ch] text-base leading-relaxed sm:text-[1.0625rem]">
          {site.positioning}
        </p>
      </Card>
    </Section>
  );
}
