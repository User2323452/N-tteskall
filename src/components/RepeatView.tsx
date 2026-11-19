"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BackLink } from "@/components/nav-memory";
import { concepts, getConcept } from "@/data/learning";
import {
  formatDueLabel,
  getConceptProgress,
  getDueConceptIds,
  gradeHint,
  listSchedule,
  setConceptStatus,
  setRecallAttempt,
} from "@/lib/progress";
import { recallGrades, type RecallGrade } from "@/types/learning";

function queueWithOpenRecallFirst(ids: string[]): string[] {
  const open: string[] = [];
  const rest: string[] = [];
  for (const id of ids) {
    if (getConceptProgress(id).recall) open.push(id);
    else rest.push(id);
  }
  return [...open, ...rest];
}

export function RepeatView() {
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [needsText, setNeedsText] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const due = queueWithOpenRecallFirst(getDueConceptIds(concepts.map((c) => c.id)));
    setQueue(due);
    setIndex(0);
    const saved = due[0] ? getConceptProgress(due[0]).recall : undefined;
    setDraft(saved?.text ?? "");
    setRevealed(Boolean(saved?.revealed));
    setNeedsText(false);
    setReady(true);
  }, []);

  const current = useMemo(
    () => (queue[index] ? getConcept(queue[index]) : undefined),
    [queue, index]
  );

  function showCard(nextIndex: number) {
    const id = queue[nextIndex];
    const saved = id ? getConceptProgress(id).recall : undefined;
    setDraft(saved?.text ?? "");
    setRevealed(Boolean(saved?.revealed));
    setNeedsText(false);
    setIndex(nextIndex);
  }

  function updateDraft(value: string) {
    setDraft(value);
    setNeedsText(false);
    if (!current) return;
    if (!value.trim()) {
      setRecallAttempt(current.id, null);
      return;
    }
    setRecallAttempt(current.id, { text: value, revealed: false });
  }

  function checkAnswer() {
    if (!current) return;
    const text = draft.trim();
    if (!text) {
      setNeedsText(true);
      return;
    }
    setDraft(text);
    setRecallAttempt(current.id, { text, revealed: true });
    setRevealed(true);
    setNeedsText(false);
  }

  function revealAnswer() {
    if (!current) return;
    const text = draft.trim();
    setDraft(text);
    setRecallAttempt(current.id, { text, revealed: true });
    setRevealed(true);
    setNeedsText(false);
  }

  function grade(status: RecallGrade) {
    if (!current) return;
    setConceptStatus(current.id, status, current.term);
    if (index + 1 >= queue.length) {
      setDraft("");
      setRevealed(false);
      setNeedsText(false);
      setIndex(queue.length);
      return;
    }
    showCard(index + 1);
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
            ? "Fullfør en leksjon, så legges nøkkelkonseptene her. Du kan også legge et konsept i køen fra konseptsiden."
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
            href="/kart"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            Kart
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const attempt = draft.trim();

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <BackLink fallback="/" label="Avslutt" />

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
          <form
            key={current.id}
            className="mt-8 flex flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              checkAnswer();
            }}
          >
            <label htmlFor="recall" className="text-sm font-medium text-slate-700">
              Hva betyr dette?
            </label>
            <textarea
              id="recall"
              value={draft}
              onChange={(event) => updateDraft(event.target.value)}
              placeholder="Skriv med egne ord"
              rows={5}
              autoFocus
              aria-invalid={needsText || undefined}
              aria-describedby={needsText ? "recall-hint" : undefined}
              className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--accent)]"
            />
            {needsText && (
              <p id="recall-hint" role="status" className="mt-2 text-sm text-slate-500">
                Skriv noe, eller vis fasiten.
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="submit"
                className="min-h-12 rounded-xl bg-[var(--accent)] text-sm font-medium text-white active:scale-[0.98]"
              >
                Sjekk
              </button>
              <button
                type="button"
                onClick={revealAnswer}
                className="min-h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 active:scale-[0.98]"
              >
                Vis fasiten
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-3 animate-[fadeUp_0.3s_ease-out]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <h2 className="text-xs font-medium text-slate-400">Du skrev</h2>
                <p
                  className={`mt-2 whitespace-pre-wrap text-[15px] leading-relaxed ${
                    attempt ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {attempt || "Ingenting skrevet"}
                </p>
              </section>
              <section className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-3">
                <h2 className="text-xs font-medium text-[var(--accent)]">Fasiten</h2>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-slate-800">
                  {current.definition}
                </p>
              </section>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{current.explanation}</p>
          </div>
        )}
      </div>

      {revealed && (
        <div className="sticky bottom-3 z-10 mt-8 grid grid-cols-2 gap-2 pb-1 sm:grid-cols-4">
          {recallGrades.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => grade(status)}
              className="min-h-12 rounded-xl border border-slate-200 bg-white px-1 text-sm font-medium text-slate-800 active:scale-[0.98]"
            >
              <span className="block">{status}</span>
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
