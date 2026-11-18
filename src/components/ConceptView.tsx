"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  categoryLabel,
  getConcept,
  learningPaths,
  lessons,
} from "@/data/learning";
import {
  formatDueLabel,
  getConceptProgress,
  gradeHint,
  introduceConcepts,
  setConceptStatus,
} from "@/lib/progress";
import { recallGrades, type ConceptProgress, type RecallGrade } from "@/types/learning";
import { termStatusStyle } from "@/lib/theme";
import { ConceptFigure, ConceptTeaching } from "@/components/figures/ConceptFigure";

export function ConceptView({ conceptId }: { conceptId: string }) {
  const concept = getConcept(conceptId);
  const [revealed, setRevealed] = useState(true);
  const [progress, setProgress] = useState<ConceptProgress>({ status: "Ny" });

  useEffect(() => {
    if (!concept) return;
    setProgress(getConceptProgress(concept.id));
    setRevealed(true);
  }, [concept]);

  if (!concept) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">Fant ikke begrepet.</p>
        <Link href="/sok" className="text-sm font-medium underline">
          Til søk
        </Link>
      </div>
    );
  }

  const related = (concept.relatedIds ?? [])
    .map((id) => getConcept(id))
    .filter(Boolean);

  const usedIn = lessons.filter((l) => l.conceptIds.includes(concept.id));
  const paths = learningPaths.filter((p) =>
    usedIn.some((l) => l.pathId === p.id)
  );

  function grade(next: RecallGrade) {
    setProgress(setConceptStatus(concept!.id, next, concept!.term));
  }

  function addToReview() {
    introduceConcepts([concept!.id]);
    setProgress(getConceptProgress(concept!.id));
  }

  return (
    <article className="mx-auto max-w-2xl animate-[fadeUp_0.35s_ease-out]">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Hjem
      </Link>

      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {categoryLabel[concept.category]}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-slate-900 sm:text-4xl">
        {concept.term}
      </h1>
      {concept.english && (
        <p className="mt-1 text-sm text-slate-400">{concept.english}</p>
      )}

      <p className="mt-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-[15px] font-medium leading-relaxed text-slate-800">
        {concept.definition}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-medium ${termStatusStyle[progress.status]?.bg} ${termStatusStyle[progress.status]?.text}`}
        >
          {progress.status}
        </span>
        {progress.dueOn ? (
          <span className="text-sm text-slate-600">
            Neste repetisjon: {formatDueLabel(progress.dueOn)}
          </span>
        ) : (
          <span className="text-sm text-slate-500">Ikke i repetisjonskøen ennå.</span>
        )}
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="text-xs font-medium text-slate-500 underline-offset-2 hover:underline"
        >
          {revealed ? "Skjul forklaring" : "Vis forklaring"}
        </button>
      </div>

      {revealed ? (
        <ConceptTeaching id={concept.id}>
          <div className="space-y-4 text-[15px] leading-relaxed text-slate-700">
            <p>{concept.explanation}</p>
            {concept.tip && (
              <p className="rounded-xl border border-amber-200/70 bg-amber-50/60 px-3.5 py-3 text-sm text-amber-950">
                <span className="font-semibold">Husk: </span>
                {concept.tip}
              </p>
            )}
          </div>
        </ConceptTeaching>
      ) : (
        <div className="mt-5">
          <ConceptFigure id={concept.id} />
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Repeter
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Si forklaringen høyt, og velg hvor godt den satt. Datoen under
          knappen er neste gang begrepet kommer i Repeter. Intervallet er kort
          første gang, og blir lengre når det sitter.
        </p>
        <button
          type="button"
          onClick={addToReview}
          className="mt-3 text-sm font-medium text-[var(--accent)]"
        >
          Legg i Repeter
        </button>
        <div className="mt-3 flex flex-wrap gap-2">
          {recallGrades.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => grade(g)}
              className={`min-h-11 flex-1 rounded-xl border px-3 py-2.5 text-center text-sm font-medium leading-tight sm:flex-none ${
                progress.status === g
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <span className="block">{g}</span>
              <span
                className={`mt-0.5 block text-[11px] font-normal ${
                  progress.status === g ? "text-white/80" : "text-slate-400"
                }`}
              >
                {gradeHint(concept.id, g)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Relaterte begreper
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((c) =>
              c ? (
                <li key={c.id}>
                  <Link
                    href={`/begrep/${c.id}`}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300"
                  >
                    {c.term}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}

      <p className="mt-8 text-xs leading-relaxed text-slate-400">
        Læringstekst. Tall som endres, må sjekkes mot Norges Bank, SSB eller
        Skatteetaten.
      </p>

      {paths.length > 0 && (
        <section className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Inngår i læringsløp
          </h2>
          <ul className="mt-3 space-y-2">
            {paths.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/lop/${p.id}`}
                  className="text-sm font-medium text-slate-800 underline-offset-2 hover:underline"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
