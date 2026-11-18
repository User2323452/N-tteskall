import type { Concept } from "@/types/learning";

function c(
  id: string,
  term: string,
  english: string,
  category: Concept["category"],
  definition: string,
  explanation: string,
  relatedIds?: string[],
  tip?: string
): Concept {
  return { id, term, english, category, definition, explanation, relatedIds, tip };
}

/** Begreper utover kjerneløpene — korte definisjoner til oversikt og søk. */
export const extraConcepts: Concept[] = [
  c(
    "kpi",
    "Konsumprisindeks (KPI)",
    "Consumer price index (CPI)",
    "makro",
    "SSBs indeks for prisutviklingen på varene og tjenestene husholdningene kjøper.",
    "KPI følger en handlekurv over tid. Tolvmånedersveksten er det vanlige målet når nyhetene sier at inflasjonen er så og så høy. Enkeltpriser kan hoppe uten at hele indeksen gjør det samme.",
    ["inflasjon", "kpi-jae", "kjopkraft"]
  ),
  c(
    "kpi-jae",
    "KPI-JAE",
    "CPI-ATE",
    "makro",
    "KPI justert for avgiftsendringer og uten energivarer. Ofte brukt som mål på underliggende prisvekst.",
    "Strømpriser og avgifter svinger av grunner som ikke alltid sier noe om presset i økonomien. KPI-JAE demper den støyen. Norges Bank ser på flere mål samtidig.",
    ["kpi", "inflasjon", "inflasjonsmal"]
  ),
  c(
    "inflasjonsmal",
    "Inflasjonsmål",
    "Inflation target",
    "makro",
    "Operativt mål for pengepolitikken: konsumprisveksten skal over tid ligge nær 2 prosent.",
    "Målet er et anker for lønns- og prisfastsetting, ikke et krav om at KPI treffer 2 prosent hver måned. Tallet står i mandatet — sjekk Norges Bank hvis du skal sitere det i et arbeid.",
    ["inflasjon", "fleksibel-inflasjonsstyring", "styringsrenten"],
    "Sjekk gjeldende mandat. 2 prosent er ankeret, ikke en månedlig fasit."
  ),
  c(
    "fleksibel-inflasjonsstyring",
    "Fleksibel inflasjonsstyring",
    "Flexible inflation targeting",
    "makro",
    "Pengepolitikken vekter både inflasjon og produksjon og sysselsetting.",
    "Banken prøver ikke å presse inflasjonen tilbake på én måned hvis det ville gitt et unødvendig hopp i ledigheten. Avveiningen gjøres over en horisont på noen år.",
    ["inflasjonsmal", "produksjonsgap", "styringsrenten"]
  ),
  c(
    "ppr",
    "Pengepolitisk rapport",
    "Monetary Policy Report",
    "makro",
    "Norges Banks rapport med analyser og rentebane, publisert flere ganger i året.",
    "Rapporten forklarer vurderingen bak rentebeslutningen. Rentebanen i rapporten er et anslag gitt informasjonen der og da, ikke et løfte.",
    ["rentebanen", "styringsrenten"]
  ),
  c(
    "transmisjon",
    "Transmisjonsmekanisme",
    "Transmission mechanism",
    "makro",
    "Kanalene fra en endring i styringsrenten til aktivitet og priser.",
    "Etterspørselskanalen: høyere rente demper forbruk og investering. Valutakurskanalen: renta kan påvirke krona og dermed importerte priser. Forventningskanalen: troen på målet setter seg i lønns- og prisfastsetting.",
    ["styringsrenten", "inflasjon"]
  ),
  c(
    "pengepolitikk",
    "Pengepolitikk",
    "Monetary policy",
    "makro",
    "Norges Banks styring av rente og likviditet i kronemarkedet for å nå inflasjonsmålet.",
    "Verktøyet folk møter, er styringsrenten. Finanspolitikken — statsbudsjettet og bruken av oljepenger — er et annet spor og ligger under norsk økonomi i oversikten.",
    ["styringsrenten", "inflasjonsmal", "finanspolitikk"]
  ),
  c(
    "produksjonsgap",
    "Produksjonsgap",
    "Output gap",
    "makro",
    "Avvik mellom faktisk produksjon og det økonomien kan produsere uten tiltagende inflasjonspress.",
    "Positivt gap betyr press: aktiviteten er høyere enn det som er holdbart uten at prisene skyter fart. Negativt gap betyr slakk. Gapet er et anslag, ikke et tall du kan lese av en kassalapp.",
    ["fleksibel-inflasjonsstyring", "inflasjon"]
  ),
  c(
    "nbim",
    "NBIM",
    "Norges Bank Investment Management",
    "olje",
    "Den operative forvalteren av Oljefondet (Statens pensjonsfond utland).",
    "NBIM investerer fondet i utlandet etter et mandat. Norges Bank som sentralbank setter styringsrenten. Samme institusjonsfamilie, to ulike oppgaver.",
    ["oljefondet", "handlingsregelen"]
  ),
  c(
    "strukturelt-underskudd",
    "Strukturelt oljekorrigert underskudd",
    "Structural non-oil deficit",
    "olje",
    "Mål på oljepengebruken over statsbudsjettet, justert for konjunkturen.",
    "Tallet brukes når man sammenligner faktisk bruk med handlingsregelen. Det er et budsjettmål, ikke en rente.",
    ["handlingsregelen", "finanspolitikk", "oljefondet"]
  ),
  c(
    "finanspolitikk",
    "Finanspolitikk",
    "Fiscal policy",
    "olje",
    "Statens inntekter, utgifter og bruk av oljepenger over statsbudsjettet.",
    "Finanspolitikken vedtas av Stortinget. Pengepolitikken besluttes av Norges Bank. De påvirker hverandre, men de er ikke samme virkemiddel.",
    ["handlingsregelen", "pengepolitikk"]
  ),
  c(
    "realavkastning",
    "Realavkastning",
    "Real return",
    "olje",
    "Avkastning etter at inflasjon er trukket fra.",
    "Handlingsregelen tar utgangspunkt i forventet realavkastning av fondet over tid, ofte omtalt rundt 3 prosent. Anslaget oppdateres — sjekk gjeldende budsjettdokumenter.",
    ["handlingsregelen", "oljefondet", "inflasjon"],
    "3 prosent er et anslag som kan endres. Sjekk året."
  ),
  c(
    "bnp",
    "Bruttonasjonalprodukt (BNP)",
    "Gross domestic product (GDP)",
    "olje",
    "Samlet verdiskaping i landet i en periode.",
    "BNP kan måles i løpende priser eller faste priser. Faste priser brukes når man vil se volum, ikke bare at prisene har steget.",
    ["bnp-fastland"]
  ),
  c(
    "bnp-fastland",
    "BNP Fastlands-Norge",
    "Mainland GDP",
    "olje",
    "BNP uten olje og gass, rørtransport og utenriks sjøfart.",
    "Fastlandet viser aktiviteten der de fleste jobber, uten at oljeprisen dominerer tallet. Derfor brukes det ofte når Norges Bank vurderer press i økonomien.",
    ["bnp", "produksjonsgap"]
  ),
  c(
    "indeksfond",
    "Indeksfond",
    "Index fund",
    "personlig",
    "Fond som følger en indeks, som regel med lav årlig kostnad.",
    "Du eier en bit av markedet i indeksen, ikke en forvalters utvalgte aksjer. Kostnaden (TER) spiser av renters rente over tid. Markedsrisikoen blir igjen: fondet faller når markedet faller.",
    ["renters-rente", "risiko-avkastning", "diversifisering", "ask"]
  ),
  c(
    "bsu",
    "Boligsparing for ungdom (BSU)",
    "Home savings scheme for youth",
    "personlig",
    "Spareordning med skattefradrag, under vilkår om alder og at pengene brukes til bolig.",
    "BSU bygger egenkapital til bolig. Det er et annet valg enn ASK: formålet er låst, og forventet avkastning er lavere enn i aksjemarkedet. Satser og aldersgrense endres.",
    ["belaningsgrad", "ask"],
    "Sjekk Skatteetaten for årets satser og aldersgrense."
  ),
  c(
    "folketrygd",
    "Folketrygd",
    "National insurance pension",
    "personlig",
    "Den offentlige grunnpensjonen. Størrelsen henger på inntekt, botid og når du tar den ut.",
    "Folketrygden er det nederste laget. Oppå kommer tjenestepensjon fra arbeidsgiver, og eventuelt egen sparing. Grunnbeløpet (G) brukes når ytelsene beregnes.",
    ["grunnbelop", "otp", "ips"]
  ),
  c(
    "grunnbelop",
    "Grunnbeløpet (G)",
    "National insurance basic amount",
    "personlig",
    "Et beløp Stortinget regulerer, brukt til å beregne pensjon og trygdeytelser.",
    "G oppdateres, normalt én gang i året. Når noen sier «2 G» eller «6 G», mener de et multiplum av dette beløpet — sjekk NAV for gjeldende kronebeløp.",
    ["folketrygd", "otp"]
  ),
  c(
    "annuitetslan",
    "Annuitetslån",
    "Annuity loan",
    "personlig",
    "Lån med fast terminbeløp gjennom løpetiden. Renteandelen faller, avdragsandelen stiger.",
    "Du betaler omtrent det samme hver termin. I starten er mye av beløpet renter. Mot slutten er mer avdrag. Serielån har i stedet fast avdrag og synkende terminbeløp.",
    ["serielan", "nominell-effektiv", "belaningsgrad"]
  ),
  c(
    "serielan",
    "Serielån",
    "Serial loan",
    "personlig",
    "Lån med fast avdrag. Terminbeløpet synker fordi renta beregnes av stadig lavere restgjeld.",
    "De første årene er dyrere enn på et annuitetslån med samme rente og løpetid. Du betaler ned lånet raskere, og betaler derfor mindre renter totalt.",
    ["annuitetslan", "nominell-effektiv"]
  ),
  c(
    "gjeldsgrad",
    "Gjeldsgrad",
    "Debt-to-income",
    "personlig",
    "Samlet gjeld delt på brutto årsinntekt.",
    "Utlånsforskriften setter en ramme for hvor høy gjeldsgraden kan være. Banken kan ha egne, strengere grenser, og skal i tillegg stresse betjeningsevnen med høyere rente.",
    ["utlansforskriften", "belaningsgrad"]
  ),
  c(
    "nominell-effektiv",
    "Nominell vs. effektiv rente",
    "Nominal vs. effective interest rate",
    "personlig",
    "Nominell rente er den oppgitte renta. Effektiv rente tar med gebyrer og hvor ofte renta legges til.",
    "To lån med samme nominelle rente kan ha ulik effektiv rente hvis etableringsgebyr og termingebyr er ulike. Når du sammenligner tilbud, er det effektiv rente som viser årskostnaden.",
    ["annuitetslan", "styringsrenten"]
  ),
  c(
    "rentefradrag",
    "Rentefradrag",
    "Interest deduction",
    "personlig",
    "Gjeldsrenter trekkes fra i alminnelig inntekt og reduserer skatten.",
    "Fradraget gjør at den reelle kostnaden av lånet er lavere enn renteregningen alene. Satsen følger skatten på alminnelig inntekt — sjekk året.",
    ["annuitetslan", "alminnelig-inntekt"]
  ),
  c(
    "alminnelig-inntekt",
    "Alminnelig inntekt",
    "Ordinary income",
    "personlig",
    "Inntektsgrunnlaget etter fradrag, som skattlegges med den flate satsen på alminnelig inntekt.",
    "Lønn, renter og aksjeinntekt behandles ulikt før de havner her. Personfradrag og minstefradrag er vanlige poster på veien. Satser endres hvert år.",
    ["personfradrag", "minstefradrag", "rentefradrag"]
  ),
  c(
    "personfradrag",
    "Personfradrag",
    "Personal allowance",
    "personlig",
    "Et bunnfradrag i alminnelig inntekt. Beløpet reguleres årlig.",
    "Fradraget gjelder skatten på alminnelig inntekt. Ubrukt fradrag følger ikke med inn i neste år. Sjekk Skatteetaten for årets beløp.",
    ["alminnelig-inntekt", "minstefradrag"],
    "Beløpet endres. Sjekk året."
  ),
  c(
    "minstefradrag",
    "Minstefradrag",
    "Minimum standard deduction",
    "personlig",
    "Standardfradrag i lønnsinntekt: en prosent av lønnen, opp til et tak.",
    "Fradraget skal grovt dekke kostnader ved å ha jobb. Prosentsats og makstak settes i budsjettet — sjekk Skatteetaten for året.",
    ["personfradrag", "alminnelig-inntekt"]
  ),
  c(
    "tidsverdi",
    "Tidsverdien av penger",
    "Time value of money",
    "marked",
    "En krone i dag er mer verdt enn en krone senere, fordi den kan gi avkastning i mellomtiden.",
    "Derfor diskonterer man framtidige beløp når man verdsetter et selskap eller sammenligner spareplaner. Renters rente er den samme ideen sett fra sparekontoen.",
    ["naverdi", "renters-rente", "dcf"]
  ),
  c(
    "naverdi",
    "Nåverdi",
    "Present value",
    "marked",
    "Verdien i dag av beløp som kommer senere, etter at tidsverdien er trukket fra.",
    "Høyere diskonteringsrente gir lavere nåverdi. Det er kjernen i nåverdimetoden (DCF).",
    ["tidsverdi", "dcf", "wacc"]
  ),
  c(
    "multiplikatorer",
    "Multiplikatorer",
    "Valuation multiples",
    "marked",
    "Prising ved å sammenligne med lignende selskaper, for eksempel P/E, EV/EBITDA og P/B.",
    "Multipler er raske og relative. De sier hva markedet betaler for en krone inntjening eller bokført egenkapital — ikke hva selskapet er «verdt» i en absolutt forstand.",
    ["pb", "evebitda", "dcf"]
  ),
  c(
    "pb",
    "Pris/bok (P/B)",
    "Price-to-book",
    "marked",
    "Børsverdi delt på bokført egenkapital. Hovedmultiplikatoren for banker.",
    "Bankenes balanse er i stor grad finansielle eiendeler, så bokført egenkapital er et naturlig anker. P/B leses sammen med egenkapitalavkastningen (ROE).",
    ["multiplikatorer", "roe", "ekb"]
  ),
  c(
    "evebitda",
    "EV/EBITDA",
    "Enterprise value / EBITDA",
    "marked",
    "Selskapsverdi (egenkapital pluss netto gjeld) delt på driftsresultat før av- og nedskrivninger.",
    "EV tar med gjelden, så multippelen kan sammenligne selskaper med ulik lånegrad bedre enn en ren P/E.",
    ["multiplikatorer", "dcf"]
  ),
  c(
    "dcf",
    "Nåverdimetoden (DCF)",
    "Discounted cash flow",
    "marked",
    "Verdien er summen av framtidige kontantstrømmer, diskontert til i dag.",
    "Metoden krever en prognose og en diskonteringsrente, ofte totalkapitalkostnaden (WACC). Små endringer i renta eller terminalverdien flytter verdien mye.",
    ["naverdi", "wacc", "tidsverdi"]
  ),
  c(
    "wacc",
    "Totalkapitalkostnad (WACC)",
    "Weighted average cost of capital",
    "marked",
    "Snittavkastningen långivere og eiere krever, vektet etter andel gjeld og egenkapital.",
    "WACC brukes som diskonteringsrente i DCF til totalkapitalen. Egenkapitalkravet kommer ofte fra CAPM.",
    ["dcf", "capm", "beta"]
  ),
  c(
    "capm",
    "CAPM",
    "Capital asset pricing model",
    "marked",
    "Avkastningskrav = risikofri rente + beta × markedets risikopremie.",
    "Modellen sier at det er den systematiske risikoen — beta — du får betalt for. Selskapsspesifikk risiko kan spres bort.",
    ["beta", "wacc", "risiko-avkastning"]
  ),
  c(
    "beta",
    "Beta",
    "Beta",
    "marked",
    "Hvor mye en aksje svinger i forhold til markedet.",
    "Beta over 1 betyr kraftigere utslag enn markedet når markedet beveger seg. Beta estimeres ofte med minste kvadraters metode (OLS) på historiske avkastninger.",
    ["capm", "ols"]
  ),
  c(
    "durasjon",
    "Durasjon",
    "Duration",
    "marked",
    "Mål på rentefølsomhet: hvor mye obligasjonsprisen faller når renta stiger.",
    "Lang durasjon betyr at prisen reagerer kraftig på renteendringer. Pris og rente beveger seg motsatt vei.",
    ["yield", "obligasjon"]
  ),
  c(
    "yield",
    "Effektiv rente (yield)",
    "Yield to maturity",
    "marked",
    "Årlig avkastning på en obligasjon hvis du kjøper til dagens pris og holder til forfall.",
    "Yield er ikke det samme som kupongrenten. Hvis prisen er under pålydende, ligger yield over kupongen. Dette er obligasjonsmarkedet — effektiv rente på et boliglån er et annet begrep.",
    ["obligasjon", "durasjon", "nominell-effektiv"]
  ),
  c(
    "kredittpaslag",
    "Kredittpåslag",
    "Credit spread",
    "marked",
    "Ekstra rente over risikofri rente, som betaling for kredittrisiko.",
    "Et selskap med svakere økonomi betaler et høyere påslag enn staten. Påslaget kan endre seg selv om styringsrenten står stille.",
    ["yield", "obligasjon"]
  ),
  c(
    "omf",
    "Obligasjoner med fortrinnsrett (OMF)",
    "Covered bonds",
    "marked",
    "Obligasjoner med fortrinnsrett i en sikkerhetsmasse, ofte boliglån.",
    "OMF er den viktigste måten norske banker finansierer boliglån på, ved siden av innskudd. Lavere kredittrisiko for investor gir vanligvis lavere rente enn usikret bankgjeld.",
    ["obligasjon", "belaningsgrad"]
  ),
  c(
    "obligasjon",
    "Obligasjon",
    "Bond",
    "marked",
    "Et lån som er gjort om til et omsettelig papir, med kupong og forfall.",
    "Kjøperen låner ut penger. Prisen i markedet faller når rentene stiger, og omvendt. Yielden er den effektive avkastningen gitt prisen du betaler.",
    ["yield", "durasjon", "omf"]
  ),
  c(
    "rentebytte",
    "Rentebytteavtale",
    "Interest rate swap",
    "marked",
    "Avtale om å bytte rentebetalinger, typisk fast rente mot flytende.",
    "Banker og selskaper bruker byttene til å styre renterisiko. Verdien av avtalen endrer seg når markedsrentene endrer seg.",
    ["nibor", "durasjon"]
  ),
  c(
    "sharpe",
    "Sharpe-rate",
    "Sharpe ratio",
    "marked",
    "Meravkastning over risikofri rente, delt på standardavviket.",
    "Tallet sier noe om avkastning per enhet svingning. Høyere er bedre i denne målestokken, men det fanger ikke all risiko — for eksempel skjeve tap.",
    ["risiko-avkastning", "diversifisering"]
  ),
  c(
    "kronekurs",
    "Kronekurs",
    "NOK exchange rate",
    "marked",
    "Prisen på norske kroner mot andre valutaer.",
    "En svakere krone gjør import dyrere i kroner og kan løfte inflasjonen. Det er valutakurskanalen i transmisjonen. I-44 er en handelsvektet indeks for krona.",
    ["transmisjon", "inflasjon"]
  ),
  c(
    "rentenetto",
    "Rentenetto",
    "Net interest income",
    "bank",
    "Renteinntekter fra utlån minus rentekostnader på innskudd og innlån.",
    "For de fleste norske banker er rentenettoen den viktigste inntekten. Den er et kronebeløp — rentemarginen er den relative forskjellen.",
    ["innskuddsdekning", "roe"]
  ),
  c(
    "innskuddsdekning",
    "Innskuddsdekning",
    "Deposit-to-loan ratio",
    "bank",
    "Innskudd fra kunder delt på utlån.",
    "Høy dekning betyr at en større del av utlånene er finansiert med innskudd. Resten finansieres blant annet med OMF og annen gjeld.",
    ["rentenetto", "omf"]
  ),
  c(
    "ki",
    "Kostnad/inntekt (K/I)",
    "Cost-to-income ratio",
    "bank",
    "Driftskostnader delt på inntekter. Lavere tall betyr mer effektiv drift.",
    "K/I sier ikke noe om kredittrisiko. En bank kan ha lav K/I og likevel store tap på utlån.",
    ["rentenetto", "roe"]
  ),
  c(
    "roe",
    "Egenkapitalavkastning (ROE)",
    "Return on equity",
    "bank",
    "Resultat delt på egenkapital.",
    "For banker leses ROE sammen med P/B. Høy avkastning kan komme av høy risiko eller tynn egenkapital, så tallet alene er ikke en fasit.",
    ["pb", "cet1", "rentenetto"]
  ),
  c(
    "cet1",
    "Ren kjernekapitaldekning (CET1)",
    "Common equity tier 1 ratio",
    "bank",
    "Den reneste egenkapitalen delt på risikovektede eiendeler.",
    "CET1 er hovedmålet på hvor mye tap en bank kan ta før egenkapitalen er brukt opp. Kravet inkluderer buffere og er høyere enn et nakent minimum.",
    ["roe", "tap-pa-utlan"]
  ),
  c(
    "tap-pa-utlan",
    "Tap på utlån",
    "Loan losses",
    "bank",
    "Forventede og faktiske tap på lån.",
    "Økte tap er et tidlig varsel om at kredittkvaliteten svekkes. I regnskapet bokføres mye av dette som nedskrivninger før tapet er endelig konstatert.",
    ["cet1", "rentenetto"]
  ),
  c(
    "ekb",
    "Egenkapitalbevis (EKB)",
    "Equity certificate",
    "bank",
    "Sparebankens omsettelige eierinstrument, med rett på utbytte.",
    "EKB ligner en aksje, men sparebanken har også samfunnseid kapital. Fordelingen mellom dem kalles eierbrøken.",
    ["eierbrok", "sparebankstiftelse", "pb"]
  ),
  c(
    "eierbrok",
    "Eierbrøk",
    "Ownership fraction",
    "bank",
    "Fordelingen mellom eierandelskapital (EKB) og den samfunnseide kapitalen i en sparebank.",
    "Eierbrøken styrer hvordan overskuddet deles mellom utbytte til EKB-eierne og den eierløse kapitalen.",
    ["ekb", "sparebankstiftelse"]
  ),
  c(
    "sparebankstiftelse",
    "Sparebankstiftelse",
    "Savings bank foundation",
    "bank",
    "Stiftelse som eier aksjer etter at en sparebank er omdannet, for eksempel Sparebankstiftelsen DNB.",
    "Stiftelsen kan dele ut gaver og er ofte en stor eier. Den er ikke det samme som egenkapitalbevis i en sparebank som fortsatt er sparebank.",
    ["ekb", "eierbrok"]
  ),
  c(
    "resultatregnskap",
    "Resultatregnskap",
    "Income statement",
    "metode",
    "Inntekter minus kostnader i en periode.",
    "Resultatet sier hva som ble tjent i perioden, ikke hvor mye kontanter som kom inn. Kontantstrømmen er et eget oppsett.",
    ["balanse", "kontantstrom"]
  ),
  c(
    "balanse",
    "Balanse",
    "Balance sheet",
    "metode",
    "Eiendeler = egenkapital + gjeld, målt på et tidspunkt.",
    "Balansen er et øyeblikksbilde. Resultatregnskapet er perioden som forklarer mye av endringen i egenkapitalen.",
    ["resultatregnskap", "kontantstrom"]
  ),
  c(
    "kontantstrom",
    "Kontantstrømoppstilling",
    "Cash flow statement",
    "metode",
    "Faktiske inn- og utbetalinger, delt på drift, investering og finansiering.",
    "Et selskap kan ha overskudd og likevel svak kontantstrøm, eller omvendt. DCF bygger på kontantstrøm, ikke på resultatet alene.",
    ["resultatregnskap", "dcf"]
  ),
  c(
    "ols",
    "Minste kvadraters metode (OLS)",
    "Ordinary least squares",
    "metode",
    "Regresjon som finner linja som minimerer summen av kvadrerte avvik.",
    "I finans brukes OLS blant annet til å estimere beta: hvor mye en aksje har samvariert med markedet. Korrelasjon er ikke det samme som årsak.",
    ["beta"]
  ),
];
