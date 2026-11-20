import { concepts } from "@/data/learning";
import { formatVerdi, getSats, satsNumber, sisteVedtatteAr } from "@/data/satser";
import { assertSatsRefs, ordIdsIn } from "@/lib/markup";

/**
 * Figurene ligger ved siden av forklaringen. De erstatter den ikke.
 * Foto der et bilde er tydeligst, interaktiv figur der et tall lærer,
 * ellers en enkel figur.
 */

export type Tone = "teal" | "blue" | "amber" | "green" | "rose" | "slate";

export type InteractiveId =
  | "personfradrag"
  | "renters-rente"
  | "belaningsgrad"
  | "gjeldsgrad"
  | "trinnskatt"
  | "inflasjon"
  | "naverdi"
  | "minstefradrag"
  | "yield"
  | "nominell"
  | "lanform"
  | "reallonn"
  | "bolig"
  | "fondkostnad"
  | "kronekurs";

export type FigureSpec =
  | { type: "photo"; src: string; alt: string; caption: string }
  | { type: "interactive"; id: InteractiveId; focus?: "annuitet" | "serie" }
  | { type: "flow"; title: string; steps: string[]; caption: string }
  | {
      type: "compare";
      title: string;
      leftLabel: string;
      left: string;
      rightLabel: string;
      right: string;
      caption: string;
    }
  | {
      type: "stack";
      title: string;
      layers: { label: string; note: string; tone: Tone }[];
      caption: string;
    }
  | {
      type: "split";
      title: string;
      parts: { label: string; share: number; tone: Tone }[];
      caption: string;
    }
  | {
      type: "formula";
      title: string;
      expression: string;
      bits: { name: string; means: string }[];
      caption: string;
    }
  | { type: "pair"; title: string; a: string; b: string; link: string; caption: string }
  | { type: "bars"; title: string; items: { label: string; value: number }[]; caption: string }
  | { type: "sketch"; title: string; kind: SketchKind; caption: string }
  | {
      type: "table";
      title: string;
      columns: string[];
      rows: { label: string; cells: string[] }[];
      caption: string;
    };

/** Enkle tegninger der poenget er en linje, en kurve eller punkter. */
export type SketchKind =
  | "kryss"
  | "konjunktur"
  | "noytral-rente"
  | "prislinje"
  | "fastpris"
  | "fastrente"
  | "volatilitet"
  | "korrelasjon"
  | "spredning"
  | "ols"
  | "risiko";

