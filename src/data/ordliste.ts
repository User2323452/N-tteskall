/**
 * Fagord som kan merkes i teksten med [[id]] eller [[id|vist tekst]].
 * `kort` er forklaringen i kortet. Den brukes også når ordet er et konsept.
 */

export type Ord = {
  id: string;
  term: string;
  /** 1–2 setninger, maks 200 tegn. */
  kort: string;
  /** Settes når ordet også er et konsept. */
  konseptId?: string;
};

export const ordliste: Ord[] = [
  {
    id: "operativt-mal",
    term: "operativt mål",
    kort: "Målet som brukes i det daglige arbeidet. Det er et praktisk mål, ikke et krav om at tallet treffer hver eneste måned.",
    konseptId: "inflasjonsmal",
  },
  {
    id: "finansielle-ubalanser",
    term: "finansielle ubalanser",
    kort: "Gjeld og boligpriser som vokser for fort, slik at økonomien kan falle brått senere.",
  },
  {
    id: "likviditet",
    term: "likviditet",
    kort: "Hvor lett det er å få tak i penger. Når tilgangen er god, er det lett å låne eller betale.",
  },
  {
    id: "prosentpoeng",
    term: "prosentpoeng",
    kort: "Forskjellen mellom to prosenttall. Fra 2 prosent til 3 prosent er ett prosentpoeng, ikke «én prosent mer».",
  },
  {
    id: "foliorente",
    term: "foliorente",
    kort: "Renta bankene får på penger de setter inn i Norges Bank. Styringsrenten er denne renta.",
    konseptId: "styringsrenten",
  },
  {
    id: "kvote",
    term: "kvote",
    kort: "Et tak for hvor mye som gjelder til en gitt pris. Over taket kan prisen være en annen.",
  },
  {
    id: "overheng",
    term: "overheng",
    kort: "Lønnsøkning fra i fjor som først slår fullt inn i år, fordi den kom et stykke ut i fjor.",
  },
  {
    id: "ter",
    term: "TER",
    kort: "Årlig kostnad i et fond, oppgitt i prosent av sparingen. Den trekkes fra avkastningen hvert år.",
    konseptId: "kostnader-i-fond",
  },
  {
    id: "palydende",
    term: "pålydende",
    kort: "Beløpet som står på lånepapiret. Det er ikke alltid det samme som prisen du betaler i dag.",
  },
  {
    id: "kupong",
    term: "kupong",
    kort: "Den faste utbetalingen som er avtalt på forhånd, ofte en eller to ganger i året.",
    konseptId: "kupongrente",
  },
  {
    id: "diskonteringsrente",
    term: "diskonteringsrente",
    kort: "Renten du bruker når du regner om et beløp i fremtiden til hva det er verdt i dag.",
  },
  {
    id: "bokfort-egenkapital",
    term: "bokført egenkapital",
    kort: "Det selskapet eier minus det det skylder, slik det står i regnskapet. Ikke det aksjene koster på børs.",
  },
  {
    id: "netto-gjeld",
    term: "netto gjeld",
    kort: "Gjeld minus penger på konto. Det som står igjen av det som skyldes.",
  },
  {
    id: "ebitda",
    term: "EBITDA",
    kort: "Et overskudd før renter, skatt og verdifall på utstyr er trukket fra. Bokstavene er engelsk for det.",
  },
  {
    id: "risikovektede-eiendeler",
    term: "risikovektede eiendeler",
    kort: "Eiendeler der et trygt lån teller mindre enn et lån med større sjanse for tap.",
  },
  {
    id: "terminalverdi",
    term: "terminalverdi",
    kort: "Verdien du setter på noe etter årene du har regnet på, for eksempel et selskap etter prognosen.",
  },
  {
    id: "aksjonarmodellen",
    term: "aksjonærmodellen",
    kort: "Reglene for hvor mye skatt du betaler av utbytte og gevinst når du eier aksjer privat.",
  },
  {
    id: "skattepliktig",
    term: "skattepliktig",
    kort: "Den delen du skal betale skatt av. Noe kan være fritatt, og da teller det ikke med.",
  },
  {
    id: "fradrag",
    term: "fradrag",
    kort: "Et beløp du trekker fra før skatten regnes, slik at du betaler skatt av et lavere beløp.",
  },
  {
    id: "alminnelig-inntekt",
    term: "alminnelig inntekt",
    kort: "Inntekt etter at fradrag er trukket fra. Den skattlegges med én flat sats.",
    konseptId: "alminnelig-inntekt",
  },
  {
    id: "personinntekt",
    term: "personinntekt",
    kort: "Lønn og ytelser som erstatter lønn, som trygd. Skatten på denne stiger i trinn når inntekten blir høyere.",
  },
  {
    id: "grunnbelopet",
    term: "grunnbeløpet (G)",
    kort: "Beløpet mange utbetalinger fra folketrygden regnes ut fra. Det oppdateres 1. mai hvert år.",
    konseptId: "grunnbelop",
  },
  {
    id: "egenkapital",
    term: "egenkapital",
    kort: "Pengene du stiller med selv. I et boligkjøp er det den delen av prisen du ikke låner.",
    konseptId: "egenkapital",
  },
  {
    id: "belaningsgrad",
    term: "belåningsgrad",
    kort: "Lånet delt på boligens verdi. Høy grad betyr at du har lånt en stor del av prisen.",
    konseptId: "belaningsgrad",
  },
  {
    id: "nominell",
    term: "nominell",
    kort: "Tallet før prisvekst er trukket fra. Nominell lønn er kronene på lønnsslippen.",
  },
  {
    id: "reell",
    term: "reell",
    kort: "Tallet etter at prisvekst er trukket fra. Det sier hva pengene faktisk rekker til.",
  },
];

const byId = new Map(ordliste.map((ord) => [ord.id, ord]));

export function getOrd(id: string): Ord | undefined {
  return byId.get(id);
}
