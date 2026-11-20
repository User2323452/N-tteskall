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

/** Konsepter utover kjerneløpene — korte definisjoner til oversikt og søk. */
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
    "Målet er et anker for lønns- og prisfastsetting, ikke et krav om at KPI treffer 2 prosent hver måned.",
    ["inflasjon", "fleksibel-inflasjonsstyring", "styringsrenten"],
    "2 prosent er ankeret, ikke en månedlig fasit."
  ),
  c(
    "fleksibel-inflasjonsstyring",
    "Fleksibel inflasjonsstyring",
    "Flexible inflation targeting",
    "makro",
    "Pengepolitikken vekter inflasjon mot produksjon og sysselsetting, og skal kunne motvirke oppbygging av finansielle ubalanser.",
    "Banken prøver ikke å presse inflasjonen tilbake på én måned hvis det ville gitt et unødvendig hopp i ledigheten. Avveiningen gjøres over en horisont på noen år. Forskrift for pengepolitikken § 3 sier at styringen også skal kunne motvirke oppbygging av finansielle ubalanser. Inflasjonsmålet er nær 2 prosent over tid.",
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
    "Verktøyet folk møter, er styringsrenten. Finanspolitikken — statsbudsjettet og bruken av oljepenger — er et annet spor.",
    ["styringsrenten", "inflasjonsmal", "finanspolitikk"]
  ),
  c(
    "produksjonsgap",
    "Produksjonsgap",
    "Output gap",
    "makro",
    "Avvik mellom faktisk produksjon og det økonomien kan produsere uten tiltagende inflasjonspress.",
    "Positivt gap betyr press: aktiviteten er høyere enn det som er holdbart uten at prisene skyter fart. Negativt gap betyr slakk. Gapet er et anslag, ikke et tall du kan lese av en kassalapp.",
    ["fleksibel-inflasjonsstyring", "inflasjon", "konjunktur", "arbeidsledighet"]
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
    "Det oljekorrigerte underskuddet justert for konjunktur. Dette tallet sammenlignes med handlingsregelen.",
    "Overføringen fra Statens pensjonsfond utland er lik det oljekorrigerte underskuddet, det faktiske underskuddet uten oljeinntekter. Det strukturelle tallet er det samme justert for konjunktur. I anslaget for 2026 er den faktiske overføringen 454,8 milliarder kroner. Det strukturelle underskuddet står i tabellen. Det er et budsjettmål, ikke en rente.",
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
    "BSU bygger egenkapital til bolig. Det er et annet valg enn ASK: formålet er låst, og forventet avkastning er lavere enn i aksjemarkedet. Du kan spare inntil {{sats:bsu-aar}}, samlet inntil {{sats:bsu-samlet}}, med fradrag på {{sats:bsu-fradrag}}. Sparing med fradrag gjelder til og med {{sats:bsu-alder}}.",
    ["belaningsgrad", "ask"]
  ),
  c(
    "folketrygd",
    "Folketrygd",
    "National insurance pension",
    "personlig",
    "Den offentlige alderspensjonen. I det nye systemet er den inntektspensjon pluss garantipensjon.",
    "Folketrygden er det nederste laget. Oppå kommer tjenestepensjon fra arbeidsgiver, og eventuelt egen sparing. Inntekt og uttakstidspunkt betyr mest for inntektspensjonen. Botid, som trygdetid, betyr mest for garantipensjonen. Grunnpensjon er en ytelse i det gamle systemet, sammen med tilleggspensjon. Grunnbeløpet (G) brukes når ytelsene beregnes. Fra 1. mai er det {{sats:grunnbelop}}.",
    ["grunnbelop", "otp", "ips"]
  ),
  c(
    "grunnbelop",
    "Grunnbeløpet (G)",
    "National insurance basic amount",
    "personlig",
    "Beløpet folketrygdens ytelser regnes ut fra. Kongen fastsetter det, og det reguleres hvert år fra 1. mai i takt med lønnsveksten.",
    "Folketrygdloven § 1-4 sier at grunnbeløpet fastsettes av Kongen. Siden 2011 er det regjeringen i statsråd som fastsetter beløpet etter trygdeoppgjøret. Fra 1. mai er grunnbeløpet {{sats:grunnbelop}}. Når noen sier «2 G» eller «6 G», mener de et multiplum av dette beløpet.",
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
    "Utlånsforskriften setter rammen til {{sats:utlan-gjeld}}. Banken kan ha egne, strengere grenser, og skal i tillegg stresse betjeningsevnen med høyere rente.",
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
    "Fradraget gjør at den reelle kostnaden av lånet er lavere enn renteregningen alene. Satsen følger skatten på alminnelig inntekt, {{sats:alminnelig-sats}}.",
    ["annuitetslan", "alminnelig-inntekt"]
  ),
  c(
    "alminnelig-inntekt",
    "Alminnelig inntekt",
    "Ordinary income",
    "personlig",
    "Inntektsgrunnlaget etter fradrag, som skattlegges med den flate satsen på alminnelig inntekt.",
    "Lønn, renter og aksjeinntekt behandles ulikt før de havner her. Personfradrag og minstefradrag er vanlige poster på veien. Satsen på alminnelig inntekt er {{sats:alminnelig-sats}}. Den vedtas for hvert år.",
    ["personfradrag", "minstefradrag", "rentefradrag"]
  ),
  c(
    "personfradrag",
    "Personfradrag",
    "Personal allowance",
    "personlig",
    "Et bunnfradrag i alminnelig inntekt. Beløpet reguleres årlig.",
    "Fradraget gjelder skatten på alminnelig inntekt. Ubrukt fradrag følger ikke med inn i neste år. Beløpet i år er {{sats:personfradrag}}.",
    ["alminnelig-inntekt", "minstefradrag"]
  ),
  c(
    "minstefradrag",
    "Minstefradrag",
    "Minimum standard deduction",
    "personlig",
    "Standardfradrag i lønnsinntekt: en prosent av lønnen, opp til et tak.",
    "Fradraget skal grovt dekke kostnader ved å ha jobb. I lønn er satsen {{sats:minstefradrag-sats}}, med øvre grense {{sats:minstefradrag-tak}}.",
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
    ["beta", "wacc", "risiko-avkastning", "risikopremie"]
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
    "Yield er ikke det samme som kupongrenten. Hvis prisen er under pålydende, ligger yield over kupongen. Dette er obligasjonsmarkedet — effektiv rente på et boliglån er et annet konsept.",
    ["obligasjon", "durasjon", "nominell-effektiv", "kupongrente"]
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
    ["yield", "durasjon", "omf", "kupongrente"]
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
    ["risiko-avkastning", "diversifisering", "volatilitet", "standardavvik"]
  ),
  c(
    "kronekurs",
    "Kronekurs",
    "NOK exchange rate",
    "marked",
    "Prisen på norske kroner mot andre valutaer.",
    "Svakere krone vil si flere kroner per euro eller dollar. Kronen styrkes ofte når renta i Norge er høyere enn ute, når oljeprisen er høy, eller når markedene er rolige. Den svekkes når rentedifferansen faller, oljeprisen faller, eller uro sender kapital mot større valutaer. Svakere krone gjør import dyrere. I-44 er Norges Banks handelsvektede indeks, og den stiger når kronen svekker seg. Dette er tendenser, ikke en lov.",
    ["transmisjon", "inflasjon", "importpriser", "styringsrenten", "eos"]
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
    ["roe", "tap-pa-utlan", "motsyklisk-buffer"]
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
  c(
    "trinnskatt",
    "Trinnskatt",
    "Bracket tax",
    "personlig",
    "Progressiv skatt på personinntekt, i tillegg til den flate skatten på alminnelig inntekt.",
    "Trinnskatten gjelder lønn, trygd og annen personinntekt. Inntekt over et trinn får en høyere sats. Den høyeste satsen gjelder bare den delen som ligger over trinnet, ikke hele inntekten. Satser og grenser vedtas hvert år. Skatteetaten viser gjeldende trinn.",
    ["minstefradrag", "alminnelig-inntekt", "formuesskatt"],
    "Den høyeste satsen gjelder bare inntekten over trinnet."
  ),
  c(
    "formuesskatt",
    "Formuesskatt",
    "Wealth tax",
    "personlig",
    "Skatt på nettoformue — eiendeler minus gjeld — over et bunnfradrag.",
    "Formueskatt er samme skatt. Grunnlaget er ligningsverdi, ikke nødvendigvis markedsverdi: primærbolig og aksjer verdsettes lavere. Gjeld trekkes fra. Skatten har en kommunal og en statlig del. Bunnfradrag og satser står i budsjettet. Sjekk Skatteetaten for året.",
    ["trinnskatt", "ask", "alminnelig-inntekt", "verdsettingsrabatt"]
  ),
  c(
    "tjenestepensjon",
    "Tjenestepensjon",
    "Occupational pension",
    "personlig",
    "Pensjon fra jobben, i tillegg til folketrygden.",
    "I privat sektor er en minstesparing lovpålagt: obligatorisk tjenestepensjon (OTP). Mange arbeidsgivere sparer mer. Den vanlige ordningen er innskuddspensjon: innskuddet er avtalt, utbetalingen avhenger av avkastning. Offentlig sektor har egne ordninger. AFP kan komme i tillegg der tariffavtalen gir det.",
    ["otp", "folketrygd", "ips", "afp", "innskuddspensjon", "ytelsespensjon"]
  ),
  c(
    "egenkapital",
    "Egenkapital",
    "Equity (home purchase)",
    "personlig",
    "Den delen av boligkjøpet du stiller med selv, ikke låner.",
    "Egenkapital er boligverdi minus lån. Belåningsgrad er lånet delt på verdien. For nedbetalingslån er grensen {{sats:utlan-belaning}}, og resten er egenkapital. Pengene kan komme fra sparing, salg av bolig eller gave. Annet lån regnes ikke som egenkapital.",
    ["belaningsgrad", "utlansforskriften", "bsu", "fellesgjeld"],
    "Egenkapital = verdi − lån. Belåningsgrad = lån / verdi."
  ),
  c(
    "fellesgjeld",
    "Fellesgjeld",
    "Shared debt (housing co-op)",
    "personlig",
    "Din andel av lånet i borettslaget eller sameiet.",
    "Prisantydningen er ofte bare innskuddet. Totalpris er innskudd pluss fellesgjeld. Gjelden betjenes gjennom felleskostnadene. Noen lag lar deg betale ned din andel (IN-ordning). Banken tar normalt fellesgjelden med når den vurderer lån og belåningsgrad.",
    ["egenkapital", "belaningsgrad", "utlansforskriften"],
    "Se på totalpris, ikke bare innskuddet i annonsen."
  ),
  c(
    "leie-mot-eie",
    "Leie mot eie",
    "Rent-to-own",
    "personlig",
    "Avtale der du leier boligen en periode, med rett eller plikt til å kjøpe den senere.",
    "Også kalt leie til eie. En del av leien kan være avtalt å telle som egenkapital. Vilkårene varierer. Du må fortsatt oppfylle bankens krav, inkludert utlånsforskriften, når kjøpet skal gjennomføres. Det er ikke en vanlig leiekontrakt.",
    ["egenkapital", "utlansforskriften"]
  ),
  c(
    "frontfagsmodellen",
    "Frontfagsmodellen",
    "Front-runner wage bargaining",
    "makro",
    "Lønnsdannelse der konkurranseutsatt industri forhandler først og setter normen.",
    "Frontfaget er industrien som konkurrerer med utlandet. Oppgjøret der blir en ramme for lønnsveksten i sektorene som følger, slik at lønningene ikke løper fra konkurranseevnen. Frontfaget er i praksis industrioverenskomsten mellom partene i industrien.",
    ["lonnsoppgjor"]
  ),
  c(
    "lonnsoppgjor",
    "Lønnsoppgjør",
    "Wage settlement",
    "makro",
    "Forhandlingene om lønn og tariffavtaler mellom partene i arbeidslivet.",
    "Hovedoppgjør annet hvert år tar hele avtalen. Mellomoppgjør i året mellom gjelder i hovedsak lønn. Frontfaget går først. Rammen oppgis ofte som årslønnsvekst, inkludert overheng. Den lokale økningen din kan avvike fra rammen.",
    ["frontfagsmodellen"]
  ),
  c(
    "sykepenger",
    "Sykepenger",
    "Sickness benefit",
    "makro",
    "Inntekt fra folketrygden når du ikke kan jobbe på grunn av sykdom.",
    "For arbeidstakere betaler arbeidsgiver som regel de første 16 dagene. Deretter kan NAV overta. Ytelsen har tak knyttet til grunnbeløpet (G) og en avgrenset periode. Du må som hovedregel være sykmeldt. Selvstendige har andre satser.",
    ["dagpenger", "folketrygd", "grunnbelop"]
  ),
  c(
    "dagpenger",
    "Dagpenger",
    "Unemployment benefit",
    "makro",
    "Folketrygdens ytelse når du har mistet arbeidstid og søker jobb.",
    "NAV krever tilstrekkelig tidligere inntekt, at du er registrert som arbeidssøker, og at du er reell jobbsøker. Ytelsen er en andel av tidligere inntekt, med tak, i en avgrenset periode. Det er ikke sykepenger: her er du arbeidsfør.",
    ["sykepenger", "folketrygd"]
  ),
  c(
    "spotpris",
    "Spotpris",
    "Spot price (electricity)",
    "olje",
    "Timeprisen på kraft i døgnmarkedet, i prisområdet der du bor.",
    "Prisen settes time for time på kraftbørsen Nord Pool, ut fra tilbud og etterspørsel. En spotavtale følger den, pluss leverandørens påslag. Nettleie, avgifter og merverdiavgift kommer i tillegg og er ikke spotpris.",
    ["prisomrader", "stromstotte", "nettleie", "fastprisavtale"]
  ),
  c(
    "prisomrader",
    "Prisområder",
    "Bidding zones",
    "olje",
    "Norge er delt i fem kraftområder der spotprisen kan være ulik.",
    "Områdene er NO1 (Østlandet), NO2 (Sør- og Sørvest-Norge), NO3 (Midt-Norge), NO4 (Nord-Norge) og NO5 (Vestlandet). Begrenset kapasitet i nettet gjør at kraften ikke flyter fritt. Sør-Norge i nyhetene er særlig NO1, NO2 og NO5. Nord-Norge er NO4.",
    ["spotpris", "stromstotte"]
  ),
  c(
    "stromstotte",
    "Strømstøtte",
    "Electricity support",
    "olje",
    "Statlig støtte som dekker en del av høy spotpris for husholdninger.",
    "Også kalt strømstønad. Når spotprisen i prisområdet ditt ligger over en terskel, dekker staten en andel av det overskytende for et vanlig forbruk. Støtten går vanligvis via nettselskapet. Terskel og andel vedtas av Stortinget og kan endres.",
    ["spotpris", "prisomrader"],
    "Støtten demper regningen. Den fjerner ikke spotprisen."
  ),
  c(
    "importpriser",
    "Importpriser",
    "Import prices",
    "marked",
    "Prisen i kroner på varer og tjenester vi kjøper fra utlandet.",
    "Mye import fra EØS-området prises i euro. Kronerprisen er den utenlandske prisen omregnet med kronekursen, pluss frakt og norske avgifter. Svakere krone løfter importprisene og kan løfte KPI. Sterkere krone gjør det motsatte.",
    ["kronekurs", "inflasjon", "eos", "styringsrenten", "importert-inflasjon"]
  ),
  c(
    "eos",
    "EØS",
    "EEA",
    "marked",
    "Avtalen som knytter Norge til EUs indre marked, uten at Norge er medlem av EU.",
    "Varer, tjenester, kapital og personer kan i hovedsak bevege seg fritt. De fleste industrivarer handles uten toll mot EU. Landbruk og fisk har unntak, og Norge har egen toll mot land utenfor. Pengepolitikken er fortsatt Norges Banks.",
    ["kronekurs", "importpriser"]
  ),
  c(
    "renteniva",
    "Rentenivå",
    "Interest rate level",
    "makro",
    "Det samlede nivået på rentene, fra styringsrenten til renta husholdningene betaler.",
    "Når en sak sier at rentene er høye eller lave, samler ordet hele rekken: styringsrenten, pengemarkedsrenta og boliglånsrenta. De er ikke samme tall. Styringsrenten er Norges Banks rente til bankene. Pengemarkedsrenta, som NIBOR, er det bankene betaler seg imellom. Boliglånsrenta er det husholdningen betaler, og den ligger vanligvis høyere.",
    ["styringsrenten", "nibor", "nominell-effektiv"]
  ),
  c(
    "deflasjon",
    "Deflasjon",
    "Deflation",
    "makro",
    "Vedvarende fall i det generelle prisnivået.",
    "Inflasjon er at prisnivået stiger, slik at en krone rekker til mindre. Deflasjon er at prisnivået faller over tid. Ett tilbud eller ett hopp ned i strømprisen er ikke deflasjon. Penger du allerede har, rekker da lenger, og kjøp kan bli utsatt fordi folk venter at prisene faller videre.",
    ["inflasjon", "kjopkraft", "kpi"]
  ),
  c(
    "reallonn",
    "Reallønn",
    "Real wage",
    "makro",
    "Lønna etter at prisveksten er trukket fra.",
    "Nominell lønn er kronene på lønnsslippen. Reallønn er hva de kronene rekker til etter prisvekst. Stiger lønna mindre enn KPI, faller reallønna selv om beløpet på slippen er høyere. Lønnsoppgjøret avtaler kroner. Reallønna sier om kjøpekraften fulgte med.",
    ["lonnsoppgjor", "kjopkraft", "kpi"]
  ),
  c(
    "arbeidsledighet",
    "Arbeidsledighet",
    "Unemployment",
    "makro",
    "Andelen av arbeidsstyrken som er uten arbeid og søker jobb.",
    "Ledigheten er antall ledige delt på arbeidsstyrken. SSB måler den i arbeidskraftundersøkelsen (AKU): personer uten arbeid som har søkt jobb og kan begynne. NAV teller dem som er registrert som helt ledige. De to tallene skiller lag, og de skal ikke byttes om. Norges Bank leser ledigheten ved siden av produksjonsgapet når den vurderer presset i økonomien.",
    ["produksjonsgap", "dagpenger"]
  ),
  c(
    "konjunktur",
    "Konjunktur",
    "Business cycle",
    "makro",
    "Svingningen i aktiviteten rundt det økonomien kan holde over tid.",
    "Høykonjunktur er når aktiviteten ligger over det som er holdbart uten at prispresset bygger seg opp. Lavkonjunktur er når den ligger under, med mer slakk. Produksjonsgapet er anslaget på dette avviket. Trenden er den jevne utviklingen under svingningen.",
    ["produksjonsgap", "fleksibel-inflasjonsstyring"]
  ),
  c(
    "noytral-rente",
    "Nøytral rente",
    "Neutral interest rate",
    "makro",
    "Rentenivået som verken strammer eller slipper opp i økonomien.",
    "Norges Bank sammenligner styringsrenten med den nøytrale renta når den vurderer om pengepolitikken er stram eller romslig. Ligger styringsrenten over, dempes etterspørselen. Ligger den under, stimuleres den. Nivået er et anslag, ikke en rente du får i banken, og det oppdateres i pengepolitisk rapport.",
    ["styringsrenten", "ppr", "produksjonsgap"]
  ),
  c(
    "importert-inflasjon",
    "Importert inflasjon",
    "Imported inflation",
    "makro",
    "Prisvekst som kommer fra varer og tjenester kjøpt i utlandet.",
    "En svakere krone gjør importen dyrere i kroner. Høyere importpriser kan løfte KPI selv om presset hjemme er uendret. Sterkere krone virker den andre veien. Importert inflasjon er denne veien, fra kronekurs til importpris og videre til prisene husholdningene møter.",
    ["kronekurs", "importpriser", "kpi", "inflasjon"]
  ),
  c(
    "tilbud-og-ettersporsel",
    "Tilbud og etterspørsel",
    "Supply and demand",
    "makro",
    "Prisen og mengden der tilbudet møter etterspørselen.",
    "Tilbudet er hvor mye som selges ved ulike priser. Etterspørselen er hvor mye som kjøpes. Krysset er prisen og mengden der de to stemmer. Når styringsrenten virker gjennom etterspørselen, er det dette krysset som flytter seg: høyere rente demper kjøpelysten, og pris og aktivitet følger etter. Kurvene er en forenkling av et marked.",
    ["transmisjon", "styringsrenten"]
  ),
  c(
    "bytteforhold",
    "Bytteforhold",
    "Terms of trade",
    "olje",
    "Forholdet mellom prisene på det Norge selger til utlandet og det Norge kjøper derfra.",
    "Bytteforholdet er eksportpris delt på importpris. Stiger prisen på det Norge selger mer enn prisen på det Norge kjøper, kan samme eksport betale mer import. Oljeprisen flytter ofte telleren. Derfor er bytteforholdet leddet mellom oljeprisen og kjøpekraften i nasjonalregnskapet. Det er et prisforhold, ikke et mål på hvor mange fat som er solgt.",
    ["oljepris", "bnp", "importpriser"]
  ),
  c(
    "handelsbalanse",
    "Handelsbalanse",
    "Trade balance",
    "olje",
    "Eksport minus import.",
    "Er eksporten større enn importen, er balansen positiv. I nasjonalregnskapet er vare- og tjenestebalansen denne differansen for både varer og tjenester. Olje og gass gjør at norsk eksport svinger med prisene på sokkelen, så balansen kan være stor selv når fastlandet importerer mye. Den står ved siden av BNP fordi utenrikshandelen synes i tallene. Driftsbalansen er et videre mål: den tar også med renter og overføringer.",
    ["bnp", "oljepris", "bytteforhold"]
  ),
  c(
    "oljepris",
    "Oljepris",
    "Oil price",
    "olje",
    "Prisen på råolje i markedet.",
    "Oljeprisen settes i verdensmarkedet og oppgis ofte i dollar per fat. Den flytter statens inntekter fra sokkelen, hvor mye som går inn i oljefondet, og ofte kronen. Høyere pris gir høyere petroleumsinntekter når volumet er det samme. Prisen er ikke fondets avkastning. Fondet er investert i utlandet, mens prisen bestemmer mye av det som betales inn.",
    ["oljefondet", "petroleumsinntekter", "kronekurs"]
  ),
  c(
    "petroleumsinntekter",
    "Petroleumsinntekter",
    "Petroleum revenues",
    "olje",
    "Statens inntekter fra olje og gass.",
    "Skatt og statens eierskap på sokkelen gir inntektene. De går inn i oljefondet. Handlingsregelen sier noe om bruken etterpå, ikke om hvor mye som kommer inn. Inntektene svinger med pris, produksjon og kostnader. De er ikke det samme som avkastningen fondet får på aksjene sine.",
    ["oljefondet", "handlingsregelen", "oljepris"]
  ),
  c(
    "automatiske-stabilisatorer",
    "Automatiske stabilisatorer",
    "Automatic stabilizers",
    "olje",
    "Skatt og trygd som demper en nedgang av seg selv, uten et nytt vedtak.",
    "Faller aktiviteten, faller skatteinntektene, og flere kan få dagpenger. Underskuddet på statsbudsjettet vokser uten at Stortinget har vedtatt et nytt tiltak. I en oppgang skjer det motsatte: skatten stiger og færre får dagpenger. Et eget krisetiltak i budsjettet er noe annet, fordi det krever et vedtak.",
    ["finanspolitikk", "dagpenger", "strukturelt-underskudd"]
  ),
  c(
    "nettleie",
    "Nettleie",
    "Grid tariff",
    "olje",
    "Betalingen for å få kraften fram, i tillegg til spotprisen.",
    "Strømregningen er mer enn kraften. Spotprisen er prisen på kraften i prisområdet ditt. Nettleie er det nettselskapet tar for å frakte den, ofte med et fast ledd og et ledd som følger forbruket. Avgifter kommer i tillegg. Strømstøtte regnes av spotprisen, ikke av nettleien.",
    ["spotpris", "stromstotte", "prisomrader"]
  ),
  c(
    "fastprisavtale",
    "Fastprisavtale",
    "Fixed-price electricity contract",
    "olje",
    "Strømavtale der prisen på kraften ligger fast i en avtalt periode.",
    "På en spotavtale følger kraftprisen markedet time for time, pluss leverandørens påslag. På en fastprisavtale er prisen på kraften avtalt for perioden. Nettleie og avgifter kommer i tillegg på begge. Fastpris er valget mot spot når du vil ha en kjent kraftpris og slippe svingningen i markedet.",
    ["spotpris", "nettleie"]
  ),
  c(
    "utbytte",
    "Utbytte",
    "Dividend",
    "marked",
    "Utbetalingen fra selskapet til aksjonæren.",
    "Overskuddet kan betales ut, eller bli igjen i selskapet. Utbytte er den utbetalingen. Det som blir igjen, kan brukes i driften og kan løfte verdien av aksjen. Utbytte er kontanter du får ut. Kursgevinst er en annen vei. Utenfor aksjesparekonto inngår utbytte i skatten etter skjerming og oppjustering.",
    ["multiplikatorer", "naverdi", "skjermingsfradrag", "oppjusteringsfaktor"]
  ),
  c(
    "borsverdi",
    "Børsverdi",
    "Market capitalization",
    "marked",
    "Aksjekursen ganger antall aksjer.",
    "Børsverdi er det markedet setter på hele egenkapitalen. Den er telleren i pris/bok: børsverdi delt på bokført egenkapital. Kursen alene sier ikke hvor stort selskapet er. To selskaper kan ha samme kurs og helt ulik børsverdi, fordi de har ulikt antall aksjer.",
    ["pb", "multiplikatorer"]
  ),
  c(
    "pe",
    "Pris/fortjeneste (P/E)",
    "Price-to-earnings",
    "marked",
    "Aksjekursen delt på resultatet per aksje.",
    "Pris/fortjeneste sier hvor mange kroner markedet betaler per krone resultat. Den er multiplikatoren en leser møter først, ved siden av pris/bok og EV/EBITDA. Høy P/E kan bety at markedet venter vekst, eller at resultatet akkurat nå er lavt. Resultatet er regnskapets tall, ikke kontantstrømmen.",
    ["multiplikatorer", "pb", "evebitda"]
  ),
  c(
    "risikopremie",
    "Risikopremie",
    "Risk premium",
    "marked",
    "Den ekstra avkastningen en risikabel plassering ventes å gi over en risikofri rente.",
    "Risikofri rente er det du kan få uten å ta den risikoen plasseringen bærer, ofte knyttet til statsrenter. Risikopremien er påslaget over den. I CAPM er markedets risikopremie det påslaget markedet ventes å gi, og beta skalerer det for den enkelte aksjen. Premien er en forventning, ikke et løfte om at du får den.",
    ["capm", "beta", "risiko-avkastning"]
  ),
  c(
    "volatilitet",
    "Volatilitet",
    "Volatility",
    "marked",
    "Hvor mye avkastningen svinger.",
    "Høy volatilitet betyr store utslag, opp og ned. Lav volatilitet betyr en roligere bane. Sharpe-raten deler meravkastningen på denne svingningen. Volatilitet er navnet på bevegelsen. Den sier hvor mye noe svinger, ikke om svingningen er verdt å ta. I tall er den ofte standardavviket til avkastningen.",
    ["sharpe", "standardavvik", "risiko-avkastning"]
  ),
  c(
    "korrelasjon",
    "Korrelasjon",
    "Correlation",
    "marked",
    "Hvor tett to avkastninger beveger seg sammen.",
    "Korrelasjon nær 1 betyr at de to stort sett stiger og faller samtidig. Nær 0 betyr at de ikke følges. Negativ korrelasjon betyr at den ene ofte går opp når den andre går ned. Diversifisering virker fordi ikke alt faller samtidig. Eier du bare ting som følges tett, sprer du mindre enn antallet papirer tyder på.",
    ["diversifisering", "standardavvik"]
  ),
  c(
    "kupongrente",
    "Kupongrente",
    "Coupon rate",
    "marked",
    "Den avtalte renta på en obligasjon, regnet av pålydende.",
    "Kupongen er beløpet utstederen betaler underveis, avtalt på forhånd. Yield er avkastningen gitt prisen du betaler i markedet. Faller prisen under pålydende, ligger yield over kupongrenta. Stiger prisen over pålydende, ligger yield under. Kupongrenta står stille når prisen flytter seg.",
    ["yield", "obligasjon", "durasjon"]
  ),
  c(
    "innskuddsgaranti",
    "Innskuddsgaranti",
    "Deposit guarantee",
    "bank",
    "Dekningen fra Bankenes sikringsfond hvis banken ikke kan betale tilbake innskuddet.",
    "Garantien gjelder innskudd, ikke aksjer og fondsandeler. For en kunde i en norsk bank i Norge dekker den fra første krone og opptil {{sats:innskuddsgaranti}} per kunde per bank. Flere kontoer i samme bank legges sammen. Beløpet over taket faller utenfor den vanlige garantien. Enkelte innskudd fra boligsalg og andre særlige livshendelser kan være dekket utover taket i en periode.",
    ["innskuddsdekning", "rentenetto"]
  ),
  c(
    "rentemargin",
    "Rentemargin",
    "Interest margin",
    "bank",
    "Forskjellen mellom renta banken tar inn og renta den betaler.",
    "Banken tar inn rente på utlån og betaler rente på innskudd og annen finansiering. Rentemarginen er den relative forskjellen, et påslag i rente. Rentenetto er den samme forskjellen regnet i kroner. En smal margin kan likevel gi stor rentenetto hvis volumet er stort. Marginen leses ved siden av rentenettoen.",
    ["rentenetto", "provisjonsinntekter"]
  ),
  c(
    "provisjonsinntekter",
    "Provisjonsinntekter",
    "Fee income",
    "bank",
    "Gebyrer banken tar for betalinger, fond og rådgivning.",
    "Rentenetto kommer fra renteforskjellen. Provisjonsinntekter er den andre hovedinntekten i mange bankrapporter. En bank med mye gebyrinntekt hviler mindre på rentemarginen alene. Provisjon er ikke renter, og den ligger utenfor rentenettoen.",
    ["rentenetto", "rentemargin", "ki"]
  ),
  c(
    "motsyklisk-buffer",
    "Motsyklisk kapitalbuffer",
    "Countercyclical capital buffer",
    "bank",
    "Et tillegg i kravet til ren kjernekapital som kan settes opp og ned med konjunkturen.",
    "Bufferen skal gjøre banken mer solid når sårbarheten i økonomien er høy, slik at den kan tåle tap og fortsatt låne ut i en nedgang. Norges Bank fastsetter satsen hvert kvartal. Kravet skal i utgangspunktet ligge mellom 0 og 2,5 prosent av risikovektede eiendeler. I november 2026 holdt Norges Bank kravet uendret på 2,5 prosent. Det er et kapitalkrav, ikke en egen konto med kontanter.",
    ["cet1", "konjunktur"],
    "2,5 prosent i november 2026. Sjekk Norges Bank."
  ),
  c(
    "fastrente",
    "Fastrente",
    "Fixed mortgage rate",
    "personlig",
    "Boliglånsrente som ligger fast i en avtalt periode.",
    "På flytende rente følger boliglånsrenta med når styringsrenten og pengemarkedet flytter seg. På fastrente er renta avtalt for en periode, for eksempel tre eller fem år. Du bytter sjansen for å følge renta ned mot et kjent beløp så lenge avtalen varer. Når perioden er ute, avtales renta på nytt. Annuitet og serie beskriver nedbetalingen. Fastrente beskriver om renta er låst.",
    ["nominell-effektiv", "annuitetslan", "serielan", "styringsrenten"]
  ),
  c(
    "buffer",
    "Buffer",
    "Cash buffer",
    "personlig",
    "Kontantreserven som skal tåle et uventet utlegg.",
    "Bufferen er penger på en konto du kan bruke uten å selge fond eller ta opp gjeld. Den kommer før langsiktig sparing i ASK eller indeksfond, og før ekstra nedbetaling på lånet. Hvor stor den skal være, følger faste utgifter og hvor sikker inntekten er. Fondsandeler er ikke en buffer hvis du ikke tåler å selge dem når markedet har falt.",
    ["ask", "indeksfond", "renters-rente"]
  ),
  c(
    "innskuddspensjon",
    "Innskuddspensjon",
    "Defined contribution pension",
    "personlig",
    "Tjenestepensjon der arbeidsgiver setter inn et avtalt beløp, og utbetalingen følger avkastningen.",
    "Innskuddet er kjent. Det du får som pensjonist, avhenger av hvor lenge pengene står og hva de kaster av seg. I privat sektor er obligatorisk tjenestepensjon som regel en slik ordning, minst det loven krever. Mange arbeidsgivere setter inn mer. Innskuddspensjon lover innbetalingen. Den lover ikke et bestemt beløp ut.",
    ["tjenestepensjon", "ytelsespensjon", "otp", "folketrygd"]
  ),
  c(
    "ytelsespensjon",
    "Ytelsespensjon",
    "Defined benefit pension",
    "personlig",
    "Tjenestepensjon der utbetalingen er avtalt på forhånd.",
    "Du får en avtalt andel av lønna, eller et annet avtalt beløp, når vilkårene er oppfylt. Arbeidsgiver bærer risikoen for at pengene strekker til. Ordningen finnes i offentlig sektor og i eldre avtaler i privat sektor. Innskuddspensjon er det andre hovedsporet: der er innskuddet avtalt, og utbetalingen følger avkastningen.",
    ["innskuddspensjon", "tjenestepensjon", "folketrygd"]
  ),
  c(
    "oppjusteringsfaktor",
    "Oppjusteringsfaktor",
    "Adjustment factor for equity income",
    "personlig",
    "Faktoren som løfter aksjegevinst og utbytte før skatten på alminnelig inntekt regnes.",
    "Skatten på alminnelig inntekt er flat. For at skatten på aksjeinntekt skal bli høyere, ganges gevinst og utbytte med en faktor etter at skjermingsfradraget er trukket fra. Tap oppjusteres på samme måte. Skatteetaten gjør det i skattemeldingen. For inntektsåret er faktoren {{sats:oppjustering}}. Faktoren vedtas for hvert år. Innenfor aksjesparekonto kommer skatten ved uttak, og oppjusteringen brukes da.",
    ["skjermingsfradrag", "ask", "alminnelig-inntekt"]
  ),
  c(
    "verdsettingsrabatt",
    "Verdsettingsrabatt",
    "Valuation discount",
    "personlig",
    "Nedsettelsen som gjør at aksjer teller lavere enn markedsverdien i grunnlaget for formuesskatt.",
    "Formuesskatt regnes av nettoformue. Aksjer tas ikke med til full verdi. Verdsettingsrabatten på aksjer er {{sats:verdsettingsrabatt}}, så de teller med det som er igjen. Børsnoterte aksjer tar utgangspunkt i kursen. Rabatten trekkes i skattefastsettingen, og gjeld som hører til aksjene, reduseres også. Satsen vedtas i budsjettet.",
    ["formuesskatt", "ask"]
  ),
  c(
    "avskrivning",
    "Avskrivning",
    "Depreciation",
    "metode",
    "Fordelingen av en anskaffelse som kostnad over eiendelens levetid.",
    "Kjøper selskapet en maskin, er ikke hele kjøpet en kostnad det året. Avskrivningen sprer anskaffelsen ut over årene maskinen brukes. EBITDA er driftsresultat før av- og nedskrivninger, så den linjen er regnet før denne kostnaden. Avskrivningen er ikke en utbetaling det året. Kontantene gikk ut da eiendelen ble kjøpt.",
    ["resultatregnskap", "evebitda", "kontantstrom"]
  ),
  c(
    "arbeidskapital",
    "Arbeidskapital",
    "Working capital",
    "metode",
    "Omløpsmidler minus kortsiktig gjeld.",
    "Omløpsmidler er varelager, kundefordringer og kontanter i driften. Kortsiktig gjeld er blant annet det selskapet skylder leverandørene. Stiger fordringene, er det overskudd som ennå ikke er blitt kontanter. Derfor forklarer arbeidskapitalen ofte avviket mellom resultatet og kontantstrømmen. Mer kapital bundet i drift er ikke det samme som et bedre resultat.",
    ["kontantstrom", "resultatregnskap", "balanse"]
  ),
  c(
    "driftsmargin",
    "Driftsmargin",
    "Operating margin",
    "metode",
    "Driftsresultatet som andel av omsetningen.",
    "Omsetning er det selskapet har solgt for. Driftsresultatet er det som er igjen etter driftskostnadene, før renter og skatt. Marginen er den andelen. En margin på 10 prosent er et eksempel: 10 øre av hver krone i salg er igjen i drift. Den er det korte målet på resultatregnskapet. Den sier ikke om kontantstrømmen er like sterk.",
    ["resultatregnskap", "kontantstrom"]
  ),
  c(
    "standardavvik",
    "Standardavvik",
    "Standard deviation",
    "metode",
    "Et mål på hvor spredt tallene ligger rundt snittet.",
    "Lavt standardavvik betyr at observasjonene ligger tett på snittet. Høyt standardavvik betyr at de spriker. Volatilitet i finans er ofte standardavviket til avkastningen. Beta fra en OLS-regresjon hviler på hvordan avkastningen samvarierer med markedet, og spredningen inngår i det regnestykket. Standardavviket er spredningen. Volatilitet er navnet når spredningen gjelder avkastning.",
    ["volatilitet", "ols", "beta", "sharpe"]
  ),
];

const satsPaKonsept: Record<string, string[]> = {
  bsu: ["bsu-aar", "bsu-samlet", "bsu-fradrag", "bsu-alder"],
  grunnbelop: ["grunnbelop"],
  gjeldsgrad: ["utlan-gjeld"],
  rentefradrag: ["alminnelig-sats"],
  "alminnelig-inntekt": ["alminnelig-sats"],
  personfradrag: ["personfradrag"],
  minstefradrag: ["minstefradrag-sats", "minstefradrag-tak"],
  egenkapital: ["utlan-belaning"],
  "strukturelt-underskudd": ["sou-mrd", "sou-pst"],
  oppjusteringsfaktor: ["oppjustering"],
  verdsettingsrabatt: ["verdsettingsrabatt"],
  innskuddsgaranti: ["innskuddsgaranti"],
};

for (const concept of extraConcepts) {
  const ids = satsPaKonsept[concept.id];
  if (ids) concept.satsIds = ids;
}
