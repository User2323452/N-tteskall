"use client";

import { useState } from "react";
import { FigureCard, StickyView, Swatch } from "@/components/figures/FigureCard";
import { RangeField } from "@/components/figures/RangeField";
import { round, useScrub } from "@/components/figures/useScrub";
import { kroner, tall } from "@/lib/format";

const YEARS = 10;
const START_LONN = 500_000;
const W = 320;
const H = 170;
const LEFT = 34;
const RIGHT = 310;
const TOP = 12;
const BOTTOM = 146;
const LONN = "#3B6FD8";
const KPI = "#64748B";
const UP = "#0F766E";
const DOWN = "#BE123C";

export function RealWageFigure() {
  const [lonnsvekst, setLonnsvekst] = useState(4);
  const [prisvekst, setPrisvekst] = useState(3);
  const [year, setYear] = useState(YEARS);
  const scrub = useScrub(W, LEFT, RIGHT, (share) => setYear(Math.round(share * YEARS)));

  const lonn = Array.from({ length: YEARS + 1 }, (_, t) => 100 * (1 + lonnsvekst / 100) ** t);
  const kpi = Array.from({ length: YEARS + 1 }, (_, t) => 100 * (1 + prisvekst / 100) ** t);
  const top = Math.max(110, Math.ceil(Math.max(lonn[YEARS], kpi[YEARS]) / 10) * 10);
  const x = (t: number) => round(LEFT + (t / YEARS) * (RIGHT - LEFT));
  const y = (v: number) => round(BOTTOM - ((v - 100) / (top - 100)) * (BOTTOM - TOP));
  const line = (values: number[]) => values.map((v, t) => `${t === 0 ? "M" : "L"}${x(t)} ${y(v)}`).join(" ");
  const band = `${line(lonn)} ${kpi
    .map((v, t) => ({ v, t }))
    .reverse()
    .map(({ v, t }) => `L${x(t)} ${y(v)}`)
    .join(" ")} Z`;

  const real = lonn[year] / kpi[year];
  const realPerAr = ((1 + lonnsvekst / 100) / (1 + prisvekst / 100) - 1) * 100;
  const stiger = lonnsvekst > prisvekst;
  const lik = lonnsvekst === prisvekst;
  const fill = lik ? "transparent" : stiger ? UP : DOWN;
  const nominell = START_LONN * (lonn[year] / 100);
  const iDagensKroner = START_LONN * real;

  return (
    <FigureCard
      title="Reallønn: lønna mot prisene"
      year="Begge starter på 100 i år 0. Dra i grafen for å velge år."
      note="Læringsfigur, ikke et bestemt år. Jevn vekst hvert år, før skatt. Reallønnsvekst = (1 + lønnsvekst) / (1 + prisvekst) − 1, som er om lag lønnsvekst minus prisvekst. KPI er prisveksten på det husholdningene kjøper."
    >
      <StickyView>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full select-none"
          role="img"
          aria-label={`Lønn og KPI over ${YEARS} år. Lønnslinjen ${stiger ? "ligger over" : lik ? "følger" : "ligger under"} KPI.`}
          {...scrub}
        >
          <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#CBD5E1" />
          <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke="#CBD5E1" />
          <text x={LEFT - 4} y={BOTTOM + 4} textAnchor="end" fontSize="12" fill="#5C6B7A">100</text>
          <text x={LEFT - 4} y={TOP + 4} textAnchor="end" fontSize="12" fill="#5C6B7A">{top}</text>
          <text x={LEFT} y={H - 6} fontSize="12" fill="#5C6B7A">År 0</text>
          <text x={RIGHT} y={H - 6} textAnchor="end" fontSize="12" fill="#5C6B7A">År {YEARS}</text>
          <path d={band} fill={fill} opacity="0.18" />
          <path d={line(kpi)} fill="none" stroke={KPI} strokeWidth="2.5" strokeDasharray="5 4" />
          <path d={line(lonn)} fill="none" stroke={LONN} strokeWidth="2.5" />
          <line x1={x(year)} x2={x(year)} y1={TOP} y2={BOTTOM} stroke="#1A2332" strokeWidth="1" />
          <circle cx={x(year)} cy={y(lonn[year])} r="5" fill={LONN} stroke="white" strokeWidth="1.5" />
          <circle cx={x(year)} cy={y(kpi[year])} r="5" fill={KPI} stroke="white" strokeWidth="1.5" />
        </svg>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--ink)]">
          <span><Swatch color={LONN} />Lønn (kroner)</span>
          <span><Swatch color={KPI} />KPI (prisene)</span>
          {!lik && <span><Swatch color={fill} />{stiger ? "Reallønna stiger" : "Reallønna faller"}</span>}
        </div>
        <p className={`text-sm font-medium ${lik ? "text-[var(--ink)]" : stiger ? "text-[#0F766E]" : "text-[#BE123C]"}`}>
          {year === 0
            ? "År 0: lønn og priser starter likt."
            : lik
              ? `År ${year}: lønna og prisene har steget like mye. Reallønna står stille.`
              : `År ${year}: lønna kjøper ${tall(Math.abs(real - 1) * 100, 1)} % ${stiger ? "mer" : "mindre"} enn i år 0.`}
        </p>
      </StickyView>
      <RangeField label="Lønnsvekst i året" min={0} max={8} step={0.1} value={lonnsvekst} display={`${tall(lonnsvekst, 1)} %`} onChange={setLonnsvekst} />
      <RangeField label="Prisvekst (KPI) i året" min={0} max={8} step={0.1} value={prisvekst} display={`${tall(prisvekst, 1)} %`} onChange={setPrisvekst} />
      <RangeField label="År" min={0} max={YEARS} step={1} value={year} display={`År ${year}`} onChange={setYear} />
      <p className="text-sm text-[var(--ink)]">
        {lik
          ? "Reallønna står stille."
          : `Reallønna ${stiger ? "stiger" : "faller"} med om lag ${tall(Math.abs(realPerAr), 1)} % i året.`}{" "}
        En lønn på {kroner(START_LONN)} blir {kroner(nominell)} i år {year}.
        Målt i prisene fra år 0 er det {kroner(iDagensKroner)}.
      </p>
    </FigureCard>
  );
}
