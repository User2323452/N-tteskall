import { extraConcepts } from "@/data/concepts-extra";
import { ordliste } from "@/data/ordliste";
import { getSats } from "@/data/satser";
import { assertSatsRefs, hasMarkup, ordIdsIn, stripMarkup } from "@/lib/markup";
import type { Concept, LearningPath, Lesson } from "@/types/learning";

/** Kuraterte konsepter — korte, korrekte definisjoner på bokmål. */
const coreConcepts: Concept[] = [
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
    relatedIds: ["inflasjon", "rentebanen", "nibor", "renteniva"],
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
    relatedIds: ["styringsrenten", "kjopkraft", "deflasjon"],
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
    relatedIds: ["inflasjon", "reallonn"],
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
    category: "olje",
    definition:
      "Retningslinje for hvor mye av Oljefondet staten kan bruke over statsbudsjettet hvert år.",
    explanation:
      "Handlingsregelen sier at den forventede realavkastningen av Statens pensjonsfond utland, om lag 3 prosent over tid, skal styre bruken. Det er et anslag over tid. I normale år bør bruken ligge under 3 prosent, slik at uttaket over tid kan tilsvare 3 prosent når kriseår regnes med. Årets anslag står i tabellen under. Målet er å jevne ut oljeinntekter, unngå å bruke opp fondet, og skjerme fastlandsøkonomien mot store svingninger. Dette er finanspolitikk, vedtatt over statsbudsjettet — ikke et virkemiddel Norges Bank bruker når den setter styringsrenten.",
    tip: "3 prosent er forventet realavkastning over tid. Normal bruk ligger lavere.",
    satsIds: ["sou-mrd", "sou-pst"],
    relatedIds: ["oljefondet", "finanspolitikk", "strukturelt-underskudd", "realavkastning"],
  },
  {
    id: "oljefondet",
    term: "Oljefondet (SPU)",
    english: "Government Pension Fund Global",
    category: "olje",
    definition:
      "Statens pensjonsfond utland — Norges sparefond investert i utlandet.",
    explanation:
      "Fondet eier aksjer, obligasjoner og eiendom utenfor Norge. Inntekter fra olje og gass settes inn; uttak styres av handlingsregelen via statsbudsjettet. Fondet skal komme kommende generasjoner til gode og er investert globalt for å spre risiko.",
    relatedIds: ["handlingsregelen", "nbim", "finanspolitikk", "oljepris", "petroleumsinntekter"],
  },
  {
    id: "nibor",
    term: "NIBOR",
    english: "Norwegian Interbank Offered Rate",
    category: "marked",
    definition:
      "Daglig panelkvotering av renta bankene krever for usikrede kronelån med løpetid fra én uke til seks måneder.",
    explanation:
      "Mange lån, obligasjoner og rentederivater er knyttet til NIBOR (eller påslag over NIBOR). Den ligger vanligvis nær styringsrenten, men kan avvike ved uro i pengemarkedet. Norges Bank skrev i 2025 at NIBOR fortsatt er den klart mest brukte referanserenten. NOWA er anbefalt alternativ og en fallback hvis NIBOR skulle opphøre. De to måler ikke samme rente.",
    relatedIds: ["styringsrenten", "nowa"],
  },
  {
    id: "nowa",
    term: "NOWA",
    english: "Norwegian Overnight Weighted Average",
    category: "marked",
    definition:
      "Vektet snitt av faktiske usikrede overnattenlån. Anbefalt alternativ til NIBOR, og en fallback.",
    explanation:
      "NOWA har eksistert siden 2011 og ble lagt om i 2020. Norges Bank skrev i 2025 at den i liten grad brukes som referanse. Den er anbefalt alternativ og en fallback hvis NIBOR skulle opphøre. Markedet bruker fortsatt NIBOR. NIBOR er en panelkvotering fra én uke til seks måneder. NOWA er overnatt. De måler ikke samme rente.",
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
      "Et fradrag som skjermer en risikofri del av aksjeavkastningen fra skatt på både utbytte og gevinst.",
    explanation:
      "Skjermingsfradraget beregnes ut fra skjermingsgrunnlaget (typisk kostpris/innskudd) ganget med en skjermingsrente satt av Skatteetaten. Etter aksjonærmodellen reduserer fradraget både skattepliktig utbytte og skattepliktig gevinst, og det kan fremføres hvis det ikke brukes. På ASK håndteres mye av dette inne i kontoen. Der beregnes skjermingen av laveste innskuddssaldo i året.",
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
    relatedIds: ["risiko-avkastning", "korrelasjon"],
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
    english: "Contractual pension",
    category: "personlig",
    definition:
      "Avtalefestet pensjon. I privat sektor et livsvarig påslag. I offentlig sektor avhenger ordningen av årskull.",
    explanation:
      "I privat sektor er AFP i Fellesordningen et livsvarig påslag som kan tas ut fra 62 år. I offentlig sektor gjelder livsvarig AFP fra 2025 for årskull fra 1963. Eldre årskull har den gamle ordningen: tidligpensjon fra 62 til 67 år, som deretter faller bort. Vilkår om ansiennitet og medlemskap gjelder. AFP er verdifull — sjekk om arbeidsgiveren din er med før du bytter jobb sent i karrieren.",
    relatedIds: ["otp"],
  },
  {
    id: "belaningsgrad",
    term: "Belåningsgrad",
    english: "Loan-to-value (LTV)",
    category: "personlig",
    definition: "Boliglånet delt på boligens markedsverdi.",
    explanation:
      "Belåningsgrad er lånet delt på boligverdien. Høy belåningsgrad gir ofte høyere rente og krav om tilleggssikkerhet. For nedbetalingslån til bolig er grensen {{sats:utlan-belaning}}. Resten er egenkapital. Rammekreditt med pant i bolig har et eget tak på {{sats:utlan-ramme}}.",
    relatedIds: ["utlansforskriften"],
    satsIds: ["utlan-belaning", "utlan-ramme"],
  },
  {
    id: "utlansforskriften",
    term: "Utlånsforskriften",
    english: "Lending regulation",
    category: "personlig",
    definition:
      "Krav til bankenes utlån — ofte kalt boliglånsforskriften — om egenkapital, gjeldsgrad og stresstest.",
    explanation:
      "Forskriften, fastsatt av Finansdepartementet, skal dempe risikoen for at husholdninger tar opp mer gjeld enn de tåler. Den viderefører reglene fra boliglånsforskriften og gjelder boliglån og en del andre lån. Kravene går til egenkapital, samlet gjeld mot inntekt, og at lånet skal tåle en høyere rente. For nedbetalingslån er belåningsgraden høyst {{sats:utlan-belaning}}. Gjelden kan være inntil {{sats:utlan-gjeld}}. Rammekreditt med pant i bolig har et tak på {{sats:utlan-ramme}}. Bankene kan ha egne, strengere regler.",
    relatedIds: ["belaningsgrad", "egenkapital", "gjeldsgrad"],
    satsIds: ["utlan-belaning", "utlan-gjeld", "utlan-ramme"],
  },
];

export const concepts: Concept[] = [...coreConcepts, ...extraConcepts];

