"use client";

import { useState } from "react";
import { MarkedText } from "@/components/MarkedText";
import type { InteractiveId } from "@/data/concept-figures";
import {
  AKSJE_FAKTOR,
  ALMINNELIG_SATS,
  fillGlass,
  type GlassFill,
  GLASS_YEAR,
  MINSTE_SATS,
  MINSTE_TAK,
  PERSONFRADRAG,
} from "@/data/glass";
import { formatVerdi, getSats, satsNumber, sisteVedtatteAr, trinnsteg } from "@/data/satser";
import { kroner, tall } from "@/lib/format";
import { RangeField } from "@/components/figures/RangeField";
import { BondFigure } from "@/components/figures/BondFigure";
import { HousingFigure } from "@/components/figures/HousingFigure";
import { LoanTimeFigure } from "@/components/figures/LoanTimeFigure";
import { RealWageFigure } from "@/components/figures/RealWageFigure";

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
      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        <MarkedText text={note} />
      </p>
    </figure>
  );
}

const GLASS_LAYERS = [
  { name: "Lønn", color: "#3B6FD8", pick: (fill: GlassFill) => fill.lonnPlass },
  { name: "Renter", color: "#C4843A", pick: (fill: GlassFill) => fill.rentePlass },
  {
    name: `Aksjegevinst × ${formatVerdi(satsNumber("oppjustering"), "tekst")}`,
    color: "#0F766E",
    pick: (fill: GlassFill) => fill.aksjePlass,
  },
];

