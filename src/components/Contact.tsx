"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Section } from "@/components/Section";
import { SpotlightCard } from "@/components/SpotlightCard";
import { site } from "@/content/site";

type Status = "idle" | "composed" | "copied";

// Keeps the composed mailto well inside what mail clients accept.
const MESSAGE_MAX = 1200;

// Static export, so there is no endpoint to POST to. The form composes a
// mailto and hands it to the visitor's own mail client. To move to a real
// endpoint, swap the body of handleSubmit for a fetch.
export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = `Portfolio message from ${name}`;
    const body = `${message}\n\n— ${name}\nReply to: ${email}`;

    // An unescaped newline or ampersand would truncate the mail there.
    window.location.href =
      `mailto:${site.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    setStatus("composed");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setStatus("copied");
    } catch {
      // Blocked clipboard. The address is on screen next to the button.
    }
  };

  return (
    <Section
      id="contact"
      title="Get in touch"
      lead="Recruiters hiring for cloud or backend roles, and engineers who want to compare notes on AWS migrations — both welcome. I read everything that arrives."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <SpotlightCard className="flex flex-col p-6 sm:p-7">
          <p className="text-muted font-mono text-xs tracking-[0.18em] uppercase">
            Email
          </p>

          <a
            href={`mailto:${site.email}`}
            className="text-accent mt-3 text-lg font-medium break-all underline-offset-4 hover:underline"
          >
            {site.email}
          </a>

          <p className="text-muted mt-4 text-sm leading-relaxed">
            Based in {site.location}, open to remote and hybrid roles. The
            fastest route is a direct email — the form does the same thing, it
            just fills the draft in for you.
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
            <button type="button" onClick={copyEmail} className="button-ghost">
              Copy address
            </button>

            <span aria-live="polite" className="text-muted text-xs">
              {status === "copied" ? "Copied to clipboard" : ""}
            </span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  className="field"
                />
              </div>

              <div className="field-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ada@example.com"
                  className="field"
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                maxLength={MESSAGE_MAX}
                placeholder="The role, the team, or the thing you want to compare notes on."
                className="field resize-y"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="button-primary">
                Compose email
              </button>

              <p
                aria-live="polite"
                className="text-muted text-xs leading-relaxed"
              >
                {status === "composed"
                  ? "Your mail app should be open with the draft ready — nothing is sent from this page."
                  : "Opens your mail app with the message filled in."}
              </p>
            </div>
          </form>
        </SpotlightCard>
      </div>
    </Section>
  );
}
