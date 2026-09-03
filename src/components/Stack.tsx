import { Section } from "@/components/Section";
import { SkillCloud } from "@/components/SkillCloud";
import { site } from "@/content/site";

/**
 * The stack, as a rotating word cloud.
 *
 * Names and relative prominence only — no proficiency bars. A self-assigned
 * "Java 90%" is unfalsifiable and reads as junior.
 *
 * Groups are flattened before they reach the cloud, then interleaved so
 * neighbouring words come from different categories: a sphere built from a
 * sorted list puts every AWS service on the same face.
 */
export function Stack() {
  if (site.stack.length === 0) return null;

  const longest = Math.max(...site.stack.map((group) => group.items.length));
  const interleaved = Array.from({ length: longest }, (_, index) =>
    site.stack
      .map((group) => group.items[index])
      .filter((item) => item != null),
  ).flat();

  return (
    <Section id="stack" title="Stack">
      <SkillCloud skills={interleaved} />
    </Section>
  );
}
