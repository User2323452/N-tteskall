import { getConcept, learningPaths } from "@/data/learning";
import type { LearningPath } from "@/types/learning";

export interface OverviewTheme {
  id: string;
  name: string;
  conceptIds: string[];
  /** Ferdig læringsløp gjennom temaet. */
  pathId?: string;
}

export interface OverviewArea {
  id: string;
  name: string;
  summary: string;
  /** Diskret venstrekant — ikke et fargelagt kort. */
  accent: string;
  themes: OverviewTheme[];
  note?: string;
}

/**
 * Kartet Oscar kjenner fra Notion: områder og temaer,
 * med begreper under. Læringsløp er stier gjennom kartet, ikke kartet selv.
 * Oljefondet er eget område (finanspolitikk), ikke et kapittel i pengepolitikken.
 */
export const overviewAreas: OverviewArea[] = [
  {
    id: "makro",
    name: "Makro og pengepolitikk",
    summary: "Priser, styringsrente, lønnsdannelse og hvordan renta når økonomien.",
    accent: "#0284C7",
    note: "Oljefondet og handlingsregelen ligger under Norsk økonomi. Det er finanspolitikk, ikke pengepolitikk.",
    themes: [
      {
        id: "inflasjon-tema",
        name: "Inflasjon og kjøpekraft",
        conceptIds: ["inflasjon", "kpi", "kpi-jae", "kjopkraft"],
      },
      {
        id: "norges-bank",
        name: "Norges Bank og styringsrenten",
        conceptIds: [
          "pengepolitikk",
          "inflasjonsmal",
          "fleksibel-inflasjonsstyring",
          "styringsrenten",
          "transmisjon",
          "rentebanen",
          "ppr",
          "produksjonsgap",
        ],
      },
      {
        id: "arbeidsliv",
        name: "Arbeidsliv",
        pathId: "arbeidsliv",
        conceptIds: [
          "frontfagsmodellen",
          "lonnsoppgjor",
          "sykepenger",
          "dagpenger",
        ],
      },
    ],
  },
  {
    id: "olje",
    name: "Norsk økonomi og oljeformue",
    summary: "Fondet, handlingsregelen, kraftpriser og verdiskapingen på fastlandet.",
    accent: "#0F766E",
    themes: [
      {
        id: "oljefond-tema",
        name: "Oljefondet og handlingsregelen",
        conceptIds: [
          "oljefondet",
          "nbim",
          "handlingsregelen",
          "strukturelt-underskudd",
          "finanspolitikk",
          "realavkastning",
        ],
        pathId: "oljefondet-og-handlingsregelen",
      },
      {
        id: "strom-og-kraft",
        name: "Strøm og kraft",
        pathId: "strom-og-kraft",
        conceptIds: ["spotpris", "prisomrader", "stromstotte"],
      },
      {
        id: "verdiskaping",
        name: "Verdiskaping",
        conceptIds: ["bnp", "bnp-fastland"],
      },
    ],
  },
  {
    id: "marked",
    name: "Marked og verdsettelse",
    summary: "Fra tidsverdi til aksjer, renter og portefølje.",
    accent: "#059669",
    themes: [
      {
        id: "grunnmuren",
        name: "Grunnmuren",
        conceptIds: ["tidsverdi", "naverdi", "risiko-avkastning", "diversifisering"],
      },
      {
        id: "aksjer",
        name: "Aksjer og verdsettelse",
        conceptIds: ["multiplikatorer", "pb", "evebitda", "dcf"],
      },
      {
        id: "bedrift",
        name: "Bedriftsøkonomi",
        conceptIds: ["wacc", "capm", "beta"],
      },
      {
        id: "renter",
        name: "Renter og obligasjoner",
        conceptIds: [
          "nibor",
          "nowa",
          "obligasjon",
          "yield",
          "durasjon",
          "kredittpaslag",
          "omf",
        ],
      },
      {
        id: "valuta",
        name: "Valuta og derivater",
        pathId: "kronekurs-og-eos",
        conceptIds: ["kronekurs", "importpriser", "eos", "rentebytte"],
      },
      {
        id: "portefolje",
        name: "Portefølje",
        conceptIds: ["sharpe", "diversifisering"],
      },
    ],
  },
  {
    id: "bank",
    name: "Bank og kreditt",
    summary: "Hvordan en bank tjener penger, måles og eies.",
    accent: "#1D4ED8",
    themes: [
      {
        id: "forretning",
        name: "Forretningsmodellen",
        conceptIds: ["rentenetto", "innskuddsdekning", "ki"],
      },
      {
        id: "bankrapport",
        name: "Bankrapport",
        conceptIds: ["roe", "cet1", "tap-pa-utlan"],
      },
      {
        id: "sparebank",
        name: "Sparebankmodellen",
        conceptIds: ["ekb", "eierbrok", "sparebankstiftelse"],
      },
      {
        id: "regelverk-bank",
        name: "Regelverket",
        conceptIds: ["utlansforskriften"],
      },
    ],
  },
  {
    id: "personlig",
    name: "Personlig økonomi",
    summary: "Sparing, pensjon, boliglån og skatt på norske vilkår.",
    accent: "#D97706",
    themes: [
      {
        id: "sparing",
        name: "Sparing",
        conceptIds: [
          "renters-rente",
          "ask",
          "skjermingsfradrag",
          "indeksfond",
          "diversifisering",
        ],
      },
      {
        id: "pensjon",
        name: "Pensjon",
        pathId: "pensjon",
        conceptIds: ["folketrygd", "tjenestepensjon", "grunnbelop", "otp", "ips", "afp"],
      },
      {
        id: "boliglan",
        name: "Boliglån",
        conceptIds: [
          "bsu",
          "belaningsgrad",
          "annuitetslan",
          "serielan",
          "nominell-effektiv",
          "gjeldsgrad",
          "rentefradrag",
          "utlansforskriften",
          "egenkapital",
          "fellesgjeld",
          "leie-mot-eie",
        ],
        pathId: "bolig",
      },
      {
        id: "skatt",
        name: "Skatt",
        pathId: "skatt-for-privatpersoner",
        conceptIds: [
          "alminnelig-inntekt",
          "personfradrag",
          "minstefradrag",
          "trinnskatt",
          "formuesskatt",
          "skjermingsfradrag",
          "rentefradrag",
        ],
      },
    ],
  },
  {
    id: "metode",
    name: "Metode og regnskap",
    summary: "De tre regnskapene, og regresjon når du estimerer beta.",
    accent: "#BE123C",
    themes: [
      {
        id: "regnskap",
        name: "Regnskapsanalyse",
        conceptIds: ["resultatregnskap", "balanse", "kontantstrom"],
      },
      {
        id: "regresjon",
        name: "Regresjon i praksis",
        conceptIds: ["ols", "beta"],
      },
    ],
  },
];

