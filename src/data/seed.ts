import type {
  Area,
  CareerGoal,
  Group,
  Page,
  Term,
} from "@/types/mesterplan";
import { EMPTY_DOC } from "@/types/mesterplan";

const now = "2026-11-18T00:00:00.000Z";

export const seedAreas: Area[] = [
  {
    id: "hukommelse",
    name: "Min økonomiske hukommelse",
    icon: "target",
    color: "gray",
    order: 0,
  },
  {
    id: "makro",
    name: "Makro & pengepolitikk",
    icon: "globe",
    color: "blue",
    subtitle:
      "Konjunktur, inflasjon, sentralbanker, norsk økonomi, handel, mikro",
    order: 1,
  },
  {
    id: "marked",
    name: "Marked & verdsettelse",
    icon: "trending-up",
    color: "green",
    subtitle:
      "Aksjer, corporate finance, obligasjoner, valuta, derivater, portefølje",
    order: 2,
  },
  {
    id: "bank",
    name: "Bank & kreditt",
    icon: "landmark",
    color: "purple",
    order: 3,
  },
  {
    id: "personlig",
    name: "Personlig økonomi",
    icon: "wallet",
    color: "orange",
    order: 4,
  },
  {
    id: "metode",
    name: "Metode & regnskap",
    icon: "ruler",
    color: "pink",
    subtitle: "Regnskap, økonometri, statistikk, modellering",
    order: 5,
  },
  {
    id: "innboks",
    name: "Innboks",
    icon: "lightbulb",
    color: "yellow",
    subtitle: "Kun for idéer som ikke passer noe område",
    order: 6,
  },
];

export const seedGroups: Group[] = [
  {
    id: "marked-grunnmuren",
    areaId: "marked",
    name: "Grunnmuren",
    order: 0,
    collapsedByDefault: false,
  },
  {
    id: "marked-aksjer",
    areaId: "marked",
    name: "Aksjer og verdsettelse",
    order: 1,
    collapsedByDefault: false,
  },
  {
    id: "marked-bedrift",
    areaId: "marked",
    name: "Bedriftsøkonomi",
    order: 2,
    collapsedByDefault: false,
  },
  {
    id: "marked-renter",
    areaId: "marked",
    name: "Renter og obligasjoner",
    order: 3,
    collapsedByDefault: false,
  },
  {
    id: "marked-valuta",
    areaId: "marked",
    name: "Valuta og derivater",
    order: 4,
    collapsedByDefault: false,
  },
  {
    id: "marked-portefolje",
    areaId: "marked",
    name: "Portefølje",
    order: 5,
    collapsedByDefault: false,
  },
  {
    id: "personlig-sparing",
    areaId: "personlig",
    name: "Sparing",
    order: 0,
    collapsedByDefault: false,
  },
  {
    id: "personlig-boliglan",
    areaId: "personlig",
    name: "Boliglån",
    order: 1,
    collapsedByDefault: false,
  },
  {
    id: "personlig-skatt",
    areaId: "personlig",
    name: "Skatt",
    order: 2,
    collapsedByDefault: false,
  },
];

function page(
  id: string,
  areaId: Page["areaId"],
  title: string,
  order: number,
  groupId?: string,
  icon?: string
): Page {
  return {
    id,
    areaId,
    groupId,
    title,
    icon,
    content: structuredClone(EMPTY_DOC),
    notes: "",
    order,
    createdAt: now,
    updatedAt: now,
  };
}

