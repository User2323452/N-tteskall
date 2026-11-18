import type { Concept, LearningPath, Lesson } from "@/types/learning";

/** Kuraterte begreper — korte, korrekte definisjoner på bokmål. */
export const concepts: Concept[] = [
  {
    id: "styringsrenten",
    term: "Styringsrenten",
    english: "Policy rate",
    category: "makro",
    definition:
      "Renta bankene får på innskudd i Norges Bank — hovedverktøyet for å styre inflasjonen.",
    explanation:
      "Når Norges Bank hever styringsrenten, blir det dyrere for bankene å låne og mer attraktivt å plassere penger i sentralbanken. Bankene hever vanligvis utlåns- og innskuddsrenter. Det demper etterspørsel og presser inflasjonen ned over tid. Motsatt når styringsrenten senkes.",
    tip: "Tenk «pris på penger» i banksystemet — ikke boliglånsrenta direkte, men den som trekker boliglånsrenta med seg.",
    relatedIds: ["inflasjon", "rentebanen", "nibor"],
  },
  {
    id: "inflasjon",
    term: "Inflasjon",
    english: "Inflation",
    category: "makro",
    definition:
      "Vedvarende oppgang i det generelle prisnivået — pengene kjøper mindre over tid.",
    explanation:
      "I Norge måles inflasjon blant annet med konsumprisindeksen (KPI). Norges Banks mål er at inflasjonen over tid skal være nær 2 prosent. Høy inflasjon svekker kjøpekraft; for lav inflasjon eller deflasjon kan hemme økonomien. Pengepolitikken brukes for å holde inflasjonen stabil.",
    tip: "Skill nominell lønn (tallet på lønnsslippen) fra reell lønn (hva du faktisk får kjøpt).",
    relatedIds: ["styringsrenten", "kjopkraft"],
  },
  {
    id: "kjopkraft",
    term: "Kjøpekraft",
    english: "Purchasing power",
    category: "makro",
    definition:
      "Hvor mye varer og tjenester du får for en gitt mengde penger.",
    explanation:
      "Hvis prisene stiger raskere enn inntekten din, faller kjøpekraften. Inflasjonsjusterte (reelle) størrelser brukes for å sammenligne over tid. For husholdninger merkes kjøpekraft særlig i mat, energi, husleie og renter.",
    relatedIds: ["inflasjon"],
  },
  {
    id: "rentebanen",
    term: "Rentebanen",
    english: "Policy rate path",
    category: "makro",
    definition:
      "Norges Banks prognose for styringsrenten framover, publisert i Pengepolitisk rapport.",
    explanation:
      "Rentebanen er ikke et løfte, men et anslag gitt dagens informasjon. Markedet og bankene bruker den til å danne forventninger. Når Norges Bank endrer rentebanen, påvirkes ofte lengre renter og kronekursen selv om styringsrenten i dag står stille.",
    relatedIds: ["styringsrenten", "inflasjon"],
  },
  {
    id: "handlingsregelen",
    term: "Handlingsregelen",
    english: "Fiscal rule",
    category: "makro",
    definition:
      "Retningslinje for hvor mye av Oljefondet staten kan bruke over statsbudsjettet hvert år.",
    explanation:
      "Handlingsregelen sier at den forventede realavkastningen av Statens pensjonsfond utland (ofte omtalt rundt 3 prosent) skal styre bruken over tid. Målet er å jevne ut oljeinntekter, unngå å bruke opp fondet, og skjerme fastlandsøkonomien mot store svingninger.",
    tip: "Pengepolitikk (Norges Bank) og finanspolitikk (statsbudsjettet/handlingsregelen) er to ulike verktøy.",
    relatedIds: ["oljefondet"],
  },
  {
    id: "oljefondet",
    term: "Oljefondet",
    english: "Government Pension Fund Global",
    category: "makro",
    definition:
      "Statens pensjonsfond utland — Norges sparefond investert i utlandet.",
    explanation:
      "Fondet eier aksjer, obligasjoner og eiendom utenfor Norge. Inntekter fra olje og gass settes inn; uttak styres av handlingsregelen via statsbudsjettet. Fondet skal komme kommende generasjoner til gode og er investert globalt for å spre risiko.",
    relatedIds: ["handlingsregelen"],
  },
  {
    id: "nibor",
    term: "NIBOR",
    english: "Norwegian Interbank Offered Rate",
    category: "marked",
    definition:
      "Pengemarkedsrente: hva bankene oppgir at de kan låne til hverandre for.",
    explanation:
      "Mange lån, obligasjoner og rentederivater er knyttet til NIBOR (eller påslag over NIBOR). Den ligger vanligvis nær styringsrenten, men kan avvike ved uro i pengemarkedet. Norge er i ferd med å fase inn andre referanserenter, blant annet NOWA.",
    relatedIds: ["styringsrenten", "nowa"],
  },
  {
    id: "nowa",
    term: "NOWA",
    english: "Norwegian Overnight Weighted Average",
    category: "marked",
    definition:
      "Norsk overnattenrente basert på faktiske transaksjoner — ny referanserente.",
    explanation:
      "NOWA er et vektet snitt av faktiske dag-til-dag-lån mellom banker. Den brukes mer som referanse etter hvert som markedet går bort fra panelbaserte renter som NIBOR. For deg som lærer: husk at «referanserente» er bakgrunnen mange kontrakter prises fra.",
    relatedIds: ["nibor", "styringsrenten"],
  },
  {
    id: "renters-rente",
    term: "Renters rente",
    english: "Compound interest",
    category: "personlig",
    definition:
      "Avkastning på tidligere avkastning — beløpet vokser eksponentielt over tid.",
    explanation:
      "Hvis du sparer 10 000 kr til 5 % årlig, får du 500 kr første år. Neste år får du rente også på de 500 kronene. Jo tidligere du starter, jo mer gjør tiden jobben. Det er grunnen til at jevn sparing tidlig ofte slår «vent til jeg har mer».",
    tip: "Formelidé: sluttverdi ≈ start × (1 + r)^n, der n er antall år.",
    relatedIds: ["ask", "risiko-avkastning"],
  },
  {
    id: "ask",
    term: "Aksjesparekonto (ASK)",
    english: "Share savings account",
    category: "personlig",
    definition:
      "Konto for aksjer og aksjefond der du kan bytte verdipapirer uten å skatte av gevinst underveis.",
    explanation:
      "På ASK utsettes skatt på gevinst til du tar penger ut av kontoen (utover innskutt beløp). Du kan altså rebalansere og bytte fond inne på kontoen uten at det utløser skatt hver gang. Utbytte og gevinst beskattes etter reglene for aksjeinntekt når du tar ut gevinst. Egnet for langsiktig aksjesparing for privatpersoner.",
    tip: "Innskutt beløp kan tas ut skattefritt; det er gevinsten som skattlegges ved uttak.",
    relatedIds: ["renters-rente", "skjermingsfradrag"],
  },
  {
    id: "skjermingsfradrag",
    term: "Skjermingsfradrag",
    english: "Risk-free allowance / shielding deduction",
    category: "personlig",
    definition:
      "Et fradrag som skjermer en risikofri del av aksjeavkastningen fra utbytteskatt.",
    explanation:
      "Skjermingsfradraget beregnes ut fra skjermingsgrunnlaget (typisk kostpris/innskudd) ganget med en skjermingsrente satt av Skatteetaten. Fradraget reduserer skattepliktig gevinst/utbytte og kan fremføres hvis det ikke brukes. På ASK håndteres mye av dette inne i kontoen.",
    relatedIds: ["ask"],
  },
  {
    id: "risiko-avkastning",
    term: "Risiko og avkastning",
    english: "Risk and return",
    category: "marked",
    definition:
      "Høyere forventet avkastning krever vanligvis at du tåler større svingninger.",
    explanation:
      "Bankinnskudd har lav risiko og lav forventet avkastning. Aksjer har høyere forventet avkastning over lange perioder, men kan falle kraftig på kort sikt. Diversifisering (spre investeringene) reduserer selskapsspesifikk risiko, men ikke markedsrisiko. Velg risiko etter tidshorisont og hva du tåler å se falle.",
    relatedIds: ["renters-rente", "diversifisering"],
  },
  {
    id: "diversifisering",
    term: "Diversifisering",
    english: "Diversification",
    category: "marked",
    definition:
      "Å spre investeringene slik at ett enkelt utfall ikke ødelegger hele porteføljen.",
    explanation:
      "Ved å eie mange selskaper, sektorer eller land reduserer du risikoen knyttet til én enkelt aksje. Et bredt aksjefond er en praktisk måte å diversifisere på. Diversifisering fjerner ikke at hele markedet kan falle, men demper «én dårlig nyhet»-risiko.",
    relatedIds: ["risiko-avkastning"],
  },
  {
    id: "otp",
    term: "Obligatorisk tjenestepensjon (OTP)",
    english: "Mandatory occupational pension",
    category: "personlig",
    definition:
      "Pensjonssparing arbeidsgiveren er pålagt å gjøre for deg, i tillegg til folketrygden.",
    explanation:
      "De fleste arbeidstakere i privat sektor har innskuddspensjon via OTP. Arbeidsgiver betaler en prosent av lønn inn på en pensjonskonto. Sammen med folketrygd (og eventuelt AFP) utgjør dette pensjonsgrunnlaget ditt. Sjekk pensjon.no eller arbeidsgivers portal for oversikt.",
    relatedIds: ["ips", "afp"],
  },
  {
    id: "ips",
    term: "Individuell pensjonssparing (IPS)",
    english: "Individual pension savings",
    category: "personlig",
    definition:
      "Privat pensjonssparing med skattefordel — pengene er i hovedsak låst til pensjonsalder.",
    explanation:
      "Med IPS kan du få fradrag i alminnelig inntekt for innskudd innenfor et årlig tak. Midlene er bundet, og uttak beskattes som alminnelig inntekt. IPS kan være aktuelt hvis du allerede sparer til buffer og langsiktige mål, og vil ha ekstra pensjonssparing med skatteutsettelse/fradrag.",
    relatedIds: ["otp"],
  },
  {
    id: "afp",
    term: "AFP",
    english: "Contractual early retirement pension",
    category: "personlig",
    definition:
      "Avtalefestet pensjon — livsvarig tillegg for mange med tariffavtale.",
    explanation:
      "AFP er et tillegg til folketrygden for ansatte i virksomheter tilknyttet ordningen (offentlig og deler av privat sektor). Vilkår om ansiennitet og medlemskap gjelder. AFP er verdifull — sjekk om arbeidsgiveren din er med før du bytter jobb sent i karrieren.",
    relatedIds: ["otp"],
  },
  {
    id: "belaningsgrad",
    term: "Belåningsgrad",
    english: "Loan-to-value (LTV)",
    category: "personlig",
    definition: "Boliglånet delt på boligens markedsverdi.",
    explanation:
      "Belåningsgrad 85 % betyr at lånet er 85 % av boligverdien og egenkapitalen 15 %. Høy belåningsgrad gir ofte høyere rente og krav om tilleggssikkerhet. Utlånsforskriften setter rammer for hvor høy belåningsgrad bankene normalt kan tilby.",
    relatedIds: ["utlansforskriften"],
  },
  {
    id: "utlansforskriften",
    term: "Utlånsforskriften",
    english: "Lending regulation",
    category: "personlig",
    definition:
      "Statlige krav til bankenes utlån — blant annet egenkapital, gjeldsgrad og stresstest.",
    explanation:
      "Forskriften skal dempe risikoen for at husholdninger tar opp mer gjeld enn de tåler. Typiske elementer: krav til egenkapital ved boligkjøp, tak på samlet gjeld i forhold til inntekt, og at du skal tåle en renteøkning. Bankene kan ha egne, strengere regler.",
    relatedIds: ["belaningsgrad"],
  },
];

