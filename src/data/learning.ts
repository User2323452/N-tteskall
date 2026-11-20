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
    definition: "Renta bankene får på innskudd i Norges Bank.",
    explanation:
      "Den er hovedverktøyet for å holde prisveksten lav og stabil. Når den heves, blir det dyrere for bankene, og boliglånsrenta følger vanligvis etter. På et lån på 3 millioner kroner gir 0,25 prosentpoeng om lag 625 kroner mer i renteutgift i måneden, før rentefradrag. Det demper etterspørselen. En vanlig misforståelse er at tallet er boliglånsrenta di.",
    tip: "Prisen bankene møter. Boliglånet ditt ligger vanligvis høyere.",
    example: "3 millioner kroner og 0,25 prosentpoeng gir 7 500 kroner i året, om lag 625 kroner i måneden, før rentefradrag.",
    forYou: "Når styringsrenten flyttes, merker du det på boliglånet og sparerenta, med bankens påslag oppå.",
    relatedIds: ["inflasjon", "rentebanen", "nibor", "renteniva"],
  },
  {
    id: "inflasjon",
    term: "Inflasjon",
    english: "Inflation",
    category: "makro",
    definition: "Vedvarende oppgang i det generelle prisnivået, så pengene kjøper mindre over tid.",
    explanation:
      "Koster den samme handlekurven 1 000 kroner i fjor og 1 030 kroner i år, er prisveksten 3 prosent. Det er et eksempel på det KPI måler. Høy prisvekst gjør at lønn og sparing rekker til mindre. En vanlig misforståelse er at én dyrere vare er inflasjon. Inflasjon er at prisene samlet stiger.",
    tip: "Inflasjon er at nesten alt blir dyrere, ikke at én vare blir det.",
    example: "1 000 kroner i fjor og 1 030 kroner i år er 3 prosent prisvekst.",
    forYou: "Se prisveksten ved siden av lønnsoppgjøret. Kronene på slippen sier ikke hele historien.",
    relatedIds: ["styringsrenten", "kjopkraft", "deflasjon"],
  },
  {
    id: "kjopkraft",
    term: "Kjøpekraft",
    english: "Purchasing power",
    category: "makro",
    definition: "Hvor mye varer og tjenester du får for pengene.",
    explanation:
      "Kjøpekraft er hva pengene rekker til. Stiger prisene 4 prosent og lønna 3 prosent, rekker lønna til mindre. Det merkes i mat, husleie og regninger. En vanlig misforståelse er at flere kroner på slippen betyr at du kan kjøpe mer.",
    tip: "Se på prisene og lønna sammen.",
    example: "Lønn opp 3 prosent og priser opp 4 prosent. Kjøpekraften faller.",
    forYou: "Et lønnstillegg som er mindre enn prisveksten, gir deg mindre i butikken.",
    relatedIds: ["inflasjon", "reallonn"],
  },
  {
    id: "rentebanen",
    term: "Rentebanen",
    english: "Policy rate path",
    category: "makro",
    definition: "Norges Banks prognose for styringsrenten framover.",
    explanation:
      "Den publiseres i Pengepolitisk rapport, fire ganger i året. Markedet bruker den til å danne forventninger, også for renter lenger fram. Banen er et anslag gitt dagens informasjon. En vanlig misforståelse er at den er et løfte om boliglånsrenta.",
    tip: "Anslag, ikke kontrakt.",
    example: "Banen kan vise lavere rente neste år. Neste rapport kan flytte den.",
    forYou: "Banken din ser på banen når den priser fastrente. Banen er ikke din avtale.",
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
    definition: "Rente på renta: neste år regnes renta også av det du tjente i fjor.",
    explanation:
      "Setter du inn 100 kroner til 5 prosent, har du 105 kroner etter ett år. Året etter regnes renta av 105. Derfor vokser beløpet fortere jo lenger det står. En vanlig misforståelse er at 5 prosent i ti år blir 50 prosent. Det blir mer, fordi renta legges på renta.",
    tip: "Tommelfingerregel, ikke en offisiell rente: 72 delt på renta i prosent er om lag antall år til beløpet er doblet.",
    example: "100 kroner til 5 prosent blir 105 det første året. 72 delt på 5 er om lag 14 år til de er doblet.",
    forYou: "Penger du ikke trenger på lenge, har tid til å få rente på renta.",
    relatedIds: ["ask", "risiko-avkastning"],
  },
  {
    id: "ask",
    term: "Aksjesparekonto (ASK)",
    english: "Share savings account",
    category: "personlig",
    definition: "En konto der du kan bytte aksjer og aksjefond uten å skatte av hver handel.",
    explanation:
      "Du kan ha børsnoterte aksjer og egenkapitalbevis i selskaper i EØS, og fond med mer enn 80 prosent aksjer ved årets start. Rentefond er utelukket, og kontanter på kontoen gir ingen rente. Innskuddet kan du ta ut først, uten skatt. Utbytte og gevinst blir stående og skattes ved uttak. Slik har det vært fra 2019.",
    tip: "Innskuddet ut først. Skatt på det som ligger over.",
    example: "Du har satt inn 100 000 kroner. De kan tas ut uten skatt. Tar du ut mer, skattes det overskytende etter skjerming.",
    forYou: "Bruk kontoen til aksjefond du skal ha i mange år, så du kan bytte uten å skatte underveis.",
    relatedIds: ["renters-rente", "skjermingsfradrag"],
  },
  {
    id: "skjermingsfradrag",
    term: "Skjermingsfradrag",
    english: "Risk-free allowance / shielding deduction",
    category: "personlig",
    definition: "Et fradrag som tar en del av avkastningen ut av skatten, regnet av innskuddet.",
    explanation:
      "Skjermingen er innskuddet ganget med en rente Skattedirektoratet setter i januar året etter. På aksjesparekonto brukes det laveste innskuddet i året, pluss skjerming fra tidligere år som ble stående. For inntektsåret 2025 er renten 3,6 prosent, så 100 000 kroner gir 3 600 kroner. En vanlig misforståelse er at den regnes av det fondet er verdt. Den regnes av innskuddet.",
    tip: "Laveste innskudd i året. Renten for 2026 fastsettes i januar 2027.",
    example: "100 000 kroner og 3,6 prosent for 2025 gir 3 600 kroner i skjerming.",
    forYou: "En del av avkastningen går fri når du tar ut penger. Resten skattes.",
    relatedIds: ["ask"],
  },
  {
    id: "risiko-avkastning",
    term: "Risiko og avkastning",
    english: "Risk and return",
    category: "marked",
    definition: "Du får vanligvis bedre betalt når verdien kan svinge mer.",
    explanation:
      "10 000 kroner på konto svinger lite. De samme pengene i aksjer kan falle mye i år, og har historisk steget mer over mange år. Derfor bør sparepengene ha en tidshorisont som tåler fallet. En vanlig misforståelse er at høy risiko betyr sikker gevinst. Det er forventningen som er høyere, og utfallet kan bli tap.",
    tip: "Kort horisont, lav svingning. Lang horisont, du kan tåle mer.",
    example: "Kontoen går jevnt opp. Aksjene hopper, og ender høyere i illustrasjonen over 20 år.",
    forYou: "Penger du trenger snart, hører hjemme der verdien ikke hopper.",
    relatedIds: ["renters-rente", "diversifisering"],
  },
  {
    id: "diversifisering",
    term: "Diversifisering",
    english: "Diversification",
    category: "marked",
    definition: "Å eie mange ting, så ett selskap ikke kan ta hele sparingen.",
    explanation:
      "Eier du én aksje og selskapet går konkurs, er den delen borte. Eier du tjue like store, tar det samme selskapet en tjuendedel. Et bredt fond er en praktisk måte å eie mange på. Hele markedet kan likevel falle. En vanlig misforståelse er at spredning fjerner all risiko.",
    tip: "Ett selskap kan ryke. I tjue selskaper tar det samme uhellet en tjuendedel.",
    example: "Ett konkursbo blant tjue like store aksjer tar om lag 5 prosent.",
    forYou: "Et bredt fond gjør spredningen for deg.",
    relatedIds: ["risiko-avkastning", "korrelasjon"],
  },
  {
    id: "otp",
    term: "Obligatorisk tjenestepensjon (OTP)",
    english: "Mandatory occupational pension",
    category: "personlig",
    definition: "Pensjonssparing jobben er pålagt å gjøre for deg, oppå folketrygden.",
    explanation:
      "Arbeidsgiver setter inn minst {{sats:otp-sats}} av lønn opp til {{sats:otp-tak}}. Med 600 000 kroner i lønn er det 12 000 kroner i året. Mange setter inn mer. Det er det midterste laget, mellom folketrygden og det du sparer selv. En vanlig misforståelse er at dette er hele pensjonen.",
    tip: "Se hva jobben setter inn, før du sparer ekstra selv.",
    example: "600 000 kroner i lønn og minstesatsen gir 12 000 kroner inn på pensjonskontoen det året.",
    forYou: "Logg inn hos pensjonsleverandøren og se innskuddet. Det er din konto.",
    satsIds: ["otp-sats", "otp-tak"],
    relatedIds: ["ips", "afp"],
  },
  {
    id: "ips",
    term: "Individuell pensjonssparing (IPS)",
    english: "Individual pension savings",
    category: "personlig",
    definition: "Egen pensjonssparing som er låst til du tar ut pensjon.",
    explanation:
      "Du kan sette inn inntil {{sats:ips-tak}} i året og få fradraget i alminnelig inntekt. Med fullt innskudd i 2026 blir skatten 5 500 kroner lavere, hvis du har skatt å trekke fra. Pengene er låst til du tar ut pensjon, tidligst fra fylte 62 år, og utbetalingen skal vare minst 10 år og minst til fylte 80. En vanlig misforståelse er at fradraget betyr skattefri pensjon. Skatten kommer ved uttak.",
    tip: "Buffer først. IPS er pensjon, tidligst fra 62 år.",
    example: "25 000 kroner inn i 2026 gir 5 500 kroner mindre i skatt det året, hvis du har skatt å trekke fra.",
    forYou: "Aktuelt når bufferen er på plass og du kan la pengene stå til minst 62 år.",
    satsIds: ["ips-tak"],
    relatedIds: ["otp"],
  },
  {
    id: "afp",
    term: "AFP",
    english: "Contractual pension",
    category: "personlig",
    definition: "Et tillegg noen får via tariffavtalen, oppå folketrygd og tjenestepensjon.",
    explanation:
      "Det er ikke en rett alle arbeidstakere har. I privat sektor kan det være et livsvarig påslag fra 62 år. I offentlig sektor avhenger ordningen av årskull: livsvarig fra 2025 for årskull fra 1963, og tidligpensjon fra 62 til 67 år for eldre årskull. En vanlig misforståelse er at tillegget følger deg når du bytter jobb. Det følger avtalen på jobben.",
    tip: "Tillegget følger tariffen på jobben, ikke deg automatisk.",
    example: "To like lønninger kan gi ulik pensjon hvis bare den ene jobben har avtalen.",
    forYou: "Spør om jobben er med, før du sier opp sent i karrieren.",
    relatedIds: ["otp"],
  },
  {
    id: "belaningsgrad",
    term: "Belåningsgrad",
    english: "Loan-to-value (LTV)",
    category: "personlig",
    definition: "Boliglånet delt på boligens markedsverdi.",
    explanation:
      "Lånet delt på boligverdien. For nedbetalingslån er grensen {{sats:utlan-belaning}}, og resten er egenkapital. Et lån på 3 600 000 kroner i en bolig til 4 000 000 kroner er 90 prosent. Banken tester også at du tåler {{sats:utlan-stress}} høyere rente, minst {{sats:utlan-gulv}}. En vanlig misforståelse er at grensen er det banken må låne deg.",
    tip: "Lån delt på verdi. Resten er egenkapital.",
    example: "3 600 000 kroner i lån og 4 000 000 kroner i verdi er 90 prosent.",
    forYou: "Høyere egenkapital gir lavere belåningsgrad, og ofte en enklere samtale med banken.",
    relatedIds: ["utlansforskriften"],
    satsIds: ["utlan-belaning", "utlan-ramme", "utlan-stress", "utlan-gulv"],
  },
  {
    id: "utlansforskriften",
    term: "Utlånsforskriften",
    english: "Lending regulation",
    category: "personlig",
    definition:
      "Krav til bankenes utlån — ofte kalt boliglånsforskriften — om egenkapital, gjeldsgrad og stresstest.",
    explanation:
      "Finansdepartementet setter rammene for hvor mye banken kan låne deg. For nedbetalingslån er belåningsgraden høyst {{sats:utlan-belaning}}, og samlet gjeld høyst {{sats:utlan-gjeld}}. Banken skal teste en rente som er {{sats:utlan-stress}} høyere, og uansett minst {{sats:utlan-gulv}}. Er renta 5 prosent, blir testen 8 prosent. Er den 3 prosent, blir testen 7 prosent.",
    tip: "Egenkapital, gjeld mot inntekt, og en rente høyere enn den du har i dag.",
    example: "Renta 5 prosent testes som 8 prosent. Renta 3 prosent testes som 7 prosent, fordi gulvet ligger over 3 pluss 3.",
    forYou: "Banken kan si nei selv om boligen er verdt nok, hvis inntekten eller testen ikke holder.",
    relatedIds: ["belaningsgrad", "egenkapital", "gjeldsgrad"],
    satsIds: ["utlan-belaning", "utlan-gjeld", "utlan-ramme", "utlan-stress", "utlan-gulv"],
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
      "Handlekurven koster mer enn i fjor. Hvor mye mer er inflasjon?",
      "Inflasjon er at prisene samlet stiger, så en krone rekker til mindre. Én vare som hopper, er ikke hele bildet.",
      "SSB måler det med konsumprisindeksen (KPI). Koster handlekurven 1 000 kroner i fjor og 1 030 kroner i år, er prisveksten 3 prosent. Det er et eksempel. Når nyhetene sier at prisveksten er så og så høy, er det som regel tolvmånedersveksten.",
      "Kjøpekraft er hvor mye du får for pengene. [[nominell|Nominelle]] kroner er beløpet på lønnsslippen. [[reell|Reelt]] er det samme etter prisvekst. Indeksen i basisåret er 100. SSB publiserer KPI den 10. i hver måned.",
      "Neste leksjon er målet banken styrer etter.",
    ],
    conceptIds: ["inflasjon", "kpi", "kjopkraft"],
    figureConceptId: "kpi",
    satsIds: ["kpi-basis"],
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
    summary: "Nær målet over tid, og fleksibelt.",
    body: [
      "Prisene steg mer enn du hadde ventet. Hva styrer Norges Bank etter?",
      "Det [[operativt-mal|operative målet]] er det banken styrer etter i praksis: årsveksten i konsumprisene skal over tid ligge nær {{sats:inflasjon-mal}}. Tallet er et anker. KPI må ikke treffe det hver eneste måned.",
      "Målet er ikke null. Litt prisvekst holder avstand til prisfall. Faller prisene vedvarende, kan folk utsette kjøp fordi de venter at det blir billigere. Et fast tall gjør det lettere å planlegge.",
      "Styringen er fleksibel. Banken veier også produksjon og sysselsetting, og skal kunne motvirke [[finansielle-ubalanser|finansielle ubalanser]], gjeld og boligpriser som vokser for fort. Den prøver ikke å tvinge prisveksten tilbake på én måned hvis ledigheten da hopper unødvendig.",
      "KPI-JAE er KPI justert for avgiftsendringer (J) og uten energivarer (AE). Strøm og avgifter kan hoppe uten at det sier noe om presset i økonomien.",
      "Neste leksjon er renta bankene får i Norges Bank.",
    ],
    conceptIds: ["inflasjonsmal", "fleksibel-inflasjonsstyring", "kpi-jae"],
    figureConceptId: "inflasjonsmal",
    satsIds: ["inflasjon-mal"],
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
    summary: "Foliorenten, og hvorfor boliglånet ditt ligger høyere.",
    body: [
      "Boliglånet ble dyrere. Hvilken rente trakk det med seg?",
      "Styringsrenten er [[foliorente|foliorenten]], renta bankene får på innskudd i Norges Bank. Pengepolitikk er at Norges Bank setter den renta for å holde prisveksten lav og stabil.",
      "Regneeksempel, ikke renta du har: øker renta [[prosentpoeng|0,25 prosentpoeng]] på et lån på 3 millioner kroner, blir renteutgiften om lag 625 kroner høyere i måneden, før rentefradrag. 3 millioner ganger 0,25 prosentpoeng er 7 500 kroner i året. 7 500 delt på 12 er 625.",
      "Boliglånsrenta ligger vanligvis over styringsrenten. Banken har egne kostnader og påslag. De to tallene er ikke like.",
      "Neste leksjon er veien fra renta til prislappen.",
    ],
    conceptIds: ["styringsrenten", "pengepolitikk"],
    figureConceptId: "styringsrenten",
    quiz: {
      question:
        "Renta på et lån på 3 millioner kroner øker med 0,25 prosentpoeng. Om lag hvor mye mer blir renteutgiften i måneden, før rentefradrag?",
      options: ["Om lag 75 kroner", "Om lag 7 500 kroner", "Ingenting. Fradraget tar hele økningen.", "Om lag 625 kroner"],
      answerIndex: 3,
      whyWrong: [
        "0,25 prosentpoeng av 3 millioner er 7 500 kroner i året. I måneden er det 625.",
        "7 500 kroner er årsbeløpet. Måneden er det delt på 12.",
        "Rentefradraget kommer i skatten etterpå. Renteutgiften på lånet øker likevel.",
        "",
      ],
      explain:
        "3 millioner ganger 0,25 prosentpoeng er 7 500 kroner i året. Delt på 12 er det 625 kroner i måneden, før rentefradrag. Det er et regneeksempel.",
    },
  },
  {
    id: "pp-4",
    pathId: "norsk-pengepolitikk",
    title: "Transmisjonskanalene",
    order: 3,
    summary: "Hvordan en renteendring når prisene.",
    body: [
      "Renta ble satt opp. Hvorfor endrer ikke prislappen seg samme dag?",
      "En renteendring går gjennom flere kanaler. Det kalles transmisjonsmekanismen.",
      "Etterspørselskanalen: høyere rente gjør lånet dyrere, så du bruker mindre i butikken. Valutakurskanalen: høyere rente kan styrke kronen, og en vare priset i euro koster da færre kroner. Forventningskanalen: tror folk at prisveksten holdes nær målet, legger lønnsoppgjøret ikke inn en ekstra spiral.",
      "Figuren er en forenklet kjede, ikke en prognose for neste kvartal.",
      "Neste leksjon er anslaget for renta fremover.",
    ],
    conceptIds: ["transmisjon"],
    figureConceptId: "transmisjon",
    quiz: {
      question: "Renta settes opp, og kronen styrkes. Hva kan skje med en vare som er priset i euro?",
      options: [
        "Den koster færre kroner",
        "Den koster flere kroner",
        "Europrisen settes av Norges Bank",
        "Varen blir tollfri",
      ],
      answerIndex: 0,
      whyWrong: [
        "",
        "En sterkere krone gjør utenlandsk valuta billigere i kroner, ikke dyrere.",
        "Prisen i euro settes av den som selger varen. Norges Bank setter styringsrenten.",
        "Toll følger handelsavtalen. En sterkere krone fjerner den ikke.",
      ],
      explain:
        "Valutakurskanalen: høyere rente kan styrke kronen, og da koster en vare priset i euro færre kroner.",
    },
  },
  {
    id: "pp-5",
    pathId: "norsk-pengepolitikk",
    title: "Rentebanen og Pengepolitisk rapport",
    order: 4,
    summary: "Et anslag, ikke et løfte.",
    body: [
      "Banken sa at renta skal ned neste år. Er det et løfte?",
      "Rentebanen er Norges Banks prognose for styringsrenten de neste årene. Den er et anslag gitt dagens informasjon, ikke en kontrakt med deg.",
      "Prognosen publiseres i Pengepolitisk rapport fire ganger i året, i mars, juni, september og desember. Komiteen setter renta. Rapporten forklarer analysen.",
      "Jo lenger fram, jo videre er spennet. Banen flyttes når ny informasjon kommer.",
      "Neste leksjon er når hensynene peker hver sin vei.",
    ],
    conceptIds: ["rentebanen", "ppr"],
    figureConceptId: "rentebanen",
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
    summary: "Prisvekst og aktivitet peker ikke alltid samme vei.",
    body: [
      "Prisveksten er over målet, og ledigheten stiger. Hva skal banken veie?",
      "Fleksibel inflasjonsstyring er en avveining. Høy prisvekst taler for høyere rente. Stigende ledighet taler for lavere rente. Styringen skal også kunne motvirke [[finansielle-ubalanser|finansielle ubalanser]], gjeld og boligpriser som vokser for fort.",
      "Tenk på økonomien som en motor. Produksjonsgapet sier om motoren går over eller under marsjfart. Over marsjfart er det press. Under er det slakk. Den svingningen rundt marsjfart er konjunkturen.",
      "Renta treffer deg særlig via boliglån og forbruk. Hvor mye som brukes over statsbudsjettet, er et annet spor.",
      "Neste leksjon er hva lønna rekker til, og hva prisfall gjør.",
    ],
    conceptIds: ["fleksibel-inflasjonsstyring", "produksjonsgap", "konjunktur"],
    figureConceptId: "produksjonsgap",
    quiz: {
      question: "Inflasjonen er over målet, men ledigheten stiger raskt. Hva må Norges Bank veie?",
      options: [
        "Bare å sette renta så høyt som mulig",
        "Bare å få ledigheten til null denne måneden",
        "Ingenting. Målet er en bestemt kronekurs",
        "Prisveksten mot ledigheten, over tid",
      ],
      answerIndex: 3,
      whyWrong: [
        "Høy rente demper prisveksten, og den kan samtidig øke ledigheten. Begge hensynene veies.",
        "Ledigheten er ett hensyn. Prisveksten er et annet, og avveiningen gjøres over tid.",
        "Norges Bank styrer mot prisvekstmålet, ikke mot en bestemt kronekurs.",
        "",
      ],
      explain:
        "Fleksibel inflasjonsstyring veier prisvekst mot aktivitet og ledighet. Hensynene peker ofte hver sin vei.",
    },
  },
  {
    id: "pp-7",
    pathId: "norsk-pengepolitikk",
    title: "Reallønn og prisfall",
    order: 6,
    summary: "Hva lønna rekker til, og hvorfor prisfall ikke er en gave.",
    body: [
      "Lønna steg, men handleturen koster mer. Fikk du egentlig mer?",
      "Reallønn er lønna etter prisvekst. Stiger lønna 3 prosent og prisene 4 prosent, faller reallønna. Du har flere kroner, og de rekker til mindre. Det er et regneeksempel, ikke et lønnsoppgjør.",
      "Deflasjon er at prisene faller over tid. Én vare på tilbud er ikke deflasjon. Faller prisene vedvarende, kan folk utsette kjøp fordi de venter at det blir billigere.",
      "Løpet om pengepolitikken stopper her.",
    ],
    conceptIds: ["reallonn", "deflasjon"],
    figureConceptId: "reallonn",
    quiz: {
      question: "Lønna stiger 3 prosent og prisene 4 prosent. Hva skjer med reallønna?",
      options: [
        "Den stiger 7 prosent",
        "Den står stille, fordi begge steg",
        "Den faller. Prisene steg mer enn lønna",
        "Den stiger 3 prosent, fordi lønna steg",
      ],
      answerIndex: 2,
      whyWrong: [
        "3 pluss 4 er ikke reallønna. Reallønna ser på lønna mot prisene.",
        "Begge steg, men prisene steg mer. Da rekker lønna til mindre.",
        "",
        "3 prosent er lønnsveksten i kroner. Prisveksten tar en del av den.",
      ],
      explain:
        "Reallønna faller når prisene stiger mer enn lønna. 3 prosent lønn og 4 prosent prisvekst er et regneeksempel.",
    },
  },
  {
    id: "ps-1",
    pathId: "personlig-sparing",
    title: "Renters rente",
    order: 0,
    summary: "100 kroner til 5 prosent blir 105. Neste år renter du også de fem.",
    body: [
      "Du setter 100 kroner på konto. Hva er de verdt om mange år?",
      "Første år til 5 prosent blir de 105 kroner. Neste år regnes renta av 105, ikke bare av 100. Det er renters rente. En tommelfingerregel, ikke en offisiell rente: del 72 på renta i prosent. 72 delt på 5 er om lag 14 år til beløpet er doblet.",
      "Snur du regnestykket, får du nåverdi. 1 000 kroner om ti år er verdt om lag 614 kroner i dag hvis du krever 5 prosent i året, fordi 614 kroner vokser til 1 000.",
      "Neste leksjon er hva du får igjen for å tåle at verdien svinger.",
    ],
    conceptIds: ["renters-rente", "naverdi"],
    figureConceptId: "renters-rente",
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
    summary: "Høyere forventet avkastning betyr at verdien svinger mer.",
    body: [
      "Du har penger du ikke trenger på flere år. Skal de stå på konto eller i aksjer?",
      "Kontoen svinger lite og gir vanligvis mindre. Aksjer kan falle kraftig, og har historisk gitt mer over lang tid. Høyere forventet avkastning er betalingen for svingningene, ikke et løfte om gevinst.",
      "Et indeksfond eier det indeksen eier. Den årlige kostnaden, [[ter|TER]], trekkes hvert år. 100 000 kroner i 30 år med 6 prosent før kostnad blir om lag 542 713 kroner når kostnaden er 0,2 prosent, og om lag 374 532 kroner når den er 1,5 prosent. Forskjellen er om lag 168 181 kroner. Det er et regneeksempel, ikke en prognose.",
      "Eier du én aksje og selskapet går konkurs, er den delen borte. Eier du tjue, tar ett selskap en tjuendedel. Hele markedet kan likevel falle.",
      "Neste leksjon er kontoen du kan bytte fond på uten å skatte av hver handel.",
    ],
    conceptIds: ["risiko-avkastning", "indeksfond", "diversifisering"],
    figureConceptId: "indeksfond",
    quiz: {
      question: "100 000 kroner står i 30 år i eksemplet. Hva gjør en årlig kostnad på 1,5 prosent mot 0,2 prosent?",
      options: [
        "Kostnaden trekkes bare det første året, så sluttbeløpet er likt.",
        "Sluttbeløpet blir om lag 168 000 kroner lavere.",
        "Kostnaden øker avkastningen, fordi fondet jobber hardere.",
        "Du får skattefradrag for hele kostnaden.",
      ],
      answerIndex: 1,
      whyWrong: [
        "Kostnaden trekkes hvert år, ikke bare det første.",
        "",
        "Kostnaden spiser av avkastningen. Den øker den ikke.",
        "Eksemplet er kostnaden i fondet, ikke et skattefradrag.",
      ],
      explain:
        "1,5 prosent i året i 30 år gir om lag 374 532 kroner. 0,2 prosent gir om lag 542 713. Forskjellen er om lag 168 181 kroner.",
    },
  },
  {
    id: "ps-3",
    pathId: "personlig-sparing",
    title: "Aksjesparekonto (ASK)",
    order: 2,
    summary: "Bytt verdipapirer uten å skatte ved hver handel.",
    body: [
      "Du vil bytte fond uten å skatte av hver handel. Det kan du på en aksjesparekonto.",
      "Der kan du eie børsnoterte aksjer og egenkapitalbevis i selskaper i EØS, og fond med mer enn 80 prosent aksjer ved inngangen til inntektsåret. Rentefond er utelukket. Kontanter kan ligge der, men de gir ingen rente. Regjeringen har foreslått at aksjer på Euronext Growth skal kunne ligge der fra 2027. Det er et forslag, ikke et vedtak.",
      "Innskuddet kan du ta ut først, uten skatt. Gevinst og utbytte blir stående. Utbytte skattes når du tar ut mer enn innskuddet, ikke når det betales inn. Slik har det vært fra 2019.",
      "Skjermingen regnes av det laveste innskuddet i løpet av året, pluss skjerming fra tidligere år som ble stående. Den gjelder innskuddet, ikke verdien på fondet. Renten for 2026 fastsettes i januar 2027. Siste fastsatte rente er 3,6 prosent for 2025.",
      "Neste leksjon er de tre lagene i pensjonen.",
    ],
    conceptIds: ["ask", "skjermingsfradrag"],
    figureConceptId: "ask",
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
    title: "Pensjon i tre lag",
    order: 3,
    summary: "Folketrygd, jobben og det du sparer selv.",
    body: [
      "Du lurer på hvor pensjonen kommer fra.",
      "Den har tre lag. Folketrygden er det offentlige laget. Jobben sparer oppå, som obligatorisk tjenestepensjon. Det tredje laget er det du sparer selv, for eksempel IPS, som er låst til du tar ut pensjon.",
      "Beløpene tar løpet Pensjon.",
      "Neste leksjon er sparingen til bolig.",
    ],
    conceptIds: ["folketrygd", "otp", "ips"],
    figureConceptId: "folketrygd",
    quiz: {
      question: "Bufferen er på plass, og du vil spare ekstra til pensjon. Hva er IPS?",
      options: [
        "En konto du kan tømme når vaskemaskinen ryker.",
        "Det samme som folketrygden.",
        "Skatt på lønn.",
        "Egen sparing som er låst til du tar ut pensjon.",
      ],
      answerIndex: 3,
      whyWrong: [
        "IPS er låst. Bufferen er kontoen du kan tømme.",
        "Folketrygden er det offentlige laget. IPS er det du sparer selv.",
        "Trinnskatt er skatt på lønn. IPS er pensjonssparing.",
        "",
      ],
      explain: "IPS er eget, bundet pensjonsspor. Folketrygd og jobbens sparing er de to andre lagene.",
    },
  },
  {
    id: "ps-5",
    pathId: "personlig-sparing",
    title: "BSU og boligvalg",
    order: 4,
    summary: "Sparing med skattefradrag, øremerket bolig.",
    body: [
      "Du skal kjøpe bolig om noen år og lurer på BSU.",
      "Du kan spare inntil {{sats:bsu-aar}} i året, samlet inntil {{sats:bsu-samlet}}, med fradrag på {{sats:bsu-fradrag}}. Fullt årsinnskudd gir da 2 750 kroner mindre i skatt. Du kan spare med fradrag til og med {{sats:bsu-alder}}.",
      "Du får ikke fradrag det året du eier primærbolig eller sekundærbolig den 31. desember, verken direkte eller gjennom et selskap. Fritidsbolig alene stenger ikke. Bruker du pengene til noe annet enn bolig, kan fradraget kreves tilbake.",
      "Hvor mye egenkapital et kjøp krever, tar løpet om boliglån. Neste leksjon setter rekkefølgen på sparingen.",
    ],
    conceptIds: ["bsu"],
    figureConceptId: "bsu",
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
      "Lønn har kommet inn. Hva skal du gjøre først?",
      "Først en buffer: penger på konto til et uventet utlegg. Så kan penger som skal stå, ligge på aksjesparekonto, der innskuddet tas ut uten skatt. BSU er et eget spor hvis du sparer til bolig og fyller vilkårene.",
      "Ekstra nedbetaling på lån kommer etter bufferen. Et fond du ikke tåler å selge, er ikke buffer.",
      "Neste løp er skatten på lønnen.",
    ],
    conceptIds: ["buffer", "ask", "bsu"],
    figureConceptId: "buffer",
    quiz: {
      question: "Du har 15 000 kroner til overs, ingen buffer og et boliglån. Hva kommer først?",
      options: [
        "Buffer på en konto du kan bruke.",
        "Alt inn på aksjesparekonto.",
        "Ekstra avdrag på lånet.",
        "BSU, selv om du allerede eier bolig.",
      ],
      answerIndex: 0,
      whyWrong: [
        "",
        "Aksjesparekonto er for penger som kan stå. Bufferen kommer først.",
        "Ekstra avdrag kommer etter at du har en reserve på konto.",
        "Eier du bolig 31. desember, faller BSU-fradraget bort. Bufferen kommer uansett først.",
      ],
      explain: "Rekkefølgen er buffer, deretter penger som kan stå, deretter ekstra nedbetaling.",
    },
  },
  {
    id: "sk-1",
    pathId: "skatt-for-privatpersoner",
    title: "Trinnskatt",
    order: 0,
    summary: "Skatt på personinntekt, i trinn.",
    body: [
      "Lønnsslippen viser trekk. Hvor mye av det er trinnskatt?",
      "Skatt på lønn er to lag. Alminnelig inntekt, etter fradrag, skattlegges med en flat sats. Trinnskatt kommer på toppen, og bare på personinntekt: lønn, trygd og lignende.",
      "Den høyeste satsen gjelder bare den delen som ligger over trinnet, ikke hele lønna. Prøv 600 000 kroner i figuren. Trinn 3 starter på {{sats:trinn-3-fra}}, så den lønnen ligger under det trinnet.",
      "Neste leksjon er fradragene som kommer før den flate skatten.",
    ],
    conceptIds: ["trinnskatt"],
    figureConceptId: "trinnskatt",
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
      "Lønnsslippen har fradrag du ikke har søkt om. Hva er de?",
      "Minstefradraget i lønn er {{sats:minstefradrag-sats}} av lønnen, opp til {{sats:minstefradrag-tak}}. Det skal grovt dekke vanlige jobbkostnader. Når taket er nådd, øker ikke fradraget om lønnen stiger mer. Den nedre grensen for vanlig lønn og pensjon ble opphevet fra inntektsåret 2023.",
      "Personfradraget er et fast beløp, {{sats:personfradrag}}. Begge trekkes fra før skatten på alminnelig inntekt, {{sats:alminnelig-sats}}.",
      "Neste leksjon er fradraget når du sparer til bolig.",
    ],
    conceptIds: ["minstefradrag", "personfradrag", "alminnelig-inntekt"],
    figureConceptId: "minstefradrag",
    satsIds: ["minstefradrag-sats", "minstefradrag-tak", "personfradrag", "alminnelig-sats"],
    quiz: {
      question: "Minstefradraget i lønn har nådd taket. Lønnen øker mer. Hva skjer med fradraget?",
      options: [
        "Det blir borte.",
        "Det synker i takt med lønnen.",
        "Det blir stående på taket.",
        "Personfradraget brukes i stedet, og minstefradraget fjernes.",
      ],
      answerIndex: 2,
      whyWrong: [
        "Fradraget forsvinner ikke når lønnen blir høyere.",
        "Under taket følger fradraget lønnen. Over taket øker det ikke.",
        "",
        "Personfradrag og minstefradrag er to fradrag. Det ene erstatter ikke det andre.",
      ],
      explain: "Minstefradraget er en prosent av lønnen opp til taket. Over taket står fradraget stille.",
    },
  },
  {
    id: "sk-3",
    pathId: "skatt-for-privatpersoner",
    title: "BSU",
    order: 2,
    summary: "Innskuddet senker skatten. Uten bolig kan fradraget kreves tilbake.",
    body: [
      "Du setter inn penger på BSU. Hva skjer med skatten?",
      "Setter du inn {{sats:bsu-aar}}, går skatten ned med {{sats:bsu-fradrag}} av innskuddet. Det er 2 750 kroner når innskuddet er fullt. Vilkårene for alder og samlet sparebeløp står i tabellen.",
      "Kjøper du ikke bolig, og bruker heller ikke pengene til å nedbetale boliglån, kan fradraget kreves tilbake.",
      "Neste leksjon er skatten når du tar ut mer enn du satte inn på aksjesparekonto.",
    ],
    conceptIds: ["bsu"],
    figureConceptId: "bsu",
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
    summary: "Innskuddet ut først. Skatt på det som ligger over, etter skjerming.",
    body: [
      "Du tar ut mer enn du satte inn. Hvor mye blir skatt?",
      "Innskuddet kommer ut først, uten skatt. Det som er igjen, er gevinst og utbytte. Skjermingen trekkes fra. På aksjesparekonto er den det laveste innskuddet i året, pluss skjerming som ble stående fra før. Resten ganges med {{sats:oppjustering}}, og det beløpet skattes med {{sats:alminnelig-sats}}.",
      "Regneeksempel. Innskudd 100 000 kroner, og laveste saldo er like stor. Skjermingsrenten for 2026: TODO: verifiser. Den fastsettes i januar 2027. Med renten for 2025, 3,6 prosent, er skjermingen 3 600 kroner. Tar du ut 20 000 kroner over innskuddet, er 16 400 kroner igjen etter skjerming. 16 400 ganger faktoren blir 28 208 kroner, og 22 prosent av det er 6 206 kroner. Faktoren og skattesatsen gjelder også i 2026. Renten i eksemplet er for 2025.",
      "Utbytte på aksjer og fond inne på kontoen skattes ikke når det betales inn. Det skattes ved uttak. Slik har det vært fra 2019.",
      "Neste leksjon er skatt på det du eier.",
    ],
    conceptIds: ["ask", "skjermingsfradrag"],
    figureConceptId: "skjermingsfradrag",
    satsIds: ["oppjustering", "alminnelig-sats"],
    quiz: {
      question: "Du har satt inn 100 000 kroner og tar ut 100 000 kroner. Hva skjer med skatten?",
      options: [
        "Hele uttaket skattlegges med en gang.",
        "Uttaket er innskuddet, og det er uten skatt.",
        "Kontoen må stenges for at uttaket skal være lov.",
        "Utbytte skattes på nytt, oppå uttaket.",
      ],
      answerIndex: 1,
      whyWrong: [
        "Innskuddet tas ut først, uten skatt. Skatt kommer på det som ligger over.",
        "",
        "Du kan ta ut innskuddet uten å stenge kontoen.",
        "Utbytte som ligger på kontoen skattes ved uttak, ikke en gang til oppå et skattefritt innskudd.",
      ],
      explain: "Innskuddet kan tas ut først uten skatt. Skatt kommer når uttaket er større enn innskuddet, etter skjerming.",
    },
  },
  {
    id: "sk-5",
    pathId: "skatt-for-privatpersoner",
    title: "Formuesskatt",
    order: 4,
    summary: "Skatt på det du eier, minus gjeld.",
    body: [
      "Du eier bolig og fond, og du har gjeld. Skal du betale skatt av det?",
      "Formuesskatt gjelder nettoformue over et bunnfradrag. For én person er fradraget {{sats:formue-bunn}}. Satsen er {{sats:formue-sats}} når kommunen bruker høyeste sats, opp til {{sats:formue-topp}}. Over det er satsen {{sats:formue-sats-hoy}}.",
      "Regneeksempel for én person i 2026, med høyeste kommunale sats: nettoformue 2 500 000 kroner. Etter bunnfradraget er grunnlaget 600 000 kroner. Skatten blir 6 000 kroner. Primærbolig og aksjer settes lavere enn salgsverdien, og gjeld trekkes fra.",
      "Med dette har du de tre vanligste skattene i løpet: lønn, sparing og formue.",
    ],
    conceptIds: ["formuesskatt"],
    figureConceptId: "formuesskatt",
    satsIds: ["formue-bunn", "formue-sats", "formue-topp", "formue-sats-hoy"],
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
    summary: "Hvert år legges en andel av inntekten inn i beholdningen.",
    body: [
      "Lønnsslippen er grunnlaget for pensjonen senere. Hvor mye av den telles?",
      "I det nye systemet er alderspensjonen inntektspensjon pluss garantipensjon. Hvert år legges {{sats:pensjon-sats}} av den pensjonsgivende inntekten inn i en beholdning, opp til {{sats:pensjon-tak}}. Har du 500 000 kroner i slik inntekt, under taket, er årets opptjening 90 500 kroner. Det er innskudd i beholdningen, ikke pensjonen som betales ut.",
      "[[grunnbelopet|Grunnbeløpet]] er {{sats:grunnbelop}} fra 1. mai. NAV forvalter ytelsen. Grunnpensjon hører til det gamle systemet.",
      "Neste leksjon er det jobben setter inn.",
    ],
    conceptIds: ["folketrygd", "grunnbelop"],
    figureConceptId: "grunnbelop",
    satsIds: ["pensjon-sats", "pensjon-tak", "grunnbelop"],
    quiz: {
      question: "Du har 500 000 kroner i pensjonsgivende inntekt, under taket. Hva legges inn i beholdningen det året?",
      options: [
        "18,1 prosent, altså 90 500 kroner",
        "Hele inntekten, 500 000 kroner",
        "2 prosent, som minstesatsen fra jobben",
        "Ingenting før du fyller 67",
      ],
      answerIndex: 0,
      whyWrong: [
        "",
        "Hele inntekten er ikke opptjeningen. Det er 18,1 prosent av den, opp til taket.",
        "2 prosent er minstesatsen fra jobben. Folketrygden bruker 18,1 prosent.",
        "Opptjeningen skjer hvert år du har inntekt. Utbetalingen kommer senere.",
      ],
      explain:
        "Årets opptjening er 18,1 prosent av inntekten under taket. 500 000 kroner gir 90 500 kroner inn i beholdningen, ikke utbetalt pensjon.",
    },
  },
  {
    id: "pe-2",
    pathId: "pensjon",
    title: "Tjenestepensjon",
    order: 1,
    summary: "Minst 2 prosent av lønn opp til 12 G, og ofte mer.",
    body: [
      "Jobben setter inn pensjon av egne penger, oppå den offentlige pensjonen. Hvor mye er minsten?",
      "I privat sektor er minstesatsen {{sats:otp-sats}} av lønn opp til {{sats:otp-tak}}. Med 600 000 kroner i lønn er det 12 000 kroner i året. Mange arbeidsgivere setter inn mer.",
      "Den vanlige ordningen er innskuddspensjon. Innskuddet er avtalt, og det du får ut, følger avkastningen. Ytelsespensjon er det andre sporet: utbetalingen er avtalt, og arbeidsgiver bærer risikoen. Offentlig sektor har egne ordninger.",
      "Neste leksjon er det du kan spare selv, med binding.",
    ],
    conceptIds: ["tjenestepensjon", "innskuddspensjon", "ytelsespensjon"],
    figureConceptId: "tjenestepensjon",
    satsIds: ["otp-sats", "otp-tak"],
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
    summary: "Eget innskudd med fradrag, låst til uttak.",
    body: [
      "Du vil spare ekstra til pensjon og få [[fradrag]]. Hva koster bindingen?",
      "Du kan sette inn inntil {{sats:ips-tak}} i året. Innbetalingen trekkes fra i [[alminnelig-inntekt|alminnelig inntekt]]. Med fullt innskudd i 2026 og {{sats:alminnelig-sats}} blir skatten 5 500 kroner lavere, hvis du har skatt å trekke fra. Avkastningen skattes ikke mens pengene står.",
      "Tidligst uttak er fra fylte 62 år. Utbetalingen skal vare minst 10 år og minst til fylte 80 år. Uttak skattes som alminnelig inntekt.",
      "Neste leksjon setter de tre lagene ved siden av hverandre.",
    ],
    conceptIds: ["ips"],
    figureConceptId: "ips",
    satsIds: ["ips-tak", "alminnelig-sats"],
    quiz: {
      question: "Du vil ta ut pengene når du er 55. Hva sier regelen?",
      options: [
        "Du kan ta ut når du vil, mot skatt på gevinsten.",
        "Du må vente til 67 år.",
        "Tidligst fra 62 år, og utbetalingen skal vare minst 10 år og til minst 80.",
        "Uttaket er skattefritt.",
      ],
      answerIndex: 2,
      whyWrong: [
        "Det beskriver aksjesparekonto. Her er pengene låst til pensjonsuttak.",
        "62 år er det tidligste, ikke 67.",
        "",
        "Uttak skattes som alminnelig inntekt. Fradraget du fikk, er ikke skattefrihet.",
      ],
      explain:
        "Uttak kan tidligst starte ved fylte 62 år, skal vare minst 10 år og minst til fylte 80, og skattes som alminnelig inntekt.",
    },
  },
  {
    id: "pe-4",
    pathId: "pensjon",
    title: "Tre lag",
    order: 3,
    summary: "Folketrygd, jobb og egen sparing.",
    body: [
      "Du har tre kilder til pensjon. Hvem sparer i hver av dem?",
      "Folketrygden følger inntekten din over tid. Tjenestepensjonen følger jobben. Det tredje laget er det du sparer selv, for eksempel IPS, og det er låst til uttak.",
      "Ingen av lagene erstatter de andre.",
      "Løpet om pensjon stopper her.",
    ],
    conceptIds: ["folketrygd", "tjenestepensjon", "ips"],
    figureConceptId: "folketrygd",
    quiz: {
      question: "Jobben sparer, og bufferen er på plass. Hva er det tredje laget?",
      options: [
        "Et nytt forbrukslån",
        "Strømstøtte",
        "Handlingsregelen",
        "Det du sparer selv, for eksempel IPS",
      ],
      answerIndex: 3,
      whyWrong: [
        "Et lån er gjeld, ikke et pensjonslag.",
        "Strømstøtte demper strømregningen. Den er ikke pensjon.",
        "Handlingsregelen styrer bruken av Oljefondet, ikke din pensjon.",
        "",
      ],
      explain: "De tre lagene er folketrygd, jobben og egen sparing. IPS er det frivillige laget, og det er låst.",
    },
  },
  {
    id: "bo-1",
    pathId: "bolig",
    title: "Boliglånsforskriften",
    order: 0,
    summary: "Egenkapital, gjeld mot inntekt, og en høyere rente.",
    body: [
      "Banken sa ja til lån, men ikke til hele beløpet du ba om. Hvilke rammer gjelder?",
      "Reglene står i utlånsforskriften, fastsatt av Finansdepartementet. Boliglånsforskriften er det gamle navnet.",
      "For nedbetalingslån er [[belaningsgrad|belåningsgraden]] høyst {{sats:utlan-belaning}}. Samlet gjeld er høyst {{sats:utlan-gjeld}}. Rammekreditt med pant i bolig har et tak på {{sats:utlan-ramme}}. Banken skal teste en rente som er {{sats:utlan-stress}} høyere enn i dag, og uansett minst {{sats:utlan-gulv}}.",
      "Er renta 5 prosent, blir testen 8 prosent. Er renta 3 prosent, blir testen 7 prosent, fordi gulvet ligger over 3 pluss 3. Banken kan være strengere.",
      "Neste leksjon er pengene du må stille med selv.",
    ],
    conceptIds: ["utlansforskriften", "belaningsgrad", "gjeldsgrad"],
    figureConceptId: "utlansforskriften",
    satsIds: ["utlan-belaning", "utlan-gjeld", "utlan-ramme", "utlan-stress", "utlan-gulv"],
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
      "Du har spart, og skal kjøpe. Hvor stort kan lånet være?",
      "[[egenkapital|Egenkapital]] er den delen av prisen du stiller med selv. [[belaningsgrad|Belåningsgrad]] er lånet delt på boligens verdi. Grensen for nedbetalingslån er {{sats:utlan-belaning}}. Resten er egenkapital. Pengene kan komme fra sparing, salg av bolig eller gave. Et nytt lån regnes ikke som egenkapital.",
      "Begge reglene gjelder samtidig. Lånet kan være høyst {{sats:utlan-belaning}} av verdien, og samlet gjeld høyst {{sats:utlan-gjeld}}. Regneeksempel: 400 000 kroner i egenkapital gir en høyeste totalpris på 4 000 000 kroner, fordi egenkapitalen da er 10 prosent. Med 700 000 kroner i inntekt og ingen annen gjeld kan boliggjelden være 3 500 000 kroner, og totalprisen 3 900 000 kroner. Inntekten stopper deg først.",
      "Neste leksjon er om terminbeløpet er likt hver gang, eller høyere i starten.",
    ],
    conceptIds: ["egenkapital", "belaningsgrad", "gjeldsgrad"],
    figureConceptId: "egenkapital",
    quiz: {
      question: "I eksemplet har du 400 000 kroner i egenkapital, 700 000 kroner i inntekt og ingen annen gjeld. Hva stopper deg først?",
      options: [
        "Belåningsgraden, fordi 400 000 kroner bare rekker til en bolig til 2 millioner.",
        "Inntekten. Gjelden kan være 3,5 millioner, og totalprisen 3,9 millioner.",
        "Rentefradraget fjerner egenkapitalkravet.",
        "Fellesgjelden i et borettslag teller aldri med.",
      ],
      answerIndex: 1,
      whyWrong: [
        "10 prosent egenkapital av 4 millioner er 400 000 kroner. Inntektsgrensen gir en lavere totalpris.",
        "",
        "Rentefradrag senker skatten på renteutgiften. Det erstatter ikke egenkapitalen.",
        "Banken tar normalt med fellesgjeld. Den er ikke usynlig i regnestykket.",
      ],
      explain:
        "400 000 kroner rekker til 4 millioner etter belåningsgraden. Inntekten begrenser gjelden til 3,5 millioner, og totalprisen til 3,9 millioner. Den laveste grensen gjelder.",
    },
  },
  {
    id: "bo-5",
    pathId: "bolig",
    title: "Annuitet eller serielån",
    order: 2,
    summary: "To måter å betale ned det samme lånet.",
    body: [
      "Terminbeløpet er renter pluss avdrag. Hva er det som ligger fast?",
      "Annuitetslån har fast terminbeløp. I starten er det meste renter, fordi restgjelden er høy. Etter hvert blir renteandelen mindre og avdraget større.",
      "Serielån har fast avdrag. Renta regnes av en restgjeld som synker, så terminbeløpet faller. De første årene er dyrere enn på et annuitetslån med samme rente og løpetid. Du betaler ned raskere, og betaler derfor mindre renter totalt.",
      "Eksempel: 1 000 000 kroner, 5 prosent rente, 20 år og én termin i året. Første termin er om lag 80 243 kroner på annuitet og 100 000 kroner på serielån. Rentene blir om lag 604 852 kroner på annuitet og 525 000 kroner på serielån til sammen.",
      "Neste leksjon er gjelden som følger boligen, ikke bare deg.",
    ],
    conceptIds: ["annuitetslan", "serielan"],
    figureConceptId: "annuitetslan",
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
      "Annonsen viser en lav pris. Hva er boligen verdt når gjelden følger med?",
      "I et borettslag eier du en andel, og laget kan ha lån. Din del av det lånet er fellesgjeld. Prisantydningen er ofte bare innskuddet. Totalpris er innskudd pluss fellesgjeld.",
      "Et eksempel, ikke en bestemt bolig: innskudd 500 000 kroner og fellesgjeld 1 500 000 kroner gir totalpris 2 000 000 kroner. Gjelden betjenes gjennom felleskostnadene. Noen lag lar deg betale ned din andel selv. Banken tar normalt fellesgjelden med når den vurderer lånet.",
      "Neste leksjon er en avtale om å leie først og kjøpe senere.",
    ],
    conceptIds: ["fellesgjeld"],
    figureConceptId: "fellesgjeld",
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
      "Du leier nå og vil eie senere. Hva må avtalen si?",
      "Leie mot eie er en avtale der du leier en periode og siden kan eller skal kjøpe. En del av leien kan være avtalt å telle som egenkapital.",
      "Eksempel på en avtale, ikke en bestemt utbygger: du leier i tre år. 2 000 kroner av leien hver måned skal telle som egenkapital. Prisen er avtalt til 3 500 000 kroner. Når de tre årene er gått, må banken fortsatt si ja. Får du ikke lån, er det avtalen som sier om du kan bli boende.",
      "Neste leksjon er hva renta faktisk koster.",
    ],
    conceptIds: ["leie-mot-eie"],
    figureConceptId: "leie-mot-eie",
    quiz: {
      question: "I eksemplet skal 2 000 kroner av leien telle som egenkapital. Du får ikke lån når kjøpet skal skje. Hva er sikkert?",
      options: [
        "Avtalen sier hva som skjer. Banken må fortsatt godkjenne lånet.",
        "Staten garanterer lånet når leietiden er ute.",
        "Leien blir automatisk et boliglån.",
        "Utlånsforskriften gjelder ikke for slike avtaler.",
      ],
      answerIndex: 0,
      whyWrong: [
        "",
        "Avtalen gir ikke en statlig lånegaranti.",
        "Leien kan avtales å telle som egenkapital. Den er ikke et lån i seg selv.",
        "Når kjøpet skal skje, gjelder de samme kravene til lån som ellers.",
      ],
      explain:
        "Leie mot eie er en avtale, ikke en lånegaranti. Banken vurderer lånet når kjøpet skal skje, og avtalen sier hva som skjer hvis svaret er nei.",
    },
  },
  {
    id: "bo-6",
    pathId: "bolig",
    title: "Renta på lånet",
    order: 5,
    summary: "Nominell rente, fastrente og fradraget.",
    body: [
      "Du har fått to lånetilbud. Hvilket er dyrest?",
      "Nominell rente er den oppgitte renta. Effektiv rente tar med gebyrer og hvor ofte renta legges til. Når du sammenligner, er det effektiv rente som viser årskostnaden.",
      "Fastrente ligger fast i en avtalt periode. Flytende rente følger med når markedsrenta flytter seg. Når bindingen er ute, avtales fastrenten på nytt.",
      "[[fradrag|Fradraget]] for gjeldsrenter trekkes fra i [[alminnelig-inntekt|alminnelig inntekt]]. Med {{sats:alminnelig-sats}} gir 10 000 kroner i renter 2 200 kroner mindre i skatt, hvis du har skatt å trekke fra.",
      "Da har du rammene, egenkapitalen og prisen på lånet.",
    ],
    conceptIds: ["nominell-effektiv", "fastrente", "rentefradrag"],
    figureConceptId: "nominell-effektiv",
    satsIds: ["alminnelig-sats"],
    quiz: {
      question: "To lån har samme nominelle rente. Det ene har høyt etableringsgebyr. Hva skiller dem?",
      options: [
        "Ingenting. Nominell rente er hele prisen.",
        "Effektiv rente er høyere på lånet med gebyret.",
        "Fastrente fjerner gebyret.",
        "Rentefradraget gjør gebyret skattefritt.",
      ],
      answerIndex: 1,
      whyWrong: [
        "Nominell rente er den oppgitte renta. Gebyrer kommer i tillegg og vises i effektiv rente.",
        "",
        "Fastrente sier om renta er låst. Den fjerner ikke etableringsgebyret.",
        "Fradraget gjelder gjeldsrenter, ikke gebyret som en egen skattefri post.",
      ],
      explain: "Effektiv rente tar med gebyrer og hvor ofte renta legges til. Derfor kan to like nominelle renter ha ulik årskostnad.",
    },
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
      "Euroen koster flere kroner enn i fjor. Hva har skjedd med kronen?",
      "Kronekursen er prisen på norske kroner mot andre valutaer. En svakere krone betyr at du betaler flere kroner for én euro.",
      "Kronen styrkes ofte når renta i Norge er høyere enn ute. Den svekkes når den forskjellen faller, eller når uro sender penger mot større valutaer. Dette er tendenser, ikke en fasit.",
      "Norges Bank følger blant annet I-44. Høyere I-44 betyr svakere krone.",
      "Neste leksjon er hva kursen gjør med varene fra utlandet.",
    ],
    conceptIds: ["kronekurs"],
    figureConceptId: "kronekurs",
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
    summary: "Prisen i kroner, og virkningen på KPI.",
    body: [
      "Jakken er sydd i et EØS-land og priset i euro. Hva betaler du i kroner?",
      "EØS-avtalen knytter Norge til EUs indre marked, uten at Norge er medlem av EU. De fleste industrivarer kan handles uten toll mot EU. Landbruk og fisk har unntak.",
      "Importprisen er prisen i kroner. Den er den utenlandske prisen omregnet til kroner, pluss frakt og norske avgifter. Eksempel, ikke dagens kurs: 100 euro til 11 kroner er 1 100 kroner, før frakt og avgift.",
      "Importert inflasjon er noe annet. Det er virkningen på KPI når dyrere import løfter prisene husholdningene møter. En høyere importpris er ikke automatisk høyere KPI.",
      "Neste leksjon er hvordan renta kan flytte den samme kursen.",
    ],
    conceptIds: ["importpriser", "importert-inflasjon", "eos"],
    figureConceptId: "importpriser",
    quiz: {
      question: "Jakken koster 10 euro mer hos produsenten, og kronen er uendret. Hva er det, før vi ser på KPI?",
      options: [
        "En endring i inflasjonsmålet",
        "En høyere importpris",
        "Importert inflasjon, samme dag",
        "En sterkere krone",
      ],
      answerIndex: 1,
      whyWrong: [
        "Inflasjonsmålet er det Norges Bank styrer etter. Det flytter seg ikke fordi en jakke koster mer.",
        "",
        "Importert inflasjon er virkningen på KPI. Her har vi bare en høyere pris i euro.",
        "Kronen er uendret i eksemplet. Det som endret seg, er prisen i euro.",
      ],
      explain:
        "Importprisen er hva varen koster i kroner. Importert inflasjon er om den dyrere importen løfter KPI.",
    },
  },
  {
    id: "kk-3",
    pathId: "kronekurs-og-eos",
    title: "Koblingen til renten",
    order: 2,
    summary: "Valutakurskanalen.",
    body: [
      "Renta i Norge settes opp. Hva kan det gjøre med en jakke til 100 euro?",
      "Høyere styringsrente kan styrke kronen, fordi plasseringer i kroner blir mer attraktive. Sterkere krone gjør varer fra utlandet billigere i kroner. Lavere rente kan svekke kronen og løfte prispresset utenfra.",
      "Regneeksempel, ikke dagens kurs: 100 euro til 11 kroner er 1 100 kroner. Til 12 kroner er det 1 200 kroner. Forskjellen er 100 kroner, før frakt og avgift.",
      "Norges Bank styrer mot prisvekstmålet, ikke mot en bestemt kronekurs.",
      "Løpet om kronen og EØS stopper her.",
    ],
    conceptIds: ["styringsrenten", "kronekurs"],
    figureConceptId: "kronekurs",
    quiz: {
      question:
        "En jakke koster 100 euro. Kursen går fra 11 til 12 kroner per euro. Hva skjer med prisen i kroner, før frakt og avgift?",
      options: [
        "Den faller fra 1 200 til 1 100 kroner",
        "Den er uendret, fordi europrisen er den samme",
        "Den stiger fra 1 100 til 1 200 kroner",
        "Den blir 100 euro dyrere",
      ],
      answerIndex: 2,
      whyWrong: [
        "12 kroner per euro er dyrere enn 11. Prisen i kroner stiger.",
        "Europrisen er den samme, men hver euro koster flere kroner.",
        "",
        "Europrisen er fortsatt 100 euro. Det som endrer seg, er kronerprisen.",
      ],
      explain:
        "100 euro til 11 kroner er 1 100 kroner. Til 12 kroner er det 1 200 kroner. Eksemplet er ikke dagens kurs.",
    },
  },
  {
    id: "sh-1",
    pathId: "start-her",
    title: "Rente og renters rente",
    order: 0,
    summary: "Prisen på penger, og hvorfor tid betyr noe.",
    body: [
      "Rente er prisen for å låne penger, og betalingen du får når du låner penger til andre, for eksempel banken. Regneeksempel: 10 000 kroner til 5 prosent i ett år blir 10 500 kroner. Det er ikke renta du får i banken i dag.",
      "Boliglånsrenta er ikke det samme som styringsrenten. Styringsrenten er renta bankene får i Norges Bank. Boliglånet ditt ligger vanligvis høyere.",
      "Renters rente betyr at neste års rente regnes av det som allerede har vokst. Derfor betyr det mer hvor lenge pengene står, enn det føles som det første året.",
    ],
    conceptIds: ["rente", "renters-rente"],
    figureConceptId: "rente",
    quiz: {
      question: "Du setter inn 10 000 kroner til 5 prosent rente i ett år. Om lag hvor mye har du da?",
      options: [
        "10 500 kroner",
        "10 000 kroner",
        "15 000 kroner",
        "10 050 kroner",
      ],
      answerIndex: 0,
      whyWrong: [
        "",
        "Pengene blir stående, men renta legger noe på.",
        "5 prosent av 10 000 er 500, ikke 5 000.",
        "500 kroner er 5 prosent. 50 kroner ville vært 0,5 prosent.",
      ],
      explain: "5 prosent av 10 000 kroner er 500 kroner. Etter ett år er beløpet 10 500 kroner. Det er et regneeksempel.",
    },
  },
  {
    id: "sh-2",
    pathId: "start-her",
    title: "Inflasjon og realrente",
    order: 1,
    summary: "Hva renta er verdt når prisene stiger.",
    body: [
      "Inflasjon betyr at prisene samlet sett stiger, så en krone kjøper mindre. Det måles ofte med konsumprisindeksen.",
      "Realrente er renta etter prisvekst. Regneeksempel: 4 prosent på sparekontoen og 3 prosent prisvekst gir om lag 1 prosent realrente. Du kan kjøpe litt mer, ikke 4 prosent mer.",
      "Stiger prisene mer enn renta, faller kjøpekraften selv om det står flere kroner på kontoen.",
    ],
    conceptIds: ["inflasjon", "realrente"],
    figureConceptId: "realrente",
    quiz: {
      question: "Sparekontoen gir 4 prosent, og prisene stiger 3 prosent. Om lag hvor mye mer får du kjøpt?",
      options: [
        "4 prosent mer",
        "7 prosent mer",
        "Om lag 1 prosent mer",
        "Ingenting, prisene spiser hele renta",
      ],
      answerIndex: 2,
      whyWrong: [
        "4 prosent er renta før prisvekst. Du må trekke fra det varene koster mer.",
        "Du legger ikke renta og prisveksten sammen. Du trekker prisveksten fra.",
        "",
        "3 prosent er mindre enn 4 prosent, så det blir en liten rest igjen.",
      ],
      explain: "4 prosent minus 3 prosent er om lag 1 prosent. Det er realrenta i eksempelet, ikke en rente fra en bank i dag.",
    },
  },
  {
    id: "sh-3",
    pathId: "start-her",
    title: "Penger og banker",
    order: 2,
    summary: "Hva penger er, og hvordan et lån blir et innskudd.",
    body: [
      "Penger er det du kan betale med. Sedler i lomma og lønn på konto er begge penger.",
      "Når banken låner ut, får låntakeren et innskudd. Bruker hen pengene, får mottakeren et nytt innskudd i sin bank. Slik blir det flere kroner i banksystemet enn de sedlene du satte inn.",
      "Renta er prisen på slike lån. Derfor påvirker den hvor mange nye kroner som lages, og hva du betaler for boliglånet.",
    ],
    conceptIds: ["penger-og-banker"],
    figureConceptId: "penger-og-banker",
    quiz: {
      question: "Banken låner ut 100 000 kroner til en kunde. Hva skjer med innskuddene?",
      options: [
        "Banken låner bare ut de samme sedlene, og summen av innskudd er uendret",
        "Det oppstår et nytt innskudd",
        "Kundens lønnskonto blir slettet",
        "Norges Bank trykker 100 000 nye sedler til den kunden",
      ],
      answerIndex: 1,
      whyWrong: [
        "Lånet blir et innskudd hos den som mottar pengene. Det er flere kroner på konto enn sedlene som ble satt inn.",
        "",
        "Lånet sletter ikke lønnskontoen. Det legger til et innskudd.",
        "Et vanlig banklån er ikke det samme som at Norges Bank trykker sedler til én kunde.",
      ],
      explain: "Når banken låner ut, blir lånet et innskudd. Mottakeren får kroner på konto. Det er slik bankene lager nye innskudd.",
    },
  },
  {
    id: "sh-4",
    pathId: "start-her",
    title: "Aksjer og fond",
    order: 3,
    summary: "Eie en bit, eller eie sammen med andre.",
    body: [
      "En aksje er en eierandel i et selskap. Du kan få utbytte, og du kan tjene hvis kursen stiger. Kursen kan også falle.",
      "Et fond samler penger fra mange. Et aksjefond eier aksjer, et rentefond eier lån, og et kombinasjonsfond eier begge. Du eier en andel, ikke hvert papir selv.",
      "Den [[ter|årlige kostnaden]] trekkes hvert år. Regneeksempel, ikke en prognose: 100 000 kroner i 30 år med 6 prosent før kostnad blir om lag 542 713 kroner ved 0,2 prosent kostnad, og om lag 374 532 kroner ved 1,5 prosent.",
    ],
    conceptIds: ["aksje", "fond", "kostnader-i-fond"],
    figureConceptId: "fond",
    quiz: {
      question: "To fond har samme avkastning før kostnad. Det ene koster 0,2 prosent i året, det andre 1,5 prosent. Hva stemmer over 30 år?",
      options: [
        "De ender likt, fordi avkastningen før kostnad er lik",
        "Det dyre fondet ender høyere, fordi høy kostnad betyr høyere kvalitet",
        "Kostnaden merkes bare det første året",
        "Det billige fondet ender klart høyere, fordi kostnaden trekkes hvert år",
      ],
      answerIndex: 3,
      whyWrong: [
        "Samme avkastning før kostnad er ikke samme sluttbeløp. Kostnaden trekkes fra hvert år.",
        "Høyere kostnad er ikke et løfte om bedre avkastning. I eksempelet er avkastningen før kostnad den samme.",
        "Kostnaden tas hvert år, og renters rente gjør at forskjellen vokser.",
        "",
      ],
      explain:
        "I regneeksemplet, 100 000 kroner og 6 prosent før kostnad i 30 år, blir 0,2 prosent kostnad om lag 542 713 kroner og 1,5 prosent om lag 374 532 kroner. Det er ikke en prognose.",
    },
  },
];

