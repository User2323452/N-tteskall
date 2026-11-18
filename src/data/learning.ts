import { extraConcepts } from "@/data/concepts-extra";
import type { Concept, LearningPath, Lesson } from "@/types/learning";

/** Kuraterte begreper — korte, korrekte definisjoner på bokmål. */
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
    category: "olje",
    definition:
      "Retningslinje for hvor mye av Oljefondet staten kan bruke over statsbudsjettet hvert år.",
    explanation:
      "Handlingsregelen sier at den forventede realavkastningen av Statens pensjonsfond utland (ofte omtalt rundt 3 prosent) skal styre bruken over tid. Målet er å jevne ut oljeinntekter, unngå å bruke opp fondet, og skjerme fastlandsøkonomien mot store svingninger. Dette er finanspolitikk, vedtatt over statsbudsjettet — ikke et virkemiddel Norges Bank bruker når den setter styringsrenten.",
    tip: "Sjekk gjeldende anslag. 3 prosent er en tommelfinger for forventet realavkastning, ikke en fasit for hvert enkelt år.",
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
    relatedIds: ["handlingsregelen", "nbim", "finanspolitikk"],
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
      "Kjøpekraft er hvor mye du får for pengene. Nominelle kroner er beløpet på konto eller lønnsslipp. Reelt er det samme beløpet etter prisvekst. Stiger prisene raskere enn lønna, faller kjøpekraften.",
    ],
    conceptIds: ["inflasjon", "kpi", "kjopkraft"],
    quiz: {
      question: "Hva måler konsumprisindeksen (KPI)?",
      options: [
        "Avkastningen i pensjonsfondet",
        "Prisutviklingen på husholdningenes varer og tjenester",
        "Styringsrenten neste kvartal",
        "Bare strømprisen",
      ],
      answerIndex: 1,
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
      "Norges Bank har et operativt mål om at konsumprisveksten skal ligge nær 2 prosent over tid. Tallet er et anker for forventningene. Det er ikke et krav om at KPI treffer 2 prosent hver eneste måned. Sjekk mandatet hvis du skal sitere tallet i et arbeid.",
      "Styringen er fleksibel. Banken legger også vekt på produksjon og sysselsetting. Den prøver ikke å presse inflasjonen tilbake på én måned hvis det ville gitt et unødvendig hopp i ledigheten.",
      "KPI-JAE er KPI uten energivarer og justert for avgiftsendringer. Den brukes ofte når man vil se den underliggende prisveksten, fordi strøm og avgifter svinger uten at det alltid sier noe om presset i økonomien.",
    ],
    conceptIds: ["inflasjonsmal", "fleksibel-inflasjonsstyring", "kpi-jae"],
    quiz: {
      question: "Hva ligger i fleksibel inflasjonsstyring?",
      options: [
        "Inflasjonen skal være null hver måned",
        "Hensyn til både inflasjon og aktivitet og sysselsetting",
        "Styringsrenten er alltid lik boliglånsrenta",
        "KPI-JAE er det eneste tallet som teller",
      ],
      answerIndex: 1,
      explain:
        "Fleksibel inflasjonsstyring veier inflasjon mot produksjon og sysselsetting, over en horisont på noen år.",
    },
  },
  {
    id: "pp-3",
    pathId: "norsk-pengepolitikk",
    title: "Styringsrenten",
    order: 2,
    summary: "Foliorenten — og hvorfor boliglånet ditt ligger høyere.",
    body: [
      "Styringsrenten er foliorenten: renta bankene får på innskudd i Norges Bank, opp til en kvote. Det er hovedverktøyet i pengepolitikken.",
      "Pengepolitikk er styring av rente og likviditet i kronemarkedet. Når styringsrenten settes opp, blir det dyrere for bankene å finansiere seg, og utlånsrentene følger vanligvis etter. Sparing blir litt mer attraktivt, og nytt lån litt dyrere.",
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
      "Fleksibel inflasjonsstyring er en avveining. Høy prisvekst og høy aktivitet taler for høyere rente. Stigende ledighet og inflasjon under målet taler for lavere rente. Ofte peker hensynene hver sin vei, og komiteen må veie dem over horisonten.",
      "Produksjonsgapet er et anslag på avviket mellom faktisk produksjon og det økonomien kan produsere uten at inflasjonspresset bygger seg opp. Positivt gap betyr press. Negativt gap betyr slakk.",
      "Renta treffer husholdningene særlig via boliglån, forbruk og kronekurs. Hvor mye som brukes over statsbudsjettet, er et annet spor. Det ligger i oversikten under norsk økonomi.",
    ],
    conceptIds: ["fleksibel-inflasjonsstyring", "produksjonsgap"],
    quiz: {
      question: "Hvem setter styringsrenten i Norge?",
      options: [
        "Finansdepartementet",
        "Norges Bank",
        "Finanstilsynet",
        "Oslo Børs",
      ],
      answerIndex: 1,
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
    ],
    conceptIds: ["renters-rente"],
    quiz: {
      question: "Hva beskriver renters rente?",
      options: [
        "Renta banken tar på boliglån",
        "Avkastning også på tidligere avkastning",
        "At skatten på aksjer alltid er null",
        "At inflasjonen er null",
      ],
      answerIndex: 1,
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
    ],
    conceptIds: ["risiko-avkastning", "indeksfond", "diversifisering"],
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
        "Når du tar ut mer enn innskuddet, etter skjerming",
        "Aldri",
        "Bare hvis fondet er et indeksfond",
      ],
      answerIndex: 1,
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
      "Pensjonen i Norge er lag på lag. Folketrygden er den offentlige grunnpensjonen, knyttet til inntekt, botid og når du tar den ut. Grunnbeløpet (G) er beløpet Stortinget regulerer, og som ytelsene regnes ut fra.",
      "Obligatorisk tjenestepensjon (OTP) er penger arbeidsgiver må spare for deg, ofte i fond, oppå folketrygden. Minstesatsen er lav. Mange arbeidsgivere sparer mer.",
      "Individuell pensjonssparing (IPS) er privat sparing med fradrag i inntekten. Pengene er bundet til pensjonsalder. De er ikke en buffer du kan ta ut når du vil. AFP er et tillegg for mange med tariffavtale — sjekk om du er omfattet før du bytter jobb sent.",
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
      "BSU, boligsparing for ungdom, gir skattefradrag innenfor vilkår: alder, hvor mye du kan spare i året, og at pengene brukes til bolig. Satser og aldersgrense endres. Sjekk Skatteetaten for året du er i.",
      "BSU er egenkapital til bolig, ikke et aksjefond. Formålet er låst, og forventet avkastning er lavere enn i aksjemarkedet. Derfor er det et annet valg enn ASK.",
      "Belåningsgrad — lån delt på boligens verdi — avgjør hvor mye egenkapital du trenger når du kjøper. Det tas grundigere i løpet om boliglån. Her er poenget at BSU bygger den egenkapitalen.",
    ],
    conceptIds: ["bsu"],
    quiz: {
      question: "Hva er BSU først og fremst?",
      options: [
        "En aksjesparekonto uten binding",
        "Sparing til bolig med skattefradrag, under vilkår",
        "Det samme som IPS",
        "Et krav om 3 prosent avkastning",
      ],
      answerIndex: 1,
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
      "Du trenger ikke optimalisere alt i dag. Du trenger å kunne forklare de fem begrepene med egne ord: renters rente, indeksfond, ASK, folketrygd og BSU.",
    ],
    conceptIds: ["renters-rente", "ask", "bsu"],
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
];

export const comingPaths: { id: string; title: string; subtitle: string; href: string }[] = [
  {
    id: "oljefondet-lop",
    title: "Oljefondet og handlingsregelen",
    subtitle: "Kommer. Finanspolitikk — eget spor, ikke en del av pengepolitikken.",
    href: "/oversikt#olje",
  },
  {
    id: "boliglan-lop",
    title: "Boliglån og utlånsregler",
    subtitle: "Kommer. Belåningsgrad, annuitet og utlånsforskriften.",
    href: "/oversikt#boliglan",
  },
];

/** Begreper som legges i Repeter når leksjonen er fullført. Maks et knippe per løp. */
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
      `${c.term} ${c.english ?? ""} ${c.definition} ${c.explanation} ${syn}`
    );
    return hay.includes(q);
  });
  const pathHits = learningPaths.filter((p) =>
    fold(`${p.title} ${p.subtitle}`).includes(q)
  );
  const lessonHits = lessons.filter((l) =>
    fold(`${l.title} ${l.summary} ${l.body.join(" ")}`).includes(q)
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
    if (!getConcept(id)) throw new Error(`Mangler begrep ${id}`);
  }
}

assertLearning();