export const lessons: Lesson[] = [
  // —— Path: norsk-pengepolitikk ——
  {
    id: "pp-1",
    pathId: "norsk-pengepolitikk",
    title: "Hva er pengepolitikk?",
    order: 0,
    summary: "Hvem styrer renta, og hvorfor?",
    body: [
      "Pengepolitikk handler om hvordan Norges Bank bruker renta og andre verktøy for å holde prisveksten stabil og bidra til høy sysselsetting.",
      "I Norge er målet at inflasjonen over tid skal være nær 2 prosent. Når prisene stiger for raskt, strammes politikken inn (høyere rente). Når aktiviteten er svak og inflasjonen lav, kan renta settes ned.",
      "Du trenger ikke huske alle modellene — husk rollene: Norges Bank setter styringsrenten; bankene og markedet overfører effekten til boliglån, bedriftslån og krona.",
    ],
    conceptIds: ["styringsrenten", "inflasjon"],
  },
  {
    id: "pp-2",
    pathId: "norsk-pengepolitikk",
    title: "Inflasjon og kjøpekraft",
    order: 1,
    summary: "Hvorfor 2 prosent er et mål — ikke «null».",
    body: [
      "Inflasjon er vedvarende oppgang i det generelle prisnivået. Litt inflasjon er normalt i en voksende økonomi; problemet oppstår når den blir høy og uforutsigbar.",
      "Kjøpekraft forteller hva lønna di faktisk er verdt. Hvis prisene stiger raskere enn lønna, blir du fattigere i praksis selv om tallet på lønnsslippen er det samme.",
      "Norges Bank ser på flere indikatorer (blant annet KPI og KPI justert for avgifter og energi). For deg som lærer: skill alltid mellom nominelle og reelle størrelser.",
    ],
    conceptIds: ["inflasjon", "kjopkraft"],
    quiz: {
      question: "Hva er Norges Banks inflasjonsmål over tid?",
      options: ["0 %", "Nær 2 %", "5 %", "Lik lønnsveksten hvert år"],
      answerIndex: 1,
      explain:
        "Målet er at inflasjonen skal være nær 2 prosent over tid — stabil, ikke null.",
    },
  },
  {
    id: "pp-3",
    pathId: "norsk-pengepolitikk",
    title: "Styringsrenten i praksis",
    order: 2,
    summary: "Fra sentralbank til boliglånet ditt.",
    body: [
      "Styringsrenten er renta på bankenes innskudd i Norges Bank. Den er ankeret for de korte pengemarkedsrentene.",
      "Når styringsrenten heves, blir det dyrere å låne og mer lønnsomt å spare. Husholdninger og bedrifter bruker ofte mindre — etterspørselen dempes, og inflasjonspresset avtar med tid.",
      "Effekten er ikke øyeblikkelig. Boliglånsrenter, kronekurs og forventninger spiller inn. Derfor kommuniserer Norges Bank også hva de tror om framtiden.",
    ],
    conceptIds: ["styringsrenten", "nibor", "nowa"],
  },
  {
    id: "pp-4",
    pathId: "norsk-pengepolitikk",
    title: "Rentebanen",
    order: 3,
    summary: "Prognose — ikke løfte.",
    body: [
      "I Pengepolitisk rapport publiserer Norges Bank en rentebane: et anslag på styringsrenten framover gitt den informasjonen de har nå.",
      "Markedet reagerer ofte mer på endringer i rentebanen enn på dagens rente alene. Hvis banen legges høyere, prises det inn strammere politikk framover.",
      "Husk: ny informasjon (inflasjon, arbeidsmarked, krone) kan endre banen neste gang. Den er et arbeidsverktøy, ikke en kontrakt.",
    ],
    conceptIds: ["rentebanen", "styringsrenten"],
    quiz: {
      question: "Hva er rentebanen?",
      options: [
        "Et lovfestet tak på boliglånsrenta",
        "Norges Banks prognose for styringsrenten framover",
        "Gjennomsnittlig NIBOR siste år",
        "Renta på sparekonto i DNB",
      ],
      answerIndex: 1,
      explain:
        "Rentebanen er Norges Banks anslag på styringsrenten framover, ikke et løfte eller et boliglånstak.",
    },
  },
  {
    id: "pp-5",
    pathId: "norsk-pengepolitikk",
    title: "Oljefondet og handlingsregelen",
    order: 4,
    summary: "Finanspolitikk — det andre store verktøyet.",
    body: [
      "Oljefondet (Statens pensjonsfond utland) er Norges sparefond investert i utlandet. Det skiller oljeformuen fra den løpende statsøkonomien.",
      "Handlingsregelen styrer hvor mye av fondet som kan brukes over statsbudsjettet over tid — i tråd med forventet realavkastning. Poenget er jevn bruk og at fondet skal vare.",
      "Pengepolitikk (rente) og finanspolitikk (budsjett/oljepenger) er ulike spor. Når du leser nyheter: spør «er dette Norges Bank eller statsbudsjettet?»",
    ],
    conceptIds: ["oljefondet", "handlingsregelen"],
  },
  {
    id: "pp-6",
    pathId: "norsk-pengepolitikk",
    title: "Oppsummering",
    order: 5,
    summary: "Sett sammen bildet.",
    body: [
      "Du har nå kjernen: inflasjonsmål → styringsrente → gjennomslag i markedet → rentebanen som forventningsstyring. Ved siden ligger oljefondet og handlingsregelen som finanspolitisk ramme.",
      "Neste steg: åpne begrepene under, test deg selv, og bruk «Repeter» senere så definisjonene setter seg.",
    ],
    conceptIds: [
      "styringsrenten",
      "inflasjon",
      "rentebanen",
      "handlingsregelen",
      "oljefondet",
    ],
    quiz: {
      question:
        "Hvilken institusjon har hovedansvaret for styringsrenten i Norge?",
      options: [
        "Finansdepartementet",
        "Norges Bank",
        "Finanstilsynet",
        "Oslo Børs",
      ],
      answerIndex: 1,
      explain: "Norges Bank setter styringsrenten som ledd i pengepolitikken.",
    },
  },

  // —— Path: personlig-sparing ——
  {
    id: "ps-1",
    pathId: "personlig-sparing",
    title: "Hvorfor spare systematisk?",
    order: 0,
    summary: "Buffer, mål og pensjon — tre lag.",
    body: [
      "Personlig økonomi blir enklere når du skiller: (1) buffer til uforutsett, (2) sparing til konkrete mål, (3) langsiktig pensjon/formue.",
      "Buffer bør stå trygt og tilgjengelig. Langsiktig sparing kan tåle mer svingninger fordi du har tid til å hente inn fall.",
      "Du trenger ikke «slå markedet». Du trenger en plan du faktisk følger.",
    ],
    conceptIds: ["risiko-avkastning"],
  },
  {
    id: "ps-2",
    pathId: "personlig-sparing",
    title: "Renters rente",
    order: 1,
    summary: "Tid er den sterkeste faktoren.",
    body: [
      "Renters rente betyr at du får avkastning på tidligere avkastning. Små, jevne beløp tidlig kan slå store beløp sent.",
      "Eksempelidé: beløp som vokser med fast prosent hvert år følger (1 + r)^n. Doblingstiden er omtrent 72 / (rente i prosent) — en tommelfingerregel, ikke en lov.",
      "Praktisk råd: automatiser sparing den dagen lønna kommer, før resten av kontoen «forsvinner».",
    ],
    conceptIds: ["renters-rente"],
    quiz: {
      question: "Hva beskriver renters rente best?",
      options: [
        "Kun renta banken tar på boliglån",
        "At du får avkastning også på tidligere avkastning",
        "At skatten alltid er null på aksjer",
        "At inflasjonen er null",
      ],
      answerIndex: 1,
      explain:
        "Renters rente er avkastning på avkastning — derfor vokser beløpet raskere jo lenger tidshorisonten er.",
    },
  },
  {
    id: "ps-3",
    pathId: "personlig-sparing",
    title: "Risiko og avkastning",
    order: 2,
    summary: "Hva du tåler å se falle.",
    body: [
      "Forventet avkastning og risiko henger sammen. Aksjer har historisk gitt høyere avkastning enn bankinnskudd over lange perioder — med større svingninger underveis.",
      "Diversifisering (for eksempel et bredt fond) reduserer risikoen for at ett selskap ødelegger sparingen. Det fjerner ikke markedsfall.",
      "Velg risiko etter tidshorisont: penger du trenger om ett år bør ikke ligge som om du har tjue.",
    ],
    conceptIds: ["risiko-avkastning", "diversifisering"],
  },
  {
    id: "ps-4",
    pathId: "personlig-sparing",
    title: "Aksjesparekonto (ASK)",
    order: 3,
    summary: "Bytt fond uten å skatte for hver handel.",
    body: [
      "ASK er laget for privat aksje- og aksjefondssparing. Du kan selge og kjøpe inne på kontoen uten at gevinst skattlegges ved hver handel.",
      "Skatt på gevinst utløses når du tar ut mer enn innskutt beløp. Det gjør det enklere å rebalansere og holde en langsiktig plan.",
      "ASK erstatter ikke bufferkontoen din — den er for penger som skal jobbe over tid.",
    ],
    conceptIds: ["ask", "skjermingsfradrag"],
    quiz: {
      question: "Når skattlegges typisk gevinst på en aksjesparekonto?",
      options: [
        "Ved hver handel inne på kontoen",
        "Når du tar ut gevinst utover innskutt beløp",
        "Aldri",
        "Bare hvis du eier utenlandske aksjer",
      ],
      answerIndex: 1,
      explain:
        "Du kan bytte verdipapirer inne på ASK; skatt på gevinst knyttes til uttak av gevinst.",
    },
  },
  {
    id: "ps-5",
    pathId: "personlig-sparing",
    title: "Pensjon i korte trekk",
    order: 4,
    summary: "Folketrygd, OTP og eventuelt AFP/IPS.",
    body: [
      "Pensjonen din er vanligvis et puslespill: folketrygd + tjenestepensjon (OTP) + eventuelt AFP + egen sparing (f.eks. IPS eller ASK).",
      "OTP er arbeidsgivers obligatoriske sparing. AFP er et verdifullt tillegg hvis du er omfattet av tariffavtale. IPS er frivillig sparing med egne skatteregler og binding.",
      "Du trenger ikke optimalisere alt i dag — men du bør vite hvilke brikker du har.",
    ],
    conceptIds: ["otp", "ips", "afp"],
  },
  {
    id: "ps-6",
    pathId: "personlig-sparing",
    title: "Oppsummering",
    order: 5,
    summary: "En enkel rekkefølge du kan huske.",
    body: [
      "1) Bygg buffer. 2) Automatiser sparing. 3) La renters rente og tid jobbe. 4) Bruk ASK til langsiktig aksjesparing. 5) Kjenn pensjonsbrikkene dine.",
      "Repeter begrepene til du kan forklare dem uten å titte — det er målet, ikke å huske årstall.",
    ],
    conceptIds: ["renters-rente", "ask", "risiko-avkastning", "otp"],
  },
];