export const lessons: Lesson[] = [
  {
    id: "pp-1",
    pathId: "norsk-pengepolitikk",
    title: "Inflasjon og kjøpekraft",
    order: 0,
    summary: "Prisnivå, KPI og hva en krone faktisk rekker til.",
    body: [
      "Inflasjon er en vedvarende økning i det generelle prisnivået. Enkeltpriser hopper opp og ned hele tiden. Inflasjon handler om at prisene samlet sett stiger, slik at en krone rekker til mindre.",
      "SSB måler dette med konsumprisindeksen (KPI). Indeksen følger en handlekurv av varer og tjenester husholdningene kjøper. Når nyhetene sier at prisveksten er så og så høy, er det som regel tolvmånedersveksten i KPI.",
      "Kjøpekraft er hvor mye du får for pengene. [[nominell|Nominelle]] kroner er beløpet på konto eller lønnsslipp. [[reell|Reelt]] er det samme beløpet etter prisvekst. Stiger prisene raskere enn lønna, faller kjøpekraften.",
    ],
    conceptIds: ["inflasjon", "kpi", "kjopkraft"],
    quiz: {
      question: "Hva måler konsumprisindeksen (KPI)?",
      options: [
        "Prisutviklingen på husholdningenes varer og tjenester",
        "Avkastningen i pensjonsfondet",
        "Styringsrenten neste kvartal",
        "Bare strømprisen",
      ],
      answerIndex: 0,
      whyWrong: [
        "",
        "Pensjonsfondets avkastning er noe annet enn prisene husholdningene møter.",
        "Styringsrenten er Norges Banks rente, ikke det KPI måler.",
        "Strøm er med i handlekurven, men indeksen er bredere enn én pris.",
      ],
      explain:
        "KPI er SSBs indeks for prisene husholdningene møter. Energipriser er med i KPI, men indeksen er bredere enn strøm.",
    },
  },
  {
    id: "pp-2",
    pathId: "norsk-pengepolitikk",
    title: "Inflasjonsmålet",
    order: 1,
    summary: "Nær 2 prosent over tid — og fleksibelt.",
    body: [
      "Norges Bank har et [[operativt-mal|operativt mål]] om at konsumprisveksten skal ligge nær 2 prosent over tid. Tallet er et anker for forventningene. Det er ikke et krav om at KPI treffer 2 prosent hver eneste måned.",
      "Styringen er fleksibel. Banken legger også vekt på produksjon og sysselsetting, og styringen skal kunne motvirke oppbygging av [[finansielle-ubalanser|finansielle ubalanser]]. Den prøver ikke å presse inflasjonen tilbake på én måned hvis det ville gitt et unødvendig hopp i ledigheten.",
      "KPI-JAE er KPI uten energivarer og justert for avgiftsendringer. Den brukes ofte når man vil se den underliggende prisveksten, fordi strøm og avgifter svinger uten at det alltid sier noe om presset i økonomien.",
    ],
    conceptIds: ["inflasjonsmal", "fleksibel-inflasjonsstyring", "kpi-jae"],
    quiz: {
      question: "Hva ligger i fleksibel inflasjonsstyring?",
      options: [
        "Inflasjonen skal være null hver måned",
        "Styringsrenten er alltid lik boliglånsrenta",
        "Hensyn til inflasjon, aktivitet og sysselsetting, og finansielle ubalanser",
        "KPI-JAE er det eneste tallet som teller",
      ],
      answerIndex: 2,
      whyWrong: [
        "Målet er nær 2 prosent over tid, ikke null hver måned.",
        "Boliglånsrenta ligger normalt over styringsrenten. De er ikke like.",
        "",
        "KPI-JAE brukes for å se underliggende prisvekst. Den er ikke det eneste hensynet.",
      ],
      explain:
        "Fleksibel inflasjonsstyring veier inflasjon mot produksjon og sysselsetting, og skal kunne motvirke oppbygging av finansielle ubalanser. Horisonten er noen år.",
    },
  },
  {
    id: "pp-3",
    pathId: "norsk-pengepolitikk",
    title: "Styringsrenten",
    order: 2,
    summary: "Foliorenten — og hvorfor boliglånet ditt ligger høyere.",
    body: [
      "Styringsrenten er [[foliorente|foliorenten]]: renta bankene får på innskudd i Norges Bank, opp til en [[kvote]]. Det er hovedverktøyet i pengepolitikken.",
      "Pengepolitikk er styring av rente og [[likviditet]] i kronemarkedet. Når styringsrenten settes opp, blir det dyrere for bankene å finansiere seg, og utlånsrentene følger vanligvis etter. Sparing blir litt mer attraktivt, og nytt lån litt dyrere.",
      "Boliglånsrenta ligger normalt over styringsrenten. Banken har egne kostnader, påslag og risiko. Styringsrenten trekker boliglånsrenta med seg, men de to tallene er ikke like.",
    ],
    conceptIds: ["styringsrenten", "pengepolitikk"],
  },
  {
    id: "pp-4",
    pathId: "norsk-pengepolitikk",
    title: "Transmisjonskanalene",
    order: 3,
    summary: "Hvordan en renteendring når prisene.",
    body: [
      "En renteendring virker ikke direkte på prislappen i butikken. Den går gjennom flere kanaler. Det kalles transmisjonsmekanismen.",
      "Etterspørselskanalen: høyere rente demper forbruk og investering. Valutakurskanalen: høyere rente kan styrke krona, slik at importerte varer blir billigere i kroner — og omvendt når renta settes ned. Forventningskanalen: hvis husholdninger og bedrifter tror at inflasjonen holdes nær målet, setter det seg i lønns- og prisfastsetting.",
      "Figuren under er en forenklet kjede, en pedagogisk modell. Den er ikke en prognose for hva som skjer neste kvartal.",
    ],
    conceptIds: ["transmisjon"],
    visual: "transmisjon",
  },
  {
    id: "pp-5",
    pathId: "norsk-pengepolitikk",
    title: "Rentebanen og Pengepolitisk rapport",
    order: 4,
    summary: "Et anslag — ikke et løfte.",
    body: [
      "Rentebanen er Norges Banks prognose for styringsrenten de neste årene. Den oppdateres når ny informasjon kommer. Markedet reagerer ofte på endringen i banen, ikke bare på renta som gjelder i dag.",
      "Prognosen publiseres i Pengepolitisk rapport, flere ganger i året, sammen med vurderingen fra rentemøtet. Komiteen setter renta. Rapporten forklarer analysen.",
      "Usikkerheten er stor. Jo lenger fram i tid, jo videre er spennet. Banen er et arbeidsverktøy, ikke en kontrakt med boliglånskunden.",
    ],
    conceptIds: ["rentebanen", "ppr"],
    quiz: {
      question: "Hva er rentebanen?",
      options: [
        "Et lovfestet tak på boliglånsrenta",
        "Norges Banks prognose for styringsrenten framover",
        "Gjennomsnittlig NIBOR siste år",
        "Renta på en sparekonto",
      ],
      answerIndex: 1,
      whyWrong: [
        "Banen er et anslag, ikke et lovfestet tak på boliglånet.",
        "",
        "NIBOR er en markedsrente. Rentebanen er Norges Banks prognose.",
        "Sparekontoen er bankens rente til deg, ikke prognosen for styringsrenten.",
      ],
      explain:
        "Rentebanen er Norges Banks anslag, publisert i Pengepolitisk rapport. Den kan endres neste gang ny informasjon kommer.",
    },
  },
  {
    id: "pp-6",
    pathId: "norsk-pengepolitikk",
    title: "Avveiningen",
    order: 5,
    summary: "Inflasjon og aktivitet peker ikke alltid samme vei.",
    body: [
      "Fleksibel inflasjonsstyring er en avveining. Høy prisvekst og høy aktivitet taler for høyere rente. Stigende ledighet og inflasjon under målet taler for lavere rente. Forskrift for pengepolitikken § 3 sier i tillegg at styringen skal kunne motvirke oppbygging av [[finansielle-ubalanser|finansielle ubalanser]]. Ofte peker hensynene hver sin vei, og komiteen må veie dem over horisonten.",
      "Produksjonsgapet er et anslag på avviket mellom faktisk produksjon og det økonomien kan produsere uten at inflasjonspresset bygger seg opp. Positivt gap betyr press. Negativt gap betyr slakk.",
      "Renta treffer husholdningene særlig via boliglån, forbruk og kronekurs. Hvor mye som brukes over statsbudsjettet, er et annet spor.",
    ],
    conceptIds: ["fleksibel-inflasjonsstyring", "produksjonsgap"],
    quiz: {
      question: "Hvem setter styringsrenten i Norge?",
      options: [
        "Finansdepartementet",
        "Finanstilsynet",
        "Oslo Børs",
        "Norges Bank",
      ],
      answerIndex: 3,
      whyWrong: [
        "Finansdepartementet fastsetter blant annet utlånsforskriften, ikke styringsrenten.",
        "Finanstilsynet fører tilsyn. Det setter ikke styringsrenten.",
        "Oslo Børs er en markedsplass, ikke den som setter renta.",
        "",
      ],
      explain: "Norges Banks komité for pengepolitikk setter styringsrenten.",
    },
  },
  {
    id: "ps-1",
    pathId: "personlig-sparing",
    title: "Renters rente",
    order: 0,
    summary: "Avkastning på tidligere avkastning.",
    body: [
      "Renters rente betyr at du får avkastning også på tidligere avkastning. 100 kroner som vokser med 5 prosent, blir 105. Neste periode regnes prosenten av 105, ikke bare av de opprinnelige 100.",
      "Effekten er liten det første året og større jo lenger pengene får stå. Derfor betyr tid og jevn sparing mer enn det føles som i starten.",
      "En høy årlig kostnad, for eksempel et dyrt fond, spiser av den samme effekten. Lav kostnad og lang horisont hører sammen.",
      "Snur du regnestykket, får du nåverdi: hva et beløp senere er verdt i dag. Med 5 prosent i året er 1 000 kroner om ti år verdt om lag 614 kroner i dag, fordi 614 kroner vokser til 1 000 på ti år.",
    ],
    conceptIds: ["renters-rente", "naverdi"],
    quiz: {
      question: "Hva beskriver renters rente?",
      options: [
        "Avkastning også på tidligere avkastning",
        "Renta banken tar på boliglån",
        "At skatten på aksjer alltid er null",
        "At inflasjonen er null",
      ],
      answerIndex: 0,
      whyWrong: [
        "",
        "Boliglånsrenta er prisen på lånet. Renters rente er avkastning på avkastning.",
        "Aksjegevinst skattlegges. Renters rente sier ingenting om at skatten er null.",
        "Inflasjonen er prisvekst. Den er ikke null, og det er ikke det renters rente beskriver.",
      ],
      explain:
        "Renters rente er avkastning på avkastning. Derfor vokser beløpet raskere jo lenger tidshorisonten er.",
    },
  },
  {
    id: "ps-2",
    pathId: "personlig-sparing",
    title: "Risiko, avkastning og indeksfond",
    order: 1,
    summary: "Høyere forventet avkastning har en pris i svingninger.",
    body: [
      "Høyere forventet avkastning henger vanligvis sammen med større svingninger. Penger på konto svinger lite og har lav forventet avkastning. Aksjer svinger mer, og har historisk gitt høyere avkastning over lange perioder.",
      "Et indeksfond følger en indeks, for eksempel et bredt aksjemarked, i stedet for at en forvalter plukker enkeltaksjer. Den årlige kostnaden er ofte lav. Fondet fjerner ikke markedsrisiko: det faller når markedet faller.",
      "Risikospredning betyr å ikke legge alt i én aksje eller én sektor. Ett selskap kan gå i null. Et bredt fond gjør at enkeltutfall veier mindre. Hele markedet kan likevel falle.",
      "Et rentefond eier obligasjoner. En obligasjon betaler en fast kupong. Stiger renta i markedet, faller prisen på obligasjonene fondet allerede eier, mest for dem med lang løpetid. Avkastningen du får hvis du kjøper til dagens pris og holder til forfall, kalles yield.",
    ],
    conceptIds: ["risiko-avkastning", "indeksfond", "diversifisering", "yield"],
  },
  {
    id: "ps-3",
    pathId: "personlig-sparing",
    title: "Aksjesparekonto (ASK)",
    order: 2,
    summary: "Bytt verdipapirer uten å skatte ved hver handel.",
    body: [
      "Aksjesparekonto (ASK) er en konto for aksjer og aksjefond. Du kan kjøpe og selge inne på kontoen uten at skatten utløses med en gang. Skatt på gevinst kommer når du tar ut mer enn du har satt inn, etter skjerming.",
      "Det lar gevinsten stå igjen og jobbe, og forsterker renters rente. ASK er for penger som skal stå over tid, ikke for bufferen du trenger neste måned.",
      "Skjermingsfradrag er en skattefri del av aksjeavkastningen, omtrent tilsvarende en risikofri avkastning. På ASK beregnes skjermingen av den laveste innskuddssaldoen i løpet av året. Selve skjermingsrenten endres — sjekk Skatteetaten for året du er i.",
    ],
    conceptIds: ["ask", "skjermingsfradrag"],
    quiz: {
      question: "Når utløses skatt på gevinst på en aksjesparekonto?",
      options: [
        "Ved hver handel inne på kontoen",
        "Aldri",
        "Når du tar ut mer enn innskuddet, etter skjerming",
        "Bare hvis fondet er et indeksfond",
      ],
      answerIndex: 2,
      whyWrong: [
        "Handel inne på kontoen utsetter skatten. Den utløses ikke ved hvert kjøp og salg.",
        "Gevinsten skattlegges når du tar ut mer enn du har satt inn.",
        "",
        "Indeksfond og andre aksjefond på ASK følger samme uttaksregel.",
      ],
      explain:
        "Handel inne på ASK utsetter skatten. Gevinst skattlegges når du tar ut mer enn innskutt beløp, etter skjermingsfradrag.",
    },
  },
  {
    id: "ps-4",
    pathId: "personlig-sparing",
    title: "Pensjon i korte trekk",
    order: 3,
    summary: "Folketrygd, tjenestepensjon og egen sparing.",
    body: [
      "Pensjonen i Norge er lag på lag. Folketrygdens alderspensjon er det offentlige laget de fleste bygger på. I det nye systemet er den inntektspensjon pluss garantipensjon. Inntekt og uttakstidspunkt betyr mest for inntektspensjonen. Botid, som trygdetid, betyr mest for garantipensjonen. Grunnbeløpet (G) fastsettes av Kongen og reguleres hvert år fra 1. mai. Fra 1. mai er det {{sats:grunnbelop}}.",
      "Obligatorisk tjenestepensjon (OTP) er penger arbeidsgiver må spare for deg, ofte i fond, oppå folketrygden. Minstesatsen er lav. Mange arbeidsgivere sparer mer.",
      "Individuell pensjonssparing (IPS) er privat sparing med fradrag i inntekten. Pengene er bundet til pensjonsalder. De er ikke en buffer du kan ta ut når du vil. I privat sektor er AFP i Fellesordningen et livsvarig påslag fra 62 år. I offentlig sektor gjelder livsvarig AFP fra 2025 for årskull fra 1963, mens eldre årskull har tidligpensjon fra 62 til 67 år. Sjekk om du er omfattet før du bytter jobb sent.",
    ],
    conceptIds: ["folketrygd", "otp", "ips"],
  },
  {
    id: "ps-5",
    pathId: "personlig-sparing",
    title: "BSU og boligvalg",
    order: 4,
    summary: "Sparing med skattefradrag, øremerket bolig.",
    body: [
      "BSU, boligsparing for ungdom, gir skattefradrag innenfor vilkår: alder, hvor mye du kan spare i året, og at pengene brukes til bolig. Du kan spare inntil {{sats:bsu-aar}}, samlet inntil {{sats:bsu-samlet}}. Fradraget er {{sats:bsu-fradrag}}. Du kan spare med fradrag til og med {{sats:bsu-alder}}.",
      "BSU er egenkapital til bolig, ikke et aksjefond. Formålet er låst, og forventet avkastning er lavere enn i aksjemarkedet. Derfor er det et annet valg enn ASK.",
      "Belåningsgrad — lån delt på boligens verdi — avgjør hvor mye egenkapital du trenger når du kjøper. Det tas grundigere i løpet om boliglån. Her er poenget at BSU bygger den egenkapitalen.",
    ],
    conceptIds: ["bsu"],
    satsIds: ["bsu-aar", "bsu-samlet", "bsu-fradrag", "bsu-alder"],
    quiz: {
      question: "Hva er BSU først og fremst?",
      options: [
        "En aksjesparekonto uten binding",
        "Sparing til bolig med skattefradrag, under vilkår",
        "Det samme som IPS",
        "Et krav om 3 prosent avkastning",
      ],
      answerIndex: 1,
      whyWrong: [
        "ASK er aksjesparing uten at pengene er øremerket bolig. BSU er det motsatte sporet.",
        "",
        "IPS er bundet pensjonssparing. BSU er sparing til bolig.",
        "3 prosent er handlingsregelens anslag, ikke et krav til BSU-kontoen.",
      ],
      explain:
        "BSU er boligsparing for ungdom: skattefradrag mot at pengene brukes til bolig, innenfor alder og beløpsgrenser.",
    },
  },
  {
    id: "ps-6",
    pathId: "personlig-sparing",
    title: "Sett det sammen",
    order: 5,
    summary: "En rekkefølge du kan huske.",
    body: [
      "Buffer først, på en konto du kan bruke. Deretter penger som skal stå: lav kostnad, lang horisont, renters rente.",
      "ASK passer til aksjer og aksjefond du kan la stå. Pensjonen er folketrygd pluss det arbeidsgiver sparer, og eventuelt IPS hvis du vil binde mer. BSU er sporet mot bolig, ikke mot aksjemarkedet.",
      "Du trenger ikke optimalisere alt i dag. Du trenger å kunne forklare de fem konseptene med egne ord: renters rente, indeksfond, ASK, folketrygd og BSU.",
    ],
    conceptIds: ["renters-rente", "ask", "bsu"],
  },
  {
    id: "sk-1",
    pathId: "skatt-for-privatpersoner",
    title: "Trinnskatt",
    order: 0,
    summary: "Skatt på personinntekt, i trinn.",
    body: [
      "Skatt på lønn er to lag. Alminnelig inntekt, etter fradrag, skattlegges med en flat sats. Trinnskatt kommer på toppen, og bare på personinntekt — lønn, trygd og lignende.",
      "Trinnskatten er progressiv. Inntekt over et trinn skattlegges med en høyere sats enn inntekten under. Den høyeste satsen gjelder bare den delen som ligger over trinnet, ikke hele lønna.",
      "Satser og grenser vedtas hvert år. Skatteetaten viser gjeldende trinn.",
    ],
    conceptIds: ["trinnskatt"],
    quiz: {
      question: "Hva er trinnskatt?",
      options: [
        "Flat skatt på all alminnelig inntekt",
        "Skatt på nettoformue",
        "Fradrag for gjeldsrenter",
        "Progressiv skatt på personinntekt, oppå skatten på alminnelig inntekt",
      ],
      answerIndex: 3,
      whyWrong: [
        "Skatten på alminnelig inntekt er det flate laget. Trinnskatt kommer oppå, og bare på personinntekt.",
        "Skatt på nettoformue er formuesskatt, ikke trinnskatt.",
        "Rentefradrag trekker gjeldsrenter fra. Det er ikke trinnskatt.",
        "",
      ],
      explain:
        "Trinnskatt treffer personinntekt i trinn. Skatten på alminnelig inntekt er et eget, flatt lag.",
    },
  },
  {
    id: "sk-2",
    pathId: "skatt-for-privatpersoner",
    title: "Minstefradrag",
    order: 1,
    summary: "Standardfradrag i lønn, prosent opp til et tak.",
    body: [
      "Minstefradraget er et standardfradrag i lønn, pensjon og enkelte andre inntekter. Det beregnes som en prosent av inntekten. Den nedre grensen for vanlige lønns- og pensjonsinntekter ble opphevet fra inntektsåret 2023, så prosentsatsen gjelder helt ned til null. Du får det automatisk i skattemeldingen.",
      "Fradraget skal grovt dekke vanlige kostnader ved å være i jobb, slik at du slipper å dokumentere dem. Har du høyere kostnader av den typen fradraget dekker, kan faktiske kostnader brukes i stedet.",
      "Minstefradraget i lønn er {{sats:minstefradrag-sats}}, med øvre grense {{sats:minstefradrag-tak}}. Prosentsats og tak settes i skattereglene og endres.",
    ],
    conceptIds: ["minstefradrag", "personfradrag"],
    satsIds: ["minstefradrag-sats", "minstefradrag-tak", "personfradrag"],
  },
  {
    id: "sk-3",
    pathId: "skatt-for-privatpersoner",
    title: "BSU",
    order: 2,
    summary: "Skattefradrag for sparing til bolig.",
    body: [
      "BSU, boligsparing for ungdom, gir fradrag i skatt for det du setter inn, innenfor et årlig tak. Ordningen har også et samlet tak og en aldersgrense. Pengene skal brukes til å kjøpe bolig eller nedbetale boliglån.",
      "Bruker du pengene til noe annet, kan tidligere fradrag bli tilbakeført. BSU er bundet sparing, ikke en vanlig sparekonto og ikke en aksjesparekonto.",
      "Renta på kontoen er et bankprodukt. Skattefradraget er det som gjør ordningen til et konsept i skatten. Grensene står i tabellen under.",
    ],
    conceptIds: ["bsu"],
    satsIds: ["bsu-aar", "bsu-samlet", "bsu-fradrag", "bsu-alder"],
    quiz: {
      question: "Hva skiller BSU fra en vanlig sparekonto?",
      options: [
        "Innskudd kan gi skattefradrag, og pengene er øremerket bolig",
        "Den er et aksjefond uten binding",
        "Den er det samme som IPS",
        "Skatteetaten garanterer avkastningen",
      ],
      answerIndex: 0,
      whyWrong: [
        "",
        "BSU er ikke et aksjefond, og pengene er øremerket bolig.",
        "IPS er pensjonssparing. BSU er sparing til bolig.",
        "Skatteetaten gir fradrag etter reglene. Den garanterer ikke avkastningen på kontoen.",
      ],
      explain:
        "BSU gir skattefradrag for innskudd innenfor tak, mot at pengene brukes til bolig.",
    },
  },
  {
    id: "sk-4",
    pathId: "skatt-for-privatpersoner",
    title: "Aksjesparekonto",
    order: 3,
    summary: "Skatt på gevinst utsettes til uttak.",
    body: [
      "På en aksjesparekonto kan du kjøpe og selge aksjer og aksjefond uten at gevinsten skattlegges ved hver handel. Skatten kommer når du tar ut mer enn du har satt inn, etter skjerming.",
      "Skjermingsfradraget er en skattefri del av avkastningen, regnet ut fra en skjermingsrente Skatteetaten fastsetter. På ASK beregnes skjermingen av innskuddet. Ubenyttet skjerming kan fremføres.",
      "ASK er for penger som kan stå. Det er ikke buffer, og det er ikke BSU: formålet er aksjesparing, ikke egenkapital til bolig.",
    ],
    conceptIds: ["ask", "skjermingsfradrag"],
  },
  {
    id: "sk-5",
    pathId: "skatt-for-privatpersoner",
    title: "Formuesskatt",
    order: 4,
    summary: "Skatt på det du eier, minus gjeld.",
    body: [
      "Formuesskatt — også kalt formueskatt — er skatt på nettoformue: ligningsverdi av eiendeler minus gjeld, over et bunnfradrag. Den har en kommunal og en statlig del.",
      "Primærbolig og aksjer verdsettes lavere enn markedsverdi. Skattegrunnlaget er derfor ikke det samme som det du kunne solgt for. Gjeld reduserer grunnlaget.",
      "Bunnfradrag, rabatter og satser vedtas i budsjettet. Sjekk Skatteetaten for året. Formuesskatt treffer formue, ikke årets lønn.",
    ],
    conceptIds: ["formuesskatt"],
    quiz: {
      question: "Hva er grunnlaget for formuesskatt?",
      options: [
        "Brutto lønn før fradrag",
        "Bare bankinnskudd",
        "Nettoformue over et bunnfradrag",
        "Gevinst på aksjesparekonto ved hver handel",
      ],
      answerIndex: 2,
      whyWrong: [
        "Brutto lønn er inntekt. Formuesskatt treffer det du eier, minus gjeld.",
        "Bankinnskudd kan inngå, men grunnlaget er hele nettoformuen, ikke bare kontoen.",
        "",
        "Gevinst på ASK skattlegges ved uttak. Det er ikke grunnlaget for formuesskatt.",
      ],
      explain:
        "Formuesskatt beregnes av ligningsverdi minus gjeld, over bunnfradraget. Trinnskatt er skatten på personinntekt.",
    },
  },
  {
    id: "pe-1",
    pathId: "pensjon",
    title: "Folketrygden",
    order: 0,
    summary: "Den offentlige pensjonen.",
    body: [
      "Folketrygden er den offentlige trygdeordningen. Alderspensjonen derfra er laget de fleste bygger på. For årskull i det nye systemet er den inntektspensjon pluss garantipensjon. Inntekt og uttakstidspunkt betyr mest for inntektspensjonen. Botid, som trygdetid, betyr mest for garantipensjonen. Grunnpensjon hører til det gamle systemet, sammen med tilleggspensjon.",
      "NAV forvalter ytelsene. Grunnbeløpet (G) fastsettes av Kongen etter folketrygdloven § 1-4 og reguleres hvert år fra 1. mai i takt med lønnsveksten. Siden 2011 er det regjeringen i statsråd som fastsetter beløpet etter trygdeoppgjøret. Fra 1. mai er grunnbeløpet {{sats:grunnbelop}}.",
      "Folketrygden betaler ikke hele pensjonen for de fleste. Tjenestepensjon og eventuell egen sparing ligger oppå.",
    ],
    conceptIds: ["folketrygd"],
  },
  {
    id: "pe-2",
    pathId: "pensjon",
    title: "Tjenestepensjon",
    order: 1,
    summary: "Pensjon fra jobben.",
    body: [
      "Tjenestepensjon er pensjonssparing knyttet til arbeidsforholdet, i tillegg til folketrygden. I privat sektor er en minstesparing lovpålagt: obligatorisk tjenestepensjon (OTP). Mange arbeidsgivere sparer mer enn minstesatsen.",
      "Den vanlige ordningen er innskuddspensjon. Innskuddet er avtalt. Det du får ut, avhenger av avkastning og hvor lenge pengene står. Offentlig sektor har egne ordninger.",
      "AFP kan komme i tillegg der tariffavtalen gir det. I privat sektor er påslaget i Fellesordningen livsvarig og kan tas ut fra 62 år. I offentlig sektor gjelder livsvarig AFP fra 2025 for årskull fra 1963. Eldre årskull har tidligpensjon fra 62 til 67 år. Den følger ikke automatisk med alle jobber. Sjekk arbeidsgiver før du bytter sent i karrieren.",
    ],
    conceptIds: ["tjenestepensjon"],
    quiz: {
      question: "Hva er obligatorisk tjenestepensjon?",
      options: [
        "Et privat fond du må opprette selv",
        "Minstesparing arbeidsgiver er pålagt å gjøre for deg",
        "Det samme som folketrygden",
        "En ytelse fra NAV når du er syk",
      ],
      answerIndex: 1,
      whyWrong: [
        "IPS er noe du oppretter selv. OTP er arbeidsgivers plikt.",
        "",
        "Folketrygden er det offentlige laget. OTP kommer oppå, fra jobben.",
        "Sykepenger er en ytelse når du er syk. OTP er sparing til pensjon.",
      ],
      explain:
        "OTP er minstesparingen arbeidsgiver skal gjøre. Folketrygden er det offentlige laget under.",
    },
  },
  {
    id: "pe-3",
    pathId: "pensjon",
    title: "IPS",
    order: 2,
    summary: "Egen pensjonssparing, med binding.",
    body: [
      "Individuell pensjonssparing (IPS) er privat sparing med fradrag i alminnelig inntekt, innenfor et årlig tak. Pengene er i hovedsak låst til pensjonsalder. Uttak skattlegges som alminnelig inntekt.",
      "IPS er ikke det samme som aksjesparekonto. På ASK kan du ta ut penger når du vil, mot skatt på gevinsten. IPS er øremerket pensjon.",
      "Taket og reglene står hos Skatteetaten. Ordningen kommer etter at du vet hva folketrygd og tjenestepensjon allerede gir.",
    ],
    conceptIds: ["ips"],
  },
  {
    id: "pe-4",
    pathId: "pensjon",
    title: "Tre lag",
    order: 3,
    summary: "Folketrygd, jobb og egen sparing.",
    body: [
      "Pensjonen er folketrygd, pluss tjenestepensjon fra jobben, pluss det du sparer selv. Ingen av lagene erstatter de andre.",
      "Folketrygden følger inntekten din over tid. Tjenestepensjonen følger jobben. IPS er frivillig og bundet.",
      "Si dem med egne ord: hvem som sparer, og om pengene er låst.",
    ],
    conceptIds: ["folketrygd", "tjenestepensjon", "ips"],
  },
  {
    id: "bo-1",
    pathId: "bolig",
    title: "Boliglånsforskriften",
    order: 0,
    summary: "Kravene banken må følge.",
    body: [
      "Boliglånsforskriften er det gamle navnet. Reglene står nå i utlånsforskriften, fastsatt av Finansdepartementet. Den setter rammer for boliglån og en del andre lån til husholdninger.",
      "Tre krav går igjen. Du må stille med egenkapital, så belåningsgraden ikke blir for høy. Samlet gjeld må stå i forhold til inntekten. Banken skal prøve om du tåler en høyere rente enn den du får i dag.",
      "For nedbetalingslån er grensen {{sats:utlan-belaning}}. Resten er egenkapital. Gjelden er begrenset til {{sats:utlan-gjeld}}. Rammekreditt med pant i bolig har et tak på {{sats:utlan-ramme}}. Banken kan være strengere.",
    ],
    conceptIds: ["utlansforskriften", "belaningsgrad", "gjeldsgrad"],
    satsIds: ["utlan-belaning", "utlan-gjeld", "utlan-ramme"],
    quiz: {
      question: "Hvem fastsetter utlånsforskriften?",
      options: [
        "Norges Bank",
        "Skatteetaten",
        "Borettslaget",
        "Finansdepartementet",
      ],
      answerIndex: 3,
      whyWrong: [
        "Norges Bank setter styringsrenten, ikke utlånsforskriften.",
        "Skatteetaten fastsetter ikke rammene for bankenes utlån.",
        "Borettslaget kan ha egen gjeld. Det fastsetter ikke forskriften.",
        "",
      ],
      explain:
        "Finansdepartementet fastsetter utlånsforskriften. Norges Bank setter styringsrenten.",
    },
  },
  {
    id: "bo-2",
    pathId: "bolig",
    title: "Egenkapital",
    order: 1,
    summary: "Den delen du ikke låner.",
    body: [
      "Egenkapital i et boligkjøp er den delen av prisen du stiller med selv. Belåningsgrad er lånet delt på boligens verdi. Grensen for nedbetalingslån er {{sats:utlan-belaning}}. Resten er egenkapital.",
      "Pengene kan komme fra sparing, for eksempel BSU, fra salg av en annen bolig, eller fra gave. Et nytt lån regnes ikke som egenkapital. Banken vurderer også at du kan betjene gjelden.",
      "Høyere egenkapital gir lavere belåningsgrad. Det er ofte et vilkår for lånet, og det demper hvor hardt et prisfall treffer deg.",
      "Begge reglene gjelder samtidig. Lånet kan være høyst {{sats:utlan-belaning}} av verdien, og samlet gjeld høyst {{sats:utlan-gjeld}}. Regneeksempel med de grensene: 400 000 kroner i egenkapital gir en høyeste totalpris på 4 000 000 kroner, fordi egenkapitalen da er 10 prosent. Med 700 000 kroner i inntekt, og ingen annen gjeld, kan boliggjelden være 3 500 000 kroner, og totalprisen dermed 3 900 000 kroner. Regelen med lavest tak stopper deg først, her inntekten.",
    ],
    conceptIds: ["egenkapital"],
  },
  {
    id: "bo-5",
    pathId: "bolig",
    title: "Annuitet eller serielån",
    order: 2,
    summary: "To måter å betale ned det samme lånet.",
    body: [
      "Et boliglån betales ned med terminer. Hver termin er renter pluss avdrag. Renta er prisen for å låne. Avdraget er den delen som betaler ned lånet.",
      "Annuitetslån har fast terminbeløp. I starten er det meste renter, fordi restgjelden er høy. Etter hvert blir renteandelen mindre og avdraget større.",
      "Serielån har fast avdrag. Renta regnes av en restgjeld som synker, så terminbeløpet faller. De første årene er dyrere enn på et annuitetslån med samme rente og løpetid. Du betaler ned raskere, og betaler derfor mindre renter totalt.",
      "Eksempel: 1 000 000 kroner, 5 prosent rente, 20 år og én termin i året. Første termin er om lag 80 243 kroner på annuitet og 100 000 kroner på serielån. Rentene blir om lag 604 852 kroner på annuitet og 525 000 kroner på serielån til sammen.",
    ],
    conceptIds: ["annuitetslan", "serielan"],
    quiz: {
      question: "Hvilket lån har fast avdrag og synkende terminbeløp?",
      options: ["Serielån", "Annuitetslån", "Rammekreditt", "Begge"],
      answerIndex: 0,
      whyWrong: [
        "",
        "Annuitetslån har fast terminbeløp, ikke fast avdrag.",
        "Rammekreditt er en kredittramme, ikke et lån med fast avdrag.",
        "Bare serielån har fast avdrag og synkende terminbeløp.",
      ],
      explain:
        "Serielån har fast avdrag. Renta regnes av lavere restgjeld for hver termin, så terminbeløpet faller. Annuitetslån har fast terminbeløp.",
    },
  },
  {
    id: "bo-3",
    pathId: "bolig",
    title: "Fellesgjeld",
    order: 3,
    summary: "Gjeld som følger andelen.",
    body: [
      "I et borettslag eier du en andel, og laget kan ha lån. Din del av det lånet er fellesgjeld. Prisantydningen er ofte bare innskuddet. Totalpris er innskudd pluss fellesgjeld.",
      "Fellesgjelden betjenes gjennom felleskostnadene. Noen lag lar deg betale ned din andel selv, en IN-ordning. Lav innskuddspris kan skjule høy gjeld. Sameier kan også ha fellesgjeld.",
      "Banken tar normalt med fellesgjelden når den vurderer lån og belåningsgrad. Se på totalpris, ikke bare tallet i annonsen.",
    ],
    conceptIds: ["fellesgjeld"],
    quiz: {
      question: "Hva er totalpris i et borettslag?",
      options: [
        "Bare felleskostnaden per måned",
        "Egenkapitalen banken krever",
        "Innskudd pluss din andel av fellesgjelden",
        "Skatten på boligen",
      ],
      answerIndex: 2,
      whyWrong: [
        "Felleskostnaden er det du betaler løpende, ikke kjøpesummen.",
        "Egenkapital er det du stiller med selv. Totalpris er prisen på andelen.",
        "",
        "Skatt på boligen er noe annet enn prisen du betaler for andelen.",
      ],
      explain:
        "Totalpris er innskuddet pluss fellesgjeld. Felleskostnaden er det du betaler løpende, ikke kjøpesummen.",
    },
  },
  {
    id: "bo-4",
    pathId: "bolig",
    title: "Leie mot eie",
    order: 4,
    summary: "Leie først, kjøp senere — på avtale.",
    body: [
      "Leie mot eie, også kalt leie til eie, er en avtale der du leier boligen en periode og siden kan eller skal kjøpe den. En del av leien kan være avtalt å telle som egenkapital. Vilkårene varierer mellom utbyggere og kommuner.",
      "Det er ikke en vanlig leiekontrakt. Du må fortsatt oppfylle bankens krav når kjøpet skal skje, inkludert utlånsforskriften. Får du ikke lån, avhenger resten av det som står i avtalen.",
      "Les hva leien dekker, om prisen er låst, og hva som skjer hvis du ikke kjøper. Ordningen er et spor mot eie, ikke en garanti for boliglån.",
    ],
    conceptIds: ["leie-mot-eie"],
  },
  {
    id: "of-1",
    pathId: "oljefondet-og-handlingsregelen",
    title: "Statens pensjonsfond utland",
    order: 0,
    summary: "Oljefondet, investert i utlandet.",
    body: [
      "Statens pensjonsfond utland er Oljefondet. Statens inntekter fra olje og gass settes inn i fondet, som investeres i utlandet i aksjer, obligasjoner og eiendom. NBIM forvalter fondet. Norges Bank setter styringsrenten. Det er to ulike oppgaver.",
      "Fondet utbetaler ikke pensjon til deg. Navnet til tross går uttak via statsbudsjettet. Pensjoner betales over budsjettet, som annen offentlig pengebruk.",
      "Poenget med å investere ute er å spre risiko og skille oljeformuen fra den løpende fastlandsøkonomien.",
    ],
    conceptIds: ["oljefondet"],
  },
  {
    id: "of-2",
    pathId: "oljefondet-og-handlingsregelen",
    title: "Handlingsregelen",
    order: 1,
    summary: "Hvor mye av fondet som brukes over tid.",
    body: [
      "Handlingsregelen er retningslinjen for bruken av fondet over statsbudsjettet. Forventet realavkastning er om lag 3 prosent over tid. Det er et anslag, ikke et tak som skal treffes hvert år.",
      "I normale år bør bruken ligge under 3 prosent, slik at uttaket over tid kan tilsvare 3 prosent når kriseår regnes med. Årets anslag står i tabellen under. Regelen skal jevne ut svingninger i oljeinntektene, la fondet vare, og hindre at fastlandsøkonomien overopphetes av oljepenger.",
      "Dette er finanspolitikk. Stortinget vedtar budsjettet etter forslag fra Finansdepartementet. Norges Bank styrer ikke handlingsregelen når den setter renta.",
    ],
    conceptIds: ["handlingsregelen"],
    satsIds: ["sou-mrd", "sou-pst"],
    quiz: {
      question: "Hva styrer handlingsregelen?",
      options: [
        "Styringsrenten neste kvartal",
        "Hvor mye av Oljefondet som brukes over statsbudsjettet over tid",
        "Skatten på aksjesparekonto",
        "Prisen på strøm i Nord-Norge",
      ],
      answerIndex: 1,
      whyWrong: [
        "Styringsrenten er Norges Banks virkemiddel, ikke handlingsregelen.",
        "",
        "Skatt på ASK er personlig skatt. Handlingsregelen styrer oljepengebruken.",
        "Strømprisen settes i kraftmarkedet, ikke av handlingsregelen.",
      ],
      explain:
        "Handlingsregelen er en retningslinje for oljepengebruken over budsjettet. Styringsrenten er Norges Banks virkemiddel.",
    },
  },
  {
    id: "of-3",
    pathId: "oljefondet-og-handlingsregelen",
    title: "Oljepengebruk i statsbudsjettet",
    order: 2,
    summary: "Underskuddet uten oljeinntekter.",
    body: [
      "Det som sammenlignes med handlingsregelen, er det strukturelle oljekorrigerte underskuddet: underskuddet uten oljeinntekter, justert for konjunktur.",
      "Overføringen fra Statens pensjonsfond utland er lik det oljekorrigerte underskuddet, altså det faktiske underskuddet uten oljeinntekter. Det strukturelle underskuddet er det samme tallet justert for konjunktur, og det er dette som sammenlignes med handlingsregelen. I anslaget for 2026 er overføringen 454,8 milliarder kroner. Finansdepartementet foreslår tallene. Stortinget vedtar budsjettet.",
      "Pengebruken er ikke det samme som fondets avkastning et enkelt år. Fondet kan falle i verdi i markedet samtidig som budsjettet bruker penger etter regelen.",
    ],
    conceptIds: ["strukturelt-underskudd", "finanspolitikk"],
    satsIds: ["sou-mrd", "sou-pst"],
  },
  {
    id: "ar-1",
    pathId: "arbeidsliv",
    title: "Frontfagsmodellen",
    order: 0,
    summary: "Konkurranseutsatt sektor forhandler først.",
    body: [
      "Frontfagsmodellen er måten lønningene i Norge forhandles fram. Industrien som konkurrerer med utlandet — frontfaget — forhandler først. Resultatet blir en norm for lønnsveksten i oppgjørene som følger.",
      "Poenget er at lønningene i skjermede næringer ikke løper fra det konkurranseutsatt sektor tåler. Da holder kostnadene seg i takt med handelspartnerne.",
      "Frontfaget er i praksis industrioverenskomsten mellom partene i industrien. Modellen er et samarbeid i arbeidslivet, ikke en rente Norges Bank setter.",
    ],
    conceptIds: ["frontfagsmodellen"],
  },
  {
    id: "ar-2",
    pathId: "arbeidsliv",
    title: "Lønnsoppgjør",
    order: 1,
    summary: "Hovedoppgjør og mellomoppgjør.",
    body: [
      "Lønnsoppgjøret er forhandlingene om lønn og tariffavtaler. Hovedoppgjør annet hvert år tar hele avtalen. Mellomoppgjør i året mellom gjelder i hovedsak lønn.",
      "Frontfaget går først. Andre områder forhandler etterpå, med rammen fra frontfaget som norm. Den lokale lønnsøkningen din kan avvike, men rammen er ankeret i nyhetene.",
      "Oppgjøret oppgis ofte som en årslønnsvekst, inkludert overheng fra året før. Det er ikke det samme som prosenten på én lønnsslipp.",
      "Reallønn er lønna etter prisvekst. Stiger lønna 4 prosent og prisene 3 prosent, stiger reallønna med om lag 1 prosent. Stiger prisene mer enn lønna, faller reallønna selv om det står flere kroner på slippen.",
    ],
    conceptIds: ["lonnsoppgjor", "reallonn"],
    quiz: {
      question: "Hva er frontfaget i et lønnsoppgjør?",
      options: [
        "NAV, som utbetaler sykepenger",
        "Finansdepartementet",
        "Norges Bank",
        "Konkurranseutsatt industri, som forhandler først",
      ],
      answerIndex: 3,
      whyWrong: [
        "NAV utbetaler ytelser. Frontfaget er partene i konkurranseutsatt industri.",
        "Finansdepartementet lager budsjettet. Det forhandler ikke frontfaget.",
        "Norges Bank setter renta. Den setter ikke lønnsnormen.",
        "",
      ],
      explain:
        "Frontfaget er konkurranseutsatt industri. Oppgjøret der setter normen for de andre.",
    },
  },
  {
    id: "ar-3",
    pathId: "arbeidsliv",
    title: "Sykepenger",
    order: 2,
    summary: "Inntekt når du er syk.",
    body: [
      "Sykepenger erstatter inntekt når du ikke kan arbeide på grunn av egen sykdom. For arbeidstakere betaler arbeidsgiver som regel de første 16 dagene, arbeidsgiverperioden. Deretter kan NAV overta.",
      "Ytelsen har et tak knyttet til grunnbeløpet i folketrygden, og en maksperiode. Du må som hovedregel være sykmeldt. Selvstendige har andre satser.",
      "Sykepenger er en ytelse fra folketrygden, ikke et resultat av lønnsoppgjøret. Oppgjøret handler om lønna når du jobber.",
    ],
    conceptIds: ["sykepenger"],
  },
  {
    id: "ar-4",
    pathId: "arbeidsliv",
    title: "Dagpenger",
    order: 3,
    summary: "Inntekt når du er arbeidsledig.",
    body: [
      "Dagpenger er folketrygdens ytelse når du har mistet arbeidstid. NAV krever at du har hatt tilstrekkelig inntekt, at du registrerer deg som arbeidssøker, og at du er reell jobbsøker.",
      "Ytelsen er en andel av tidligere inntekt, med tak, og den varer i en avgrenset periode. Reglene står hos NAV og kan endres.",
      "Dagpenger er ikke sykepenger. Her er du arbeidsfør og søker jobb.",
    ],
    conceptIds: ["dagpenger"],
  },
  {
    id: "st-1",
    pathId: "strom-og-kraft",
    title: "Spotpris",
    order: 0,
    summary: "Timeprisen i ditt prisområde.",
    body: [
      "Spotprisen er prisen på kraft i døgnmarkedet, time for time, i prisområdet der du bor. Den settes ut fra tilbud og etterspørsel på kraftbørsen Nord Pool.",
      "En spotavtale følger denne prisen, pluss leverandørens påslag. Nettleie, avgifter og merverdiavgift kommer i tillegg og er ikke spotpris.",
      "Prisen kan svinge mye mellom timer, og mellom landsdeler, selv om det er samme land.",
    ],
    conceptIds: ["spotpris"],
  },
  {
    id: "st-2",
    pathId: "strom-og-kraft",
    title: "Prisområder",
    order: 1,
    summary: "Fem områder, ikke én norsk pris.",
    body: [
      "Norge er delt i fem prisområder: NO1 (Østlandet), NO2 (Sør- og Sørvest-Norge), NO3 (Midt-Norge), NO4 (Nord-Norge) og NO5 (Vestlandet). Flaskehalser i nettet gjør at kraft ikke flyter fritt, så spotprisen kan være ulik.",
      "I nyhetene betyr Sør-Norge ofte de sørlige områdene, særlig NO1, NO2 og NO5, som er tettere koplet til kraftmarkedene i Europa. Nord-Norge er NO4. Midt-Norge, NO3, er et eget område.",
      "Strømstøtte og spotavtalen din følger prisen i området der måleren står, ikke et landsgjennomsnitt.",
    ],
    conceptIds: ["prisomrader"],
    quiz: {
      question: "Hvorfor kan strømprisen være ulik i Sør-Norge og Nord-Norge?",
      options: [
        "Fordi nettet har begrenset kapasitet mellom prisområdene",
        "Fordi folketrygden har ulike satser",
        "Fordi Norges Bank setter en rente per fylke",
        "Fordi formuesskatten er høyere i sør",
      ],
      answerIndex: 0,
      whyWrong: [
        "",
        "Folketrygden har ikke ulike satser per landsdel. Prisen følger kraftnettet.",
        "Norges Bank setter én styringsrente, ikke en rente per fylke.",
        "Formuesskatten forklarer ikke prisforskjellen mellom prisområdene.",
      ],
      explain:
        "Prisområdene er atskilt av begrenset nettkapasitet. NO4 er Nord-Norge. De sørlige områdene har ofte en annen pris.",
    },
  },
  {
    id: "st-3",
    pathId: "strom-og-kraft",
    title: "Strømstøtte",
    order: 2,
    summary: "Staten dekker en del av høy spotpris.",
    body: [
      "Strømstøtte, også kalt strømstønad, er en statlig ordning for husholdninger. Når spotprisen i prisområdet ligger over en terskel, dekker staten en andel av det som ligger over, for et vanlig forbruk.",
      "Støtten går vanligvis via nettselskapet, så den trekkes fra på regningen. Terskel og andel vedtas av Stortinget og kan endres. Ordningen fjerner ikke spotprisen.",
      "Nettleie og avgifter er ikke det samme som spotprisen støtten regnes av. Sjekk gjeldende regler hvis du skal bruke tallene.",
    ],
    conceptIds: ["stromstotte"],
  },
  {
    id: "kk-1",
    pathId: "kronekurs-og-eos",
    title: "Kronekursen",
    order: 0,
    summary: "Hva som styrker og svekker kronen.",
    body: [
      "Kronekursen er prisen på norske kroner mot andre valutaer. En svakere krone betyr at du betaler flere kroner for én euro eller dollar.",
      "Kronen styrkes ofte når renta i Norge er høyere enn hos handelspartnerne, når oljeprisen er høy, eller når investorer er villige til å eie små valutaer. Den svekkes når rentedifferansen faller, oljeprisen faller, eller uro sender kapital mot større valutaer.",
      "Norges Bank følger blant annet den handelsvektede indeksen I-44. Høyere I-44 betyr svakere krone. Dette er tendenser. Olje og uro kan overdøve renta.",
    ],
    conceptIds: ["kronekurs"],
    quiz: {
      question: "Hva betyr en svakere krone?",
      options: [
        "At du betaler færre kroner for én euro",
        "At styringsrenten settes til null",
        "At du betaler flere kroner for utenlandsk valuta",
        "At Oljefondet utbetaler pensjon direkte",
      ],
      answerIndex: 2,
      whyWrong: [
        "Færre kroner per euro er en sterkere krone, ikke en svakere.",
        "Styringsrenten settes av Norges Bank ut fra pengepolitikken, ikke av at kronen er svak.",
        "",
        "Oljefondet utbetaler ikke pensjon direkte til deg, uansett kronekurs.",
      ],
      explain:
        "Svakere krone vil si at utenlandsk valuta koster flere kroner. Det gjør import dyrere.",
    },
  },
  {
    id: "kk-2",
    pathId: "kronekurs-og-eos",
    title: "Importpriser og EØS",
    order: 1,
    summary: "Europriser blir kroner.",
    body: [
      "EØS-avtalen knytter Norge til EUs indre marked, uten at Norge er medlem av EU. De fleste industrivarer kan handles uten toll mot EU. Landbruk og fisk har unntak, og Norge har egen toll mot andre land.",
      "Mye av importen prises i euro. Importprisen i kroner er den utenlandske prisen omregnet med kronekursen, pluss frakt og norske avgifter. Svakere krone løfter importprisene og kan løfte KPI.",
      "Sterkere krone gjør import billigere, og svekker samtidig konkurranseevnen for bedrifter som selger ut. Det er den andre siden av samme kurs.",
    ],
    conceptIds: ["importpriser", "eos"],
  },
  {
    id: "kk-3",
    pathId: "kronekurs-og-eos",
    title: "Koblingen til renten",
    order: 2,
    summary: "Valutakurskanalen.",
    body: [
      "Når Norges Bank hever styringsrenten, kan kronen styrkes fordi plasseringer i kroner blir mer attraktive. Sterkere krone demper importprisene, og det trekker inflasjonen ned. Settes renta ned, kan kronen svekke seg og løfte importert prispress.",
      "Det er valutakurskanalen. Den virker sammen med etterspørselen: høyere rente demper også lån og forbruk.",
      "Norges Bank styrer mot inflasjonsmålet, ikke mot en bestemt kronekurs. En renteendring er ikke et løfte om at kronen beveger seg.",
    ],
    conceptIds: ["styringsrenten", "kronekurs"],
  },
];

