import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { RailFill } from "@/components/RailFill";
import { Stack } from "@/components/Stack";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[78rem] px-4 sm:px-6 lg:px-8">
      <main id="main">
        <Hero />

        {/* The rail runs beside the stages only. The hero is the source it
            runs from, so it sits outside. The fill is a sibling of the stage
            stack rather than part of it, so the spacing rule does not push an
            absolutely positioned element down the page. */}
        <div className="pipeline mt-24 sm:mt-28">
          <RailFill />

          <div className="space-y-24 sm:space-y-28">
            <About />
            <Stack />
            <Experience />
            <Projects />
            <Contact />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
