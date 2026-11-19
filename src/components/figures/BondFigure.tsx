"use client";

import { useState } from "react";
import { FigureCard, StickyView, Swatch } from "@/components/figures/FigureCard";
import { RangeField } from "@/components/figures/RangeField";
import { round, useScrub } from "@/components/figures/useScrub";
import { tall } from "@/lib/format";

const KUPONG = 4;
const PALYDENDE = 100;
const MAKS_RENTE = 10;
const W = 320;
const H = 180;
const LEFT = 34;
const RIGHT = 310;
const TOP = 10;
const BOTTOM = 156;
const MIN_PRIS = 60;
const MAKS_PRIS = 145;
const KORT = "#0F766E";
const LANG = "#3B6FD8";

/** Pris per 100 kr pålydende: nåverdien av kupongene og pålydende, diskontert med yield. */
export function bondPrice(yieldPct: number, years: number) {
  const r = yieldPct / 100;
  let price = 0;
  for (let t = 1; t <= years; t += 1) price += KUPONG / (1 + r) ** t;
  return price + PALYDENDE / (1 + r) ** years;
}

export function BondFigure() {
  const [rente, setRente] = useState(5);
  const scrub = useScrub(W, LEFT, RIGHT, (share) => setRente(Math.round(share * MAKS_RENTE * 10) / 10));
  const x = (pct: number) => round(LEFT + (pct / MAKS_RENTE) * (RIGHT - LEFT));
  const y = (price: number) => round(BOTTOM - ((price - MIN_PRIS) / (MAKS_PRIS - MIN_PRIS)) * (BOTTOM - TOP));
  const curve = (years: number) =>
    Array.from({ length: 51 }, (_, i) => (i / 50) * MAKS_RENTE)
      .map((pct, i) => `${i === 0 ? "M" : "L"}${x(pct)} ${y(bondPrice(pct, years))}`)
      .join(" ");
  const kort = bondPrice(rente, 1);
  const lang = bondPrice(rente, 10);
  const relation =
    Math.abs(rente - KUPONG) < 0.05
      ? "Yield er lik kupongen, så begge koster 100 kr."
      : rente > KUPONG
        ? "Yield er over kupongen, så prisen er under 100 kr."
        : "Yield er under kupongen, så prisen er over 100 kr.";

  return (
    <FigureCard
      title="Obligasjonspris og rente"
      year="To obligasjoner med samme kupong, 4 kr i året per 100 kr. Dra i grafen for å endre markedsrenta."
      note="Læringsfigur. Pålydende 100 kr, én kupong i året, ingen kredittrisiko og ingen kostnader. Prisen er nåverdien av kupongene og pålydende, regnet med markedsrenta. Kjøper du til den prisen og holder til forfall, er avkastningen din lik markedsrenta. Det er yield. Lang løpetid gir større prisutslag, altså høyere durasjon."
    >
      <StickyView>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full select-none"
          role="img"
          aria-label={`Pris mot markedsrente. Ved ${tall(rente, 1)} % koster 1-årsobligasjonen ${tall(kort, 2)} kr og 10-årsobligasjonen ${tall(lang, 2)} kr.`}
          {...scrub}
        >
          <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#CBD5E1" />
          <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke="#CBD5E1" />
          <line x1={LEFT} x2={RIGHT} y1={y(100)} y2={y(100)} stroke="#94A3B8" strokeDasharray="3 3" />
          <line x1={x(KUPONG)} x2={x(KUPONG)} y1={TOP} y2={BOTTOM} stroke="#94A3B8" strokeDasharray="3 3" />
          <text x={LEFT - 4} y={y(100) + 4} textAnchor="end" fontSize="11" fill="#5C6B7A">100</text>
          <text x={LEFT - 4} y={y(140) + 4} textAnchor="end" fontSize="11" fill="#5C6B7A">140</text>
          <text x={LEFT - 4} y={y(70) + 4} textAnchor="end" fontSize="11" fill="#5C6B7A">70</text>
          <text x={LEFT} y={H - 6} fontSize="11" fill="#5C6B7A">0 %</text>
          <text x={x(KUPONG)} y={H - 6} textAnchor="middle" fontSize="11" fill="#5C6B7A">kupong 4 %</text>
          <text x={RIGHT} y={H - 6} textAnchor="end" fontSize="11" fill="#5C6B7A">10 %</text>
          <path d={curve(1)} fill="none" stroke={KORT} strokeWidth="2.5" />
          <path d={curve(10)} fill="none" stroke={LANG} strokeWidth="2.5" />
          <line x1={x(rente)} x2={x(rente)} y1={TOP} y2={BOTTOM} stroke="#1A2332" strokeWidth="1" />
          <circle cx={x(rente)} cy={y(kort)} r="5" fill={KORT} stroke="white" strokeWidth="1.5" />
          <circle cx={x(rente)} cy={y(lang)} r="5" fill={LANG} stroke="white" strokeWidth="1.5" />
        </svg>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["1 år til forfall", KORT, kort],
              ["10 år til forfall", LANG, lang],
            ] as const
          ).map(([label, color, price]) => (
            <div key={label} className="rounded-xl bg-[var(--background)] p-2.5">
              <p className="text-xs text-[var(--ink)]"><Swatch color={color} />{label}</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-[var(--ink)]">{tall(price, 2)} kr</p>
              <p className="text-xs tabular-nums text-[var(--muted)]">
                {price >= 100 ? "+" : "−"}{tall(Math.abs(price - 100), 2)} kr mot 100
              </p>
            </div>
          ))}
        </div>
      </StickyView>
      <RangeField label="Markedsrente (yield)" min={0} max={MAKS_RENTE} step={0.1} value={rente} display={`${tall(rente, 1)} %`} onChange={setRente} />
      <p className="text-sm text-[var(--ink)]">
        {relation} Kupongen er fortsatt 4 kr. Den lange obligasjonen svinger mest når renta endres.
      </p>
    </FigureCard>
  );
}