export const learningPaths: LearningPath[] = [
  {
    id: "start-her",
    title: "Start her",
    subtitle: "Rente, prisvekst, banker, aksjer og fond.",
    category: "makro",
    estimatedMinutes: 12,
    lessonIds: ["sh-1", "sh-2", "sh-3", "sh-4"],
  },
  {
    id: "norsk-pengepolitikk",
    title: "Norsk pengepolitikk",
    subtitle:
      "Fra inflasjon og KPI til styringsrente, transmisjon og rentebane.",
    category: "makro",
    estimatedMinutes: 40,
    lessonIds: ["pp-1", "pp-2", "pp-3", "pp-4", "pp-5", "pp-6", "pp-7"],
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
    subtitle: "Utlånsforskriften, egenkapital, annuitet og serielån, fellesgjeld, leie mot eie og renta på lånet.",
    category: "personlig",
    estimatedMinutes: 24,
    lessonIds: ["bo-1", "bo-2", "bo-5", "bo-3", "bo-4", "bo-6"],
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
  "alminnelig-inntekt",
  "buffer",
  "rente",
  "realrente",
  "penger-og-banker",
  "aksje",
  "fond",
  "etf",
  "kostnader-i-fond",
  "kurtasje-valutapaslag",
  "grunnbelop",
  "innskuddspensjon",
  "ytelsespensjon",
  "fastrente",
  "nominell-effektiv",
  "rentefradrag",
  "konjunktur",
  "deflasjon",
  "importert-inflasjon",
]);

