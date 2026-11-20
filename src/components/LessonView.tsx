"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ConceptFigure } from "@/components/figures/ConceptFigure";
import { MarkedText } from "@/components/MarkedText";
import { SatsTabell } from "@/components/SatsTabell";
import { figureKey } from "@/data/concept-figures";
import {
  getConcept,
  getLesson,
  getLessonsForPath,
  getPath,
  srsConceptIds,
} from "@/data/learning";
import { useLessonMotion } from "@/components/lesson-motion";
import { stripMarkup } from "@/lib/markup";
import { useNav } from "@/components/nav-memory";
import {
  getConceptProgress,
  getPathProgress,
  introduceConcepts,
  isIntroduced,
  markLessonComplete,
  markPathComplete,
  todayAlreadyCounted,
  touchPath,
} from "@/lib/progress";

export function LessonView({
  pathId,
  lessonId,
}: {
  pathId: string;
  lessonId: string;
}) {
  const router = useRouter();
  const nav = useNav();
  const motion = useLessonMotion();
  const path = getPath(pathId);
  const lesson = getLesson(lessonId);
  const lessons = getLessonsForPath(pathId);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);
  const [saved, setSaved] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setQuizChoice(null);
    setQuizChecked(false);
    setWrongChoices([]);
    setSaved(false);
    setLeaving(false);
  }, [lessonId]);

  useEffect(() => {
    if (!path) return;
    touchPath(pathId, path.title);
  }, [path, pathId]);

  const index = lessons.findIndex((l) => l.id === lessonId);
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;

  const alreadyDone = useMemo(() => {
    void saved;
    return getPathProgress(pathId).completedLessonIds.includes(lessonId);
  }, [pathId, lessonId, saved]);

  if (!path || !lesson || lesson.pathId !== pathId) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">Fant ikke leksjonen.</p>
        <Link href="/" className="text-sm font-medium underline">
          Til hjem
        </Link>
      </div>
    );
  }

  const concepts = lesson.conceptIds
    .map((id) => getConcept(id))
    .filter(Boolean);
  const lessonConceptIds = lesson.conceptIds;
  const figureOwners = new Map<string, string>();
  for (const id of lessonConceptIds) {
    if (lesson.figureConceptId && id !== lesson.figureConceptId) continue;
    if (!figureOwners.has(figureKey(id))) figureOwners.set(figureKey(id), id);
  }
  const lessonTitle = lesson.title;
  const pathTitle = path.title;

  function completeAndGo(href: string) {
    if (leaving) return;
    setLeaving(true);
    const commit = () => {
      introduceConcepts(lessonConceptIds, { onlySrs: true });
      markLessonComplete(pathId, lessonId, `Leksjon: ${lessonTitle}`);
      if (!next) {
        markPathComplete(
          pathId,
          lessons.map((l) => l.id),
          `Fullførte ${pathTitle}`
        );
      }
      setSaved(true);
    };
    if (motion) {
      const conceptsAdded = lessonConceptIds.filter(
        (id) => srsConceptIds.has(id) && !isIntroduced(getConceptProgress(id))
      ).length;
      motion.run({
        href,
        fromId: lessonId,
        toId: next?.id ?? null,
        commit,
        conceptsAdded,
        madeDay: !todayAlreadyCounted(),
      });
      return;
    }
    commit();
    router.push(href);
  }

  const quizOk =
    lesson.quiz &&
    quizChecked &&
    quizChoice === lesson.quiz.answerIndex;

  const canAdvance = !lesson.quiz || quizOk || alreadyDone;

  return (
    <article className="mx-auto max-w-2xl">
      {motion ? (
        <button
          type="button"
          onClick={motion.close}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {path.title}
        </button>
      ) : (
        <Link
          href={`/lop/${pathId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {path.title}
        </Link>
      )}

      <p className="mt-5 text-xs font-medium text-slate-400">
        Leksjon {index + 1} av {lessons.length}
      </p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${((index + 1) / lessons.length) * 100}%` }}
        />
      </div>

      <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl tracking-tight text-slate-900">
        {lesson.title}
      </h1>
      <p className="mt-2 text-sm text-slate-500">{lesson.summary}</p>

      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700">
        {lesson.body.map((paragraph, index) => (
          <p key={index}>
            <MarkedText text={paragraph} />
          </p>
        ))}
      </div>

      {lesson.satsIds && lesson.satsIds.length > 0 && (
        <div className="mt-6">
          <SatsTabell ids={lesson.satsIds} />
        </div>
      )}

      {concepts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Nøkkelkonsepter
          </h2>
          <ul className="mt-3 space-y-2">
            {concepts.map((c) =>
              c ? (
                <li
                  key={c.id}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3"
                >
                  <Link href={`/konsept/${c.id}`} className="block">
                    <span className="font-medium text-slate-900">{c.term}</span>
                    <span className="mt-0.5 block text-sm text-slate-500">
                      {stripMarkup(c.definition)}
                    </span>
                  </Link>
                  {figureOwners.get(figureKey(c.id)) === c.id && (
                    <div className="mt-3">
                      <ConceptFigure id={c.id} />
                    </div>
                  )}
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}

      {lesson.quiz && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <h2 className="font-medium text-slate-900">Test deg selv</h2>
          <p className="mt-1 text-sm text-slate-600">{lesson.quiz.question}</p>
          <ul className="mt-3 space-y-2">
            {lesson.quiz.options.map((opt, i) => {
              const selected = quizChoice === i;
              const wrong = wrongChoices.includes(i);
              let style =
                "border-slate-200 bg-white hover:border-slate-300";
              if (quizOk && i === lesson.quiz!.answerIndex) {
                style = "border-emerald-400 bg-emerald-50";
              } else if (wrong) {
                style = "border-rose-300 bg-rose-50";
              } else if (selected) {
                style = "border-slate-900 bg-white";
              }
              return (
                <li key={opt}>
                  <button
                    type="button"
                    disabled={quizChecked}
                    onClick={() => setQuizChoice(i)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm ${style}`}
                  >
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
          {!quizChecked ? (
            <button
              type="button"
              disabled={quizChoice === null}
              onClick={() => {
                if (quizChoice !== null && quizChoice !== lesson.quiz!.answerIndex) {
                  setWrongChoices((current) =>
                    current.includes(quizChoice) ? current : [...current, quizChoice]
                  );
                }
                setQuizChecked(true);
              }}
              className="mt-3 rounded-xl bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Sjekk svar
            </button>
          ) : quizOk ? (
            <p className="mt-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <Check className="h-4 w-4" /> Riktig.
              </span>{" "}
              <MarkedText text={lesson.quiz.explain} />
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-rose-700">Ikke helt.</span>{" "}
                <MarkedText
                  text={
                    quizChoice !== null
                      ? lesson.quiz.whyWrong?.[quizChoice] || lesson.quiz.explain
                      : lesson.quiz.explain
                  }
                />
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuizChecked(false);
                  setQuizChoice(null);
                }}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800"
              >
                Prøv igjen
              </button>
            </div>
          )}
        </section>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
        {prev ? (
          <button
            type="button"
            onClick={() => {
              const href = `/lop/${pathId}/${prev.id}`;
              if (nav) nav.replace(href);
              else router.replace(href);
            }}
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" /> Forrige
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            type="button"
            disabled={!canAdvance || leaving}
            onClick={() => completeAndGo(`/lop/${pathId}/${next.id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            Neste leksjon <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canAdvance || leaving}
            onClick={() => completeAndGo(`/lop/${pathId}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            Fullfør løpet <Check className="h-4 w-4" />
          </button>
        )}
      </div>
      {lesson.quiz && !canAdvance && (
        <p className="mt-2 text-xs text-slate-500">
          Svar riktig på spørsmålet for å gå videre.
        </p>
      )}
    </article>
  );
}