export const seedPages: Page[] = [
  // Makro
  page("makro-norges-bank", "makro", "Norges Bank og styringsrenten", 0),
  page("makro-oljefondet", "makro", "Oljefondet og handlingsregelen", 1),
  page("makro-inflasjon", "makro", "Inflasjon og kjøpekraft", 2),

  // Marked
  page(
    "marked-tidsverdi",
    "marked",
    "Tidsverdien av penger",
    0,
    "marked-grunnmuren"
  ),
  page(
    "marked-risiko",
    "marked",
    "Risiko og avkastning",
    1,
    "marked-grunnmuren"
  ),
  page(
    "marked-fundamentals",
    "marked",
    "Grunleggende/fundamentals",
    0,
    "marked-aksjer"
  ),
  page("marked-teknisk", "marked", "Teknisk Analyse", 1, "marked-aksjer"),
  page("marked-sosial", "marked", "Sosial Arbitrage", 2, "marked-aksjer"),
  page("marked-dcf", "marked", "Nåverdimetoden (DCF)", 3, "marked-aksjer"),
  page("marked-multiplikator", "marked", "Multiplikatoren", 4, "marked-aksjer"),
  page(
    "marked-bankverdsettelse",
    "marked",
    "Verdsettelse av banker",
    5,
    "marked-aksjer"
  ),
  page("marked-wacc", "marked", "Kapitalkostnad (WACC)", 0, "marked-bedrift"),
  page(
    "marked-kapitalstruktur",
    "marked",
    "Kapitalstruktur og utbytte",
    1,
    "marked-bedrift"
  ),
  page("marked-obligasjoner", "marked", "Obligasjoner", 0, "marked-renter"),
  page("marked-rentemarkedet", "marked", "Rentemarkedet", 1, "marked-renter"),
  page("marked-kronekursen", "marked", "Kronekursen", 0, "marked-valuta"),
  page("marked-derivater", "marked", "Derivater", 1, "marked-valuta"),
  page(
    "marked-diversifisering",
    "marked",
    "Diversifisering",
    0,
    "marked-portefolje"
  ),

  // Bank
  page("bank-bankrapport", "bank", "Bankrapport", 0),
  page("bank-sparebankmodellen", "bank", "Sparebankmodellen", 1),
  page("bank-foretningsmodellen", "bank", "Foretningsmodellen", 2),
  page("bank-finaut", "bank", "FinAut-autorisasjon", 3),
  page("bank-risikoen", "bank", "Risikoen", 4),
  page("bank-regelverket", "bank", "Regelverket", 5),

  // Personlig
  page(
    "personlig-ask",
    "personlig",
    "Aksjesparekonto (ASK)",
    0,
    "personlig-sparing"
  ),
  page(
    "personlig-ikz",
    "personlig",
    "Investeringskonto zero (IKZ)",
    1,
    "personlig-sparing"
  ),
  page("personlig-pensjon", "personlig", "Pensjon", 2, "personlig-sparing"),
  page(
    "personlig-renters-rente",
    "personlig",
    "Renters rente",
    3,
    "personlig-sparing"
  ),
  page("personlig-boliglan", "personlig", "Boliglån", 0, "personlig-boliglan"),
  page("personlig-renter", "personlig", "Renter", 1, "personlig-boliglan"),
  page(
    "personlig-annuitet",
    "personlig",
    "Annuitetslån vs Serielån",
    2,
    "personlig-boliglan"
  ),
  page(
    "personlig-belaningsgrad",
    "personlig",
    "Belåningsgrad og BSU",
    3,
    "personlig-boliglan"
  ),
  page(
    "personlig-rentefradrag",
    "personlig",
    "Rentefradrag",
    4,
    "personlig-boliglan"
  ),
  page(
    "personlig-personfradrag",
    "personlig",
    "Personfradrag",
    0,
    "personlig-skatt",
    "coins"
  ),
  page(
    "personlig-minstefradrag",
    "personlig",
    "Minstefradrag og Alminnelig inntekt",
    1,
    "personlig-skatt"
  ),
  page(
    "personlig-skjermingsfradrag",
    "personlig",
    "Skjermingsfradrag",
    2,
    "personlig-skatt",
    "chart"
  ),
  page(
    "personlig-frikort",
    "personlig",
    "Frikortgrense",
    3,
    "personlig-skatt"
  ),
  page(
    "personlig-trygdeavgift",
    "personlig",
    "Trygdeavgift",
    4,
    "personlig-skatt"
  ),
  page("personlig-kildeskatt", "personlig", "Kildeskatt", 5, "personlig-skatt"),

  // Metode
  page("metode-regnskapsanalyse", "metode", "Regnskapsanalyse", 0),
  page("metode-regresjon", "metode", "Regresjon i praksis", 1),
];

