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

| Field         | Holds                                                          |
| ------------- | -------------------------------------------------------------- |
| `name`        | Full name. Also generates the navbar monogram.                 |
| `role`        | Job title                                                      |
| `tagline`     | One-line stack summary under the name                          |
| `location`    | City, country                                                  |
| `url`         | Absolute origin, for canonical and OG tags                     |
| `email`       | Contact address                                                |
| `photo`       | `{ src, alt, width, height }` or `null`                        |
| `links`       | Header links: `{ label, href, kind }`                          |
| `positioning` | The summary paragraph                                          |
| `credentials` | One line of certifications and results                         |
| `stack`       | `{ label, items: [{ name, weight }] }`                         |
| `projects`    | `{ name, stack, description, links }`                          |
| `experience`  | `{ company, title, period, location, context, bullets, tech }` |

A skill's `weight` runs 1 to 3 and sets prominence, not proficiency. Weight 3
renders highlighted.

A link's `kind` picks its icon and must be one of `github`, `demo`, `docs`,
`video`, `writeup`, `resume`, `linkedin` or `email`. Setting `"pending": true`
renders an inert "soon" chip instead of a link, and ignores `href`.

## Using it for someone else

Replace `content.json`, swap `public/resume.pdf`, and update the favicon at
`src/app/favicon.ico`. Nothing in `src/components/` needs to change.

Four strings are still hard-coded and describe the current owner:

- `Contact.tsx:54` invites recruiters hiring for cloud or backend roles
- `Contact.tsx:70` claims availability for remote and hybrid roles
- `Skills.tsx:13` refers to the tools the owner works in daily
- `layout.tsx:34` sets the OpenGraph locale to `en_IN`

## Deploying

`npm run build` writes a plain `out/` directory that any static host serves.

For Cloudflare Pages, set the build command to `npm run build` and the output
directory to `out`. GitHub Pages will not publish from a private repository on
the free plan. If the repo is public and deployed from a subpath, set
`basePath` in `next.config.ts`.