export const learningPaths: LearningPath[] = [
  {
    id: "norsk-pengepolitikk",
    title: "Norsk pengepolitikk",
    subtitle:
      "Fra inflasjon og KPI til styringsrente, transmisjon og rentebane.",
    category: "makro",
    estimatedMinutes: 35,
    lessonIds: ["pp-1", "pp-2", "pp-3", "pp-4", "pp-5", "pp-6"],
  },
  {
    id: "personlig-sparing",
    title: "Personlig sparing",
    subtitle: "Renters rente, indeksfond, ASK, pensjon og BSU.",
    category: "personlig",
    estimatedMinutes: 30,
    lessonIds: ["ps-1", "ps-2", "ps-3", "ps-4", "ps-5", "ps-6"],
  },
  {
    id: "skatt-for-privatpersoner",
    title: "Skatt for privatpersoner",
    subtitle: "Trinnskatt, minstefradrag, BSU, aksjesparekonto og formuesskatt.",
    category: "personlig",
    estimatedMinutes: 20,
    lessonIds: ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"],
  },
  {
    id: "pensjon",
    title: "Pensjon",
    subtitle: "Folketrygden, tjenestepensjon og IPS.",
    category: "personlig",
    estimatedMinutes: 15,
    lessonIds: ["pe-1", "pe-2", "pe-3", "pe-4"],
  },
  {
    id: "bolig",
    title: "Bolig",
    subtitle: "Boliglånsforskriften, egenkapital, annuitet og serielån, fellesgjeld og leie mot eie.",
    category: "personlig",
    estimatedMinutes: 20,
    lessonIds: ["bo-1", "bo-2", "bo-5", "bo-3", "bo-4"],
  },
  {
    id: "oljefondet-og-handlingsregelen",
    title: "Oljefondet og handlingsregelen",
    subtitle: "Statens pensjonsfond utland, handlingsregelen og oljepengebruken.",
    category: "olje",
    estimatedMinutes: 14,
    lessonIds: ["of-1", "of-2", "of-3"],
  },
  {
    id: "arbeidsliv",
    title: "Arbeidsliv",
    subtitle: "Frontfagsmodellen, lønnsoppgjør, sykepenger og dagpenger.",
    category: "makro",
    estimatedMinutes: 16,
    lessonIds: ["ar-1", "ar-2", "ar-3", "ar-4"],
  },
  {
    id: "strom-og-kraft",
    title: "Strøm og kraft",
    subtitle: "Spotpris, prisområder og strømstøtte.",
    category: "olje",
    estimatedMinutes: 14,
    lessonIds: ["st-1", "st-2", "st-3"],
  },
  {
    id: "kronekurs-og-eos",
    title: "Kronekurs og EØS",
    subtitle: "Hva som flytter kronen, importpriser og koblingen til renten.",
    category: "marked",
    estimatedMinutes: 14,
    lessonIds: ["kk-1", "kk-2", "kk-3"],
  },
];

