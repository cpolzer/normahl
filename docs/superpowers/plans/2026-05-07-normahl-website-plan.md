# NoRMAhl Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild normahl.de as a static Astro website with concert data and news from JSON files.

**Architecture:** Astro static site generator with Tailwind CSS. Pages: home, concerts, news, impressum, datenschutz. Data: JSON files for concerts and news.

**Tech Stack:** Astro, Tailwind CSS, Node.js

---

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "normahl-website",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/tailwind": "^6.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.normahl.de',
  integrations: [tailwind()],
  output: 'static',
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

- [ ] **Step 4: Create src/env.d.ts**

```typescript
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 5: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/env.d.ts
git commit -m "feat: initialize Astro project"
```

---

### Task 2: Create Data Files

**Files:**
- Create: `src/data/concerts.json`
- Create: `src/data/news.json`

- [ ] **Step 1: Create concerts.json**

```json
[
  {
    "date": "2026-04-10",
    "venue": "Komma/AT-Wörgl",
    "city": "Wörgl",
    "ticketUrl": "https://komma.at/veranstaltung/komma-connect-2/",
    "cancelled": false
  },
  {
    "date": "2026-04-18",
    "venue": "Countryside Calling",
    "city": "Unterpreppach",
    "ticketUrl": "https://www.bvd-ticket.de/produkt/countryside-calling/",
    "cancelled": false
  },
  {
    "date": "2026-05-01",
    "venue": "Sportplatz",
    "city": "Prölsdorf",
    "ticketUrl": "https://www.facebook.com/krachambachfestival/?locale=de_DE",
    "cancelled": false
  },
  {
    "date": "2026-05-02",
    "venue": "Reaktor",
    "city": "Schongau",
    "ticketUrl": "https://punk.de/index.php?MainCat=15&SubCat=86&ProdID=14712",
    "cancelled": false
  },
  {
    "date": "2026-05-16",
    "venue": "Heimspiel Festival",
    "city": "Weissenburg",
    "ticketUrl": "https://heimspielfestival.de/",
    "cancelled": false
  },
  {
    "date": "2026-06-06",
    "venue": "Oderbruch-Festival",
    "city": "Seelow",
    "ticketUrl": "https://punk.de/shop.php?MainCat=15&SubCat=87&ProdID=2262",
    "cancelled": false
  },
  {
    "date": "2026-06-27",
    "venue": "Schnick Schnack Festival",
    "city": "Lähde",
    "ticketUrl": "https://www.schnickschnack-festival.de/",
    "cancelled": false
  },
  {
    "date": "2026-08-01",
    "venue": "Kulturfestival am Schloßberg",
    "city": "Wildenberg",
    "ticketUrl": "https://rodschaundtom.de/products/kulturfestival-im-eigenen-land-wildenberg-1",
    "cancelled": false
  },
  {
    "date": "2026-10-16",
    "venue": "Kulturbühne Hinterhalt",
    "city": "Geretsried",
    "ticketUrl": "https://punk.de/shop.php?MainCat=15&SubCat=86&ProdID=14823",
    "cancelled": false
  },
  {
    "date": "2026-10-17",
    "venue": "Freiraum",
    "city": "St.Pölten",
    "ticketUrl": "https://tickets.close2fan.com/event/25-jahre-rocknroll-highschool-jubilaum",
    "cancelled": false
  }
]
```

- [ ] **Step 2: Create news.json**