function GlassFigure() {
  const [lonn, setLonn] = useState(108_000);
  const [rente, setRente] = useState(10_000);
  const [gevinst, setGevinst] = useState(26_500);
  const fill = fillGlass(lonn, rente, gevinst);
  const rimY = 22;
  const bottom = 148;
  const left = 14;
  const right = 82;
  const y = (fromBottom: number) => bottom - (Math.min(fromBottom, PERSONFRADRAG) / PERSONFRADRAG) * (bottom - rimY);
  let cursor = 0;
  const bands = GLASS_LAYERS.map((layer) => {
    const amount = layer.pick(fill);
    const start = cursor;
    cursor += amount;
    return { ...layer, amount, y1: y(start), y2: y(cursor) };
  });
  const spillShare = Math.sqrt(fill.over / PERSONFRADRAG);
  const puddleRx = fill.over > 0 ? Math.min(50, 10 + 20 * spillShare) : 0;
  const puddleRy = fill.over > 0 ? Math.min(9, 3 + 3 * spillShare) : 0;
  const puddleX = Math.max(right + 6 + puddleRx, 128);

  return (
    <Card
      title="Personfradraget som et glass"
      year={`Inntektsåret ${GLASS_YEAR}. Læringsfigur, ikke skatteråd.`}
      note={`Forutsetninger: skatteklasse 1, personfradrag ${formatVerdi(PERSONFRADRAG, "kr")}, minstefradrag ${formatVerdi(MINSTE_SATS * 100, "%")} av lønn opp til ${formatVerdi(MINSTE_TAK, "kr")}, renter 1:1, realisert aksjegevinst × ${formatVerdi(AKSJE_FAKTOR, "tekst")}, ${formatVerdi(ALMINNELIG_SATS * 100, "%")} skatt på det som renner over. Ingen andre fradrag, ingen trinnskatt og ingen trygdeavgift. ${formatVerdi(AKSJE_FAKTOR, "tekst")} × ${formatVerdi(ALMINNELIG_SATS * 100, "%")} = ${formatVerdi(AKSJE_FAKTOR * ALMINNELIG_SATS * 100, "%")} av selve gevinsten når den ligger over kanten. Sølet er ikke i skala, beløpet står i teksten. Tallene er for ${GLASS_YEAR}.`}
    >
      <div className="sticky top-0 z-10 -mx-4 border-b border-[var(--line)] bg-white/95 px-4 pb-3 pt-2 backdrop-blur">
        <div className="flex items-end gap-3">
          <svg
            viewBox="0 0 196 160"
            className="h-[160px] w-[196px] max-w-[58%] shrink-0"
            role="img"
            aria-label={
              fill.over > 0
                ? `Glasset er fullt og ${kroner(fill.over)} renner over kanten`
                : `Glasset har ${kroner(PERSONFRADRAG - fill.total)} ledig`
            }
          >
            <defs>
              <pattern id="glass-skatt" width="6" height="6" patternUnits="userSpaceOnUse">
                <rect width="6" height="6" fill="#FFE4E6" />
                <path d="M-1 7 L7 -1" stroke="#BE123C" strokeWidth="1.4" />
              </pattern>
            </defs>
            <path
              d={`M${left} ${rimY} V${bottom - 8} Q${left} ${bottom} ${left + 8} ${bottom} H${right - 8} Q${right} ${bottom} ${right} ${bottom - 8} V${rimY}`}
              fill="#F4F7F8"
            />
            {bands.map((band) =>
              band.amount > 0 && band.y1 > band.y2 ? (
                <rect key={band.name} x={left + 1} y={band.y2} width={right - left - 2} height={band.y1 - band.y2} fill={band.color} />
              ) : null
            )}
            {fill.over > 0 && (
              <>
                <path
                  d={`M${right - 6} ${rimY} Q${right + 4} ${rimY - 8} ${right + 8} ${rimY + 6} Q${right + 12} ${bottom - 40} ${puddleX - puddleRx * 0.4} ${bottom + 4}`}
                  fill="none"
                  stroke="#BE123C"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <ellipse cx={puddleX} cy={bottom + 4} rx={puddleRx} ry={puddleRy} fill="url(#glass-skatt)" stroke="#BE123C" strokeWidth="1.2" />
              </>
            )}
            <path
              d={`M${left} ${rimY} V${bottom - 8} Q${left} ${bottom} ${left + 8} ${bottom} H${right - 8} Q${right} ${bottom} ${right} ${bottom - 8} V${rimY}`}
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
            />
            <line x1={left - 6} x2={left} y1={rimY} y2={rimY} stroke="#64748B" strokeWidth="2" />
            <line x1={right} x2={right + 6} y1={rimY} y2={rimY} stroke="#64748B" strokeWidth="2" />
            <text x={left - 4} y={rimY - 8} fontSize="13" fill="#1A2332">
              Kant {tall(PERSONFRADRAG)} kr
            </text>
          </svg>
          <ul className="min-w-0 flex-1 space-y-1.5 pb-1 text-xs text-[var(--ink)]">
            {GLASS_LAYERS.map((layer) => (
              <li key={layer.name} className="flex items-center gap-1.5">
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: layer.color }} aria-hidden />
                {layer.name}
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <span className="h-3 w-3 shrink-0 rounded-sm border border-[#BE123C] bg-[#FFE4E6]" aria-hidden />
              Renner over, skattes
            </li>
          </ul>
        </div>
        <p
          className={`mt-2 text-sm font-semibold tabular-nums ${fill.over === 0 ? "text-[#0f6e56]" : "text-[#BE123C]"}`}
          aria-live="polite"
        >
          {fill.over === 0
            ? `Ledig i glasset: ${kroner(PERSONFRADRAG - fill.total)}`
            : `Renner over: ${kroner(fill.over)}`}
        </p>
      </div>
      <div className="space-y-3">
        <RangeField label="Lønn i året" min={0} max={800_000} step={5_000} value={lonn} display={kroner(lonn)} onChange={setLonn} />
        <RangeField label="Renteinntekter" min={0} max={200_000} step={1_000} value={rente} display={kroner(rente)} onChange={setRente} />
        <RangeField label="Aksjegevinst du realiserer" min={0} max={200_000} step={500} value={gevinst} display={kroner(gevinst)} onChange={setGevinst} />
      </div>
      <p className={`text-sm font-medium ${fill.over === 0 ? "text-[#0f6e56]" : "text-[var(--ink)]"}`}>
        {fill.over === 0
          ? "Alt får plass under personfradraget. 0 kr skatt på dette i figuren."
          : `Glasset er fullt, og ${kroner(fill.over)} renner over kanten. Skatt i figuren: ${kroner(fill.skatt)} (${tall(ALMINNELIG_SATS * 100, 0)} %).`}
      </p>
      <ul className="space-y-2 text-sm">
        <li className="flex gap-2">
          <span className="mt-1 h-3 w-3 shrink-0 rounded-sm" style={{ background: GLASS_LAYERS[0].color }} aria-hidden />
          <span>
            <span className="font-medium text-[var(--ink)]">Lønn etter minstefradrag</span>
            <span className="mt-0.5 block text-[var(--muted)]">
              {kroner(fill.lonnPlass)} tar plass. 46 % trekkes først, så 1 kr lønn tar {tall(1 - MINSTE_SATS, 2)} kr plass, inntil taket på {kroner(MINSTE_TAK)}.
            </span>
          </span>
        </li>
        <li className="flex gap-2">
          <span className="mt-1 h-3 w-3 shrink-0 rounded-sm" style={{ background: GLASS_LAYERS[1].color }} aria-hidden />
          <span>
            <span className="font-medium text-[var(--ink)]">Renter 1:1</span>
            <span className="mt-0.5 block text-[var(--muted)]">{kroner(fill.rentePlass)} teller akkurat det de er.</span>
          </span>
        </li>
        <li className="flex gap-2">
          <span className="mt-1 h-3 w-3 shrink-0 rounded-sm" style={{ background: GLASS_LAYERS[2].color }} aria-hidden />
          <span>
            <span className="font-medium text-[var(--ink)]">Aksjegevinst × {tall(AKSJE_FAKTOR, 2)}</span>
            <span className="mt-0.5 block text-[var(--muted)]">
              {kroner(gevinst)} blir {kroner(fill.aksjePlass)} i glasset. Den legges øverst, så den renner over først.
            </span>
          </span>
        </li>
      </ul>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Ledig før gevinst", kroner(fill.ledigForGevinst)],
          ["Maks fri gevinst", kroner(Math.max(0, fill.maksFriGevinst))],
          ["Skatt i figuren", kroner(fill.skatt)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-[var(--background)] px-2 py-2">
            <dt className="text-xs text-[var(--muted)]">{label}</dt>
            <dd className="mt-1 text-xs font-semibold tabular-nums text-[var(--ink)]">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

const COMPOUND_START = 10_000;

function niceCeil(value: number) {
  const power = 10 ** Math.floor(Math.log10(value));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => s * power >= value) ?? 10;
  return step * power;
}

function CompoundFigure() {
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(20);
  const r = rate / 100;
  const end = COMPOUND_START * (1 + r) ** years;
  const simple = COMPOUND_START * (1 + r * years);
  const width = 320;
  const top = 24;
  const base = 136;
  const left = 4;
  const right = width - 4;
  const yMax = niceCeil(end);
  const x = (year: number) => left + (year / years) * (right - left);
  const y = (value: number) => base - (value / yMax) * (base - top);
  const curve = Array.from({ length: years + 1 }, (_, t) => `${x(t)},${y(COMPOUND_START * (1 + r) ** t)}`);
  const startY = y(COMPOUND_START);
  const simpleEnd = `${x(years)},${y(simple)}`;
  return (
    <Card
      title="Renters rente"
      note="Figuren starter med 10 000 kr, som i teksten, og legger renta til én gang i året. Ingen skatt, ingen gebyr. Aksen tilpasser seg sluttverdien, så les tallet øverst. Avkastning er ikke garantert."
    >
      <RangeField label="Årlig rente" min={1} max={12} step={0.5} value={rate} display={`${tall(rate, 1)} %`} onChange={setRate} />
      <RangeField label="År pengene står" min={1} max={40} step={1} value={years} display={`${years} år`} onChange={setYears} />
      <svg viewBox={`0 0 ${width} 156`} className="w-full" role="img" aria-label={`Kurve fra 10 000 kr til ${kroner(end)} over ${years} år`}>
        <line x1={left} x2={right} y1={top} y2={top} stroke="#E2E8F0" />
        <text x={left} y={top - 8} fontSize="12" fill="#64748B">
          {kroner(yMax)}
        </text>
        <rect x={left} y={startY} width={right - left} height={base - startY} fill="#CBD5E1" />
        <polygon points={`${left},${startY} ${simpleEnd} ${right},${startY}`} fill="#9FD8C4" />
        <polygon points={`${curve.join(" ")} ${simpleEnd}`} fill="#0f6e56" />
        <polyline points={curve.join(" ")} fill="none" stroke="#0B5443" strokeWidth="2" />
        <circle cx={x(years)} cy={y(end)} r="3.5" fill="#0B5443" />
        <line x1={left} x2={right} y1={base} y2={base} stroke="#94A3B8" />
        <text x={left} y={base + 16} fontSize="12" fill="#64748B">
          I dag
        </text>
        <text x={right} y={base + 16} fontSize="12" fill="#64748B" textAnchor="end">
          {years} år
        </text>
      </svg>
      <ul className="space-y-1 text-xs text-[var(--ink)]">
        {(
          [
            ["#CBD5E1", "Innskuddet", COMPOUND_START],
            ["#9FD8C4", "Rente på innskuddet", simple - COMPOUND_START],
            ["#0f6e56", "Rente på renta", end - simple],
          ] as const
        ).map(([color, label, value]) => (
          <li key={label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: color }} aria-hidden />
              {label}
            </span>
            <span className="tabular-nums">{kroner(value)}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-[var(--ink)]">
        Første år gir {kroner(COMPOUND_START * r)} i rente. 10 000 kr i {years} år til {tall(rate, 1)} % blir om lag {kroner(end)}. Det mørke feltet er rente på renta, og det vokser fortere jo lenger pengene står.
      </p>
    </Card>
  );
}

const GJELD_MAX = 8;

function RatioFigure({ kind }: { kind: "belaning" | "gjeld" }) {
  const belaning = kind === "belaning";
  const [base, setBase] = useState(belaning ? 4_000_000 : 700_000);
  const [loan, setLoan] = useState(belaning ? 3_600_000 : 3_500_000);
  const loanMax = belaning ? base : 8_000_000;
  const shownLoan = Math.min(loan, loanMax);
  const ratio = base > 0 ? shownLoan / base : 0;
  const changeBase = (value: number) => {
    setBase(value);
    if (belaning) setLoan((current) => Math.min(current, value));
  };

  if (belaning) {
    const pct = ratio * 100;
    const egenkapital = base - shownLoan;
    return (
      <Card
        title="Belåningsgrad"
        note={`Læringsfigur. Streken er ${formatVerdi(satsNumber("utlan-belaning"), "%")}, grensen for nedbetalingslån. ${getSats("utlan-belaning").merknad ?? ""} Rammekreditt med pant i bolig har et tak på ${formatVerdi(satsNumber("utlan-ramme"), "%")}. Banken kan være strengere.`}
      >
        <RangeField label="Boligverdi" min={1_000_000} max={12_000_000} step={100_000} value={base} display={kroner(base)} onChange={changeBase} />
        <RangeField label="Lån" min={0} max={loanMax} step={50_000} value={shownLoan} display={kroner(shownLoan)} onChange={setLoan} />
        <div>
          <div className="relative flex h-6 overflow-hidden rounded-full bg-slate-100">
            <div className="h-6 bg-[#3B6FD8]" style={{ width: `${pct}%` }} />
            <div className="h-6 flex-1 bg-[#0f6e56]" />
            <div className="absolute top-0 h-6 w-0.5 bg-[var(--ink)]" style={{ left: `${satsNumber("utlan-belaning")}%` }} />
          </div>
          <div className="relative mt-1 h-4 text-xs text-[var(--muted)]">
            <span className="absolute -translate-x-1/2" style={{ left: `${satsNumber("utlan-belaning")}%` }}>
              {formatVerdi(satsNumber("utlan-belaning"), "%")}
            </span>
          </div>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--ink)]">
            <li className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[#3B6FD8]" aria-hidden />
              Lån {kroner(shownLoan)}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[#0f6e56]" aria-hidden />
              Egenkapital {kroner(egenkapital)}
            </li>
          </ul>
        </div>
        <p className="text-sm text-[var(--ink)]">
          Lånet er {tall(pct, 0)}&nbsp;% av boligverdien, og egenkapitalen er {tall(100 - pct, 0)}&nbsp;%.{" "}
          {pct > satsNumber("utlan-belaning")
            ? `Det er over streken på ${formatVerdi(satsNumber("utlan-belaning"), "%")}. Med denne boligen trenger du minst ${kroner(base * (1 - satsNumber("utlan-belaning") / 100))} i egenkapital.`
            : `Det er innenfor streken på ${formatVerdi(satsNumber("utlan-belaning"), "%")}.`}
        </p>
      </Card>
    );
  }

  const bar = Math.min(100, (ratio / GJELD_MAX) * 100);
  const debtCap = satsNumber("utlan-gjeld");
  const marker = (debtCap / GJELD_MAX) * 100;
  return (
    <Card
      title="Gjeldsgrad"
      note={`Læringsfigur. Streken er ${debtCap} ganger brutto inntekt, rammen i utlånsforskriften. Ikke et lånetilsagn.`}
    >
      <RangeField label="Brutto inntekt" min={200_000} max={2_000_000} step={25_000} value={base} display={kroner(base)} onChange={changeBase} />
      <RangeField label="Samlet gjeld" min={0} max={loanMax} step={50_000} value={shownLoan} display={kroner(shownLoan)} onChange={setLoan} />
      <div>
        <div className="relative h-4 rounded-full bg-slate-100">
          <div className={`h-4 rounded-full ${ratio > debtCap ? "bg-rose-700" : "bg-[#0f6e56]"}`} style={{ width: `${bar}%` }} />
          <div className="absolute top-0 h-4 w-0.5 bg-[var(--ink)]" style={{ left: `${marker}%` }} />
        </div>
        <div className="relative mt-1 h-4 text-xs text-[var(--muted)]">
          <span className="absolute left-0">0</span>
          <span className="absolute -translate-x-1/2" style={{ left: `${marker}%` }}>
            {debtCap}
          </span>
          <span className="absolute right-0">{GJELD_MAX}+</span>
        </div>
      </div>
      <p className="text-sm text-[var(--ink)]">
        Gjelden er {tall(ratio, 1)} ganger inntekten. Streken er {debtCap}, som gir {kroner(base * debtCap)} i samlet gjeld med denne inntekten.
        {ratio > GJELD_MAX ? ` Stolpen stopper ved ${GJELD_MAX}.` : ""}
      </p>
    </Card>
  );
}

function trinnskatt(income: number) {
  const steps = trinnsteg();
  return steps.map((step, index) => {
    const end = steps[index + 1]?.from ?? Number.POSITIVE_INFINITY;
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
      title={`Trinnskatt ${sisteVedtatteAr(getSats("trinn-1-fra"))}`}
      year="Bare personinntekt. Ikke skatten på alminnelig inntekt."
      note={`Satsene er trinnskatt for ${sisteVedtatteAr(getSats("trinn-1-fra"))}. Bare inntekten over hvert trinn får den satsen. Figuren er ikke et skattekort.`}
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
      note={`${formatVerdi(MINSTE_SATS * 100, "%")} av lønnsinntekt, øvre grense ${formatVerdi(MINSTE_TAK, "kr")}. Figuren har ingen nedre grense og ingen andre inntekter.`}
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
  if (id === "yield") return <BondFigure />;
  if (id === "nominell") return <NominalFigure />;
  if (id === "reallonn") return <RealWageFigure />;
  if (id === "bolig") return <HousingFigure />;
  return <LoanTimeFigure focus={focus ?? "annuitet"} />;
}