export const comingPaths: { id: string; title: string; subtitle: string; href: string }[] = [];

/** Konsepter som legges i Repeter når leksjonen er fullført. Maks et knippe per løp. */
export const srsConceptIds = new Set<string>([
  "inflasjon",
  "kpi",
  "kpi-jae",
  "kjopkraft",
  "inflasjonsmal",
  "fleksibel-inflasjonsstyring",
  "styringsrenten",
  "transmisjon",
  "rentebanen",
  "ppr",
  "renters-rente",
  "risiko-avkastning",
  "indeksfond",
  "ask",
  "skjermingsfradrag",
  "folketrygd",
  "otp",
  "ips",
  "bsu",
  "trinnskatt",
  "minstefradrag",
  "formuesskatt",
  "tjenestepensjon",
  "utlansforskriften",
  "egenkapital",
  "fellesgjeld",
  "leie-mot-eie",
  "oljefondet",
  "handlingsregelen",
  "strukturelt-underskudd",
  "finanspolitikk",
  "frontfagsmodellen",
  "lonnsoppgjor",
  "sykepenger",
  "dagpenger",
  "spotpris",
  "prisomrader",
  "stromstotte",
  "kronekurs",
  "importpriser",
  "eos",
  "pengepolitikk",
  "produksjonsgap",
  "reallonn",
  "diversifisering",
  "yield",
  "naverdi",
  "annuitetslan",
  "serielan",
  "belaningsgrad",
  "gjeldsgrad",
  "personfradrag",
]);

