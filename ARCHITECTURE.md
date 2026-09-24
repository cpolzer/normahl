# Architecture

## Task runner

[mise](https://mise.jdx.dev) is the one and only task runner for this repo (`.mise.toml`). Every `npm run` script in `package.json` has a corresponding `mise run` task; contributors and local workflows should invoke tasks through `mise`, not `npm run` directly. When adding a new npm script, add the matching mise task in the same change so the two never drift apart.

## Overview

Static site, no server-side runtime. Astro renders every route to static HTML at build time (`output: 'static'` in `astro.config.mjs`). The site can be built with a configurable base path via the `BASE_PATH` env var (`astro.config.mjs`: `base: process.env.BASE_PATH || '/normahl/'`), so always build URLs from `import.meta.env.BASE_URL` (or `canonical()`, see below), never a hardcoded `/normahl/`.

```
src/
  pages/        route → file mapping (Astro file-based routing)
  layouts/      BaseLayout.astro — shared <head>, wraps every page
  components/   Header, Footer, AuthGuard, ConcertCard, NewsCard
  data/         concerts.json, news.json, site.json — hand-edited or synced content
  styles/       global.css — Tailwind entrypoint + theme tokens + a handful of shared classes
```

## Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `pages/index.astro` | Hero, upcoming concerts (preview), news (optional) |
| `/konzerte` | `pages/konzerte.astro` | Full concert list |
| `/presse` | `pages/presse.astro` | Press/photo material |
| `/news` | `pages/news.astro` | Full news list |
| `/impressum`, `/datenschutz` | Legal pages |
| `/login` | Password gate for `AuthGuard`-protected pages (unused by default); `<meta name="robots" content="noindex">` |
| `/sitemap.xml` | `pages/sitemap.xml.ts` — public pages (excludes `/login`), canonical URLs |
| `/robots.txt` | `pages/robots.txt.ts` — allows everything, points to the sitemap |
| `/konzerte/feed.xml` | `pages/konzerte/feed.xml.ts` — Atom feed of upcoming concerts, built with `src/lib/feed.ts` |

## Styling approach

Tailwind v4 is wired up via `@tailwindcss/vite` and imported once in `src/styles/global.css`. Brand colors live in a `@theme` block there (`--color-black`, `--color-accent`, etc.), which makes them available both as CSS custom properties (`var(--color-accent)`) and as generated Tailwind utilities (`bg-accent`, `text-black`, …).

Two styling patterns coexist by design:

1. **Shared, cross-page classes** stay in `global.css` as plain CSS: `.container`, `.section`, `.section-title`, `.btn`/`.btn-primary`/`.btn-outline`, `.card`, `.divider`. These are used across multiple pages/components, so they're not inlined as utilities.
2. **Page/component-specific markup** uses Tailwind utility classes directly in the `.astro` file, with a small residual `<style>` block only for things utilities can't express cleanly (complex `mask-image` effects, `@keyframes`, or CSS state classes toggled by vanilla JS).

**Important gotcha**: don't give a page-scoped element the same class name as a rule in `global.css` unless you mean to inherit it. Tailwind's utility classes live in a low-priority `@layer`, so an unlayered rule in `global.css` with the same class name wins the cascade regardless of source order or specificity, silently overriding utility classes on that element. This caused a real bug during the hero section migration (`.hero` collided with a legacy generic rule) — fixed by renaming the page-specific element to `.home-hero`. When adding new utility-styled markup, grep `global.css` for the class name first.

## Interactive behavior

Client-side JS lives in `<script>` blocks in the relevant `.astro` file (no framework — Astro's default is zero-JS, opted into per-page). On `index.astro`:

- Hero slideshow: desktop rotates through `heroImages` every 5s via a JS `active` class; mobile shows a single static image (`hero-1-mobile.jpg`) with the desktop slideshow hidden via `max-sm:hidden` — no rotation on mobile.
- Preview config bar (`#config-bar`, gated by `site.showNews`/`site.showPreview` flags in `site.json`): lets a visitor toggle the "Adler" watermark, hero content visibility, and hero logo color (white/red/grey) via `data-color` on the hero section, persisted to `localStorage`.
- News tabs: click a thumbnail to swap the active `.news-panel`.

## Data flow

- `concerts.json` / `news.json` are read directly in the page frontmatter (`import concerts from '../data/concerts.json'`) — no CMS, no API calls at runtime.
- Concert sync is a manual/scripted process: `scripts/fetch-calendar.mjs` pulls the band's public Google Calendar, `scripts/sync-concerts.mjs` merges new future entries into `concerts.json`. Neither runs automatically in CI — run them locally and commit the result.

## Images

`scripts/generate-thumbnails.mjs` runs as part of `npm run build` (before `astro build`) and writes resized/optimized images into `public/images/` using Sharp. Source images and generated thumbnails currently live side-by-side in `public/`, not in `src/assets` — Astro's built-in `astro:assets` pipeline is not used.

## URLs and SEO

`src/lib/urls.ts` exports `canonical(path, base?)`, which turns a bare pathname into an absolute `https://www.normahl.de/...` URL, stripping whatever base path the current build uses (`/normahl/` or `/`) and normalizing directory-style trailing slashes. `BaseLayout.astro` uses it to render `<link rel="canonical">` on every page and links an `<link rel="alternate" type="application/atom+xml">` to the feed.

`src/pages/sitemap.xml.ts` lists the public routes (respecting the `site.showNews` flag) as canonical URLs; `/login` is deliberately excluded. `src/pages/robots.txt.ts` allows everything and points to the sitemap — it intentionally has no `Disallow: /login`, because a Disallow would hide `/login`'s `<meta name="robots" content="noindex">` from crawlers that never fetch a disallowed page.

`src/pages/konzerte/feed.xml.ts` renders an Atom feed of upcoming concerts via `src/lib/feed.ts` (`upcomingConcerts`, `renderFeed`, entry IDs/titles, a `berlinToday()` helper since CI runs in UTC). The feed is discovered via the `<link rel="alternate" type="application/atom+xml">` tag `BaseLayout.astro` renders on every page, and is linked for visitors by the footer's fifth icon (`.footer-social`) only — the header has no feed icon.

## Icons

Social/media icons in the header and footer are copied verbatim from [Simple Icons](https://simpleicons.org) 16.32.0 (CC0-1.0) — `<path d="...">` data with `aria-hidden="true"` on the `<svg>` and an `aria-label` on the link. An e2e test (`tests/footer.spec.ts`) asserts the header and footer use the identical path per brand, so a new icon must come from Simple Icons too, added to both places.

## Testing

- **Unit** (Vitest, `mise run test:unit`): `src/**/*.test.ts`, e.g. `src/lib/urls.test.ts`, `src/lib/feed.test.ts` — pure logic (`canonical()`, feed rendering/entry IDs, `upcomingConcerts`).
- **E2E** (Playwright, `mise run test`): `tests/*.spec.ts`, serving the built `dist/` — always run `mise run build` right before. `PW_PORT` overrides the dev/preview port (`playwright.config.ts`), so several suites (e.g. parallel worktrees) can run without colliding.
- `mise run check:root`: a build with base path `/` plus safety checks (no leftover `/normahl/`, no embedded password hash, `index.html` present).

## Deployment

Pushes to `main` are built and deployed automatically by GitHub Actions.
