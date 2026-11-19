"use client";

import { useState } from "react";
import { FigureCard, StickyView, Swatch } from "@/components/figures/FigureCard";
import { RangeField } from "@/components/figures/RangeField";
import { round } from "@/components/figures/useScrub";
import { kroner, tall } from "@/lib/format";

const MAKS_BELANING = 0.9;
const MAKS_GJELDSGRAD = 5;
const EK = "#0F766E";
const LAN = "#3B6FD8";
const FELLES = "#93A8D8";
const EPS = 1e-9;

export function housingLimits(totalpris: number, egenkapital: number, inntekt: number) {
  const gjeld = Math.max(0, totalpris - egenkapital);
  return {
    gjeld,
    belaning: totalpris > 0 ? gjeld / totalpris : 0,
    gjeldsgrad: inntekt > 0 ? gjeld / inntekt : 0,
    /** gjeld ≤ 90 % av totalpris  ⇔  totalpris ≤ egenkapital / 10 %. */
    maksPrisBelaning: egenkapital / (1 - MAKS_BELANING),
    /** gjeld ≤ 5 × inntekt  ⇔  totalpris ≤ 5 × inntekt + egenkapital. */
    maksPrisGjeld: MAKS_GJELDSGRAD * inntekt + egenkapital,
  };
}

function House({ ekShare, fellesShare }: { ekShare: number; fellesShare: number }) {
  const top = 8;
  const eave = 46;
  const bottom = 148;
  const h = bottom - top;
  const yAt = (share: number) => round(bottom - share * h);
  const shape = `M70 ${top} L130 ${eave} V${bottom} H10 V${eave} Z`;
  const ekTop = yAt(Math.min(1, ekShare));
  const lanTop = yAt(Math.min(1, 1 - fellesShare));
  const line90 = yAt(1 - MAKS_BELANING);
  return (
    <svg viewBox="0 0 140 156" className="h-40 w-32 shrink-0" role="img" aria-label="Huset delt i egenkapital, lån og fellesgjeld">
      <defs>
        <clipPath id="hus-form">
          <path d={shape} />
        </clipPath>
      </defs>
      <g clipPath="url(#hus-form)">
        <rect x="0" y={top} width="140" height={h} fill={FELLES} />
        <rect x="0" y={lanTop} width="140" height={bottom - lanTop} fill={LAN} />
        <rect x="0" y={ekTop} width="140" height={bottom - ekTop} fill={EK} />
      </g>
      <path d={shape} fill="none" stroke="#1A2332" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="2" x2="138" y1={line90} y2={line90} stroke="#1A2332" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}

function Rule({ ok, label, value, limit }: { ok: boolean; label: string; value: string; limit: string }) {
  return (
    <div className={`rounded-xl px-2.5 py-2 ${ok ? "bg-[var(--accent-soft)]" : "bg-rose-50"}`}>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className={`text-base font-semibold tabular-nums ${ok ? "text-[var(--accent)]" : "text-rose-700"}`}>{value}</p>
      <p className="text-xs text-[var(--muted)]">{ok ? "Innenfor" : "Over"} {limit}</p>
    </div>
  );
}

export function HousingFigure() {
  const [pris, setPris] = useState(3_500_000);
  const [egenkapital, setEgenkapital] = useState(400_000);
  const [inntekt, setInntekt] = useState(700_000);
  const [felles, setFelles] = useState(0);

  const ek = Math.min(egenkapital, pris);
  const l = housingLimits(pris, egenkapital, inntekt);
  const fellesgjeld = Math.min(felles, l.gjeld);
  const banklan = l.gjeld - fellesgjeld;
  const okBelaning = l.belaning <= MAKS_BELANING + EPS;
  const okGjeld = l.gjeldsgrad <= MAKS_GJELDSGRAD + EPS;
  const maksPris = Math.min(l.maksPrisBelaning, l.maksPrisGjeld);
  const stopper =
    Math.abs(l.maksPrisBelaning - l.maksPrisGjeld) < 1
      ? "Begge reglene stopper deg samtidig."
      : l.maksPrisBelaning < l.maksPrisGjeld
        ? "Egenkapitalen stopper deg først (90 %-regelen)."
        : "Inntekten stopper deg først (fem ganger inntekten).";

  return (
    <FigureCard
      title="Hva stopper deg først?"
      year="Belåningsgrad, egenkapital og gjeldsgrad i samme bolig."
      note="Læringsfigur, ikke et lånetilsagn. Utlånsforskriften fra 31. desember 2024, fortsatt i 2026: nedbetalingslån høyst 90 % av boligverdien (10 % egenkapital), og samlet gjeld høyst fem ganger brutto årsinntekt. Figuren antar at du ikke har annen gjeld, som studielån eller billån. Fellesgjeld regnes med i lånet og i verdien, slik banken normalt gjør. Banken skal også sjekke at du tåler høyere rente, og kan være strengere."
    >
      <StickyView>
        <div className="flex items-center gap-3">
          <House ekShare={pris > 0 ? ek / pris : 0} fellesShare={pris > 0 ? fellesgjeld / pris : 0} />
          <div className="min-w-0 flex-1 space-y-2">
            <Rule ok={okBelaning} label="Belåningsgrad" value={`${tall(l.belaning * 100, 1)} %`} limit="90 %" />
            <Rule ok={okGjeld} label="Gjeldsgrad" value={`${tall(l.gjeldsgrad, 1)} × inntekt`} limit="5 ×" />
          </div>
        </div>
        <ul className="space-y-0.5 text-xs text-[var(--ink)]">
          <li className="flex justify-between gap-2"><span><Swatch color={EK} />Egenkapital</span><span className="tabular-nums">{kroner(ek)}</span></li>
          <li className="flex justify-between gap-2"><span><Swatch color={LAN} />Lån i banken</span><span className="tabular-nums">{kroner(banklan)}</span></li>
          {fellesgjeld > 0 && (
            <li className="flex justify-between gap-2"><span><Swatch color={FELLES} />Fellesgjeld</span><span className="tabular-nums">{kroner(fellesgjeld)}</span></li>
          )}
          <li className="text-[var(--muted)]">Den stiplete streken er 10 % av verdien. Egenkapitalen må nå opp til den.</li>
        </ul>
      </StickyView>
      <RangeField label="Totalpris" min={1_000_000} max={10_000_000} step={50_000} value={pris} display={kroner(pris)} onChange={setPris} />
      <RangeField label="Egenkapital" min={0} max={3_000_000} step={25_000} value={egenkapital} display={kroner(egenkapital)} onChange={setEgenkapital} />
      <RangeField label="Brutto årsinntekt" min={200_000} max={2_000_000} step={25_000} value={inntekt} display={kroner(inntekt)} onChange={setInntekt} />
      <RangeField label="Fellesgjeld (borettslag)" min={0} max={3_000_000} step={50_000} value={felles} display={kroner(fellesgjeld)} onChange={setFelles} />
      <div className="space-y-1 rounded-xl bg-[var(--background)] p-3 text-sm text-[var(--ink)]">
        <p>Høyeste totalpris med {kroner(egenkapital)} i egenkapital: {kroner(l.maksPrisBelaning)} (10 × egenkapitalen).</p>
        <p>Høyeste totalpris med {kroner(inntekt)} i inntekt: {kroner(l.maksPrisGjeld)} (5 × inntekten + egenkapitalen).</p>
        <p className="font-medium">
          {stopper} Taket er {kroner(maksPris)}.
        </p>
      </div>
    </FigureCard>
  );
}