const synonyms: Record<string, string[]> = {
  oljefondet: ["spu", "pensjonsfondet", "oljefond", "statens pensjonsfond"],
  styringsrenten: ["renta", "sentralbankrenta", "foliorente", "policy rate"],
  inflasjon: ["prisvekst"],
  kpi: ["konsumprisindeks", "cpi", "konsumpris"],
  "kpi-jae": ["kpi jae", "cpi-ate", "underliggende inflasjon"],
  ask: ["aksjesparekonto"],
  bsu: ["boligsparing"],
  omf: ["covered bond", "covered bonds"],
  ekb: ["egenkapitalbevis", "primary capital certificate"],
  belaningsgrad: ["ltv", "loan to value", "belåningsgrad"],
  rentebanen: ["policy rate path"],
  handlingsregelen: ["3-prosentregelen", "tre prosent", "fiscal rule"],
  folketrygd: ["alderspensjon", "nav pensjon"],
  transmisjon: ["transmisjonsmekanisme", "transmisjonskanaler"],
  inflasjonsmal: ["inflasjonsmålet", "2 prosent"],
  trinnskatt: ["trinnskatten"],
  formuesskatt: ["formueskatt", "formuesskatten"],
  tjenestepensjon: ["otp", "obligatorisk tjenestepensjon", "innskuddspensjon"],
  egenkapital: ["egenkapitalkrav", "egenandel"],
  fellesgjeld: ["fellesgjelden", "borettslag", "totalpris"],
  "leie-mot-eie": ["leie til eie", "leie-til-eie"],
  frontfagsmodellen: ["frontfag", "frontfaget"],
  lonnsoppgjor: ["lønnsoppgjør", "hovedoppgjør", "mellomoppgjør"],
  sykepenger: ["sykmelding", "arbeidsgiverperiode"],
  dagpenger: ["arbeidsledighetstrygd"],
  spotpris: ["nord pool", "strømpris", "strompris"],
  stromstotte: ["strømstøtte", "strømstønad", "stromstonad"],
  prisomrader: ["prisområde", "no1", "no2", "no4", "sør-norge", "nord-norge"],
  importpriser: ["importpris", "importert inflasjon"],
  eos: ["eøs", "eøs-avtalen", "indre marked"],
  "strukturelt-underskudd": ["oljepengebruk", "oljepenger"],
  utlansforskriften: ["boliglånsforskriften", "boliglansforskriften"],
  kronekurs: ["kronekursen", "nok", "i-44"],
  renteniva: ["rentenivå", "rentenivået"],
  deflasjon: ["prisnedgang"],
  reallonn: ["reallønn", "reallønnsvekst", "reell lønn"],
  arbeidsledighet: ["ledighet", "aku", "arbeidskraftundersøkelsen", "helt ledige"],
  konjunktur: ["høykonjunktur", "lavkonjunktur", "konjunkturene"],
  "noytral-rente": ["nøytral rente", "nøytrale renten"],
  "importert-inflasjon": ["importert prisvekst"],
  "tilbud-og-ettersporsel": ["tilbudskurve", "etterspørselskurve"],
  bytteforhold: ["bytteforholdet", "terms of trade"],
  handelsbalanse: ["handelsbalansen", "vare- og tjenestebalansen"],
  oljepris: ["oljeprisen", "brent", "råolje"],
  petroleumsinntekter: ["petroleumsinntekt", "oljeinntekter", "gassinntekter"],
  "automatiske-stabilisatorer": ["automatisk stabilisator", "automatiske stabilisatorer"],
  nettleie: ["nettleia", "nettleien", "nettselskap"],
  fastprisavtale: ["fastpris", "fastprisavtale strøm"],
  utbytte: ["utbyttet", "dividende"],
  borsverdi: ["børsverdi", "børsverdien", "markedsverdi", "market cap"],
  pe: ["p/e", "pris/fortjeneste", "price earnings"],
  risikopremie: ["risikopremien", "equity risk premium"],
  volatilitet: ["volatiliteten"],
  korrelasjon: ["korrelasjonen"],
  kupongrente: ["kupong", "kupongen"],
  innskuddsgaranti: ["innskuddsgarantien", "sikringsfondet", "bankenes sikringsfond"],
  rentemargin: ["rentemarginen"],
  provisjonsinntekter: ["provisjon", "gebyrinntekter"],
  "motsyklisk-buffer": ["motsyklisk kapitalbuffer", "motsyklisk buffer"],
  fastrente: ["fast rente", "fastrentelån"],
  buffer: ["bufferkonto", "kontantreserve"],
  innskuddspensjon: ["innskuddsbasert", "innskuddspensjonen"],
  ytelsespensjon: ["ytelsesbasert", "ytelsespensjonen"],
  oppjusteringsfaktor: ["oppjustering", "oppjusteringsfaktoren"],
  verdsettingsrabatt: ["verdsettelsesrabatt", "verdsettingsrabatten"],
  avskrivning: ["avskrivninger", "avskrivningen"],
  arbeidskapital: ["arbeidskapitalen", "working capital"],
  driftsmargin: ["driftsmarginen", "ebit-margin"],
  standardavvik: ["standardavviket"],
};

