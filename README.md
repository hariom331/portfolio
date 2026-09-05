# Portfolio

Single-page developer portfolio for Hariom Joshi. Next.js 16, React 19,
TypeScript and Tailwind CSS v4, exported to static HTML. All page copy comes
from one JSON file.

## Running it

Needs Node 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command                | What it does                     |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Dev server on port 3000          |
| `npm run build`        | Static export to `out/`          |
| `npm run preview`      | Serve the built `out/` directory |
| `npm run lint`         | ESLint                           |
| `npm run typecheck`    | `tsc --noEmit`                   |
| `npm run format`       | Prettier, write                  |
| `npm run format:check` | Prettier, check only             |

## Editing content

Everything the page says lives in `src/content/content.json`. Components read
it through `src/content/site.ts` and hold no copy of their own, so that one
file is all you need to change.

`src/content/types.ts` defines the shape and `src/content/parse.ts` checks the
JSON against it on load. A bad field fails the build and names the path:

```
content.json: experience[0].period must be a string, got nothing
content.json: stack[0].items[0].weight must be 1, 2 or 3, got 5
```

Edits appear in about a second while `npm run dev` is running. The deployed
site is a static export, so updating a live site needs `npm run build` and a
redeploy.

### Fields

| Field         | Holds                                                              |
| ------------- | ------------------------------------------------------------------ |
| `name`        | Full name. Also generates the monogram and the `user@prod` prompt. |
| `role`        | Job title                                                          |
| `tagline`     | One-line stack summary under the name                              |
| `location`    | City, country                                                      |
| `region`      | Home AWS region, used as the locality label in the console chrome  |
| `url`         | Absolute origin, for canonical and OG tags                         |
| `email`       | Contact address                                                    |
| `photo`       | `{ src, alt, width, height }` or `null`                            |
| `links`       | Header links: `{ label, href, kind }`                              |
| `positioning` | The summary paragraph                                              |
| `philosophy`  | The "How I work" paragraph under it                                |
| `deploy`      | The hero terminal transcript: `{ command, steps, result }`         |
| `credentials` | The build badges: `{ label, value }`                               |
| `stack`       | `{ label, items: [{ name, weight }] }`                             |
| `projects`    | `{ name, stack, description, links }`                              |
| `experience`  | A role — see below                                                 |

A role is
`{ company, title, period, since?, location, context, metrics, bullets, tech }`.

`metrics` is the row of numbers the card leads with, each
`{ value, label, note }`. They belong to the role rather than to the page: they
are what changed on that engagement, so they are quoted where the engagement
is, not in the masthead.

`since` is an ISO date and drives the live uptime readout in the hero terminal.
Leave it off a role that has ended and nothing counts up.

A skill's `weight` runs 1 to 3 and sets prominence, not proficiency. Weight 3
is the tier the Stack panels highlight and the only one the manifest lists;
weight 1 sits back a step from weight 2 in the supporting run.

A link's `kind` picks its icon and must be one of `github`, `demo`, `docs`,
`video`, `writeup`, `resume`, `linkedin` or `email`. Setting `"pending": true`
renders an inert "soon" chip instead of a link, and ignores `href`.

Every line of the hero terminal restates a claim the rest of the page backs up.
Keep it that way — it is the first thing read and the easiest thing to make
untrue.

## Using it for someone else

Replace `content.json`, swap `public/resume.pdf`, and update the favicon at
`src/app/favicon.ico`.

Four things are still written into components and describe the current owner:

- `Stack.tsx` — the section's lead paragraph
- `Contact.tsx` — the lead paragraph, and the "Open to remote and hybrid" row
- `Manifest.tsx` — the `apiVersion` and `kind` of the rendered resource
- `layout.tsx` — the OpenGraph locale, `en_IN`

## Theme

One theme, dark. The page is a console and a console is dark, so there is no
light mapping to keep in step and no toggle to ship.

The metaphor is load-bearing rather than decorative:

- The five sections are **stages of one run**, strung down a hairline spine in
  the left gutter. A node is queued, pulses amber while its stage is on screen
  and settles to a green tick once it is behind you; the spine fills green
  behind you as you read.
- The hero is a **deploy transcript** that plays itself with CSS alone — no
  JavaScript, so it runs with scripting off — and ends on a live `uptime`.
- The summary is restated as a **manifest**, generated from the same content
  file the prose comes from, so the two cannot drift.
- The stack is **four panels of the estate**, each splitting the handful of
  tools that are owned end to end from the longer run of ones merely worked
  with. Depth is the point of the section, so depth is what the layout shows.
- A role **leads with its numbers**, then backs them with `+` additions in a
  diff. Credentials are the **two-part shields** across the top of a README.
- Contact is an **HTTP request**. It composes a `mailto:` — a static export has
  no endpoint to POST to, which is why the panel says so.

`⌘K` / `Ctrl-K` opens a command palette: jump to a stage, copy the address,
open the résumé.

The surface underneath is flat: opaque panels, hairline rules, near-square
corners, JetBrains Mono for anything structural and Space Grotesk for prose. No
drop shadows. Colour is semantic and sparing — amber is the operator's own
signal and marks headings, actions and focus; green means passed; blue means
merely informational; yellow means not finished yet. Nothing else is coloured.

Everything is driven by the tokens in the one `:root` block at the top of
`src/app/globals.css`, so a new palette means editing one block:

| Token                      | Holds                                         |
| -------------------------- | --------------------------------------------- |
| `bg` / `surface` / `raise` | Page ground, panels on it, and hovered panels |
| `fg` / `muted` / `faint`   | Text, in descending prominence                |
| `line` / `line-2`          | Borders, resting and hovered                  |
| `grid`                     | The backdrop lattice                          |
| `accent` / `accent-ink`    | The operator's signal, and text on it         |
| `ok` / `info` / `warn`     | Passed, informational, and pending            |
| `grain` / `trace`          | Backdrop grain, and pointer-lattice strength  |
| `r-panel` / `r-chip`       | Corner rounding                               |
| `grid-size`                | Backdrop lattice pitch                        |

`muted`, `faint`, `accent`, `ok`, `info` and `warn` all clear WCAG AA (4.5:1)
against both `bg` and `surface`. Keep that true if you change them — `faint`
carries every small uppercase label on the page and has the least headroom.

The rail is laid out from two variables on `.pipeline`: `--gutter` is the left
inset the stages sit at, and `--node` is the node's size. The spine is centred
on half the node, so changing either keeps everything aligned.

### Two things that will bite

`html` uses `overflow-x: clip`, not `hidden`. `hidden` forces the used
`overflow-y` to `auto`, which makes the root element a scroll container — and
every `IntersectionObserver` on the page watches the implicit viewport root, so
they all stop firing. The stage rail, the scroll reveals and the active nav
link would go quietly dead.

Each section reveals itself on an observer, which means a section that never
gets its callback would sit at `opacity: 0` for good. `Section.tsx` starts a
watchdog alongside the observer: an observer reports on its target as soon as
it starts watching, so if nothing has arrived in 1.2s the reveal is abandoned
and the content is shown. The writing is the point; the fade is an ornament.

## Deploying

`npm run build` writes a plain `out/` directory that any static host serves.

For Cloudflare Pages, set the build command to `npm run build` and the output
directory to `out`. GitHub Pages will not publish from a private repository on
the free plan. If the repo is public and deployed from a subpath, set
`basePath` in `next.config.ts`.