export const learningPaths: LearningPath[] = [
  {
    id: "norsk-pengepolitikk",
    title: "Norsk pengepolitikk",
    subtitle:
      "Styringsrente, inflasjon, rentebanen og oljefondets handlingsregel.",
    category: "makro",
    estimatedMinutes: 25,
    lessonIds: ["pp-1", "pp-2", "pp-3", "pp-4", "pp-5", "pp-6"],
  },
  {
    id: "personlig-sparing",
    title: "Personlig sparing",
    subtitle: "Renters rente, risiko, ASK og pensjon — uten jargon-jungel.",
    category: "personlig",
    estimatedMinutes: 25,
    lessonIds: ["ps-1", "ps-2", "ps-3", "ps-4", "ps-5", "ps-6"],
  },
];

export function getPath(id: string): LearningPath | undefined {
  return learningPaths.find((p) => p.id === id);
}

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getLessonsForPath(pathId: string): Lesson[] {
  return lessons
    .filter((l) => l.pathId === pathId)
    .sort((a, b) => a.order - b.order);
}

export function getConcept(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

export function searchLearning(query: string): {
  concepts: Concept[];
  paths: LearningPath[];
  lessons: Lesson[];
} {
  const q = query.trim().toLowerCase();
  if (!q) return { concepts: [], paths: [], lessons: [] };

  const conceptHits = concepts.filter((c) => {
    const hay =
      `${c.term} ${c.english ?? ""} ${c.definition} ${c.explanation}`.toLowerCase();
    return hay.includes(q);
  });
  const pathHits = learningPaths.filter((p) => {
    const hay = `${p.title} ${p.subtitle}`.toLowerCase();
    return hay.includes(q);
  });
  const lessonHits = lessons.filter((l) => {
    const hay = `${l.title} ${l.summary} ${l.body.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
  return { concepts: conceptHits, paths: pathHits, lessons: lessonHits };
}

export const categoryLabel: Record<Concept["category"], string> = {
  makro: "Makro",
  marked: "Marked",
  bank: "Bank",
  personlig: "Personlig",
  metode: "Metode",
};