function fold(value: string): string {
  return value
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a");
}

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
  coming: typeof comingPaths;
} {
  const q = fold(query.trim());
  if (!q) return { concepts: [], paths: [], lessons: [], coming: [] };

  const conceptHits = concepts.filter((c) => {
    const syn = (synonyms[c.id] ?? []).join(" ");
    const hay = fold(
      stripMarkup(`${c.term} ${c.english ?? ""} ${c.definition} ${c.explanation} ${c.tip ?? ""} ${syn}`)
    );
    return hay.includes(q);
  });
  const pathHits = learningPaths.filter((p) =>
    fold(`${p.title} ${p.subtitle}`).includes(q)
  );
  const lessonHits = lessons.filter((l) =>
    fold(stripMarkup(`${l.title} ${l.summary} ${l.body.join(" ")} ${l.quiz?.explain ?? ""}`)).includes(q)
  );
  const comingHits = comingPaths.filter((p) =>
    fold(`${p.title} ${p.subtitle}`).includes(q)
  );
  return {
    concepts: conceptHits,
    paths: pathHits,
    lessons: lessonHits,
    coming: comingHits,
  };
}

export const categoryLabel: Record<Concept["category"], string> = {
  makro: "Makro",
  olje: "Norsk økonomi",
  marked: "Marked",
  bank: "Bank",
  personlig: "Personlig",
  metode: "Metode",
};

