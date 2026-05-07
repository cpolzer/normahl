# NoRMAhl Website - Design Specification

**Date:** 2026-05-07  
**Status:** Draft

## Overview

Rebuild normahl.de as a static website using Astro. Features: concert dates, news updates, band info, merchandise/booking links.

## Architecture

```
/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ConcertCard.astro
│   │   ├── NewsCard.astro
│   │   └── Hero.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── konzerte.astro
│   │   ├── news.astro
│   │   ├── impressum.astro
│   │   └── datenschutz.astro
│   ├── data/
│   │   ├── concerts.json
│   │   └── news.json
│   └── styles/
│       └── global.css
├── public/
│   └── images/
├── astro.config.mjs
└── package.json
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — logo, hero (latest release), concert slider, recent news |
| `/konzerte` | Full concert list |
| `/news` | News list |
| `/impressum` | Legal info |
| `/datenschutz` | Privacy policy |

## Data Schema

### concerts.json

```json
[
  {
    "date": "2026-04-10",
    "venue": "Komma/AT-Wörgl",
    "city": "Wörgl",
    "ticketUrl": "https://komma.at/veranstaltung/komma-connect-2/",
    "cancelled": false
  }
]
```

### news.json

```json
[
  {
    "id": "wizo-2026",
    "title": "NoRMAhl sieht das Licht mit WIZO 2026",
    "date": "2026-02-04",
    "excerpt": "2026 wird super gestartet - NoRMAhl zu Gast bei WIZO!",
    "content": "Full markdown content...",
    "links": [
      { "label": "Read more", "url": "https://youtu.be/CmyoEYzLp2o" }
    ]
  }
]
```

## Theme

- **Colors**: Black/white (#000, #fff)
- **Accent**: Optional gray scale
- **Fonts**: System fonts (sans-serif)
- **Layout**: Responsive, mobile-first

## Integrations

- `@astrojs/tailwind` — Styling
- `@astrojs/sitemap` — SEO
- `@astrojs/rss` — News feed
- `@astrojs/image` — Image optimization

## Deployment

Static HTML/CSS/JS → any host (Netlify, Vercel, GitHub Pages)