```json
[
  {
    "id": "wizo-2026",
    "title": "NoRMAhl sieht das Licht mit WIZO 2026",
    "date": "2026-02-04",
    "excerpt": "Welch Freude, 2026 wird super gestartet - NoRMAhl zu Gast bei WIZO!",
    "content": "04.02.2026 Lindau Club Vaudeville\n05.02.2026 Ulm Roxy\n06.02.2026 Würzburg Posthalle\n07/08.02.2026 Nürnberg Löwensaal\n11.02.2026 Ingolstadt Eventhalle Westpark\n12.02.2026 München Backstage\n13.03.2026 Hamburg Große Freiheit 36\n14.03.2026 Hannover Capitol\n15.03.2026 Bremen Schlachthof\n21/22.03.2026 Berlin Astra\n05.04.2026 Stuttgart LKA\n\nZusatz Konzerte!!! Nürnberg am 8.2.26 und im Astra/Berlin am 22. März 2026.",
    "links": [
      { "label": "Read more", "url": "https://youtu.be/CmyoEYzLp2o" }
    ]
  },
  {
    "id": "single-premiere",
    "title": "Single Premiere - Schwäbisch Gmünd",
    "date": "2025-04-25",
    "excerpt": "Es gibt neues auf die Ohren, die neue Single geht am 25.04.2025 raus",
    "content": "Schwäbisch Gmünd - die neue Single.",
    "links": [
      { "label": "Video", "url": "https://youtu.be/CmyoEYzLp2o" }
    ]
  },
  {
    "id": "vinyl-live-bayerland",
    "title": "Vinyl, Baby! LIVE IN BAYERLAND",
    "date": "2019-12-13",
    "excerpt": "Live in Bayerland ist ab 13.12.2019 als Doppel-LP in silbernem Vinyl erhältlich!",
    "content": "NoRMAhl - Live in Bayerland. Digital erhältlich!",
    "links": [
      { "label": "Bestellen", "url": "https://punk.de/index.php?MainCat=1&SubCat=4&ProdID=12972" }
    ]
  },
  {
    "id": "friend-cdu",
    "title": "Rerelease CDU",
    "date": "2025-01-01",
    "excerpt": "Rerelease aus passendem Anlass! Ein Hoch auf unsere schwarzen Nullen.",
    "content": "Jetzt online vorbestellen bei Spotify, Apple music, Tidal, Deezer.",
    "links": [
      { "label": "Stream", "url": "https://ffm.to/zmjwyoe" }
    ]
  }
]
```

- [ ] **Step 3: Commit**

```bash
git add src/data/concerts.json src/data/news.json
git commit -m "feat: add concert and news data"
```

---

### Task 3: Create Base Layout and Global Styles

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-black: #000000;
  --color-white: #ffffff;
}

