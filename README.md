# Nøtteskall

Norsk læringsapp for økonomi: **læringsløp**, **begreper**, **oversikt** og **profil**. Lokal-først (IndexedDB og localStorage), PWA-klar for iPhone Safari.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Kuratert læringsinnhold (statisk) + lokal fremdrift og repetisjon
- TipTap-notater under `/notater` (demotert)
- Dexie / IndexedDB + JSON-backup (ingen innlogging)

## Lokal utvikling

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Hva du kan gjøre

1. Fortsette et **læringsløp** (Norsk pengepolitikk, Personlig sparing)
2. Bla i **Oversikt** — områder, temaer og begreper
3. **Søke** et begrep (også vanlige synonymer som «oljefondet» og «renta»)
4. **Repetere** begreper du har møtt
5. Se fremdrift under **Profil**
6. Valgfritt: egne notater under `/notater`

## Deploy (Vercel)

Importer `User2323452/N-tteskall` som Next.js-prosjekt. Ingen miljøvariabler trengs. Push til `main` deployer automatisk når prosjektet er koblet.
