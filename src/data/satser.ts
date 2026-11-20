/**
 * Eneste kilde for tall som endres fra år til år.
 * To år per sats: siste vedtatte år, og året etter hvis det finnes et forslag.
 * Ellers de to siste vedtatte årene.
 */

export type SatsEnhet = "kr" | "%" | "mrd. kr" | "G" | "tekst";

export type SatsStatus = "vedtatt" | "forslag";

export type SatsVerdi = {
  verdi: number | string;
  status: SatsStatus;
};

export type Sats = {
  id: string;
  /** Fullt navn, for eksempel «BSU – maks sparebeløp per år». */
  navn: string;
  /** Kort navn i tabellen på mobil. Maks ca. 22 tegn. */
  kortNavn: string;
  enhet: SatsEnhet;
  verdier: Record<number, SatsVerdi>;
  /** URL til primærkilden. */
  kilde: string;
  /** Datoen kilden ble lest, YYYY-MM-DD. */
  sistSjekket: string;
  merknad?: string;
};

const SJEKKET = "2026-11-20";

const SKATT = "https://www.skatteetaten.no";

export const satser: Sats[] = [
  {
    id: "bsu-aar",
    navn: "BSU – maks sparebeløp per år",
    kortNavn: "BSU per år",
    enhet: "kr",
    verdier: {
      2025: { verdi: 27_500, status: "vedtatt" },
      2026: { verdi: 27_500, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/fradrag-for-boligsparing-for-ungdom-bsu/?year=2026`,
    sistSjekket: SJEKKET,
    merknad: "Samme grense i 2025 og 2026 hos Skatteetaten.",
  },
  {
    id: "bsu-samlet",
    navn: "BSU – maks samlet sparebeløp",
    kortNavn: "BSU samlet",
    enhet: "kr",
    verdier: {
      2025: { verdi: 300_000, status: "vedtatt" },
      2026: { verdi: 300_000, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/fradrag-for-boligsparing-for-ungdom-bsu/?year=2026`,
    sistSjekket: SJEKKET,
  },
  {
    id: "bsu-fradrag",
    navn: "BSU – sats for skattefradrag",
    kortNavn: "BSU-fradrag",
    enhet: "%",
    verdier: {
      2025: { verdi: 10, status: "vedtatt" },
      2026: { verdi: 10, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/fradrag-for-boligsparing-for-ungdom-bsu/?year=2026`,
    sistSjekket: SJEKKET,
  },
  {
    id: "bsu-alder",
    navn: "BSU – sparing med fradrag",
    kortNavn: "BSU-alder",
    enhet: "tekst",
    verdier: {
      2025: { verdi: "året du fyller 33", status: "vedtatt" },
      2026: { verdi: "året du fyller 33", status: "vedtatt" },
    },
    kilde: `${SKATT}/person/skatt/hjelp-til-riktig-skatt/bank-og-lan/bsu/`,
    sistSjekket: SJEKKET,
    merknad: "Til og med det året du fyller 33. Fra året du fyller 34 kan du ikke spare med fradrag.",
  },
  {
    id: "grunnbelop",
    navn: "Grunnbeløpet (G) fra 1. mai",
    kortNavn: "Grunnbeløp (G)",
    enhet: "kr",
    verdier: {
      2025: { verdi: 130_160, status: "vedtatt" },
      2026: { verdi: 136_549, status: "vedtatt" },
    },
    kilde: "https://www.nav.no/regulering-2026",
    sistSjekket: SJEKKET,
    merknad: "Fra 1. mai. 2026 er også fastsatt i forskrift 22. mai 2026 nr. 869 (Lovdata).",
  },
  {
    id: "inflasjon-mal",
    navn: "Operativt mål for prisveksten",
    kortNavn: "Inflasjonsmål",
    enhet: "%",
    verdier: {
      2025: { verdi: 2, status: "vedtatt" },
      2026: { verdi: 2, status: "vedtatt" },
    },
    kilde: "https://lovdata.no/dokument/INS/forskrift/2026-09-18-1815",
    sistSjekket: SJEKKET,
    merknad:
      "Bestemmelse om pengepolitikken 18. september 2026 § 2: årsvekst i konsumprisene som over tid er nær 2 prosent. Samme mål sto i bestemmelsen fra 2019 § 3.",
  },
  {
    id: "kpi-basis",
    navn: "Basisår for konsumprisindeksen",
    kortNavn: "KPI-basis",
    enhet: "tekst",
    verdier: {
      2025: { verdi: "2015 = 100", status: "vedtatt" },
      2026: { verdi: "2025 = 100", status: "vedtatt" },
    },
    kilde:
      "https://www.ssb.no/priser-og-prisindekser/konsumpriser/statistikk/konsumprisindeksen/artikler/endringer-i-konsumprisindeksen-kpi",
    sistSjekket: SJEKKET,
    merknad: "Indeksen i basisåret er 100. Fra januar 2026 er basisåret 2025. Før det var det 2015.",
  },
  {
    id: "sou-mrd",
    navn: "Strukturelt oljekorrigert underskudd",
    kortNavn: "Underskudd",
    enhet: "mrd. kr",
    verdier: {
      2026: { verdi: 583.4, status: "vedtatt" },
      2027: { verdi: 608.4, status: "forslag" },
    },
    kilde: "https://www.regjeringen.no/no/aktuelt/nokkeltall-i-nasjonalbudsjettet-2027/id3174610/",
    sistSjekket: SJEKKET,
    merknad:
      "Løpende priser. 583,4 mrd. kr er anslaget for 2026 i Nasjonalbudsjettet 2027. 608,4 mrd. kr er forslaget for 2027.",
  },
  {
    id: "sou-pst",
    navn: "Strukturelt underskudd i prosent av fondet",
    kortNavn: "Andel av fondet",
    enhet: "%",
    verdier: {
      2026: { verdi: 2.7, status: "vedtatt" },
      2027: { verdi: 2.7, status: "forslag" },
    },
    kilde: "https://www.regjeringen.no/no/aktuelt/nokkeltall-i-nasjonalbudsjettet-2027/id3174610/",
    sistSjekket: SJEKKET,
    merknad: "Prosent av Statens pensjonsfond utland ved inngangen til året. Normen i handlingsregelen er om lag 3 prosent forventet realavkastning over tid. 2,7 prosent er årets anslag, ikke normen.",
  },
  {
    id: "spu-verdi",
    navn: "Oljefondets verdi",
    kortNavn: "Fondets verdi",
    enhet: "tekst",
    verdier: {
      2025: { verdi: "21 268 mrd. kr ved årsslutt", status: "vedtatt" },
      2026: { verdi: "22 683 mrd. kr 30. juni", status: "vedtatt" },
    },
    kilde:
      "https://www.nbim.no/no/nyheter-og-innsikt/rapporter/2026/halvarsrapport-2026/nettrapport-halvarsrapport-2026/",
    sistSjekket: SJEKKET,
    merknad:
      "2025 er fondets verdi ved utgangen av 2025. 2026 er verdien 30. juni 2026. Samme dag var investeringsporteføljen 22 695 mrd. kr: aksjer 16 358 (72,1 prosent), renter 5 860 (25,8 prosent), unotert eiendom 373 (1,6 prosent) og unotert infrastruktur 104 (0,5 prosent).",
  },
  {
    id: "dagpenger-sats",
    navn: "Dagpenger av tidligere inntekt",
    kortNavn: "Dagpengesats",
    enhet: "%",
    verdier: {
      2025: { verdi: 62.4, status: "vedtatt" },
      2026: { verdi: 62.4, status: "vedtatt" },
    },
    kilde: "https://www.nav.no/dagpenger",
    sistSjekket: SJEKKET,
    merknad:
      "Inntekt over 6 G regnes ikke med. Minst 2 G gir inntil 104 uker. Under 2 G gir inntil 52 uker. Satsen er den NAV beskriver som gjeldende.",
  },
  {
    id: "norgespris",
    navn: "Norgespris på strøm",
    kortNavn: "Norgespris",
    enhet: "tekst",
    verdier: {
      2026: { verdi: "40 øre/kWh", status: "vedtatt" },
      2027: { verdi: "45 øre/kWh", status: "forslag" },
    },
    kilde: "https://www.regjeringen.no/no/tema/energi/strom/regjeringens-stromtiltak/id2900232/",
    sistSjekket: SJEKKET,
    merknad:
      "Eksklusiv merverdiavgift. 40 øre gjelder fra 1. oktober 2025 til 31. desember 2026. 45 øre er forslaget fra 1. januar 2027. Nettleie og avgifter kommer i tillegg. Gjelder de første 5 000 kWh i måneden i boligen.",
  },
  {
    id: "personfradrag",
    navn: "Personfradrag, klasse 1",
    kortNavn: "Personfradrag",
    enhet: "kr",
    verdier: {
      2025: { verdi: 108_550, status: "vedtatt" },
      2026: { verdi: 114_540, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/personfradrag/?year=2026`,
    sistSjekket: SJEKKET,
    merknad: "2026 er også i Stortingets skattevedtak 18. desember 2025 nr. 2747 § 6-3. 2025: 108 550 kr.",
  },
  {
    id: "minstefradrag-sats",
    navn: "Minstefradrag i lønn, sats",
    kortNavn: "Minstefradrag",
    enhet: "%",
    verdier: {
      2025: { verdi: 46, status: "vedtatt" },
      2026: { verdi: 46, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/minstefradrag/?year=2026`,
    sistSjekket: SJEKKET,
  },
  {
    id: "minstefradrag-tak",
    navn: "Minstefradrag i lønn, øvre grense",
    kortNavn: "Minstefradrag, tak",
    enhet: "kr",
    verdier: {
      2025: { verdi: 92_000, status: "vedtatt" },
      2026: { verdi: 95_700, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/minstefradrag/?year=2026`,
    sistSjekket: SJEKKET,
  },
  {
    id: "alminnelig-sats",
    navn: "Skatt på alminnelig inntekt, personer",
    kortNavn: "Alminnelig skatt",
    enhet: "%",
    verdier: {
      2025: { verdi: 22, status: "vedtatt" },
      2026: { verdi: 22, status: "vedtatt" },
    },
    kilde: `${SKATT}/rettskilder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/`,
    sistSjekket: SJEKKET,
    merknad: "22 prosent også i 2025, jf. forskuddsmeldingen 2025 fra Skatteetaten.",
  },
  {
    id: "oppjustering",
    navn: "Oppjusteringsfaktor for aksjeinntekt",
    kortNavn: "Oppjustering",
    enhet: "tekst",
    verdier: {
      2025: { verdi: 1.72, status: "vedtatt" },
      2026: { verdi: 1.72, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/faktor-for-oppjustering-av-eierinntekter/?year=2026`,
    sistSjekket: SJEKKET,
  },
  {
    id: "verdsettingsrabatt",
    navn: "Verdsettingsrabatt på aksjer",
    kortNavn: "Aksjerabatt",
    enhet: "%",
    verdier: {
      2025: { verdi: 20, status: "vedtatt" },
      2026: { verdi: 20, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/formuesskatt/?year=2026`,
    sistSjekket: SJEKKET,
    merknad: "Aksjer teller med 80 prosent i formuesgrunnlaget.",
  },
  {
    id: "formue-bunn",
    navn: "Bunnfradrag i formuesskatt, én person",
    kortNavn: "Bunnfradrag",
    enhet: "kr",
    verdier: {
      2025: { verdi: 1_760_000, status: "vedtatt" },
      2026: { verdi: 1_900_000, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/formuesskatt/`,
    sistSjekket: SJEKKET,
    merknad:
      "Ektefeller får det dobbelte. 2025: 1 760 000 kr, Stortingets skattevedtak 13. desember 2024 nr. 3203. 2026: Stortingets skattevedtak 18. desember 2025 nr. 2747 kapittel 2.",
  },
  {
    id: "formue-sats",
    navn: "Formuesskatt, samlet sats",
    kortNavn: "Formuesskatt",
    enhet: "%",
    verdier: {
      2025: { verdi: 1, status: "vedtatt" },
      2026: { verdi: 1, status: "vedtatt" },
    },
    kilde: `${SKATT}/satser/formuesskatt/`,
    sistSjekket: SJEKKET,
    merknad:
      "Når kommunen bruker høyeste sats. 2026: inntil 0,35 prosent kommune pluss 0,65 prosent stat. 2025: inntil 0,525 pluss 0,475. Skatteetaten bruker maks i forskuddet.",
  },
  {
    id: "formue-topp",
    navn: "Grense for høyere formuesskatt",
    kortNavn: "Høyere trinn",
    enhet: "kr",
    verdier: {
      2025: { verdi: 20_700_000, status: "vedtatt" },
      2026: { verdi: 21_500_000, status: "vedtatt" },
    },
    kilde: "https://lovdata.no/dokument/STV/forskrift/2025-12-18-2747/KAPITTEL_2",
    sistSjekket: SJEKKET,
    merknad: "2025-grensen 20 700 000 kr står i skattevedtak 13. desember 2024 nr. 3203. 2026-grensen står i skattevedtaket lenken peker på.",
  },
  {
    id: "formue-sats-hoy",
    navn: "Formuesskatt over det øvre trinnet",
    kortNavn: "Høyere sats",
    enhet: "%",
    verdier: {
      2025: { verdi: 1.1, status: "vedtatt" },
      2026: { verdi: 1.1, status: "vedtatt" },
    },
    kilde: "https://lovdata.no/dokument/STV/forskrift/2025-12-18-2747/KAPITTEL_2",
    sistSjekket: SJEKKET,
    merknad:
      "Når kommunen bruker høyeste sats. 2026: 0,35 pluss 0,75. 2025: 0,525 pluss 0,575, skattevedtak 13. desember 2024 nr. 3203.",
  },
  {
    id: "innskuddsgaranti",
    navn: "Innskuddsgaranti per kunde per bank",
    kortNavn: "Innskuddsgaranti",
    enhet: "kr",
    verdier: {
      2025: { verdi: 2_000_000, status: "vedtatt" },
      2026: { verdi: 2_000_000, status: "vedtatt" },
    },
    kilde: "https://www.bankenessikringsfond.no/om-garantien/hvor-mye-dekker-garantien/",
    sistSjekket: SJEKKET,
    merknad: "Gjelder kunde i norsk bank i Norge. Beløpet følger av finansforetaksloven.",
  },
  {
    id: "frikort-grense",
    navn: "Frikortgrense",
    kortNavn: "Frikortgrense",
    enhet: "kr",
    verdier: {
      2025: { verdi: 100_000, status: "vedtatt" },
      2026: { verdi: 100_000, status: "vedtatt" },
    },
    kilde: "https://www.skatteetaten.no/rettskilder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/",
    sistSjekket: SJEKKET,
    merknad:
      "Forskuddsutskrivingen 2026 og frikortsiden setter grensen til 100 000 kroner. 2025-kolonnen er satt likt. TODO: verifiser om 2025-grensen var en annen.",
  },
  {
    id: "frikort-trekk",
    navn: "Trekk over frikortgrensen uten skattekort",
    kortNavn: "Trekk over grensen",
    enhet: "%",
    verdier: {
      2025: { verdi: 50, status: "vedtatt" },
      2026: { verdi: 50, status: "vedtatt" },
    },
    kilde: "https://www.skatteetaten.no/presse/nyhetsrommet/sommerjobb-og-frikort-dette-ma-du-vite-/",
    sistSjekket: SJEKKET,
    merknad:
      "Skatteetaten, 8. juli 2026: uten ordinært skattekort trekkes 50 prosent av inntekten over frikortgrensen. 2025-kolonnen er satt likt.",
  },
  {
    id: "feriepenger-sats",
    navn: "Feriepenger, minstesats i ferieloven",
    kortNavn: "Feriepenger",
    enhet: "%",
    verdier: {
      2025: { verdi: 10.2, status: "vedtatt" },
      2026: { verdi: 10.2, status: "vedtatt" },
    },
    kilde: "https://lovdata.no/nav/lov/1988-04-29-21/kapIII/%C2%A710",
    sistSjekket: SJEKKET,
    merknad:
      "Ferieloven § 10: 10,2 prosent av feriepengegrunnlaget. Over 60 år med ekstraferie: 2,3 prosentpoeng mer, bare opp til 6 G. Tariffavtaler gir ofte 12 prosent.",
  },
  {
    id: "studielan-basis",
    navn: "Basislån, fulltidsstudent",
    kortNavn: "Basislån",
    enhet: "tekst",
    verdier: {
      2026: { verdi: "170 368 kr", status: "vedtatt" },
      2027: { verdi: "170 368 kr", status: "vedtatt" },
    },
    kilde: "https://lanekassen.no/nb-NO/presse-og-samfunnskontakt/nyheter/studere-til-hosten-2026/",
    sistSjekket: SJEKKET,
    merknad:
      "Studieåret 2026–2027, fulltid i høyere utdanning, elleve måneder. Ett beløp for studieåret, derfor samme tall i begge kolonner.",
  },
  {
    id: "utlan-belaning",
    navn: "Utlånsforskriften – maks belåningsgrad, nedbetalingslån",
    kortNavn: "Maks belåningsgrad",
    enhet: "%",
    verdier: {
      2025: { verdi: 90, status: "vedtatt" },
      2026: { verdi: 90, status: "vedtatt" },
    },
    kilde: "https://www.regjeringen.no/no/tema/okonomi-og-budsjett/finansmarkedene/utlansforskriften2/id3077676/",
    sistSjekket: SJEKKET,
    merknad: "Gjelder fra 31. desember 2024, fortsatt i 2026. Egenkapitalkravet er da 10 prosent.",
  },
  {
    id: "utlan-gjeld",
    navn: "Utlånsforskriften – maks gjeldsgrad",
    kortNavn: "Maks gjeldsgrad",
    enhet: "tekst",
    verdier: {
      2025: { verdi: "5 × inntekt", status: "vedtatt" },
      2026: { verdi: "5 × inntekt", status: "vedtatt" },
    },
    kilde: "https://www.regjeringen.no/no/tema/okonomi-og-budsjett/finansmarkedene/utlansforskriften2/id3077676/",
    sistSjekket: SJEKKET,
    merknad: "Samlet gjeld skal ikke overstige fem ganger årsinntekt.",
  },
  {
    id: "utlan-ramme",
    navn: "Utlånsforskriften – maks belåningsgrad, rammekreditt",
    kortNavn: "Rammekreditt",
    enhet: "%",
    verdier: {
      2025: { verdi: 60, status: "vedtatt" },
      2026: { verdi: 60, status: "vedtatt" },
    },
    kilde: "https://www.regjeringen.no/no/tema/okonomi-og-budsjett/finansmarkedene/utlansforskriften2/id3077676/",
    sistSjekket: SJEKKET,
    merknad: "Rammekreditt med pant i bolig.",
  },
  {
    id: "utlan-stress",
    navn: "Utlånsforskriften – renteøkning i stresstesten",
    kortNavn: "Rentestress",
    enhet: "tekst",
    verdier: {
      2025: { verdi: "3 prosentpoeng", status: "vedtatt" },
      2026: { verdi: "3 prosentpoeng", status: "vedtatt" },
    },
    kilde: "https://lovdata.no/dokument/SF/forskrift/2020-12-09-2648",
    sistSjekket: SJEKKET,
    merknad: "Utlånsforskriften § 5. Påslag på kundens samlede gjeld. Laveste rente som kan brukes, er en egen sats.",
  },
  {
    id: "utlan-gulv",
    navn: "Utlånsforskriften – laveste rente i stresstesten",
    kortNavn: "Rentegulv",
    enhet: "%",
    verdier: {
      2025: { verdi: 7, status: "vedtatt" },
      2026: { verdi: 7, status: "vedtatt" },
    },
    kilde: "https://lovdata.no/dokument/SF/forskrift/2020-12-09-2648",
    sistSjekket: SJEKKET,
    merknad: "Utlånsforskriften § 5. Banken skal uansett legge til grunn minst denne renta.",
  },
  {
    id: "pensjon-sats",
    navn: "Opptjening av inntektspensjon",
    kortNavn: "Pensjonsopptjening",
    enhet: "%",
    verdier: {
      2025: { verdi: 18.1, status: "vedtatt" },
      2026: { verdi: 18.1, status: "vedtatt" },
    },
    kilde: "https://lovdata.no/nav/folketrygdloven/kap20/%C2%A720-5",
    sistSjekket: SJEKKET,
    merknad:
      "Folketrygdloven § 20-5. Andel av pensjonsgivende inntekt opp til taket. Det er årets innskudd i beholdningen, ikke pensjonen som betales ut.",
  },
  {
    id: "pensjon-tak",
    navn: "Tak for inntekt som gir pensjonsopptjening",
    kortNavn: "Opptjeningstak",
    enhet: "tekst",
    verdier: {
      2025: { verdi: "7,1 G", status: "vedtatt" },
      2026: { verdi: "7,1 G", status: "vedtatt" },
    },
    kilde: "https://lovdata.no/nav/folketrygdloven/kap20/%C2%A720-5",
    sistSjekket: SJEKKET,
    merknad: "Folketrygdloven § 20-5. Gjennomsnittlig grunnbeløp i kalenderåret.",
  },
  {
    id: "otp-sats",
    navn: "Minstesats for obligatorisk tjenestepensjon",
    kortNavn: "OTP-sats",
    enhet: "%",
    verdier: {
      2025: { verdi: 2, status: "vedtatt" },
      2026: { verdi: 2, status: "vedtatt" },
    },
    kilde: "https://lovdata.no/dokument/NL/lov/2005-12-21-124/%C2%A74",
    sistSjekket: SJEKKET,
    merknad: "OTP-loven § 4. Av lønn opp til 12 G. Mange arbeidsgivere setter inn mer.",
  },
  {
    id: "otp-tak",
    navn: "Lønn som minstesatsen for OTP regnes av",
    kortNavn: "OTP-tak",
    enhet: "tekst",
    verdier: {
      2025: { verdi: "12 G", status: "vedtatt" },
      2026: { verdi: "12 G", status: "vedtatt" },
    },
    kilde: "https://lovdata.no/dokument/NL/lov/2005-12-21-124/%C2%A74",
    sistSjekket: SJEKKET,
    merknad: "Innskuddet skal minst være 2 prosent av lønn opp til 12 G.",
  },
  {
    id: "ips-tak",
    navn: "Maksimalt fradrag for individuell sparing til pensjon",
    kortNavn: "IPS-tak",
    enhet: "kr",
    verdier: {
      2025: { verdi: 15_000, status: "vedtatt" },
      2026: { verdi: 25_000, status: "vedtatt" },
    },
    kilde:
      "https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/arbeid-trygd-og-pensjon/pensjon-og-uforetrygd/ny-ordning-for-skattefavorisert-individuell-sparing-til-pensjon/",
    sistSjekket: SJEKKET,
    merknad:
      "Ordningen individuell sparing til pensjon, skatteloven § 6-47. Nye avtaler i gammel IPS kan ikke inngås. Samlet fradrag når begge brukes, følger dette taket.",
  },
];

/** Trinnskatt. Figuren bruker tallene. Tabellen på mobil viser dem ikke. */
const TRINN: { n: number; fra2025: number; fra2026: number; sats2025: number; sats2026: number }[] = [
  { n: 1, fra2025: 217_400, fra2026: 226_100, sats2025: 1.7, sats2026: 1.7 },
  { n: 2, fra2025: 306_050, fra2026: 318_300, sats2025: 4, sats2026: 4 },
  { n: 3, fra2025: 697_150, fra2026: 725_050, sats2025: 13.7, sats2026: 13.7 },
  { n: 4, fra2025: 942_400, fra2026: 980_100, sats2025: 16.7, sats2026: 16.8 },
  { n: 5, fra2025: 1_410_750, fra2026: 1_467_200, sats2025: 17.7, sats2026: 17.8 },
];

for (const trinn of TRINN) {
  satser.push(
    {
      id: `trinn-${trinn.n}-fra`,
      navn: `Trinnskatt trinn ${trinn.n}, inntekt over`,
      kortNavn: `Trinn ${trinn.n} fra`,
      enhet: "kr",
      verdier: {
        2025: { verdi: trinn.fra2025, status: "vedtatt" },
        2026: { verdi: trinn.fra2026, status: "vedtatt" },
      },
      kilde: `${SKATT}/satser/trinnskatt/?year=2026`,
      sistSjekket: SJEKKET,
      merknad: "2026 er også i Stortingets skattevedtak 18. desember 2025 nr. 2747 § 3-1.",
    },
    {
      id: `trinn-${trinn.n}-sats`,
      navn: `Trinnskatt trinn ${trinn.n}, sats`,
      kortNavn: `Trinn ${trinn.n} sats`,
      enhet: "%",
      verdier: {
        2025: { verdi: trinn.sats2025, status: "vedtatt" },
        2026: { verdi: trinn.sats2026, status: "vedtatt" },
      },
      kilde: `${SKATT}/satser/trinnskatt/?year=2026`,
      sistSjekket: SJEKKET,
    }
  );
}

const byId = new Map(satser.map((sats) => [sats.id, sats]));

export function getSats(id: string): Sats {
  const sats = byId.get(id);
  if (!sats) throw new Error(`Ukjent sats ${id}`);
  return sats;
}

export function yearsOf(sats: Sats): number[] {
  return Object.keys(sats.verdier)
    .map(Number)
    .sort((a, b) => a - b);
}

/** Siste år med status vedtatt. */
export function sisteVedtatteAr(sats: Sats): number {
  const vedtatt = yearsOf(sats).filter((year) => sats.verdier[year]?.status === "vedtatt");
  const siste = vedtatt[vedtatt.length - 1];
  if (siste === undefined) throw new Error(`Sats ${sats.id} mangler vedtatt år`);
  return siste;
}

/**
 * Kolonnene i tabellen: siste vedtatte år, og året etter hvis det finnes.
 * Ellers de to siste vedtatte årene.
 */
export function visningsar(sats: Sats): [number, number] {
  const years = yearsOf(sats);
  const siste = sisteVedtatteAr(sats);
  const neste = years.find((year) => year > siste);
  if (neste !== undefined) return [siste, neste];
  const vedtatt = years.filter((year) => sats.verdier[year]?.status === "vedtatt");
  const forrige = vedtatt[vedtatt.length - 2];
  if (forrige === undefined) throw new Error(`Sats ${sats.id} har bare ett år`);
  return [forrige, siste];
}

export function satsNumber(id: string, year?: number): number {
  const sats = getSats(id);
  const chosen = year ?? sisteVedtatteAr(sats);
  const entry = sats.verdier[chosen];
  if (!entry) throw new Error(`Sats ${id} mangler ${chosen}`);
  if (typeof entry.verdi === "number") return entry.verdi;
  const match = entry.verdi.replace(/\s/g, "").replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  if (!match) throw new Error(`Sats ${id} har ikke et tall`);
  return Number(match[0]);
}

function formatTall(value: number, digits: number): string {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatVerdi(verdi: number | string, enhet: SatsEnhet): string {
  if (enhet === "tekst") {
    if (typeof verdi === "number") {
      const rounded = Math.round(verdi * 100) / 100;
      const digits = Number.isInteger(rounded) ? 0 : Number.isInteger(rounded * 10) ? 1 : 2;
      return formatTall(rounded, digits);
    }
    return verdi;
  }
  const n = typeof verdi === "number" ? verdi : Number(String(verdi).replace(",", "."));
  if (enhet === "kr") return `${formatTall(Math.round(n), 0)} kr`;
  if (enhet === "%") {
    const rounded = Math.round(n * 10) / 10;
    const digits = Number.isInteger(rounded) ? 0 : 1;
    return `${formatTall(rounded, digits)} %`;
  }
  if (enhet === "mrd. kr") {
    const rounded = Math.round(n * 10) / 10;
    const digits = Number.isInteger(rounded) ? 0 : 1;
    return `${formatTall(rounded, digits)} mrd. kr`;
  }
  return `${formatTall(Math.round(n), 0)} G`;
}

/** Verdien for siste vedtatte år, med årstall. «27 500 kr (2026)». */
export function formatSatsInline(id: string): string {
  const sats = getSats(id);
  const year = sisteVedtatteAr(sats);
  const entry = sats.verdier[year];
  if (!entry) throw new Error(`Sats ${id} mangler ${year}`);
  return `${formatVerdi(entry.verdi, sats.enhet)} (${year})`;
}

export function formatSjekket(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function kildeNavn(url: string): string {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
  if (host.endsWith("skatteetaten.no")) return "Skatteetaten";
  if (host.endsWith("nav.no")) return "NAV";
  if (host.endsWith("regjeringen.no")) return "regjeringen.no";
  if (host.endsWith("bankenessikringsfond.no")) return "Bankenes sikringsfond";
  if (host.endsWith("lovdata.no")) return "Lovdata";
  if (host.endsWith("norges-bank.no")) return "Norges Bank";
  if (host.endsWith("ssb.no")) return "SSB";
  if (host.endsWith("finanstilsynet.no")) return "Finanstilsynet";
  if (host.endsWith("lanekassen.no")) return "Lånekassen";
  return host;
}

/** Trinnene for ett år, slik figuren regner. Satsen er en andel, ikke prosent. */
export function trinnsteg(year?: number): { from: number; rate: number }[] {
  const chosen = year ?? sisteVedtatteAr(getSats("trinn-1-fra"));
  return [1, 2, 3, 4, 5].map((n) => ({
    from: satsNumber(`trinn-${n}-fra`, chosen),
    rate: satsNumber(`trinn-${n}-sats`, chosen) / 100,
  }));
}

function assertSatser() {
  const ids = new Set<string>();
  for (const sats of satser) {
    if (ids.has(sats.id)) throw new Error(`Dobbel sats-id ${sats.id}`);
    ids.add(sats.id);
    if (!sats.kortNavn || sats.kortNavn.length > 22) {
      throw new Error(`kortNavn for ${sats.id} er «${sats.kortNavn}»`);
    }
    if (!/^https?:\/\//.test(sats.kilde)) throw new Error(`Kilde mangler for ${sats.id}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sats.sistSjekket)) {
      throw new Error(`sistSjekket for ${sats.id}`);
    }
    const years = yearsOf(sats);
    if (years.length !== 2) throw new Error(`Sats ${sats.id} skal ha to år`);
    visningsar(sats);
    const checked = new Date(sats.sistSjekket + "T12:00:00");
    const age = Date.now() - checked.getTime();
    if (age > 366 * 24 * 60 * 60 * 1000) {
      console.warn(`Sats ${sats.id} er sjekket ${sats.sistSjekket}, eldre enn 12 måneder.`);
    }
  }
}

assertSatser();
