import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { CursorGlow } from "@/components/CursorGlow";
import { GradientBackdrop } from "@/components/GradientBackdrop";
import { Navbar } from "@/components/Navbar";
import { site } from "@/content/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description = `${site.role} in ${site.location}. ${site.tagline.split(" · ").join(", ")}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role}`,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: `${site.name} — ${site.role}`,
    description,
  },
};

/**
 * schema.org Person, so search results and anything else reading structured
 * data get the same facts the page states.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location,
  },
  sameAs: site.links
    .map((link) => link.href)
    .filter((href) => href.startsWith("https://")),
};

/**
 * Runs before first paint. Two jobs:
 *
 * 1. Mark the document JavaScript-capable, which gates the scroll-reveal
 *    hiding rule in `globals.css`. Without JS the class is never set and
 *    every section renders visible.
 * 2. Apply any stored theme choice. This has to happen before paint or the
 *    page flashes the system theme first — the classic flash of wrong theme.
 *    It is wrapped in try/catch because reading localStorage throws outright
 *    in some privacy configurations.
 */
const bootScript = `(function(){
  var r = document.documentElement;
  r.classList.add("js");
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") r.setAttribute("data-theme", t);
  } catch (e) {}
})()`;

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The inline script below adds a `js` class before React hydrates, so the
      // server and client class lists differ by design. Scoped to this element
      // only — children are still checked normally.
      suppressHydrationWarning
    >
      <head>
        {/* Inline and synchronous on purpose: it must run before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <GradientBackdrop />
        <CursorGlow />
        <a
          href="#main"
          className="glass sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Navbar />
        {children}
        <script
          type="application/ld+json"
          // Serialised from a literal above, so there is no untrusted input here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