function lessonTexts(lesson: Lesson): string[] {
  const quiz = lesson.quiz;
  return [
    lesson.summary,
    ...lesson.body,
    quiz?.question ?? "",
    ...(quiz?.options ?? []),
    quiz?.explain ?? "",
    ...(quiz?.whyWrong ?? []),
  ];
}

function assertNoDuplicateOrd(label: string, texts: string[]) {
  const seen = new Map<string, number>();
  for (const text of texts) {
    assertSatsRefs(text, label);
    for (const id of ordIdsIn(text)) seen.set(id, (seen.get(id) ?? 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) throw new Error(`${label} merker «${id}» ${count} ganger`);
  }
}

function assertLearning() {
  const path = learningPaths.find((p) => p.id === "norsk-pengepolitikk");
  if (!path) throw new Error("Mangler løp A");
  const blob = [
    path.title,
    path.subtitle,
    ...getLessonsForPath(path.id).flatMap((l) => [l.title, l.summary, ...l.body, l.quiz?.question ?? "", l.quiz?.explain ?? ""]),
  ].join("\n");
  if (/handlingsregel|oljefond/i.test(blob)) {
    throw new Error("Løp A blander inn handlingsregelen eller oljefondet");
  }
  const required = [
    "inflasjon",
    "kpi",
    "kpi-jae",
    "inflasjonsmal",
    "styringsrenten",
    "ask",
    "bsu",
    "transmisjon",
    "folketrygd",
    "indeksfond",
  ];
  for (const id of required) {
    if (!getConcept(id)) throw new Error(`Mangler konsept ${id}`);
  }

  const ordById = new Map(ordliste.map((ord) => [ord.id, ord]));
  const usedOrd = new Set<string>();
  for (const ord of ordliste) {
    if (!ord.kort || ord.kort.length > 200) {
      throw new Error(`Fagord ${ord.id} mangler kort forklaring, eller den er over 200 tegn`);
    }
    if (hasMarkup(ord.term) || hasMarkup(ord.kort)) {
      throw new Error(`Fagord ${ord.id} har merking i termen eller forklaringen`);
    }
  }
  for (const concept of concepts) {
    if (hasMarkup(concept.term) || hasMarkup(concept.definition)) {
      throw new Error(`Konsept ${concept.id} har merking i termen eller definisjonen`);
    }
    for (const id of concept.satsIds ?? []) {
      try {
        getSats(id);
      } catch {
        throw new Error(`Konsept ${concept.id} viser ukjent sats ${id}`);
      }
    }
  }
  for (const lesson of lessons) {
    assertNoDuplicateOrd(`Leksjon ${lesson.id}`, lessonTexts(lesson));
    for (const text of lessonTexts(lesson)) {
      for (const id of ordIdsIn(text)) {
        if (!ordById.has(id)) throw new Error(`Leksjon ${lesson.id} merker ukjent fagord ${id}`);
        usedOrd.add(id);
      }
    }
    for (const id of lesson.satsIds ?? []) {
      try {
        getSats(id);
      } catch {
        throw new Error(`Leksjon ${lesson.id} viser ukjent sats ${id}`);
      }
    }
    if (lesson.satsIds && lesson.satsIds.length > 5) {
      throw new Error(`Leksjon ${lesson.id} har mer enn fem satser i tabellen`);
    }
    for (const conceptId of lesson.conceptIds) {
      if (!srsConceptIds.has(conceptId)) {
        throw new Error(`Konsept ${conceptId} i leksjon ${lesson.id} mangler i repetisjonen`);
      }
    }
  }
  const unused = ordliste.filter((ord) => !usedOrd.has(ord.id)).map((ord) => ord.id);
  if (unused.length > 0) {
    console.warn(`Fagord som ikke er merket i en leksjon ennå: ${unused.join(", ")}`);
  }

  const quizzes = lessons.flatMap((lesson) => (lesson.quiz ? [lesson.quiz] : []));
  const counts = new Map<number, number>();
  for (const quiz of quizzes) {
    if (quiz.answerIndex < 0 || quiz.answerIndex >= quiz.options.length) {
      throw new Error(`Svarindeks utenfor alternativene: ${quiz.question}`);
    }
    counts.set(quiz.answerIndex, (counts.get(quiz.answerIndex) ?? 0) + 1);
    if (!quiz.whyWrong || quiz.whyWrong.length !== quiz.options.length) {
      throw new Error(`whyWrong mangler eller har feil lengde: ${quiz.question}`);
    }
    quiz.whyWrong.forEach((reason, index) => {
      if (index === quiz.answerIndex) {
        if (reason !== "") throw new Error(`whyWrong på riktig svar skal være tom: ${quiz.question}`);
      } else if (!reason.trim()) {
        throw new Error(`Mangler forklaring på feil svar: ${quiz.question}`);
      }
    });
  }
  for (const [index, count] of counts) {
    if (count / quizzes.length > 0.4) {
      throw new Error(`For mange quizer har svar ${index}: ${count} av ${quizzes.length}`);
    }
  }
}

assertLearning();