export const seedCareerGoals: CareerGoal[] = [
  { id: "goal-1", text: "Investment Banking", order: 0 },
  { id: "goal-2", text: "Kunderådgiver på kundesenter i Bank", order: 1 },
  {
    id: "goal-3",
    text: "Kunderådgiver i dagligbank eller privatmarked",
    order: 2,
  },
  {
    id: "goal-4",
    text: "Økonomimedarbeider/regnskapsmedarbeider",
    order: 3,
  },
];

/** Konseptbanken: term titles + short definitions for spaced repetition (not Notion article pages). */
export const seedTerms: Term[] = [
  {
    id: "term-styringsrenten",
    term: "Styringsrenten",
    english: "Policy rate",
    areaId: "makro",
    explanation:
      "Renta bankene får på innskudd i Norges Bank. Norges Banks viktigste verktøy for å styre inflasjonen.",
    status: "Ny",
  },
  {
    id: "term-rentebanen",
    term: "Rentebanen",
    english: "Policy rate path",
    areaId: "makro",
    explanation:
      "Norges Banks prognose for styringsrenten framover, publisert i Pengepolitisk rapport.",
    status: "Ny",
  },
  {
    id: "term-handlingsregelen",
    term: "Handlingsregelen",
    english: "Fiscal rule",
    areaId: "makro",
    explanation:
      "Retningslinje for bruk av oljefondet over statsbudsjettet. Normen er om lag 3 prosent forventet realavkastning over tid. Årets anslag kan ligge lavere.",
    status: "Ny",
  },
  {
    id: "term-nibor",
    term: "NIBOR",
    english: "Norwegian Interbank Offered Rate",
    areaId: "marked",
    explanation:
      "Daglig panelkvotering av renta bankene krever for usikrede kronelån, fra én uke til seks måneder. Fortsatt den referanserenten markedet bruker. Mange lån og obligasjoner prises ut fra den.",
    status: "Ny",
  },
  {
    id: "term-nowa",
    term: "NOWA",
    english: "Norwegian Overnight Weighted Average",
    areaId: "marked",
    explanation:
      "Vektet snitt av faktiske usikrede overnattenlån. Anbefalt alternativ og fallback hvis NIBOR skulle opphøre. NIBOR er fortsatt referanserenten markedet bruker. De måler ikke samme rente.",
    status: "Ny",
  },
  {
    id: "term-wacc",
    term: "Totalkapitalkostnad (WACC)",
    english: "Weighted average cost of capital",
    areaId: "marked",
    explanation:
      "Snittavkastningen långivere og eiere krever, vektet etter andel gjeld og egenkapital. Brukes som diskonteringsrente i DCF.",
    status: "Ny",
  },
  {
    id: "term-sharpe",
    term: "Sharpe-rate",
    english: "Sharpe ratio",
    areaId: "marked",
    explanation:
      "Meravkastning over risikofri rente delt på standardavviket. Avkastning per enhet risiko.",
    status: "Ny",
  },
  {
    id: "term-rentebytte",
    term: "Rentebytteavtale",
    english: "Interest rate swap",
    areaId: "marked",
    explanation:
      "Avtale om å bytte rentebetalinger, typisk fast mot flytende rente.",
    status: "Ny",
  },
  {
    id: "term-durasjon",
    term: "Durasjon",
    english: "Duration",
    areaId: "marked",
    explanation:
      "Mål på rentefølsomhet: hvor mye obligasjonsprisen faller når renta stiger.",
    status: "Ny",
  },
  {
    id: "term-multiplikatorer",
    term: "Multiplikatorer",
    english: "Multiples / relative valuation",
    areaId: "marked",
    explanation:
      "Prising av et selskap ved å sammenligne det med lignende selskaper, f.eks. P/E, EV/EBITDA og P/B.",
    status: "Ny",
  },
  {
    id: "term-evebitda",
    term: "EV/EBITDA",
    english: "Enterprise value / EBITDA",
    areaId: "marked",
    explanation:
      "Selskapsverdi (egenkapital + netto gjeld) delt på driftsresultat før av- og nedskrivninger. Viser hva hele selskapet koster i forhold til driften.",
    status: "Ny",
  },
  {
    id: "term-beta",
    term: "Beta",
    english: "Beta",
    areaId: "marked",
    explanation:
      "Hvor mye en aksje svinger i forhold til markedet. Beta over 1 betyr mer systematisk risiko enn markedet.",
    status: "Ny",
  },
  {
    id: "term-dcf",
    term: "Nåverdimetoden (DCF)",
    english: "Discounted cash flow",
    areaId: "marked",
    explanation:
      "Selskapets verdi er summen av framtidige kontantstrømmer, diskontert tilbake til i dag.",
    status: "Ny",
  },
  {
    id: "term-omf",
    term: "Obligasjoner med fortrinnsrett (OMF)",
    english: "Covered bonds",
    areaId: "marked",
    explanation:
      "Obligasjoner sikret i en pott av boliglån. Den viktigste måten norske banker finansierer boliglån på.",
    status: "Ny",
  },
  {
    id: "term-capm",
    term: "CAPM",
    english: "Capital Asset Pricing Model",
    areaId: "marked",
    explanation:
      "Avkastningskrav = risikofri rente + beta × markedets risikopremie.",
    status: "Ny",
  },
  {
    id: "term-pb",
    term: "Pris/bok (P/B)",
    english: "Price-to-book",
    areaId: "marked",
    explanation:
      "Børsverdi delt på bokført egenkapital. Hovedmultiplikatoren for banker.",
    status: "Ny",
  },
  {
    id: "term-effektiv-rente",
    term: "Effektiv rente (yield)",
    english: "Yield to maturity",
    areaId: "marked",
    explanation:
      "Årlig avkastning på en obligasjon hvis du kjøper nå og holder den til forfall.",
    status: "Ny",
  },
  {
    id: "term-kredittpaslag",
    term: "Kredittpåslag",
    english: "Credit spread",
    areaId: "marked",
    explanation:
      "Ekstra rente en låntaker betaler over risikofri rente, som kompensasjon for kredittrisiko.",
    status: "Ny",
  },
  {
    id: "term-sparebankstiftelse",
    term: "Sparebankstiftelse",
    english: "Savings bank foundation",
    areaId: "bank",
    explanation:
      "Stiftelse som eier aksjene når en sparebank blir aksjeselskap, f.eks. Sparebankstiftelsen DNB.",
    status: "Ny",
  },
  {
    id: "term-rentenetto",
    term: "Rentenetto",
    english: "Net interest income",
    areaId: "bank",
    explanation:
      "Renteinntekter fra utlån minus rentekostnader på innskudd og innlån. Bankens viktigste inntekt.",
    status: "Ny",
  },
  {
    id: "term-tap",
    term: "Tap på utlån",
    english: "Loan losses / impairments",
    areaId: "bank",
    explanation:
      "Forventede og faktiske tap på lån. Tidlig varsel om at kredittkvaliteten svekkes.",
    status: "Ny",
  },
  {
    id: "term-eierbrok",
    term: "Eierbrøk",
    english: "Ownership fraction",
    areaId: "bank",
    explanation:
      "Fordeler sparebankens overskudd mellom EKB-eierne (utbytte) og den samfunnseide kapitalen (gaver).",
    status: "Ny",
  },
  {
    id: "term-ki",
    term: "Kostnad/inntekt (K/I)",
    english: "Cost-to-income ratio",
    areaId: "bank",
    explanation:
      "Driftskostnader delt på inntekter. Måler hvor effektivt banken drives; lavere er bedre.",
    status: "Ny",
  },
  {
    id: "term-innskuddsdekning",
    term: "Innskuddsdekning",
    english: "Deposit-to-loan ratio",
    areaId: "bank",
    explanation:
      "Innskudd delt på utlån. Hvor mye av utlånene som er finansiert med kundeinnskudd.",
    status: "Ny",
  },
  {
    id: "term-cet1",
    term: "Ren kjernekapitaldekning (CET1)",
    english: "Common Equity Tier 1 ratio",
    areaId: "bank",
    explanation:
      "Den reneste egenkapitalen delt på risikovektede eiendeler. Hovedmålet på hvor solid en bank er.",
    status: "Ny",
  },
  {
    id: "term-roe",
    term: "Egenkapitalavkastning (ROE)",
    english: "Return on equity",
    areaId: "bank",
    explanation:
      "Resultat delt på egenkapital. Viser lønnsomhet og styrer P/B-verdsettelsen av banker.",
    status: "Ny",
  },
  {
    id: "term-ekb",
    term: "Egenkapitalbevis (EKB)",
    english: "Equity certificate",
    areaId: "bank",
    explanation:
      "Sparebankens aksjelignende eierandel som selges til investorer og gir rett på utbytte.",
    status: "Ny",
  },
  {
    id: "term-ips",
    term: "Individuell pensjonssparing (IPS)",
    english: "Individual pension savings",
    areaId: "personlig",
    explanation:
      "Privat pensjonssparing med skattefradrag. Pengene er låst til pensjonsalder.",
    status: "Ny",
  },
  {
    id: "term-afp",
    term: "AFP",
    english: "Contractual pension",
    areaId: "personlig",
    explanation:
      "Avtalefestet pensjon. I privat sektor er AFP i Fellesordningen et livsvarig påslag fra 62 år. I offentlig sektor gjelder livsvarig AFP fra 2025 for årskull fra 1963. Eldre årskull har tidligpensjon fra 62 til 67 år.",
    status: "Ny",
  },
  {
    id: "term-belaningsgrad",
    term: "Belåningsgrad",
    english: "Loan-to-value (LTV)",
    areaId: "personlig",
    explanation: "Lånet delt på boligens verdi.",
    status: "Ny",
  },
  {
    id: "term-utlansforskriften",
    term: "Utlånsforskriften",
    english: "Residential mortgage regulation",
    areaId: "personlig",
    explanation:
      "Regler for bankenes boliglån: krav til egenkapital, maks gjeldsgrad og stresstest av betjeningsevne.",
    status: "Ny",
  },
  {
    id: "term-nominell",
    term: "Nominell vs. effektiv rente",
    english: "Nominal vs. effective rate",
    areaId: "personlig",
    explanation:
      "Nominell rente er den oppgitte renta. Effektiv rente inkluderer gebyrer og hvor ofte renta legges til, og viser den reelle kostnaden.",
    status: "Ny",
  },
  {
    id: "term-g",
    term: "Grunnbeløpet (G)",
    english: "National insurance basic amount",
    areaId: "personlig",
    explanation:
      "Beløp som reguleres årlig og brukes til å beregne pensjoner og trygdeytelser.",
    status: "Ny",
  },
  {
    id: "term-otp",
    term: "Obligatorisk tjenestepensjon (OTP)",
    english: "Mandatory occupational pension",
    areaId: "personlig",
    explanation:
      "Pensjon arbeidsgiveren må spare inn for deg, i tillegg til folketrygden.",
    status: "Ny",
  },
  {
    id: "term-ols",
    term: "Minste kvadraters metode (OLS)",
    english: "Ordinary least squares",
    areaId: "metode",
    explanation:
      "Regresjonsmetode som finner linja som minimerer summen av kvadrerte avvik. Brukes f.eks. til å estimere beta.",
    status: "Ny",
  },
];