const synonyms: Record<string, string[]> = {
  oljefondet: ["spu", "pensjonsfondet", "oljefond", "statens pensjonsfond"],
  styringsrenten: ["sentralbankrenta", "foliorente", "policy rate"],
  rente: ["renta", "renten", "renter"],
  aksje: ["aksjer", "aksjen"],
  fond: ["aksjefond", "rentefond", "fondet"],
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
  importpriser: ["importpris", "importprisen"],
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

function conceptRank(concept: Concept, query: string): number {
  const term = fold(concept.term);
  const syns = (synonyms[concept.id] ?? []).map((item) => fold(item));
  if (term === query || syns.includes(query)) return 0;
  if (term.startsWith(query)) return 1;
  return 2;
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
      stripMarkup(
        `${c.term} ${c.english ?? ""} ${c.definition} ${c.explanation} ${c.example ?? ""} ${c.forYou ?? ""} ${c.tip ?? ""} ${syn}`
      )
    );
    return hay.includes(q);
  });
  conceptHits.sort((a, b) => conceptRank(a, q) - conceptRank(b, q));
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

  const first = (query: string) => searchLearning(query).concepts[0]?.id;
  if (first("renta") !== "rente") throw new Error("Søk på renta skal treffe rente først");
  if (first("renten") !== "rente") throw new Error("Søk på renten skal treffe rente først");
  if (first("aksjer") !== "aksje") throw new Error("Søk på aksjer skal treffe aksje først");
  if (first("aksjefond") !== "fond") throw new Error("Søk på aksjefond skal treffe fond først");
  if (first("rentefond") !== "fond") throw new Error("Søk på rentefond skal treffe fond først");
  if (first("fond") !== "fond") throw new Error("Søk på fond skal treffe fond først");
}

assertLearning();
