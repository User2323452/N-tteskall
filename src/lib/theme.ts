import type { AreaId, TermAreaId } from "@/types/mesterplan";

export const termAreaLabel: Record<TermAreaId, string> = {
  makro: "Makro",
  marked: "Marked",
  bank: "Bank",
  personlig: "Personlig",
  metode: "Metode",
};

export function labelForTermArea(id: string): string {
  return termAreaLabel[id as TermAreaId] ?? id;
}

export const areaAccent: Record<
  AreaId | string,
  { soft: string; border: string; text: string; dot: string }
> = {
  hukommelse: {
    soft: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
  makro: {
    soft: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-800",
    dot: "bg-sky-500",
  },
  marked: {
    soft: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  bank: {
    soft: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-800",
    dot: "bg-violet-500",
  },
  personlig: {
    soft: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    dot: "bg-amber-500",
  },
  metode: {
    soft: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-800",
    dot: "bg-rose-400",
  },
  innboks: {
    soft: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-900",
    dot: "bg-yellow-500",
  },
};

export const termStatusStyle: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  Ny: { bg: "bg-slate-100", text: "text-slate-600", label: "Ny" },
  Usikker: { bg: "bg-amber-100", text: "text-amber-800", label: "Usikker" },
  "Kan det": {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    label: "Kan det",
  },
};
