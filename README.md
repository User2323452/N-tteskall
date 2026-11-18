# MesterPlan

Norsk læringsplattform for økonomi og finans: **læringsløp**, **begrepssøk** og lett **repetisjon**. Lokal-først (IndexedDB / localStorage), PWA-klar for iPhone Safari.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Kuratert læringsinnhold (statisk) + lokal fremdrift/SRS
- TipTap-notater (valgfritt / demotert)
- Dexie / IndexedDB + JSON-backup (ingen innlogging)

## Lokal utvikling

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Hva du kan gjøre

1. Velge et **læringsløp** (f.eks. Norsk pengepolitikk, Personlig sparing)
2. **Søke** et økonomisk begrep og lese klar norsk forklaring
3. **Repetere** begreper med enkel spaced repetition
4. Valgfritt: egne notater under `/notater`

## Deploy (Vercel)

Importer `User2323452/N-tteskall` som Next.js-prosjekt. Ingen miljøvariabler trengs. Push til `main` deployer automatisk når prosjektet er koblet.