export const conceptFigures: Record<string, FigureSpec> = {
  styringsrenten: {
    type: "flow",
    title: "Fra sentralbank til din rente",
    steps: ["Norges Bank", "Bankenes innskudd", "Utlån og sparing", "Etterspørsel"],
    caption: "Styringsrenten er prisen på penger mellom Norges Bank og bankene. Boliglånsrenten følger etter.",
  },
  inflasjon: { type: "interactive", id: "inflasjon" },
  kjopkraft: { type: "interactive", id: "reallonn" },
  rentebanen: {
    type: "flow",
    title: "Et anslag, ikke et løfte",
    steps: ["Renta i dag", "Banen fremover", "Ny rapport", "Banen flyttes"],
    caption: "Rentebanen er Norges Banks anslag. Den tegnes på nytt når ny informasjon kommer.",
  },
  handlingsregelen: {
    type: "compare",
    title: "Avkastning og normal bruk",
    leftLabel: "Forventet realavkastning",
    left: "Om lag 3 prosent over tid. Et anslag, ikke et tall som skal treffes hvert år.",
    rightLabel: "Bruk i normale år",
    right: "Bør ligge under det, slik at uttaket over tid kan tilsvare 3 prosent når kriseår regnes med.",
    caption:
      "Regelen er om lag 3 prosent forventet realavkastning over tid. Årets anslag står i tabellen under.",
  },
  oljefondet: {
    type: "flow",
    title: "Fra sokkelen til budsjettet",
    steps: [
      "Olje- og gassinntekter",
      "Fondet",
      "Investert i utlandet",
      "Om lag 3 % forventet avkastning",
      "Statsbudsjettet",
    ],
    caption:
      "Oljefondet er sparepengene, investert i utlandet. Om lag 3 prosent er forventet realavkastning over tid. Årets bruk står i tabellen.",
  },
  nibor: {
    type: "pair",
    title: "Panelkvotering av usikrede lån",
    a: "NIBOR",
    b: "Én uke til seks måneder",
    link: "kvoterer usikrede kronelån på",
    caption:
      "NIBOR er en daglig panelkvotering av renta bankene krever. Norges Bank skrev i 2025 at den fortsatt er den klart mest brukte referanserenten. Den ligger vanligvis nær styringsrenten, med et påslag.",
  },
  nowa: {
    type: "pair",
    title: "Faktiske lån over natten",
    a: "NOWA",
    b: "Usikrede overnattenlån",
    link: "er snittet av",
    caption:
      "NOWA er et vektet snitt av faktiske usikrede overnattenlån. Den har eksistert siden 2011 og ble lagt om i 2020. Den er anbefalt alternativ og en fallback hvis NIBOR skulle opphøre. Norges Bank skrev i 2025 at den i liten grad brukes som referanse. NIBOR og NOWA måler ikke samme rente.",
  },
  "renters-rente": { type: "interactive", id: "renters-rente" },
  ask: {
    type: "flow",
    title: "Skatten venter",
    steps: ["Innskudd", "Kjøp og salg inne på kontoen", "Uttak over innskuddet", "Da kommer skatten"],
    caption:
      "Innskuddet tas ut først, uten skatt. Skatt kommer på det du tar ut over innskuddet, etter skjerming. Handel inne på kontoen utløser ikke skatt.",
  },
  skjermingsfradrag: {
    type: "formula",
    title: "Fra innskudd til skatt",
    expression: "100 000 × 3,6 % = 3 600 i skjerming",
    bits: [
      { name: "Innskudd", means: "Laveste innskudd i året. Her 100 000 kroner." },
      { name: "Rente", means: "3,6 prosent for 2025. Renten for 2026 fastsettes i januar 2027." },
      { name: "Uttak", means: "20 000 kroner over innskuddet, minus 3 600, blir 16 400." },
      { name: "Skatt", means: "16 400 × 1,72 × 22 % = 6 206 kroner." },
    ],
    caption:
      "Regneeksempel. Renten er for 2025. Faktoren 1,72 og skatten 22 prosent gjelder også i 2026. Skjermingen regnes av innskuddet, ikke av fondets verdi.",
  },
  "risiko-avkastning": {
    type: "sketch",
    title: "Jevnt eller hakkete",
    kind: "risiko",
    caption:
      "Illustrasjon over 20 år, ikke en prognose. Kontoen stiger jevnt. Aksjene svinger og ender høyere. Utfallet kan også bli tap.",
  },
  diversifisering: {
    type: "compare",
    title: "Ett selskap mot tjue",
    leftLabel: "1 aksje",
    left: "Går selskapet konkurs, er den delen borte.",
    rightLabel: "20 aksjer",
    right: "Ett selskap i null tar en tjuendedel. Resten står.",
    caption: "Illustrasjon. Hele markedet kan falle samtidig. Da hjelper det ikke at du eier tjue.",
  },
  otp: {
    type: "stack",
    title: "Pensjonen i lag",
    layers: [
      { label: "AFP, der tariffen gir det", note: "ikke alle jobber", tone: "amber" },
      { label: "OTP fra jobben", note: "minst det loven krever", tone: "teal" },
      { label: "Folketrygd", note: "bunnen", tone: "green" },
    ],
    caption: "Obligatorisk tjenestepensjon er minst {{sats:otp-sats}} av lønn opp til {{sats:otp-tak}}, oppå folketrygden.",
  },
  ips: {
    type: "stack",
    title: "IPS i tre linjer",
    layers: [
      { label: "Hvem", note: "Du sparer selv", tone: "teal" },
      { label: "Verktøy", note: "Fradrag nå, skatt ved uttak", tone: "blue" },
      { label: "Eksempel", note: "Låst til pensjon, så det er ikke buffer", tone: "amber" },
    ],
    caption: "IPS er eget pensjonsspor. Årstaket står i tabellen. Uttak tidligst fra 62 år.",
  },
  afp: {
    type: "compare",
    title: "To ordninger",
    leftLabel: "Privat sektor",
    left: "I Fellesordningen er AFP et livsvarig påslag som kan tas ut fra 62 år.",
    rightLabel: "Offentlig sektor",
    right: "Livsvarig AFP fra 2025 for årskull fra 1963. Eldre årskull har tidligpensjon fra 62 til 67 år, som deretter faller bort.",
    caption: "Tidligpensjon beskriver den gamle offentlige ordningen. Det livsvarige påslaget er en annen ytelse. Sjekk avtalen før du bytter jobb sent i karrieren.",
  },
  belaningsgrad: { type: "interactive", id: "belaningsgrad" },
  utlansforskriften: {
    type: "stack",
    title: "Tre rammer banken ser på",
    layers: [
      {
        label: "Betjeningsevne",
        note: `${String(getSats("utlan-stress").verdier[sisteVedtatteAr(getSats("utlan-stress"))].verdi)} høyere, minst ${formatVerdi(satsNumber("utlan-gulv"), "%")}`,
        tone: "rose",
      },
      {
        label: "Gjeldsgrad",
        note: String(getSats("utlan-gjeld").verdier[sisteVedtatteAr(getSats("utlan-gjeld"))].verdi),
        tone: "amber",
      },
      {
        label: "Belåningsgrad",
        note: `${formatVerdi(satsNumber("utlan-belaning"), "%")} på nedbetalingslån, ${formatVerdi(satsNumber("utlan-ramme"), "%")} på rammekreditt`,
        tone: "blue",
      },
    ],
    caption:
      "For nedbetalingslån er grensen {{sats:utlan-belaning}}. Resten er egenkapital. Banken kan være strengere.",
  },
  kpi: {
    type: "compare",
    title: "Samme kurv, to tidspunkt",
    leftLabel: "I fjor",
    left: "1 000 kr",
    rightLabel: "I år",
    right: "1 030 kr",
    caption: "Samme kurv koster 3 % mer. Det er prisveksten KPI måler.",
  },
  "kpi-jae": {
    type: "compare",
    title: "Med og uten støyen",
    leftLabel: "KPI",
    left: "Hele kurven, inkludert strøm og avgiftsendringer.",
    rightLabel: "KPI-JAE",
    right: "Uten energivarer, og justert for avgifter. Brukes som blikk på underliggende prisvekst.",
    caption: "Norges Bank ser på begge. KPI-JAE demper hopp som ikke alltid sier noe om presset i økonomien.",
  },
  inflasjonsmal: {
    type: "pair",
    title: "Målet over tid",
    a: "Prisveksten",
    b: "Nær 2 prosent",
    link: "skal ligge",
    caption:
      "Målet er årsvekst i konsumprisene nær {{sats:inflasjon-mal}} over tid. Ett enkelt månedstall treffer sjelden prikken.",
  },
  "fleksibel-inflasjonsstyring": {
    type: "stack",
    title: "Hensynene i styringen",
    layers: [
      { label: "Finansielle ubalanser", note: "skal kunne motvirkes", tone: "rose" },
      { label: "Aktivitet og sysselsetting", note: "veies med", tone: "amber" },
      { label: "Inflasjon nær målet", note: "over tid, ikke hver måned", tone: "teal" },
    ],
    caption:
      "Bestemmelse om pengepolitikken § 2. Styringen vekter prisvekst nær {{sats:inflasjon-mal}} mot produksjon og sysselsetting, og skal kunne motvirke oppbygging av finansielle ubalanser.",
  },
  ppr: {
    type: "flow",
    title: "Der banen publiseres",
    steps: ["Analyser", "Rentebanen", "Pengepolitisk rapport", "Neste rapport kan flytte den"],
    caption: "Pengepolitisk rapport er Norges Banks gjennomgang. Rentebanen der er et anslag.",
  },
  transmisjon: {
    type: "flow",
    title: "Veien fra renta til prisene",
    steps: ["Styringsrente", "Pengemarked", "Bankrente", "Etterspørsel", "Priser"],
    caption: "Forenklet kjede. Renta virker også via kronen og via det folk venter seg. Figuren er ikke en prognose.",
  },
  pengepolitikk: {
    type: "stack",
    title: "Pengepolitikken i tre linjer",
    layers: [
      { label: "Eksempel", note: "renta opp, lånet blir dyrere", tone: "amber" },
      { label: "Verktøy", note: "styringsrenten", tone: "teal" },
      { label: "Hvem", note: "Norges Bank", tone: "blue" },
    ],
    caption: "Pengepolitikk er renten Norges Bank setter. Statsbudsjettet er et annet spor.",
  },
  produksjonsgap: {
    type: "compare",
    title: "Press eller slakk",
    leftLabel: "Positivt gap",
    left: "Økonomien produserer mer enn den kan uten at prispresset bygger seg opp.",
    rightLabel: "Negativt gap",
    right: "Det er slakk. Ledigheten er høyere, og presset på prisene er svakere.",
    caption: "Gapet er et anslag på avviket fra kapasiteten, ikke et tall du leser av en måler.",
  },
  nbim: {
    type: "flow",
    title: "Hvem som passer fondet",
    steps: ["Oljefondet", "NBIM forvalter", "Aksjer, renter og eiendom ute"],
    caption: "NBIM er forvalteren. Fondet eies av staten. Handlingsregelen styrer uttaket, ikke NBIM alene.",
  },
  "strukturelt-underskudd": {
    type: "formula",
    title: "To tall i budsjettet",
    expression: "Overføring = oljekorrigert underskudd",
    bits: [
      { name: "Oljekorrigert", means: "Det faktiske underskuddet uten oljeinntekter. Det er dette fondet overfører." },
      { name: "Strukturelt", means: "Samme tall justert for konjunktur. Det sammenlignes med handlingsregelen." },
    ],
    caption:
      "Strukturelt betyr et normalår, etter at konjunkturen er justert bort. Det tallet sammenlignes med handlingsregelen og står i tabellen.",
  },
  finanspolitikk: {
    type: "stack",
    title: "Finanspolitikken i tre linjer",
    layers: [
      { label: "Eksempel", note: "bruk av fondet over budsjettet", tone: "amber" },
      { label: "Verktøy", note: "skatt og utgifter", tone: "teal" },
      { label: "Hvem", note: "Stortinget", tone: "blue" },
    ],
    caption: "Finanspolitikken vedtas i statsbudsjettet. Styringsrenten er pengepolitikk og settes av Norges Bank.",
  },
  realavkastning: {
    type: "formula",
    title: "Det som er igjen etter prisvekst",
    expression: "Realavkastning ≈ nominell avkastning − inflasjon",
    bits: [
      { name: "Nominell", means: "Avkastningen i kroner, før prisvekst" },
      { name: "Inflasjon", means: "Det som spiser av kjøpekraften" },
    ],
    caption: "Tjener fondet 6 prosent og prisene stiger 3, er realavkastningen om lag 3. Handlingsregelen handler om den reelle delen.",
  },
  bnp: {
    type: "stack",
    title: "Hele verdiskapingen",
    layers: [
      { label: "Utenfor fastlandet", note: "olje, gass, rør og utenriks sjøfart", tone: "slate" },
      { label: "Fastlands-Norge", note: "med fiske og annen kystaktivitet", tone: "teal" },
    ],
    caption:
      "BNP Fastlands-Norge holder olje og gass, rørtransport og utenriks sjøfart utenfor. Utenriks sjøfart er egen virksomhet, ved siden av petroleumsvirksomheten. Fiske og annen kystaktivitet er med.",
  },
  "bnp-fastland": {
    type: "photo",
    src: "/bilder/begrep-fastland.jpg",
    alt: "En fiskebåt ved bryggen i et kystvær, med naust og kasser.",
    caption:
      "BNP Fastlands-Norge er verdiskapingen uten olje og gass, rørtransport og utenriks sjøfart. Fiske og annen kystaktivitet er med.",
  },
  indeksfond: { type: "interactive", id: "fondkostnad" },
  bsu: {
    type: "stack",
    title: "BSU i tre linjer",
    layers: [
      { label: "Hvem", note: "Du sparer. Banken holder kontoen.", tone: "teal" },
      { label: "Verktøy", note: "Skattefradrag, låst til bolig", tone: "blue" },
      { label: "Eksempel", note: "Fullt innskudd: 2 750 kr mindre i skatt i 2026", tone: "green" },
    ],
    caption: "2 750 kroner er 10 prosent av 27 500 kroner, satsene for 2026. Fritidsbolig alene stenger ikke fradraget.",
  },
  folketrygd: {
    type: "stack",
    title: "Det offentlige laget under",
    layers: [
      { label: "Egen sparing", note: "det du legger oppå", tone: "amber" },
      { label: "Tjenestepensjon", note: "fra jobben", tone: "teal" },
      { label: "Folketrygd", note: "NAV, opptjent over livet", tone: "green" },
    ],
    caption:
      "I det nye systemet er alderspensjonen inntektspensjon pluss garantipensjon. Grunnpensjon hører til det gamle systemet, sammen med tilleggspensjon. Laget dekker sjelden hele pensjonen alene.",
  },
  grunnbelop: {
    type: "formula",
    title: "Enheten ytelsene regnes i",
    expression: "Ytelse = antall G × grunnbeløpet i kroner",
    bits: [
      { name: "G", means: "Kongen fastsetter beløpet. Det reguleres 1. mai i takt med lønnsveksten" },
      { name: "Kronebeløpet", means: "Per 1. mai 2026 er G 136 549 kroner" },
    ],
    caption:
      "Pensjon og flere trygder oppgis i G. Folketrygdloven § 1-4. Siden 2011 fastsetter regjeringen i statsråd beløpet etter trygdeoppgjøret.",
  },
  annuitetslan: { type: "interactive", id: "lanform", focus: "annuitet" },
  serielan: { type: "interactive", id: "lanform", focus: "serie" },
  gjeldsgrad: { type: "interactive", id: "gjeldsgrad" },
  "nominell-effektiv": { type: "interactive", id: "nominell" },
  rentefradrag: {
    type: "split",
    title: "Hva 10 000 kr i renter koster etter skatt",
    parts: [
      { label: "Du betaler", share: 78, tone: "slate" },
      { label: "22 %", share: 22, tone: "green" },
    ],
    caption: "Gjeldsrenter trekkes fra i alminnelig inntekt. Med 22 prosent skatt i 2026 er fradraget 2 200 kr av 10 000. Forutsetter at du har skatt å trekke fra. Ikke et råd.",
  },
  "alminnelig-inntekt": {
    type: "flow",
    title: "Veien til den flate skatten",
    steps: ["Inntekter", "Fradrag", "Alminnelig inntekt", "22 prosent"],
    caption: "Lønn, renter og aksjer behandles ulikt før de havner her. Satsen i figuren er 22 prosent for 2026. Trinnskatt er et eget lag oppå personinntekt.",
  },
  personfradrag: { type: "interactive", id: "personfradrag" },
  minstefradrag: { type: "interactive", id: "minstefradrag" },
  tidsverdi: {
    type: "pair",
    title: "Samme krone, to tidspunkt",
    a: "100 kr i dag",
    b: "100 kr om ti år",
    link: "er ikke like mye",
    caption: "Kronen i dag kan stå og gi avkastning. Derfor er en krone senere mindre verdt når du regner i dag.",
  },
  naverdi: { type: "interactive", id: "naverdi" },
  multiplikatorer: {
    type: "compare",
    title: "Pris delt på en størrelse",
    leftLabel: "Du ser",
    left: "P/E, P/B eller EV/EBITDA. Prisen sammenlignes med resultat, egenkapital eller driftsresultat.",
    rightLabel: "Du må spørre",
    right: "Er selskapene like nok til at forholdstallet kan sammenlignes?",
    caption: "En multiplikator er en prislapp mot noe selskapet tjener eller eier. Den er et sammenligningsverktøy, ikke en verdi i seg selv.",
  },
  pb: {
    type: "formula",
    title: "Pris mot bok",
    expression: "P/B = aksjekurs / bokført egenkapital per aksje",
    bits: [
      { name: "P", means: "Det markedet betaler" },
      { name: "B", means: "Egenkapitalen i regnskapet, per aksje" },
    ],
    caption: "Over 1 betaler du mer enn bokført egenkapital. Under 1 betaler du mindre. Bokført er ikke det samme som det du kunne solgt eiendelene for.",
  },
  evebitda: {
    type: "formula",
    title: "Hele selskapet mot driften",
    expression: "EV/EBITDA = selskapsverdi / driftsresultat før avskrivninger",
    bits: [
      { name: "EV", means: "Aksjer pluss gjeld, minus kontanter. Hele virksomheten" },
      { name: "EBITDA", means: "Driftsoverskudd før avskrivninger, renter og skatt" },
    ],
    caption: "Tallet gjør det lettere å sammenligne selskaper med ulik gjeld. Det ignorerer likevel investeringer som avskrivningene peker på.",
  },
  dcf: {
    type: "flow",
    title: "Fra fremtidige kroner til i dag",
    steps: ["Kontantstrømmer fremover", "Trekk fra tidsverdien", "Nåverdi", "Det er anslaget"],
    caption: "DCF verdsetter ved å diskontere det selskapet kan betale eierne senere. Høyere rente gir lavere nåverdi.",
  },
  wacc: {
    type: "formula",
    title: "Kravet til hele kapitalen",
    expression: "WACC = vekt · lånerente + vekt · eierkrav",
    bits: [
      { name: "Lånerente", means: "Det långiverne krever, etter skatt i den vanlige formelen" },
      { name: "Eierkrav", means: "Det aksjonærene krever, ofte fra CAPM" },
    ],
    caption: "WACC er et veid snitt. Mer gjeld trekker vanligvis snittet ned, inntil risikoen i gjelden stiger.",
  },
  capm: {
    type: "formula",
    title: "Kravet til en aksje",
    expression: "Krav = risikofri rente + beta × markedspåslag",
    bits: [
      { name: "Risikofri", means: "Det du kan få uten aksjerisiko" },
      { name: "Beta", means: "Hvor hardt aksjen svinger med markedet" },
      { name: "Påslag", means: "Ekstra avkastning markedet ventes å gi over risikofri" },
    ],
    caption: "CAPM sier at du bare får betalt for risiko som følger markedet. Egen risiko i ett selskap kan spres bort.",
  },
  beta: {
    type: "bars",
    title: "Hvor hardt den følger markedet",
    items: [
      { label: "0,5", value: 0.5 },
      { label: "1", value: 1 },
      { label: "1,5", value: 1.5 },
    ],
    caption: "Beta 1 beveger seg om lag med markedet. 0,5 beveger seg halvparten så mye. 1,5 mer. Stolpene er forholdet, ikke en kurs.",
  },
  durasjon: { type: "interactive", id: "yield" },
  yield: { type: "interactive", id: "yield" },
  kredittpaslag: {
    type: "stack",
    title: "Hva lånerenten består av",
    layers: [
      { label: "Kredittpåslag", note: "betaling for at låntaker kan svikte", tone: "rose" },
      { label: "Risikofri rente", note: "bunnen", tone: "blue" },
    ],
    caption: "To lån med samme løpetid kan ha ulik rente fordi långiver krever ekstra for kredittrisikoen.",
  },
  omf: {
    type: "flow",
    title: "Boliglån som verdipapir",
    steps: ["Boliglån", "Sikkerhetsmasse", "Obligasjon med fortrinnsrett", "Investor"],
    caption: "Banken samler boliglån og utsteder obligasjoner med sikkerhet i dem. Investoren har fortrinn til den massen.",
  },
  obligasjon: {
    type: "pair",
    title: "Du er långiver",
    a: "Du låner bort",
    b: "Kupong, så hovedstolen",
    link: "får du tilbake",
    caption: "En obligasjon er et lån du eier. Utstederen betaler rente og, ved forfall, beløpet tilbake. Prisen i mellomtiden svinger med renta.",
  },
  rentebytte: {
    type: "pair",
    title: "Bytte fast mot flytende",
    a: "Fast rente",
    b: "Flytende rente",
    link: "byttes",
    caption: "I et rentebytte betaler den ene parten fast og mottar flytende, eller omvendt. Hovedstolen byttes vanligvis ikke.",
  },
  sharpe: {
    type: "formula",
    title: "Avkastning per enhet svingning",
    expression: "(avkastning − risikofri rente) / svingning",
    bits: [
      { name: "Telleren", means: "Det du fikk utover risikofri plassering" },
      { name: "Nevneren", means: "Hvor mye verdien svingte" },
    ],
    caption: "Høyere Sharpe betyr mer meravkastning per enhet svingning. To porteføljer med lik avkastning: den roligste vinner på dette målet.",
  },
  kronekurs: { type: "interactive", id: "kronekurs" },
  rentenetto: {
    type: "formula",
    title: "Det banken tjener på renten",
    expression: "Rentenetto = renteinntekter − rentekostnader",
    bits: [
      { name: "Inntekt", means: "Renter på utlån" },
      { name: "Kostnad", means: "Renter på innskudd og bankens egen funding" },
    ],
    caption: "Rentenetto er kjernen i en vanlig bank. Gebyrer kommer i tillegg og ligger utenfor dette tallet.",
  },
  innskuddsdekning: {
    type: "split",
    title: "Hva utlånet er finansiert med",
    parts: [
      { label: "Innskudd", share: 60, tone: "teal" },
      { label: "Marked", share: 40, tone: "slate" },
    ],
    caption: "Innskuddsdekning er innskudd delt på utlån. Høy dekning betyr at flere utlån er finansiert av kundenes innskudd. 60/40 er et eksempel.",
  },
  ki: {
    type: "formula",
    title: "Hvor mye driften koster",
    expression: "Kostnader / inntekter",
    bits: [
      { name: "Kostnader", means: "Drift, lønn og lignende" },
      { name: "Inntekter", means: "Rentenetto og andre inntekter" },
    ],
    caption: "Lavere forholdstall betyr at banken bruker mindre av inntekten på å drive. Tallet sier ikke om inntekten er sunn.",
  },
  roe: {
    type: "formula",
    title: "Avkastning på egenkapitalen",
    expression: "Resultat / egenkapital",
    bits: [
      { name: "Resultat", means: "Det som er igjen etter tap og skatt" },
      { name: "Egenkapital", means: "Eiernes kapital" },
    ],
    caption: "Høy egenkapitalavkastning kan komme av god drift, eller av at banken har lite egenkapital og dermed mer risiko.",
  },
  cet1: {
    type: "formula",
    title: "Den reneste kapitalen",
    expression: "Ren kjernekapital / risikovektede eiendeler",
    bits: [
      { name: "Teller", means: "Aksjekapital og opptjent egenkapital, med fradrag" },
      { name: "Nevner", means: "Eiendeler vektet etter hvor risikable de er" },
    ],
    caption: "CET1 er kapitaldekningen tilsynet følger tettest. Et boliglån veier mindre enn et usikret lån.",
  },
  "tap-pa-utlan": {
    type: "pair",
    title: "Når lånet ikke betales",
    a: "Utlån",
    b: "Tap i resultatet",
    link: "kan bli",
    caption: "Banken setter av tap når det er sannsynlig at kunden ikke betaler. Tapet treffer resultatet, ikke bare en note.",
  },
  ekb: {
    type: "compare",
    title: "To deler av en sparebank",
    leftLabel: "Egenkapitalbevis",
    left: "Omsettelig eierandel. Eieren kan få utbytte og selge beviset.",
    rightLabel: "Grunnfond",
    right: "Eierløs kapital som blir i banken. Den har ingen aksjonær.",
    caption: "Et egenkapitalbevis er ikke en vanlig aksje i et aksjeselskap. Eierbrøken sier hvor stor del bevisene utgjør.",
  },
  eierbrok: {
    type: "split",
    title: "Hvem egenkapitalen tilhører",
    parts: [
      { label: "Egenkapitalbevis", share: 40, tone: "blue" },
      { label: "Grunnfond", share: 60, tone: "slate" },
    ],
    caption: "Eierbrøken er egenkapitalbevisenes andel av bankens egenkapital. 40/60 er et eksempel, ikke en bestemt bank.",
  },
  sparebankstiftelse: {
    type: "flow",
    title: "Der den gamle kapitalen ble lagt",
    steps: ["Sparebank", "Legger ut egenkapitalbevis", "Stiftelsen eier en del", "Gir gaver til formålet"],
    caption: "Når en sparebank henter eiere utenfra, kan grunnfondet samles i en stiftelse som eier bevis og deler ut overskudd etter formålet.",
  },
  resultatregnskap: {
    type: "flow",
    title: "Over en periode",
    steps: ["Inntekter", "Kostnader", "Resultat"],
    caption: "Resultatregnskapet viser hva som ble tjent og brukt i en periode, for eksempel et år. Det er ikke beholdningen på en dato.",
  },
  balanse: {
    type: "pair",
    title: "Alltid i balanse",
    a: "Eiendeler",
    b: "Egenkapital + gjeld",
    link: "er lik",
    caption: "Balansen er et øyeblikksbilde. Det selskapet eier, er finansiert av eierne og av långiverne.",
  },
  kontantstrom: {
    type: "stack",
    title: "Tre steder pengene beveger seg",
    layers: [
      { label: "Finansiering", note: "lån, utbytte, emisjon", tone: "amber" },
      { label: "Investering", note: "kjøp og salg av anlegg", tone: "blue" },
      { label: "Drift", note: "selve virksomheten", tone: "teal" },
    ],
    caption: "Resultat kan være positivt mens kontantene faller, hvis pengene ligger i kundefordringer eller i nye anlegg.",
  },
  ols: {
    type: "sketch",
    title: "Linjen som bommer minst",
    kind: "ols",
    caption:
      "OLS velger linjen der summen av de kvadrerte avvikene er minst. Beta er hvor bratt en slik linje er. Den er et estimat, ikke en naturlov.",
  },
  trinnskatt: { type: "interactive", id: "trinnskatt" },
  formuesskatt: {
    type: "flow",
    title: "Skatt på det du eier",
    steps: ["Ligningsverdi", "Minus gjeld", "Over bunnfradraget", "Formuesskatt"],
    caption: "Grunnlaget er ikke alltid markedsverdien. Primærbolig og aksjer har rabatter. Bunnfradrag og satser står i tabellen.",
  },
  tjenestepensjon: {
    type: "flow",
    title: "Fra lønn til senere utbetaling",
    steps: ["Lønn", "Arbeidsgiver setter inn", "Kontoen står", "Utbetaling som pensjonist"],
    caption: "I innskuddspensjon er innskuddet avtalt. Det du får ut, avhenger av avkastning og tid. Minstesatsen i privat sektor er {{sats:otp-sats}} av lønn opp til {{sats:otp-tak}}.",
  },
  egenkapital: { type: "interactive", id: "bolig" },
  fellesgjeld: {
    type: "split",
    title: "Totalpris i eksemplet",
    parts: [
      { label: "Innskudd", share: 25, tone: "teal" },
      { label: "Fellesgjeld", share: 75, tone: "slate" },
    ],
    caption:
      "Eksempel, ikke en bestemt bolig. 500 000 kroner i innskudd pluss 1 500 000 kroner i fellesgjeld er 2 000 000 kroner i totalpris.",
  },
  "leie-mot-eie": {
    type: "flow",
    title: "Leie først, kjøp senere",
    steps: ["Leie en periode", "Leie kan avtales som egenkapital", "Kjøpsrett eller kjøpsplikt", "Banken må fortsatt si ja"],
    caption:
      "Leie mot eie er en avtale om å leie en periode og senere kunne eller skulle kjøpe. En del av leien kan avtales å telle som egenkapital. Vilkårene varierer.",
  },
  frontfagsmodellen: {
    type: "flow",
    title: "Hvem som går først",
    steps: ["Frontfaget forhandler", "Rammen", "Staten, kommunene og handelen følger"],
    caption:
      "Industrien som selger til utlandet, forhandler først. Rammen skal hindre at lønningene priser bedriftene ut.",
  },
  lonnsoppgjor: {
    type: "flow",
    title: "Rekkefølgen",
    steps: ["Frontfaget", "Rammen", "Andre oppgjør"],
    caption: "Lønnsoppgjøret er forhandlingene. Frontfaget setter en ramme de andre oppgjørene vanligvis holder seg nær.",
  },
  sykepenger: {
    type: "flow",
    title: "Hvem som betaler når du er syk",
    steps: ["Du blir syk", "Arbeidsgiverperioden", "NAV etterpå"],
    caption:
      "Arbeidsgiver betaler de første 16 dagene. NAV kan overta etterpå, opp til 6 G, i opptil 52 uker. Grunnbeløpet står i tabellen.",
  },
  dagpenger: {
    type: "split",
    title: "En andel, ikke hele lønnen",
    parts: [
      { label: "Dekkes ikke", share: 38, tone: "slate" },
      { label: "Dagpenger", share: 62, tone: "teal" },
    ],
    caption:
      "Dagpenger er {{sats:dagpenger-sats}} av tidligere inntekt, opp til 6 G. Stolpen er et bilde av andelen. Varigheten står hos NAV.",
  },
  spotpris: {
    type: "bars",
    title: "Et døgn, som eksempel",
    items: [
      { label: "06", value: 45 },
      { label: "08", value: 80 },
      { label: "12", value: 40 },
      { label: "16", value: 55 },
      { label: "18", value: 90 },
      { label: "21", value: 50 },
    ],
    caption:
      "Eksempel, ikke dagens priser. Døgnmarkedet settes hvert kvarter fra 1. oktober 2025. Stolpene viser formen på et døgn, ikke hvert kvarter.",
  },
  prisomrader: {
    type: "bars",
    title: "Samme land, ulik pris",
    items: [
      { label: "NO1", value: 70 },
      { label: "NO2", value: 85 },
      { label: "NO3", value: 45 },
      { label: "NO4", value: 30 },
      { label: "NO5", value: 60 },
    ],
    caption: "Norge er delt i prisområder fordi kraften ikke flyter fritt. Stolpene er en illustrasjon, ikke dagens priser.",
  },
  stromstotte: {
    type: "flow",
    title: "Når prisen blir høy",
    steps: ["Spotpris", "Over terskelen", "Staten dekker en del", "Du betaler resten"],
    caption:
      "Strømstøtten skjærer toppen av spotprisen over en terskel. Den gjelder når du ikke har valgt Norgespris. Nettleie ligger utenfor.",
  },
  norgespris: {
    type: "pair",
    title: "To ordninger, ett valg",
    a: "Strømstøtte",
    b: "Norgespris",
    link: "eller",
    caption:
      "Norgespris er statens faste pris, {{sats:norgespris}} ekskl. mva ut 2026. Du kan ha én av ordningene. Nettleie og avgifter kommer i tillegg.",
  },
  importpriser: {
    type: "flow",
    title: "Fra europris til kroner",
    steps: ["Pris i euro", "Kronekurs", "Pris i kroner"],
    caption:
      "Importprisen er den utenlandske prisen i kroner. Eksempel, ikke dagens kurs: 100 euro til 11 kroner er 1 100 kroner, før frakt og avgift.",
  },
  eos: {
    type: "pair",
    title: "Utenfor EU, innenfor markedet",
    a: "Norge",
    b: "EUs indre marked",
    link: "knyttes via EØS",
    caption: "EØS-avtalen gir Norge tilgang til det indre markedet og plikt til å ta inn relevante regler. Norge er ikke medlem av EU.",
  },
  renteniva: {
    type: "stack",
    title: "Tre renter i samme stabel",
    layers: [
      { label: "Boliglånsrente", note: "det husholdningen betaler", tone: "amber" },
      { label: "Pengemarkedsrente", note: "bankene seg imellom", tone: "teal" },
      { label: "Styringsrente", note: "Norges Bank, bunnen", tone: "blue" },
    ],
    caption: "Rentenivået er hele stabelen. De tre tallene beveger seg ofte sammen, og boliglånsrenta ligger vanligvis øverst.",
  },
  deflasjon: {
    type: "compare",
    title: "To prisstier",
    leftLabel: "Stiger",
    left: "Inflasjon. Det generelle prisnivået løfter seg over tid.",
    rightLabel: "Faller",
    right: "Deflasjon. Det generelle prisnivået synker over tid.",
    caption: "Én vare som blir billigere, er ikke deflasjon. Prisnivået skal falle, og fallet skal vare.",
  },
  reallonn: { type: "interactive", id: "reallonn" },
  arbeidsledighet: {
    type: "bars",
    title: "To mål på ledighet",
    items: [
      { label: "AKU", value: 70 },
      { label: "Registrert", value: 48 },
    ],
    caption: "Ledige delt på arbeidsstyrken. Stolpene viser at AKU og registrert ledighet skiller lag. De er ikke årets tall fra SSB eller NAV.",
  },
  konjunktur: {
    type: "sketch",
    title: "Bølgen rundt trenden",
    kind: "konjunktur",
    caption:
      "Konjunkturen er bølgen. Trenden er den jevne linjen. Produksjonsgapet er avviket mellom dem. Tegningen er en form, ikke Norges tall.",
  },
  "noytral-rente": {
    type: "sketch",
    title: "Over eller under linjen",
    kind: "noytral-rente",
    caption:
      "Den stiplete linjen er anslaget på nøytral rente. Styringsrenten over linjen strammer, under linjen slipper den opp. Anslaget står i pengepolitisk rapport.",
  },
  "importert-inflasjon": {
    type: "flow",
    title: "Fra valuta til pris",
    steps: ["Kronekurs", "Importpris", "KPI"],
    caption:
      "Importert inflasjon er virkningen på KPI. Importprisen er hva varen koster i kroner. Rekkefølgen er poenget, ikke en prognose.",
  },
  "tilbud-og-ettersporsel": {
    type: "sketch",
    title: "Krysset",
    kind: "kryss",
    caption:
      "Der de to kurvene krysser, lander pris og mengde. Høyere rente flytter etterspørselen ned, og krysset flytter seg til lavere pris og mengde.",
  },
  bytteforhold: {
    type: "formula",
    title: "Eksportpris mot importpris",
    expression: "Bytteforhold = eksportpris / importpris",
    bits: [
      { name: "Eksportpris", means: "Prisen på det Norge selger" },
      { name: "Importpris", means: "Prisen på det Norge kjøper" },
    ],
    caption: "Stiger telleren mer enn nevneren, kan samme eksport betale mer import. Tallet er et forhold, ikke kroner.",
  },
  handelsbalanse: {
    type: "bars",
    title: "Eksport, import og differansen",
    items: [
      { label: "Eksport", value: 100 },
      { label: "Import", value: 70 },
      { label: "Differanse", value: 30 },
    ],
    caption: "Handelsbalansen er differansen. Stolpene er et regnestykke, ikke Norges tall et bestemt år.",
  },
  oljepris: {
    type: "sketch",
    title: "En prislinje",
    kind: "prislinje",
    caption:
      "Linjen viser at prisen går opp og ned over tid. Den er ikke en notering, og aksen har ingen tall. Plattformbildet på området viser hvor inntekten kommer fra.",
  },
  petroleumsinntekter: {
    type: "flow",
    title: "Inn i fondet",
    steps: ["Sokkel", "Stat", "Fond"],
    caption: "Inntektene går inn i fondet. Handlingsregelen handler om uttaket, ikke om denne innbetalingen.",
  },
  "automatiske-stabilisatorer": {
    type: "compare",
    title: "Underskuddet følger med",
    leftLabel: "Aktiviteten faller",
    left: "Skatten synker og dagpengene stiger. Underskuddet vokser av seg selv.",
    rightLabel: "Aktiviteten tar seg opp",
    right: "Skatten stiger og færre får dagpenger. Underskuddet krymper.",
    caption: "Det trengs ikke et nytt vedtak i statsbudsjettet. Et krisetiltak på toppen er et eget vedtak.",
  },
  nettleie: {
    type: "split",
    title: "Regningen delt",
    parts: [
      { label: "Spot", share: 46, tone: "amber" },
      { label: "Nettleie", share: 32, tone: "teal" },
      { label: "Avgifter", share: 22, tone: "slate" },
    ],
    caption: "Andelene er et eksempel, ikke din regning. Strømstøtten skjærer i spotdelen, ikke i nettleien.",
  },
  fastprisavtale: {
    type: "sketch",
    title: "Flat mot ujevn",
    kind: "fastpris",
    caption:
      "Linjene er kraftprisen. På fastpris ligger den flatt i avtaleperioden, på spot hopper den kvart for kvart. Nettleie og avgifter kommer i tillegg på begge.",
  },
  utbytte: {
    type: "split",
    title: "Overskuddet delt",
    parts: [
      { label: "Utbytte", share: 40, tone: "teal" },
      { label: "Blir igjen", share: 60, tone: "slate" },
    ],
    caption: "Andelene er et eksempel. Det som blir igjen, er fortsatt i selskapet. Selskapet bestemmer fordelingen.",
  },
  borsverdi: {
    type: "formula",
    title: "Hele egenkapitalen i markedet",
    expression: "Børsverdi = aksjekurs × antall aksjer",
    bits: [
      { name: "Kurs", means: "Prisen på én aksje" },
      { name: "Antall", means: "Hvor mange aksjer selskapet har" },
    ],
    caption: "Én aksje til 100 kroner i et selskap med en million aksjer er en børsverdi på 100 millioner. Regnestykket er formen.",
  },
  pe: {
    type: "formula",
    title: "Pris over fortjeneste",
    expression: "P/E = pris per aksje / fortjeneste per aksje",
    bits: [
      { name: "Pris", means: "Det markedet betaler for aksjen" },
      { name: "Fortjeneste", means: "Resultatet per aksje" },
    ],
    caption: "Samme form som pris/bok, med resultatet i nevneren. Tallet er en sammenligning, ikke en verdi i seg selv.",
  },
  risikopremie: {
    type: "stack",
    title: "Påslaget oppå",
    layers: [
      { label: "Risikopremie", note: "ekstra forventet avkastning", tone: "rose" },
      { label: "Risikofri rente", note: "bunnen", tone: "blue" },
    ],
    caption: "Forventet avkastning er bunnen pluss påslaget. Påslaget er betalingen for å bære risiko, ikke et løfte.",
  },
  volatilitet: {
    type: "sketch",
    title: "Rolig og urolig",
    kind: "volatilitet",
    caption:
      "Begge følger samme jevne bane. Volatilitet er størrelsen på svingningen rundt den. Den er ikke det samme som at kursen faller.",
  },
  korrelasjon: {
    type: "sketch",
    title: "Følges, eller ikke",
    kind: "korrelasjon",
    caption:
      "Til venstre går de to kurvene samme vei. Til høyre følger den ene ikke den andre. Diversifisering hjelper mest når avkastningene ikke følges.",
  },
  kupongrente: {
    type: "compare",
    title: "Avtalt mot det prisen gir",
    leftLabel: "Kupongrente",
    left: "Fast. Avtalt av pålydende.",
    rightLabel: "Yield",
    right: "Flytter seg når prisen i markedet flytter seg.",
    caption: "Samme obligasjon kan ha én kupong og en annen yield. Yield er avkastningen gitt prisen du betaler.",
  },
  innskuddsgaranti: {
    type: "compare",
    title: "Under taket, og over",
    leftLabel: "Under taket",
    left: "Innskuddet dekkes av garantien.",
    rightLabel: "Over taket",
    right: "Den vanlige garantien dekker ikke resten.",
    caption: "Taket er {{sats:innskuddsgaranti}} per kunde per bank, for innskudd i en norsk bank i Norge. Flere kontoer i samme bank teller samlet.",
  },
  rentemargin: {
    type: "formula",
    title: "Rente inn minus rente ut",
    expression: "Rentemargin = utlånsrente − innskuddsrente",
    bits: [
      { name: "Utlånsrente", means: "Det lånekunden betaler" },
      { name: "Innskuddsrente", means: "Det banken betaler for innskuddet" },
    ],
    caption: "Forskjellen er i rente, ikke i kroner. Kronene er rentenettoen. Et stort volum med smal margin kan likevel gi mange kroner.",
  },
  provisjonsinntekter: {
    type: "split",
    title: "Inntekten delt",
    parts: [
      { label: "Rente", share: 68, tone: "blue" },
      { label: "Provisjon", share: 32, tone: "teal" },
    ],
    caption: "Andelene er et eksempel, ikke en bestemt bank. Provisjon er gebyrer. Rente er rentenettoen.",
  },
  "motsyklisk-buffer": {
    type: "stack",
    title: "Kapitalkravet i lag",
    layers: [
      { label: "Motsyklisk buffer", note: "det øverste laget, kan settes ned", tone: "rose" },
      { label: "Annet kapitalkrav", note: "bunnen, inkludert ren kjernekapital", tone: "blue" },
    ],
    caption: "Bufferen er det øverste laget. I november 2026 var kravet 2,5 prosent. Stabelen er formen, ikke hele kravet til én bank.",
  },
  fastrente: {
    type: "sketch",
    title: "Låst eller med på renta",
    kind: "fastrente",
    caption:
      "Linjene er boliglånsrenta. Fastrenten ligger flatt mens styringsrenten flytter seg. Den flytende renta følger etter. Etter bindingen avtales fastrenten på nytt.",
  },
  buffer: {
    type: "flow",
    title: "Reserve først",
    steps: ["Buffer på konto", "Langsiktig sparing", "Ekstra nedbetaling"],
    caption: "Pengene i bufferen skal kunne tas ut. Fondsandeler er ikke en buffer hvis du ikke tåler å selge dem.",
  },
  innskuddspensjon: {
    type: "compare",
    title: "Samme ramme, to ordninger",
    leftLabel: "Innskuddspensjon",
    left: "Avtalt innskudd. Utbetalingen følger avkastningen.",
    rightLabel: "Ytelsespensjon",
    right: "Avtalt utbetaling. Avkastningen endrer ikke løftet.",
    caption: "Paret viser forskjellen. Innskuddspensjon lover innbetalingen, ikke beløpet du får ut.",
  },
  ytelsespensjon: {
    type: "compare",
    title: "Samme ramme, to ordninger",
    leftLabel: "Ytelsespensjon",
    left: "Utbetalingen er avtalt.",
    rightLabel: "Innskuddspensjon",
    right: "Innskuddet er avtalt. Utbetalingen følger avkastningen.",
    caption: "Samme ramme som på innskuddspensjon. Her er løftet beløpet du får, ikke beløpet som settes inn.",
  },
  oppjusteringsfaktor: {
    type: "bars",
    title: "Grunnlaget før og etter",
    items: [
      { label: "Før", value: 1 },
      { label: `Etter × ${formatVerdi(satsNumber("oppjustering"), "tekst")}`, value: satsNumber("oppjustering") },
    ],
    caption: "Den høyre stolpen er grunnlaget etter faktoren {{sats:oppjustering}}. Faktoren vedtas for hvert år.",
  },
  verdsettingsrabatt: {
    type: "bars",
    title: "Markedsverdi og det som teller",
    items: [
      { label: "Marked", value: 100 },
      { label: "I formuen", value: 100 - satsNumber("verdsettingsrabatt") },
    ],
    caption: "Aksjer teller med det som er igjen etter rabatten {{sats:verdsettingsrabatt}}. Stolpene viser den formen.",
  },
  avskrivning: {
    type: "split",
    title: "Anskaffelsen i like biter",
    parts: [
      { label: "År 1", share: 25, tone: "teal" },
      { label: "År 2", share: 25, tone: "blue" },
      { label: "År 3", share: 25, tone: "slate" },
      { label: "År 4", share: 25, tone: "amber" },
    ],
    caption: "Like biter er lineær avskrivning, den enkleste formen. Hele kjøpet er ikke en kostnad i år én. Kontantene gikk ut ved kjøpet.",
  },
  arbeidskapital: {
    type: "formula",
    title: "Det driften binder",
    expression: "Arbeidskapital = omløpsmidler − kortsiktig gjeld",
    bits: [
      { name: "Omløpsmidler", means: "Varelager, fordringer og kontanter i driften" },
      { name: "Kortsiktig gjeld", means: "Blant annet det som skyldes leverandørene" },
    ],
    caption: "Endringen flytter kontantstrømmen. Stiger fordringene, er overskuddet ennå ikke blitt kontanter.",
  },
  driftsmargin: {
    type: "split",
    title: "Omsetningen, og biten som blir igjen",
    parts: [
      { label: "Margin 10 %", share: 10, tone: "teal" },
      { label: "Driftskostnader 90 %", share: 90, tone: "slate" },
    ],
    caption: "Hele stolpen er omsetningen. Biten er driftsresultatet. 10 prosent er eksempelet fra teksten: 10 øre av hver krone i salg, ikke et bestemt selskap.",
  },
  standardavvik: {
    type: "sketch",
    title: "Tett eller spredt",
    kind: "spredning",
    caption:
      "Snittet er det samme i begge. Standardavviket sier hvor langt punktene ligger fra det. Volatilitet er denne spredningen for avkastning.",
  },
  rente: {
    type: "formula",
    title: "Ett år, ett regneeksempel",
    expression: "10 000 kr × 5 % = 500 kr",
    bits: [
      { name: "10 000 kr", means: "Det du setter inn" },
      { name: "5 %", means: "Renta i eksempelet, ikke en rente fra banken i dag" },
      { name: "500 kr", means: "Det som legges til på ett år" },
    ],
    caption: "Etter ett år er beløpet 10 500 kroner. Neste år regnes renta av det nye beløpet.",
  },
  realrente: {
    type: "compare",
    title: "Renta og prisene",
    leftLabel: "Renta",
    left: "4 prosent på sparekontoen.",
    rightLabel: "Prisveksten",
    right: "3 prosent dyrere varer.",
    caption: "Regneeksempel: om lag 1 prosent igjen. Ikke en rente du får nå.",
  },
  "penger-og-banker": {
    type: "flow",
    title: "Fra innskudd til nytt innskudd",
    steps: ["Du setter inn", "Banken låner ut", "Mottakeren får et innskudd"],
    caption: "Lånet blir et nytt innskudd. Banken låner ikke bare ut de samme sedlene.",
  },
  aksje: {
    type: "compare",
    title: "To måter å tjene på",
    leftLabel: "Utbytte",
    left: "Penger selskapet betaler ut til eierne.",
    rightLabel: "Kurs",
    right: "Det du får hvis du selger andelen.",
    caption: "Begge kan utebli, og kursen kan falle. Da er andelen verdt mindre enn du betalte.",
  },
  fond: {
    type: "stack",
    title: "Tre vanlige fond",
    layers: [
      { label: "Aksjefond", note: "eier aksjer", tone: "teal" },
      { label: "Rentefond", note: "eier lån og obligasjoner", tone: "blue" },
      { label: "Kombinasjonsfond", note: "eier begge deler", tone: "amber" },
    ],
    caption: "Fondet eier papirene. Du eier en andel sammen med de andre sparerne.",
  },
  etf: {
    type: "compare",
    title: "Samme fond, ulik handel",
    leftLabel: "Vanlig fond",
    left: "Ofte én pris om dagen.",
    rightLabel: "ETF",
    right: "Kjøpes og selges på børs gjennom dagen.",
    caption: "En ETF er et fond med børspris. Den er ikke automatisk billigere.",
  },
  "kostnader-i-fond": {
    type: "bars",
    title: "Samme avkastning, ulik kostnad",
    items: [
      { label: "0,2 % i året", value: 542_713 },
      { label: "1,5 % i året", value: 374_532 },
    ],
    caption:
      "Regneeksempel, ikke en prognose. 100 000 kroner i 30 år, 6 prosent før kostnad. Stolpene er det som er igjen etter kostnaden.",
  },
  "kurtasje-valutapaslag": {
    type: "compare",
    title: "To kostnader ved handelen",
    leftLabel: "Kurtasje",
    left: "Gebyret for selve handelen.",
    rightLabel: "Valutapåslag",
    right: "Ekstra når du veksler til en annen valuta.",
    caption: "De kommer i tillegg til den årlige kostnaden i et fond.",
  },
  "investeringskonto-zero": {
    type: "table",
    title: "Tre kontoer, kort",
    columns: ["ASK", "IKZ", "Vanlig"],
    rows: [
      { label: "Innhold", cells: ["Aksjer, fond", "Også renter", "Det du kjøper"] },
      { label: "Skatt", cells: ["Ved uttak", "Ved uttak", "Ved salg"] },
      { label: "Innskudd først", cells: ["Ja", "Nei", "Nei"] },
      { label: "Stemmerett", cells: ["Ja", "Nei", "Ja"] },
      { label: "Garanti", cells: ["Nei", "Nei", "Nei"] },
    ],
    caption:
      "Kort sammenligning. Verdipapirene dekkes ikke av innskuddsgarantien. TODO: verifiser skattesatsen på IKZ hos Skatteetaten.",
  },
  kapitalforsikring: {
    type: "flow",
    title: "Hvem eier hva",
    steps: ["Du betaler inn", "Selskapet eier papirene", "Du har et krav", "Skatt ved uttak"],
    caption: "Du har kravet. Selskapet står som eier, så stemmeretten følger ikke med.",
  },
  lonnsslipp: {
    type: "flow",
    title: "Fra brutto til konto",
    steps: ["Brutto", "Trekk", "Netto"],
    caption: "Netto er det som kommer på konto. 40 000 og 12 000 i teksten er et eksempel.",
  },
  skattekort: {
    type: "compare",
    title: "Trekk, ikke fasit",
    leftLabel: "Skattekort",
    left: "Styrer trekket gjennom året.",
    rightLabel: "Skattemelding",
    right: "Oppgjøret etter året.",
    caption: "Kortet er forskuddet. Meldingen er der du sjekker fasiten.",
  },
  tabelltrekk: {
    type: "compare",
    title: "To måter å trekke på",
    leftLabel: "Tabell",
    left: "Følger lønn og fradrag.",
    rightLabel: "Prosent",
    right: "En prosent av utbetalingen.",
    caption: "Prosenttrekk brukes ofte når du har flere arbeidsgivere.",
  },
  frikort: {
    type: "compare",
    title: "Under og over grensen",
    leftLabel: "Under",
    left: "Ikke skattetrekk.",
    rightLabel: "Over uten kort",
    right: "50 prosent av det over grensen.",
    caption: "Grensen og trekket står i tabellen. TODO: verifiser om 2025-grensen var den samme.",
  },
  feriepenger: {
    type: "formula",
    title: "Minstesatsen",
    expression: "Feriepenger = grunnlag × minstesats",
    bits: [
      { name: "Grunnlag", means: "Arbeidsvederlag utbetalt året før" },
      { name: "Minstesats", means: "10,2 prosent i ferieloven" },
    ],
    caption: "Tariffavtaler gir ofte 12 prosent. Over 60 år kommer 2,3 prosentpoeng på toppen, opp til 6 G.",
  },
  skattemelding: {
    type: "flow",
    title: "Fra trekk til oppgjør",
    steps: ["Trekk gjennom året", "Skattemelding", "Oppgjør"],
    caption: "Du sjekker meldingen. Oppgjøret viser restskatt eller tilgode.",
  },
  restskatt: {
    type: "compare",
    title: "For lite, eller for mye",
    leftLabel: "Restskatt",
    left: "Trekket var for lavt.",
    rightLabel: "Tilgode",
    right: "Trekket var for høyt.",
    caption: "TODO: verifiser rentesatsen på restskatt hos Skatteetaten. Den står ikke her.",
  },
  forbrukslan: {
    type: "compare",
    title: "Med pant, og uten",
    leftLabel: "Boliglån",
    left: "Pant i boligen.",
    rightLabel: "Forbrukslån",
    right: "Uten pant. Ofte dyrere.",
    caption: "Sammenlign effektiv rente. Ingen rentesats står her, fordi tilbudene varierer.",
  },
  kredittkort: {
    type: "flow",
    title: "Rammen og renta",
    steps: ["Du bruker kortet", "Forfall", "Hele beløpet, eller rente"],
    caption: "Ubrukt ramme kan telle som gjeld. 20 000 kroner i teksten er et eksempel.",
  },
  studielan: {
    type: "flow",
    title: "Fra lån til stipend",
    steps: ["Basislån", "Vilkår sjekkes", "Inntil 40 % kan bli stipend", "Rente etter fulltid"],
    caption:
      "40 prosent krever bortebo, bestått grad og grensene. Enkeltfag kan gi 15 prosent. Renta løper fra dagen etter støtten.",
  },
  gjeldsregisteret: {
    type: "compare",
    title: "Hva som synes",
    leftLabel: "I registeret",
    left: "Forbrukslån og kredittkort.",
    rightLabel: "Ikke her",
    right: "Boliglån med pant.",
    caption: "Banken ser den usikrede gjelden når du søker et nytt lån.",
  },
  statsbudsjett: {
    type: "flow",
    title: "Ett år for staten",
    steps: ["Inntekter", "Utgifter", "Stortinget vedtar"],
    caption: "Finanspolitikken er valgene i budsjettet. Handlingsregelen rammer inn oljepengebruken.",
  },
};

