# NoRMAhl Website

Official band website for NoRMAhl (Punkrock `78), built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com), deployed to GitHub Pages.

Live at: https://www.normahl.de

## Stack

- **Astro 7** (static output)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Sharp** for build-time image thumbnail generation
- **Playwright** for e2e responsiveness tests

## Getting started

[mise](https://mise.jdx.dev) is the one and only task runner for this repo — it pins Node 22 and wraps every project command as a task (see `.mise.toml`). Don't invoke `npm run` directly; use the matching `mise run` task instead.

```bash
mise install      # installs Node 22 per .mise.toml
npm install
mise run dev       # start dev server
```

## Tasks

| Command | Description |
|---|---|
| `mise run dev` | Start the Astro dev server |
| `mise run build` | Generate image thumbnails, then build the static site to `dist/` |
| `mise run preview` | Preview the built site locally |
| `mise run check` | Sync Astro's generated types |
| `mise run test` | Run Playwright e2e responsiveness tests (desktop/tablet/mobile) |
| `mise run test:ui` | Run Playwright e2e tests in UI mode |

Adding a new `npm run` script to `package.json`? Add a matching `mise` task in the same change — `package.json` scripts are implementation details invoked by `mise`, not something contributors or CI should call directly.

## Content & data

- `src/data/concerts.json`, `src/data/news.json`, `src/data/site.json` — site content, hand-edited or synced (see below).
- `scripts/fetch-calendar.mjs` — pulls the band's public Google Calendar into `resources/calendar.json`/`.ics`.
- `scripts/sync-concerts.mjs` — merges future calendar entries into `src/data/concerts.json`.
- `scripts/generate-thumbnails.mjs` — generates resized hero/press images into `public/images/` at build time (runs automatically via `npm run build`).

## Auth (optional password gate)

Pages can be gated behind a simple client-side password check (`src/components/AuthGuard.astro` + `src/pages/login.astro`), driven by the `PUBLIC_PASSWORD_HASH` environment variable. Not enabled by default.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site and deploys `dist/` to GitHub Pages.

## More docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — how the site is structured
- [AGENTS.md](./AGENTS.md) — conventions and gotchas for AI coding agents working in this repo
