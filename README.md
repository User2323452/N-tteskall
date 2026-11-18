# MesterPlan

Norsk læringsapp for økonomi: egne notater, blurting og begrepsbank. Lokal-først (IndexedDB), PWA-klar for iPhone Safari.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- TipTap (overskrifter, lister, callouts, toggles) med autosave
- Dexie / IndexedDB (ingen innlogging)
- PWA: `manifest.webmanifest` + enkel service worker

## Lokal utvikling

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Importer i Vercel (Oscar)

Hvis repoet ikke allerede er koblet:

1. Gå til [vercel.com](https://vercel.com) og logg inn (GitHub).
2. **Add New… → Project**.
3. Importer **`User2323452/N-tteskall`**.
4. **Framework Preset:** Next.js (skal oppdages automatisk).
5. **Root Directory:** `.` (repo-roten).
6. La Build Command (`next build`) og Output stå som standard.
7. Ingen miljøvariabler trengs for MVP.
8. **Deploy**.

Etter første deploy: åpne URL-en på iPhone → Safari → Del → **Legg til på Hjem-skjerm**.

Hver push til `main` deployer automatisk når prosjektet er koblet.

## MVP-funksjoner

- Forside med område-kort (struktur-seed, tomme sider merket)
- Temaside med TipTap + autosave + «Test meg» (blurting)
- Begrepsbanken med status-repetisjon
- Flytende «+ Idé»
- JSON eksport/import (nederst på siden)

## Merknader

- Seed er **struktur only**: områder, undergrupper og tomme temasider. Ingen Notion-artikkeltekst i sidene. Begrepsbanken har 35 startbegreper for repetisjon.
- Data ligger kun i nettleseren — eksporter JSON før du bytter enhet eller sletter nettleserdata.