/** Konsepter med samme interaktive figur deler nøkkel, så en leksjon viser den én gang. */
export function figureKey(conceptId: string): string {
  const spec = conceptFigures[conceptId];
  return spec?.type === "interactive" ? `interaktiv:${spec.id}` : conceptId;
}

export function figureSitsBeside(spec: FigureSpec | undefined): boolean {
  return Boolean(spec && spec.type !== "interactive" && spec.type !== "sketch");
}

function assertFigures() {
  const missing = concepts.filter((concept) => !conceptFigures[concept.id]);
  if (missing.length > 0) {
    throw new Error(
      `Mangler figur for: ${missing.map((concept) => concept.id).join(", ")}`
    );
  }
  const known = new Set(concepts.map((concept) => concept.id));
  const extra = Object.keys(conceptFigures).filter((id) => !known.has(id));
  if (extra.length > 0) {
    throw new Error(`Ukjent figur: ${extra.join(", ")}`);
  }
  for (const concept of concepts) {
    const spec = conceptFigures[concept.id];
    const caption = spec && spec.type !== "interactive" ? spec.caption : "";
    const texts = [concept.explanation, concept.tip ?? "", caption];
    const seen = new Map<string, number>();
    for (const text of texts) {
      assertSatsRefs(text, `Konsept ${concept.id}`);
      for (const id of ordIdsIn(text)) seen.set(id, (seen.get(id) ?? 0) + 1);
    }
    for (const [id, count] of seen) {
      if (count > 1) throw new Error(`Konsept ${concept.id} merker «${id}» ${count} ganger`);
    }
  }
}

assertFigures();
