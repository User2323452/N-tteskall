"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { concepts, getConcept } from "@/data/learning";
import {
  formatDueLabel,
  getDueConceptIds,
  gradeHint,
  listSchedule,
  setConceptStatus,
} from "@/lib/progress";
import type { RecallGrade } from "@/types/learning";

export function RepeatView() {
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const due = getDueConceptIds(concepts.map((c) => c.id));
    // Prioritize "Ny" / never reviewed by keeping due order; shuffle lightly
    setQueue(due);
    setIndex(0);
    setRevealed(false);
    setReady(true);
  }, []);

  const current = useMemo(
    () => (queue[index] ? getConcept(queue[index]) : undefined),
    [queue, index]
  );

  function grade(status: RecallGrade) {
    if (!current) return;
    setConceptStatus(current.id, status, current.term);
    if (index + 1 >= queue.length) {
      setIndex(queue.length);
      setRevealed(false);
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  if (!ready) {
    return <p className="text-sm text-slate-500">Laster repetisjon…</p>;
  }

  if (queue.length === 0 || index >= queue.length) {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const upcoming = listSchedule().filter((item) => item.dueOn > today);
    const nextUp = upcoming[0];
    const nextTerm = nextUp ? getConcept(nextUp.id)?.term : undefined;
    return (
      <div className="mx-auto max-w-lg space-y-4 py-8 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          {queue.length === 0 ? "Ingenting venter" : "Ferdig for nå"}
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">
          {queue.length === 0
            ? "Fullfør en leksjon, så legges nøkkelbegrepene her. Du kan også legge et begrep i køen fra begrepssiden."
            : "Du har gått gjennom det som forfalt i dag."}
        </p>
        {nextTerm && nextUp && (
          <p className="text-sm text-slate-700">
            Neste: {nextTerm}, {formatDueLabel(nextUp.dueOn)}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/"
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white"
          >
            Til hjem
          </Link>
          <Link
            href="/oversikt"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            Oversikt
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-lg flex-col">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Avslutt
      </Link>

      <p className="mt-4 text-sm text-slate-500">
        Venter i dag: {queue.length - index}
      </p>

      <div className="mt-10 flex flex-1 flex-col">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-slate-900">
          {current.term}
        </h1>
        {current.english && (
          <p className="mt-1 text-sm text-slate-400">{current.english}</p>
        )}

        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-sm font-medium text-slate-600 transition hover:border-slate-400"
          >
            Vis forklaring
          </button>
        ) : (
          <div className="mt-8 space-y-3 animate-[fadeUp_0.3s_ease-out]">
            <p className="text-[15px] font-medium leading-relaxed text-slate-800">
              {current.definition}
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              {current.explanation}
            </p>
          </div>
        )}
      </div>

      {revealed && (
        <div className="sticky bottom-20 mt-8 grid grid-cols-3 gap-2 pb-4">
          {(
            [
              ["Usikker", "Usikker"],
              ["OK", "OK"],
              ["Kan det", "Kan det"],
            ] as const
          ).map(([status, label]) => (
            <button
              key={status}
              type="button"
              onClick={() => grade(status)}
              className="min-h-12 rounded-xl border border-slate-200 bg-white px-1 text-sm font-medium text-slate-800 active:scale-[0.98]"
            >
              <span className="block">{label}</span>
              <span className="mt-0.5 block text-[10px] font-normal text-slate-400">
                {gradeHint(current.id, status)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