/** Løp som hører til området, enten via temaet eller kategorien. */
export function pathsInArea(area: OverviewArea): LearningPath[] {
  const linked = new Set(
    area.themes
      .map((theme) => theme.pathId)
      .filter((id): id is string => Boolean(id))
  );
  return learningPaths.filter(
    (path) => linked.has(path.id) || path.category === area.id
  );
}

export const areaPictures: Record<string, { src: string; alt: string }> = {
  makro: {
    src: "/bilder/kart-makro.jpg",
    alt: "Brød, melk og epler på et kjøkkenbord, med en nøkkel. Priser og bolig i hverdagen.",
  },
  olje: {
    src: "/bilder/kart-olje.jpg",
    alt: "En oljeplattform i rolig sjø. Oljeinntektene som fondet kommer fra.",
  },
  marked: {
    src: "/bilder/kart-marked.jpg",
    alt: "En vekt med ulike ting i den ene skålen og én stein i den andre. Avveining i markedet.",
  },
  bank: {
    src: "/bilder/kart-bank.jpg",
    alt: "En lys skranke med en lukket notatbok. Banken som mellomledd.",
  },
  personlig: {
    src: "/bilder/kart-personlig.jpg",
    alt: "Et glass med mynter, et lite trehus og nøkler. Sparing og bolig.",
  },
  metode: {
    src: "/bilder/kart-metode.jpg",
    alt: "Tre blanke notatbøker på rad. Resultat, balanse og kontantstrøm.",
  },
};

function assertOverview() {
  for (const area of overviewAreas) {
    for (const theme of area.themes) {
      for (const id of theme.conceptIds) {
        if (!getConcept(id)) {
          throw new Error(`Oversikt: mangler begrep ${id} i ${theme.name}`);
        }
      }
    }
  }
}

assertOverview();
