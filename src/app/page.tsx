import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Summary } from "@/components/Summary";

/**
 * One page, one column, in the order a recruiter reads: who, what, the tools,
 * history, side work, how to reach him. The top bar in the layout links to
 * each section by hash; nothing here routes.
 */
export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-10 sm:px-8 sm:pt-14">
      <main id="main" className="space-y-20 sm:space-y-24">
        <Hero />
        <Summary />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
