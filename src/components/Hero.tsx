import Image from "next/image";

import { LinkList } from "@/components/LinkList";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-name"
      className="flex scroll-mt-24 flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-14"
    >
      <div className="order-2 max-w-2xl md:order-1">
        <p className="text-muted font-mono text-xs tracking-[0.22em] uppercase">
          {site.location}
        </p>

        <h1
          id="hero-name"
          className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          <span className="gradient-text">{site.name}</span>
        </h1>

        <p className="mt-4 text-lg font-medium sm:text-xl">{site.role}</p>
        <p className="text-muted mt-2 font-mono text-sm">{site.tagline}</p>

        <div className="mt-8">
          <LinkList links={site.links} label="Contact and profiles" />
        </div>

        <p className="text-muted mt-8 max-w-xl text-sm leading-relaxed">
          {site.credentials}
        </p>
      </div>

      {site.photo ? (
        <div className="order-1 shrink-0 self-center md:order-2 md:self-auto">
          <Image
            src={site.photo.src}
            alt={site.photo.alt}
            width={site.photo.width}
            height={site.photo.height}
            priority
            className="photo-frame object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}