html {
  font-family: system-ui, sans-serif;
  background-color: var(--color-white);
  color: var(--color-black);
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
```

- [ ] **Step 2: Create BaseLayout.astro**

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = "NoRMAhl - Deutsche Rockband" } = Astro.props;
---

<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content={description}>
  <title>{title}</title>
</head>
<body>
  <slot />
</body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: add base layout and global styles"
```

---

### Task 4: Create Header and Footer Components

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Header.astro**

```astro
---
const navLinks = [
  { href: '/', label: 'Startseite' },
  { href: '/konzerte', label: 'Konzerte' },
];
---

<header class="border-b-2 border-black">
  <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
    <a href="/" class="block">
      <img src="/images/logo-normahl-schwarz.svg" alt="NoRMAhl" class="h-12" />
    </a>
    <ul class="flex gap-8">
      {navLinks.map(link => (
        <li>
          <a href={link.href} class="hover:underline">{link.label}</a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

- [ ] **Step 2: Create Footer.astro**

```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="border-t-2 border-black mt-16">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 class="font-bold">NoRMAhl</h3>
        <p>Heinkelstr. 3</p>
        <p>73663 Berglen</p>
      </div>
      <div>
        <h3 class="font-bold">Booking</h3>
        <p>punk.de</p>
        <p>booking@normahl.de</p>
      </div>
      <div>
        <h3 class="font-bold">Presse</h3>
        <a href="/presse" class="hover:underline">Presse</a>
      </div>
    </div>
    <div class="mt-8 pt-8 border-t border-gray-300">
      <a href="/impressum" class="mr-4 hover:underline">Impressum</a>
      <a href="/datenschutz" class="hover:underline">Datenschutz</a>
      <p class="mt-2">&copy; {currentYear} NoRMAhl</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "feat: add header and footer components"
```

---

### Task 5: Create ConcertCard and NewsCard Components

**Files:**
- Create: `src/components/ConcertCard.astro`
- Create: `src/components/NewsCard.astro`

- [ ] **Step 1: Create ConcertCard.astro**

```astro
---
interface Props {
  date: string;
  venue: string;
  city: string;
  ticketUrl: string;
  cancelled?: boolean;
}

const { date, venue, city, ticketUrl, cancelled = false } = Astro.props;

const formattedDate = new Date(date).toLocaleDateString('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});
---

<div class="border-2 border-black p-4">
  <p class="font-bold">{formattedDate}</p>
  <p>{venue} / {city}</p>
  {!cancelled && (
    <a href={ticketUrl} class="inline-block mt-2 bg-black text-white px-4 py-2 hover:bg-gray-800">
      Tickets
    </a>
  )}
  {cancelled && (
    <span class="inline-block mt-2 text-red-600">Ausgefallen</span>
  )}
</div>
```

- [ ] **Step 2: Create NewsCard.astro**

```astro
---
interface Props {
  title: string;
  date: string;
  excerpt: string;
}

const { title, date, excerpt } = Astro.props;

const formattedDate = new Date(date).toLocaleDateString('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});
---

<article class="border-2 border-black p-4">
  <h3 class="font-bold text-lg">{title}</h3>
  <p class="text-sm text-gray-600">{formattedDate}</p>
  <p class="mt-2">{excerpt}</p>
</article>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ConcertCard.astro src/components/NewsCard.astro
git commit -m "feat: add concert and news card components"
```

---

### Task 6: Create Home Page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ConcertCard from '../components/ConcertCard.astro';
import NewsCard from '../components/NewsCard.astro';
import concerts from '../data/concerts.json';
import news from '../data/news.json';

const sortedConcerts = concerts
  .filter(c => !c.cancelled && new Date(c.date) >= new Date())
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 5);

const sortedNews = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
---

<BaseLayout title="NoRMAhl">
  <Header />
  
  <main>
    <section class="bg-black text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-4">NoRMAhl</h1>
        <p class="text-xl">Live in Bayerland</p>
        <a href="https://www.amazon.de/Live-Bayerland-Jahre-Diesel-Bier/dp/B07L19C25K" class="inline-block mt-4 bg-white text-black px-4 py-2">
          Kaufen
        </a>
        <a href="https://open.spotify.com/album/42CUl09G2oeiWsw7IPnlWU" class="inline-block mt-4 ml-4 bg-white text-black px-4 py-2">
          Streamen
        </a>
        <a href="https://youtu.be/03dsocprW4Y" class="inline-block mt-4 ml-4 bg-white text-black px-4 py-2">
          Video
        </a>
      </div>
    </section>

    <section id="konzerte" class="container mx-auto px-4 py-16">
      <h2 class="text-2xl font-bold mb-8">KONZERTE</h2>
      <div class="grid gap-4">
        {sortedConcert => (
          <ConcertCard {...sortedConcert} />
        ))}
      </div>
      <div class="mt-8 text-center">
        <a href="/konzerte" class="bg-black text-white px-4 py-2">Alle Konzerte</a>
      </div>
    </section>

    <section class="container mx-auto px-4 py-16">
      <h2 class="text-2xl font-bold mb-8">NEWS</h2>
      <div class="grid gap-4 md:grid-cols-2">
        {sortedNews.slice(0, 4).map(item => (
          <NewsCard title={item.title} date={item.date} excerpt={item.excerpt} />
        ))}
      </div>
    </section>
  </main>

  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page"
```

---

### Task 7: Create Concerts and News Pages

**Files:**
- Create: `src/pages/konzerte.astro`
- Create: `src/pages/news.astro`

- [ ] **Step 1: Create konzerte.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ConcertCard from '../components/ConcertCard.astro';
import concerts from '../data/concerts.json';

const sortedConcerts = concerts
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
---

<BaseLayout title="Konzerte - NoRMAhl">
  <Header />
  
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-8">KONZERTE</h1>
    <div class="grid gap-4">
      {sortedConcerts.map(concert => (
        <ConcertCard {...concert} />
      ))}
    </div>
  </main>

  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Create news.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import news from '../data/news.json';

const sortedNews = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
---

<BaseLayout title="News - NoRMAhl">
  <Header />
  
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-8">NEWS</h1>
    <div class="space-y-8">
      {sortedNews.map(item => (
        <article class="border-2 border-black p-4">
          <h2 class="font-bold text-xl">{item.title}</h2>
          <p class="text-sm text-gray-600">{new Date(item.date).toLocaleDateString('de-DE')}</p>
          <p class="mt-4 whitespace-pre-line">{item.content || item.excerpt}</p>
          {item.links?.map(link => (
            <a href={link.url} class="inline-block mt-4 mr-4 bg-black text-white px-4 py-2">
              {link.label}
            </a>
          ))}
        </article>
      ))}
    </div>
  </main>

  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/konzerte.astro src/pages/news.astro
git commit -m "feat: add concerts and news pages"
```

---

### Task 8: Create Legal Pages

**Files:**
- Create: `src/pages/impressum.astro`
- Create: `src/pages/datenschutz.astro`

- [ ] **Step 1: Create impressum.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout title="Impressum - NoRMAhl">
  <Header />
  
  <main class="container mx-auto px-4 py-16 max-w-2xl">
    <h1 class="text-3xl font-bold mb-8">Impressum</h1>
    
    <h2 class="text-xl font-bold mt-8">Angaben gemäß § 5 TMG</h2>
    <p class="mt-4">
      NoRMAhl<br>
      Heinkelstr. 3<br>
      73663 Berglen
    </p>
    
    <h2 class="text-xl font-bold mt-8">Kontakt</h2>
    <p class="mt-4">
      E-Mail: booking@normahl.de
    </p>
    
    <h2 class="text-xl font-bold mt-8">Haftung für Inhalte</h2>
    <p class="mt-4">
      Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
    </p>
  </main>

  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Create datenschutz.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout title="Datenschutz - NoRMAhl">
  <Header />
  
  <main class="container mx-auto px-4 py-16 max-w-2xl">
    <h1 class="text-3xl font-bold mb-8">Datenschutz</h1>
    
    <h2 class="text-xl font-bold mt-8">Datenschutz auf einen Blick</h2>
    <p class="mt-4">
      Diese Website verwendet keine Cookies und erhebt keine personenbezogenen Daten außer техischen Zugangsdaten, die technisch notwendig sind.
    </p>
    
    <h2 class="text-xl font-bold mt-8">Kontakt</h2>
    <p class="mt-4">
      Bei Fragen zum Datenschutz wenden Sie sich bitte an: datenschutz@normahl.de
    </p>
  </main>

  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/impressum.astro src/pages/datenschutz.astro
git commit -m "feat: add legal pages"
```

---

### Task 9: Add Placeholder Assets and Verify Build

**Files:**
- Create: `public/images/logo-normahl-schwarz.svg`
- Create: `public/images/logo-normahl-weiss.svg`

- [ ] **Step 1: Create placeholder logo SVG**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <text x="100" y="40" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="30">NoRMAhl</text>
</svg>
```

- [ ] **Step 2: Create directory structure**

```bash
mkdir -p public/images
```

- [ ] **Step 3: Run build to verify**

```bash
npm run build
```

Expected: Build completes without errors

- [ ] **Step 4: Commit**

```bash
git add public/
git commit -m "feat: add placeholder assets and verify build"
```

---

## Plan Complete

**End state:** Full Astro site with home, concerts, news, impressum, datenschutz pages. JSON data for concerts and news. Tailwind styling.

**To test:** `npm run dev` and visit `http://localhost:4321`