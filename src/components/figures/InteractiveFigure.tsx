"use client";

import { useMemo, useState } from "react";
import type { InteractiveId } from "@/data/concept-figures";
import {
  AKSJE_FAKTOR,
  ALMINNELIG_SATS,
  fillGlass,
  GLASS_YEAR,
  MINSTE_SATS,
  MINSTE_TAK,
  PERSONFRADRAG,
} from "@/data/glass";
import { kroner, tall } from "@/lib/format";
import { RangeField } from "@/components/figures/RangeField";

function Card({
  title,
  year,
  children,
  note,
}: {
  title: string;
  year?: string;
  children: React.ReactNode;
  note: string;
}) {
  return (
    <figure className="rounded-2xl border border-[var(--line)] bg-white p-4">
      <figcaption className="text-sm font-semibold text-[var(--ink)]">{title}</figcaption>
      {year && <p className="mt-1 text-xs text-[var(--muted)]">{year}</p>}
      <div className="mt-4 space-y-4">{children}</div>
      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">{note}</p>
    </figure>
  );
}

function GlassFigure() {
  const [lonn, setLonn] = useState(108_000);
  const [rente, setRente] = useState(10_000);
  const [gevinst, setGevinst] = useState(26_500);
  const fill = fillGlass(lonn, rente, gevinst);
  const scale = Math.max(fill.total, PERSONFRADRAG, 1);
  const innerH = 200;
  const bottom = 228;
  const y = (fromBottom: number) => bottom - (fromBottom / scale) * innerH;
  const layers = [
    { amount: fill.lonnPlass, color: "#3B6FD8", name: "Lønn" },
    { amount: fill.rentePlass, color: "#C4843A", name: "Renter" },
    { amount: fill.aksjePlass, color: "#0F766E", name: "Aksje × 1,72" },
  ];
  let cursor = 0;
  const bands = layers.map((layer) => {
    const start = cursor;
    cursor += layer.amount;
    return { ...layer, y1: y(start), y2: y(cursor) };
  });
  const kantY = y(PERSONFRADRAG);
  const topY = y(Math.max(fill.total, PERSONFRADRAG));

  return (
    <Card
      title="Personfradraget som et glass"
      year={`Inntektsåret ${GLASS_YEAR}. Læringsfigur, ikke skatteråd.`}
      note="Forutsetninger: skatteklasse 1, personfradrag 114 540 kr, minstefradrag 46 % av lønn opp til 95 700 kr, renter 1:1, realisert aksjegevinst × 1,72, 22 % skatt på det som renner over. Ingen andre fradrag, ingen trinnskatt og ingen trygdeavgift. 1,72 × 22 % = 37,84 % av selve gevinsten når den ligger over kanten."
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg viewBox="0 0 120 250" className="h-56 w-28 shrink-0" role="img" aria-label="Glass med lønn, renter og aksjegevinst">
          <defs>
            <pattern id="glass-skatt" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M-1 7 L7 -1" stroke="#BE123C" strokeWidth="1.4" />
            </pattern>
          </defs>
          <path
            d={`M26 ${topY} H94 V${bottom - 8} Q94 ${bottom} 86 ${bottom} H34 Q26 ${bottom} 26 ${bottom - 8} Z`}
            fill="#F4F7F8"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          {bands.map((band) =>
            band.amount > 0 ? (
              <rect
                key={band.name}
                x="28"
                y={Math.min(band.y1, band.y2)}
                width="64"
                height={Math.max(1, Math.abs(band.y1 - band.y2))}
                fill={band.color}
              />
            ) : null
          )}
          {fill.over > 0 && (
            <rect
              x="28"
              y={Math.min(topY, kantY)}
              width="64"
              height={Math.max(1, Math.abs(kantY - topY))}
              fill="url(#glass-skatt)"
            />
          )}
          <line x1="18" x2="102" y1={kantY} y2={kantY} stroke="#1A2332" strokeDasharray="3 3" />
          <text x="60" y="14" textAnchor="middle" fontSize="8" fill="#1A2332">
            Kant {tall(PERSONFRADRAG)}
          </text>
        </svg>
        <ul className="min-w-0 flex-1 space-y-2 text-sm">
          <li>
            <span className="font-medium text-[var(--ink)]">Lønn etter minstefradrag</span>
            <span className="mt-0.5 block text-[var(--muted)]">
              {kroner(fill.lonnPlass)} får plass. 46 % trekkes først, så 1 kr lønn tar {tall(1 - MINSTE_SATS, 2)} kr plass, inntil taket på {kroner(MINSTE_TAK)}.
            </span>
          </li>
          <li>
            <span className="font-medium text-[var(--ink)]">Renter 1:1</span>
            <span className="mt-0.5 block text-[var(--muted)]">
              {kroner(fill.rentePlass)} teller akkurat det de er.
            </span>
          </li>
          <li>
            <span className="font-medium text-[var(--ink)]">Aksjegevinst × {tall(AKSJE_FAKTOR, 2)}</span>
            <span className="mt-0.5 block text-[var(--muted)]">
              {kroner(gevinst)} blir {kroner(fill.aksjePlass)} i glasset.
            </span>
          </li>
        </ul>
      </div>
      <p className="text-[11px] leading-relaxed text-[var(--muted)]">
        Den stiplete streken er kanten. Det skraverte feltet ligger over og skattlegges.
      </p>
      <div className="space-y-3">
        <RangeField label="Lønn i året" min={0} max={800_000} step={5_000} value={lonn} display={kroner(lonn)} onChange={setLonn} />
        <RangeField label="Renteinntekter" min={0} max={200_000} step={1_000} value={rente} display={kroner(rente)} onChange={setRente} />
        <RangeField label="Aksjegevinst du realiserer" min={0} max={200_000} step={500} value={gevinst} display={kroner(gevinst)} onChange={setGevinst} />
      </div>
      <p className={`text-sm font-medium ${fill.over === 0 ? "text-[#0f6e56]" : "text-[var(--ink)]"}`}>
        {fill.over === 0
          ? "Alt får plass under personfradraget. 0 kr skatt på dette i figuren."
          : `${kroner(fill.over)} renner over kanten. Skatt i figuren: ${kroner(fill.skatt)} (${tall(ALMINNELIG_SATS * 100, 0)} %).`}
      </p>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Ledig før gevinst", kroner(fill.ledigForGevinst)],
          ["Maks fri gevinst", kroner(Math.max(0, fill.maksFriGevinst))],
          ["Skatt i figuren", kroner(fill.skatt)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-[var(--background)] px-2 py-2">
            <dt className="text-[10px] text-[var(--muted)]">{label}</dt>
            <dd className="mt-1 text-xs font-semibold tabular-nums text-[var(--ink)]">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function CompoundFigure() {
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const start = 10_000;
  const end = start * (1 + rate / 100) ** years;
  const width = Math.min(100, (end / (start * 8)) * 100);
  return (
    <Card
      title="Renters rente"
      note="Figuren starter med 10 000 kr og legger renta til hvert år. Ingen skatt, ingen gebyr. Avkastning er ikke garantert."
    >
      <RangeField label="Årlig rente" min={1} max={12} step={0.5} value={rate} display={`${tall(rate, 1)} %`} onChange={setRate} />
      <RangeField label="År pengene står" min={1} max={40} step={1} value={years} display={`${years} år`} onChange={setYears} />
      <div className="space-y-1">
        <div className="h-3 rounded-full bg-slate-100">
          <div className="h-3 rounded-full bg-slate-300" style={{ width: "12%" }} />
        </div>
        <div className="h-3 rounded-full bg-slate-100">
          <div className="h-3 rounded-full bg-[#0f6e56]" style={{ width: `${Math.max(12, width)}%` }} />
        </div>
        <p className="text-[11px] text-[var(--muted)]">Grå: uten rente. Grønn: med rente.</p>
      </div>
      <p className="text-sm text-[var(--ink)]">
        10 000 kr i {years} år til {tall(rate, 1)} % blir om lag {kroner(end)}. Uten rente er det fortsatt 10 000 kr.
      </p>
    </Card>
  );
}

function RatioFigure({ kind }: { kind: "belaning" | "gjeld" }) {
  const belaning = kind === "belaning";
  const [base, setBase] = useState(belaning ? 4_000_000 : 700_000);
  const [loan, setLoan] = useState(belaning ? 3_600_000 : 3_500_000);
  const ratio = base > 0 ? loan / base : 0;
  const limit = belaning ? 0.9 : 5;
  const pct = belaning ? ratio * 100 : ratio;
  const marker = belaning ? limit * 100 : (limit / 8) * 100;
  const bar = belaning ? Math.min(100, pct) : Math.min(100, (ratio / 8) * 100);
  return (
    <Card
      title={belaning ? "Belåningsgrad" : "Gjeldsgrad"}
      note={
        belaning
          ? "Læringsfigur. Streken er 90 %, grensen for nedbetalingslån i utlånsforskriften fra 31. desember 2024, fortsatt i 2026. Rammekreditt med pant i bolig har et tak på 60 %. Gjeldsgraden på fem ganger inntekten står. Banken kan være strengere."
          : "Læringsfigur. Streken er 5 ganger brutto inntekt, en vanlig ramme. Sjekk gjeldende forskrift. Ikke et lånetilsagn."
      }
    >
      {belaning ? (
        <RangeField label="Boligverdi" min={1_000_000} max={12_000_000} step={100_000} value={base} display={kroner(base)} onChange={setBase} />
      ) : (
        <RangeField label="Brutto inntekt" min={200_000} max={2_000_000} step={25_000} value={base} display={kroner(base)} onChange={setBase} />
      )}
      <RangeField
        label={belaning ? "Lån" : "Samlet gjeld"}
        min={0}
        max={belaning ? base : 8_000_000}
        step={belaning ? 50_000 : 50_000}
        value={Math.min(loan, belaning ? base : 8_000_000)}
        display={kroner(Math.min(loan, belaning ? base : 8_000_000))}
        onChange={setLoan}
      />
      <div className="relative h-4 rounded-full bg-slate-100">
        <div className="h-4 rounded-full bg-[#0f6e56]" style={{ width: `${bar}%` }} />
        <div className="absolute top-0 h-4 w-0.5 bg-[var(--ink)]" style={{ left: `${marker}%` }} />
      </div>
      <p className="text-sm text-[var(--ink)]">
        {belaning
          ? `Lånet er ${tall(pct, 0)} % av boligverdien. Streken er 90 %.`
          : `Gjelden er ${tall(pct, 1)} ganger inntekten. Streken er 5.`}
      </p>
    </Card>
  );
}

const TRINN = [
  { from: 226_100, rate: 0.017 },
  { from: 318_300, rate: 0.04 },
  { from: 725_050, rate: 0.137 },
  { from: 980_100, rate: 0.168 },
  { from: 1_467_200, rate: 0.178 },
];

function trinnskatt(income: number) {
  return TRINN.map((step, index) => {
    const end = TRINN[index + 1]?.from ?? Number.POSITIVE_INFINITY;
    const slice = Math.max(0, Math.min(income, end) - step.from);
    return { ...step, slice, tax: slice * step.rate };
  });
}

function TrinnFigure() {
  const [income, setIncome] = useState(600_000);
  const parts = trinnskatt(income);
  const tax = parts.reduce((sum, part) => sum + part.tax, 0);
  return (
    <Card
      title="Trinnskatt 2026"
      year="Bare personinntekt. Ikke skatten på alminnelig inntekt."
      note="Satsene er trinnskatt for 2026. Bare inntekten over hvert trinn får den satsen. Figuren er ikke et skattekort."
    >
      <RangeField label="Personinntekt" min={0} max={2_000_000} step={10_000} value={income} display={kroner(income)} onChange={setIncome} />
      <ul className="space-y-1">
        {parts.map((part) => (
          <li key={part.from} className="flex items-baseline justify-between gap-3 text-xs">
            <span className="text-[var(--ink)]">
              {tall(part.rate * 100, 1)} % over {kroner(part.from)}
            </span>
            <span className="tabular-nums text-[var(--muted)]">{kroner(part.tax)}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-[var(--ink)]">
        Trinnskatt i figuren: {kroner(tax)}. Inntekten under første trinn har 0 kr trinnskatt.
      </p>
    </Card>
  );
}

function InflationFigure() {
  const [rate, setRate] = useState(2);
  const [years, setYears] = useState(10);
  const later = 100 * (1 + rate / 100) ** years;
  const buys = 100 / (1 + rate / 100) ** years;
  return (
    <Card
      title="Prisvekst"
      note="Jevn prisvekst hvert år, samme handlekurv. Figuren sier ikke hva inflasjonen blir."
    >
      <RangeField label="Prisvekst i året" min={0} max={10} step={0.5} value={rate} display={`${tall(rate, 1)} %`} onChange={setRate} />
      <RangeField label="År" min={1} max={30} step={1} value={years} display={`${years} år`} onChange={setYears} />
      <p className="text-sm text-[var(--ink)]">
        En kurv til 100 kr i dag koster om lag {kroner(later)} om {years} år. 100 kr kjøper da om lag {kroner(buys)} av dagens varer.
      </p>
    </Card>
  );
}

function PresentValueFigure() {
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);
  const pv = 1000 / (1 + rate / 100) ** years;
  return (
    <Card
      title="Nåverdi av 1 000 kr senere"
      note="Én utbetaling, fast diskonteringsrente. Høyere krav gir lavere verdi i dag."
    >
      <RangeField label="Krav til avkastning" min={0} max={15} step={0.5} value={rate} display={`${tall(rate, 1)} %`} onChange={setRate} />
      <RangeField label="År til du får pengene" min={1} max={30} step={1} value={years} display={`${years} år`} onChange={setYears} />
      <p className="text-sm text-[var(--ink)]">
        1 000 kr om {years} år er verdt om lag {kroner(pv)} i dag når kravet er {tall(rate, 1)} %.
      </p>
    </Card>
  );
}

function DeductionFigure() {
  const [salary, setSalary] = useState(250_000);
  const deduction = Math.min(salary * MINSTE_SATS, MINSTE_TAK);
  const hitCap = salary * MINSTE_SATS >= MINSTE_TAK;
  return (
    <Card
      title="Minstefradrag i lønn, 2026"
      note="46 % av lønnsinntekt, øvre grense 95 700 kr. Figuren har ingen nedre grense og ingen andre inntekter. Sjekk Skatteetaten."
    >
      <RangeField label="Lønn" min={0} max={500_000} step={5_000} value={salary} display={kroner(salary)} onChange={setSalary} />
      <div className="h-4 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-4 rounded-full bg-[#0f6e56]"
          style={{ width: `${(deduction / MINSTE_TAK) * 100}%` }}
        />
      </div>
      <p className="text-sm text-[var(--ink)]">
        Fradraget er {kroner(deduction)}.
        {hitCap ? " Taket er nådd, så høyere lønn øker ikke fradraget." : " Taket er ikke nådd ennå."}
      </p>
    </Card>
  );
}

function YieldFigure() {
  const [yieldPct, setYieldPct] = useState(4);
  const price = (100 * 4) / yieldPct;
  return (
    <Card
      title="Fast kupong, bevegelig pris"
      note="En evig obligasjon med 4 kr kupong per 100 kr pålydende. Når avkastningskravet stiger, faller prisen. Forenklet figur."
    >
      <RangeField label="Avkastningskrav" min={1} max={10} step={0.1} value={yieldPct} display={`${tall(yieldPct, 1)} %`} onChange={setYieldPct} />
      <p className="text-sm text-[var(--ink)]">
        Prisen blir om lag {kroner(price)} når kravet er {tall(yieldPct, 1)} %. Høyere krav, lavere pris.
      </p>
    </Card>
  );
}

function NominalFigure() {
  const [nominal, setNominal] = useState(6);
  const effective = ((1 + nominal / 100 / 12) ** 12 - 1) * 100;
  return (
    <Card
      title="Nominell rente, månedlig"
      note="Renta legges til tolv ganger i året, uten gebyrer. Effektiv rente i banken tar også med gebyrer."
    >
      <RangeField label="Nominell rente" min={1} max={15} step={0.1} value={nominal} display={`${tall(nominal, 1)} %`} onChange={setNominal} />
      <p className="text-sm text-[var(--ink)]">
        {tall(nominal, 1)} % nominelt blir om lag {tall(effective, 2)} % effektivt når renta legges til hver måned.
      </p>
    </Card>
  );
}

function payment(principal: number, rate: number, years: number) {
  if (rate === 0) return principal / years;
  return (principal * rate) / (1 - (1 + rate) ** -years);
}

function loanYear(kind: "annuitet" | "serie", year: number) {
  const principal = 1_000_000;
  const rate = 0.05;
  const years = 20;
  if (kind === "serie") {
    const avdrag = principal / years;
    const rest = principal - (year - 1) * avdrag;
    const renter = rest * rate;
    return { renter, avdrag, total: renter + avdrag };
  }
  const term = payment(principal, rate, years);
  let balance = principal;
  let renter = 0;
  let avdrag = 0;
  for (let i = 1; i <= year; i += 1) {
    renter = balance * rate;
    avdrag = term - renter;
    balance -= avdrag;
  }
  return { renter, avdrag, total: term };
}

function LoanFigure({ focus }: { focus: "annuitet" | "serie" }) {
  const [year, setYear] = useState(1);
  const serie = useMemo(() => loanYear("serie", year), [year]);
  const ann = useMemo(() => loanYear("annuitet", year), [year]);
  return (
    <Card
      title="Samme lån, to former"
      year="1 000 000 kr, 5 % årlig rente, 20 år. Forenklet, uten gebyr."
      note="Annuitet holder terminbeløpet jevnt: mye renter først, mer avdrag siden. Serielån har fast avdrag, så terminbeløpet faller. Figuren er årlig, ikke bankens månedlige plan."
    >
      <RangeField label="År i lånet" min={1} max={20} step={1} value={year} display={`År ${year}`} onChange={setYear} />
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ["annuitet", "Annuitet", ann],
            ["serie", "Serielån", serie],
          ] as const
        ).map(([id, label, row]) => (
          <div
            key={id}
            className={`rounded-xl p-2 ${focus === id ? "bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]" : "bg-[var(--background)]"}`}
          >
            <p className="text-xs font-semibold text-[var(--ink)]">{label}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">Renter {kroner(row.renter)}</p>
            <p className="text-[11px] text-[var(--muted)]">Avdrag {kroner(row.avdrag)}</p>
            <p className="mt-1 text-xs font-medium text-[var(--ink)]">Termin {kroner(row.total)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function InteractiveFigure({
  id,
  focus,
}: {
  id: InteractiveId;
  focus?: "annuitet" | "serie";
}) {
  if (id === "personfradrag") return <GlassFigure />;
  if (id === "renters-rente") return <CompoundFigure />;
  if (id === "belaningsgrad") return <RatioFigure kind="belaning" />;
  if (id === "gjeldsgrad") return <RatioFigure kind="gjeld" />;
  if (id === "trinnskatt") return <TrinnFigure />;
  if (id === "inflasjon") return <InflationFigure />;
  if (id === "naverdi") return <PresentValueFigure />;
  if (id === "minstefradrag") return <DeductionFigure />;
  if (id === "yield") return <YieldFigure />;
  if (id === "nominell") return <NominalFigure />;
  return <LoanFigure focus={focus ?? "annuitet"} />;
}
