"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { CopyEmail } from "@/components/CopyEmail";
import { LinkIcon } from "@/components/LinkIcon";
import { Lit } from "@/components/Lit";
import { Section } from "@/components/Section";
import { site } from "@/content/site";
import { anchorProps } from "@/lib/links";

// Keeps the composed mailto well inside what mail clients accept.
const MESSAGE_MAX = 1200;

// A static export has no endpoint to POST to. The form composes a mailto and
// hands it to the visitor's own mail client — which is also why the panel says
// so rather than pretending to send. To move to a real endpoint, swap the body
// of handleSubmit for a fetch.
export function Contact() {
  const [composed, setComposed] = useState(false);

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

    setComposed(true);
  };

  const profiles = site.links.filter(
    (link) => link.kind === "github" || link.kind === "linkedin",
  );

  return (
    <Section
      id="contact"
      title="Contact"
      lead="Recruiters hiring for cloud, DevOps or backend roles, and engineers who want to compare notes on AWS migrations — both welcome."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Lit className="flex flex-col">
          <div className="panel-head">
            <span aria-hidden="true" className="live-dot" />
            <span>open channel</span>
          </div>

          <div className="panel-body flex flex-1 flex-col">
            <p className="mono-label">Primary</p>
            <a
              href={`mailto:${site.email}`}
              className="text-accent mt-2 block font-mono text-sm break-all underline-offset-4 hover:underline sm:text-base"
            >
              {site.email}
            </a>

            <dl className="border-line mt-6 space-y-3 border-t pt-5">
              <div className="flex items-baseline gap-3">
                <dt className="mono-label w-20 shrink-0">Based</dt>
                <dd className="text-muted text-sm">{site.location}</dd>
              </div>
              <div className="flex items-baseline gap-3">
                <dt className="mono-label w-20 shrink-0">Region</dt>
                <dd className="text-muted font-mono text-sm">{site.region}</dd>
              </div>
              <div className="flex items-baseline gap-3">
                <dt className="mono-label w-20 shrink-0">Notice</dt>
                <dd className="text-muted text-sm">
                  Open to remote and hybrid
                </dd>
              </div>
            </dl>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
              <CopyEmail />
              {profiles.map((link) => (
                <a
                  key={link.kind}
                  href={link.href}
                  {...anchorProps(link.href)}
                  aria-label={link.label}
                  title={link.label}
                  className="icon-btn"
                >
                  {link.kind ? <LinkIcon kind={link.kind} /> : null}
                </a>
              ))}
            </div>
          </div>
        </Lit>

        <Lit>
          <div className="panel-head">
            <span>compose</span>
            <span className="panel-head-end">mailto</span>
          </div>

          <div className="panel-body">
            {/* The request this form is really making, spelled out. */}
            <pre className="text-faint mb-5 font-mono text-[0.6875rem] leading-relaxed">
              <code>
                <span className="text-accent">POST</span> /hire HTTP/1.1{"\n"}
                Host: {new URL(site.url).host}
                {"\n"}
                Content-Type: text/plain
              </code>
            </pre>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="field-group">
                  <label htmlFor="contact-name">from.name</label>
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
                  <label htmlFor="contact-email">from.email</label>
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
                <label htmlFor="contact-message">body</label>
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
                <button type="submit" className="btn btn-primary">
                  send request
                  <span aria-hidden="true">→</span>
                </button>

                <p
                  aria-live="polite"
                  className="text-faint max-w-xs text-xs leading-relaxed"
                >
                  {composed
                    ? "Your mail app should be open with the draft ready — nothing is sent from this page."
                    : "Opens your mail app with the message filled in."}
                </p>
              </div>
            </form>
          </div>
        </Lit>
      </div>
    </Section>
  );
}
