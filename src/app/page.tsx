import { Experience } from "@/components/Experience";
import { Flagship } from "@/components/Flagship";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Highlights } from "@/components/Highlights";
import { Positioning } from "@/components/Positioning";
import { Projects } from "@/components/Projects";
import { Stack } from "@/components/Stack";

/**
 * One page, scroll, no routing.
 *
 * From `lg` up the identity block becomes a sticky left rail and the content
 * scrolls beside it, so the page uses the full width of a desktop window
 * instead of leaving a narrow column adrift in the middle of it. Below `lg`
 * the two columns collapse back into the single stacked order, which is the
 * order a recruiter reads top-down anyway.
 */
export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[88rem] px-5 py-14 sm:px-8 lg:py-20">
      <div className="lg:grid lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start lg:gap-14 xl:grid-cols-[23rem_minmax(0,1fr)] xl:gap-20">
        {/*
          `self-start` is what makes `sticky` work here — a grid item defaults
          to stretching the full row height, and a stretched item has nothing
          left to stick within.
        */}
        <div className="lg:sticky lg:top-16 lg:self-start">
          <Header />
        </div>

        <main id="main" className="mt-14 space-y-14 lg:mt-0 lg:space-y-20">
          <Positioning />
          <Highlights />
          <Flagship />
          <Stack />
          <Projects />
          <Experience />
        </main>
      </div>

      <Footer />
    </div>
  );
}
