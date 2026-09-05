import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { Backdrop } from "@/components/Backdrop";
import { CommandPalette } from "@/components/CommandPalette";
import { CursorGlow } from "@/components/CursorGlow";
import { ScrollProgress } from "@/components/ScrollProgress";
import { TopBar } from "@/components/TopBar";
import { site } from "@/content/site";

import "./globals.css";

// Both faces are variable, so every weight in the design comes out of one file
// each and no weight list is needed.
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const terminal = JetBrains_Mono({
  variable: "--font-terminal",
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
  knowsAbout: site.stack.flatMap((group) => group.items),
  sameAs: site.links
    .map((link) => link.href)
    .filter((href) => href.startsWith("https://")),
};

// Marks the document as scripted, which is what gates the scroll reveal: with
// no JavaScript the sections never get their observer, so they must not start
// hidden.
const bootScript = `document.documentElement.classList.add("js")`;

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${terminal.variable} h-full antialiased`}
      // The boot script edits this element's class list before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Backdrop />
        <CursorGlow />
        <ScrollProgress />

        <a
          href="#main"
          className="panel sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
        >
          Skip to content
        </a>

        <TopBar />
        {children}
        <CommandPalette />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
