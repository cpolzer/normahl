# Agent instructions

Conventions and gotchas for AI coding agents (Claude Code, etc.) working in this repo. See [ARCHITECTURE.md](./ARCHITECTURE.md) for how the site is structured and [README.md](./README.md) for setup/scripts.

## Task runner

**mise is the one and only task runner for this repo.** Always invoke `mise run <task>` (see `.mise.toml`) — never call `npm run <script>` directly, even though the underlying `package.json` scripts exist. If a task you need doesn't have a `mise` entry yet, add one in `.mise.toml` in the same change rather than falling back to `npm run`.

Current tasks: `mise run dev`, `mise run build`, `mise run preview`, `mise run check`, `mise run test`, `mise run test:ui`.

## Before making changes

- `mise run build` must succeed (runs thumbnail generation + `astro build`). Run it after any change to `.astro` files or `astro.config.mjs`.
- For visual changes, prefer verifying in a real browser (dev server or `astro preview`) over trusting the build output alone — Tailwind/CSS issues don't show up as build errors.
- Check `src/data/site.json` before assuming a section is "broken" — `showNews` and `showPreview` are feature flags, not bugs, when a section doesn't render.

## Styling conventions

- Tailwind v4 utilities are the default for new or migrated markup. Shared cross-page classes (`.container`, `.section`, `.btn`, `.card`, `.divider`, etc.) stay as plain CSS in `src/styles/global.css` — don't duplicate them as utility soup on every element.
- **Before naming a page-scoped class, grep `src/styles/global.css` for that name.** Tailwind's utilities live in a lower-priority `@layer`, so any unlayered rule in `global.css` with a matching class name silently wins over utility classes on that element, regardless of specificity or source order. This is not a theoretical risk — it broke the hero section's layout during the Tailwind migration (`.hero` collided with a legacy rule) and was only caught by visual inspection, not the build. If in doubt, prefix page-specific classes distinctively (e.g. `home-hero` instead of `hero`).
- Brand colors are theme tokens in `global.css`'s `@theme` block (`--color-black`, `--color-accent`, `--color-gray-*`, …) — reference them via generated utilities (`bg-black`, `text-accent`) or `var(--color-accent)` in arbitrary values, not hardcoded hex, when the color is one of the existing tokens.
- JS-driven state (`.active`, `.hero-hidden`, `.off`, `data-color`, etc.) toggled by vanilla `<script>` blocks is styled with Tailwind's arbitrary variants (`[&.active]:opacity-100`, `group-data-[color='red']:...`) rather than moved into a separate stylesheet, to keep the state/style mapping in one place.

## JS conventions

- No frontend framework — Astro's zero-JS-by-default model. Interactive bits are hand-written vanilla TS in `<script>` tags scoped to the page/component that needs them.
- Don't introduce a framework (React/Vue/etc.) or a state management library for small interactive widgets like tabs or toggles; the existing pattern (`querySelector` + class toggling + `localStorage`) is intentional and sufficient here.

## Content changes

- Concert/news data lives in `src/data/*.json`. Editing these directly is fine and is the normal way to update content — no CMS.
- `scripts/fetch-calendar.mjs` and `scripts/sync-concerts.mjs` are run manually (not in CI). Don't wire them into the build or a GitHub Action without being asked — the maintainer reviews synced calendar entries before committing.

## Git workflow

- Feature work happens on a branch (`feature/...`), gets reviewed/tested, then merged to `main` — don't push directly to `main` for anything beyond trivial fixes without confirming first.
- Commit and push only when explicitly asked.
