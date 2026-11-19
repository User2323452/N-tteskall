"use client";

import { useMemo, useState } from "react";
import { FigureCard, StickyView, Swatch } from "@/components/figures/FigureCard";
import { RangeField } from "@/components/figures/RangeField";
import { round, useScrub } from "@/components/figures/useScrub";
import { kroner, tall } from "@/lib/format";

const PRINCIPAL = 1_000_000;
const YEARS = 20;
const RENTER = "#C4843A";
const AVDRAG = "#3B6FD8";
const W = 320;
const LEFT = 8;
const RIGHT = 312;
const PANEL = 78;

type Row = { renter: number; avdrag: number };

export function loanSchedule(kind: "annuitet" | "serie", rate: number): Row[] {
  const rows: Row[] = [];
  let rest = PRINCIPAL;
  const term = rate === 0 ? PRINCIPAL / YEARS : (PRINCIPAL * rate) / (1 - (1 + rate) ** -YEARS);
  for (let year = 1; year <= YEARS; year += 1) {
    const renter = rest * rate;
    const avdrag = kind === "serie" ? PRINCIPAL / YEARS : term - renter;
    rows.push({ renter, avdrag });
    rest -= avdrag;
  }
  return rows;
}

function Panel({
  label,
  rows,
  year,
  max,
  y0,
}: {
  label: string;
  rows: Row[];
  year: number;
  max: number;
  y0: number;
}) {
  const slot = (RIGHT - LEFT) / YEARS;
  const h = (v: number) => round((v / max) * (PANEL - 18));
  const base = y0 + PANEL;
  return (
    <g>
      <text x={LEFT} y={y0 + 11} fontSize="12" fontWeight="600" fill="#1A2332">{label}</text>
      <line x1={LEFT} x2={RIGHT} y1={base} y2={base} stroke="#CBD5E1" />
      {rows.map((row, index) => {
        const x = round(LEFT + index * slot + 1.5);
        const width = round(slot - 3);
        const avdragH = h(row.avdrag);
        const renterH = h(row.renter);
        const picked = index + 1 === year;
        return (
          <g key={index} opacity={picked ? 1 : 0.45}>
            <rect x={x} y={base - avdragH} width={width} height={avdragH} fill={AVDRAG} />
            <rect x={x} y={base - avdragH - renterH} width={width} height={renterH} fill={RENTER} />
          </g>
        );
      })}
    </g>
  );
}

export function LoanTimeFigure({ focus }: { focus: "annuitet" | "serie" }) {
  const [rate, setRate] = useState(5);
  const [year, setYear] = useState(1);
  const ann = useMemo(() => loanSchedule("annuitet", rate / 100), [rate]);
  const serie = useMemo(() => loanSchedule("serie", rate / 100), [rate]);
  const max = Math.max(...ann.map((r) => r.renter + r.avdrag), ...serie.map((r) => r.renter + r.avdrag));
  const scrub = useScrub(W, LEFT, RIGHT, (share) => setYear(Math.min(YEARS, Math.floor(share * YEARS) + 1)));
  const sum = (rows: Row[]) => rows.reduce((total, row) => total + row.renter, 0);
  const slot = (RIGHT - LEFT) / YEARS;
  const markerX = round(LEFT + (year - 0.5) * slot);
  const H = PANEL * 2 + 30;

  const cards = [
    ["annuitet", "Annuitet", ann[year - 1], sum(ann)],
    ["serie", "Serielån", serie[year - 1], sum(serie)],
  ] as const;

  return (
    <FigureCard
      title="Samme lån, alle 20 år"
      year={`${kroner(PRINCIPAL)}, ${YEARS} år, én termin i året. Dra i stolpene for å velge år.`}
      note="Læringsfigur. Årlige terminer og fast rente hele løpetiden, uten gebyrer og uten rentefradrag. Banken regner med månedlige terminer, så beløpene blir litt andre. Annuitet: fast terminbeløp. Serielån: fast avdrag, renta regnes av restgjelden."
    >
      <StickyView>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full select-none"
          role="img"
          aria-label={`Renter og avdrag for annuitetslån og serielån, år 1 til ${YEARS}. Valgt år ${year}.`}
          {...scrub}
        >
          <Panel label="Annuitet" rows={ann} year={year} max={max} y0={0} />
          <Panel label="Serielån" rows={serie} year={year} max={max} y0={PANEL + 12} />
          <line x1={markerX} x2={markerX} y1={14} y2={PANEL * 2 + 14} stroke="#1A2332" strokeWidth="1" strokeDasharray="2 2" />
          <text x={LEFT} y={H - 2} fontSize="12" fill="#5C6B7A">År 1</text>
          <text x={RIGHT} y={H - 2} textAnchor="end" fontSize="12" fill="#5C6B7A">År {YEARS}</text>
        </svg>
        <div className="flex gap-4 text-xs text-[var(--ink)]">
          <span><Swatch color={RENTER} />Renter</span>
          <span><Swatch color={AVDRAG} />Avdrag</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {cards.map(([id, label, row]) => (
            <div
              key={id}
              className={`rounded-xl p-2.5 ${focus === id ? "bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]" : "bg-[var(--background)]"}`}
            >
              <p className="text-xs font-semibold text-[var(--ink)]">{label}, år {year}</p>
              <p className="mt-1 text-xs tabular-nums text-[var(--muted)]">Renter {kroner(row.renter)}</p>
              <p className="text-xs tabular-nums text-[var(--muted)]">Avdrag {kroner(row.avdrag)}</p>
              <p className="mt-1 text-sm font-medium tabular-nums text-[var(--ink)]">Termin {kroner(row.renter + row.avdrag)}</p>
            </div>
          ))}
        </div>
      </StickyView>
      <RangeField label="År i lånet" min={1} max={YEARS} step={1} value={year} display={`År ${year}`} onChange={setYear} />
      <RangeField label="Rente" min={0} max={10} step={0.5} value={rate} display={`${tall(rate, 1)} %`} onChange={setRate} />
      <p className="text-sm text-[var(--ink)]">
        Renter totalt: {kroner(sum(ann))} på annuitet og {kroner(sum(serie))} på serielån.
        {rate > 0
          ? ` Serielånet koster mer de første årene, men ${kroner(sum(ann) - sum(serie))} mindre i renter til sammen.`
          : " Uten rente er de to lånene like."}
      </p>
    </FigureCard>
  );
}
