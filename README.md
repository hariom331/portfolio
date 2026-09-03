# portfolio

Personal site for Hariom Joshi — Cloud & Backend Engineer, Hyderabad.

One page, statically exported. It exists to be a single URL for a LinkedIn
featured section, a GitHub bio and an email signature. It is a link hub with
proof attached, not a creative showcase.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4, built with
`output: "export"` to a plain `out/` directory.

## Commands

| Command                | What it does                        |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Dev server on http://localhost:3000 |
| `npm run build`        | Static export to `out/`             |
| `npm run preview`      | Serve the built `out/` directory    |
| `npm run lint`         | ESLint                              |
| `npm run typecheck`    | `tsc --noEmit`                      |
| `npm run format`       | Prettier, write                     |
| `npm run format:check` | Prettier, check only                |

## Editing content

All copy lives in `src/content/site.ts`, typed by `src/content/types.ts`.
Components read from it and hard-code nothing. To change what the page says,
edit that one file.

The master resume (`analysis/11-resume-rewritten.md` in the resumes repo) is
the source of truth for every claim. If the two disagree, the resume wins.

## Outstanding

- [ ] Re-copy `public/resume.pdf` whenever the LaTeX master is rebuilt; nothing
      syncs the two.
- [ ] Set the real origin in `site.url` once a domain is registered.
- [ ] Fill in `site.flagship` when the flagship project is live and its numbers
      are measured. The section renders nothing while it is `null`, by design.

## Deploying

Cloudflare Pages: build command `npm run build`, output directory `out`.

GitHub Pages will not publish from a private repository on the free plan. If
this repo stays private, use Cloudflare Pages. If it goes public and you use
GitHub Pages from a project subpath, set `basePath` in `next.config.ts`.
