"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Circle } from "lucide-react";
import {
  categoryLabel,
  getLessonsForPath,
  getPath,
} from "@/data/learning";
import { getPathProgress, nextLessonId } from "@/lib/progress";

export function PathView({ pathId }: { pathId: string }) {
  const path = getPath(pathId);
  const lessons = getLessonsForPath(pathId);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick((n) => n + 1);
  }, []);

  const progress = useMemo(() => {
    void tick;
    return getPathProgress(pathId);
  }, [pathId, tick]);
  const done = new Set(progress.completedLessonIds);
  const next = nextLessonId(path?.lessonIds ?? [], progress.completedLessonIds);

  if (!path) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">Fant ikke læringsløpet.</p>
        <Link href="/" className="text-sm font-medium text-slate-900 underline">
          Tilbake til hjem
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Hjem
      </Link>

      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {categoryLabel[path.category]} · ca. {path.estimatedMinutes} min
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-slate-900 sm:text-4xl">
          {path.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {path.subtitle}
        </p>
        {next && (
          <Link
            href={`/lop/${path.id}/${next}`}
            className="mt-5 inline-flex rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white"
          >
            {done.size > 0 ? "Fortsett der du slapp" : "Start læringsløpet"}
          </Link>
        )}
        {!next && done.size > 0 && (
          <p className="mt-5 text-sm font-medium text-emerald-700">
            Du har fullført dette læringsløpet. Repeter begrepene for å feste dem.
          </p>
        )}
      </header>

      <ol className="space-y-2">
        {lessons.map((lesson, i) => {
          const completed = done.has(lesson.id);
          return (
            <li key={lesson.id}>
              <Link
                href={`/lop/${path.id}/${lesson.id}`}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 transition hover:border-slate-300"
              >
                <span className="mt-0.5 text-slate-400">
                  {completed ? (
                    <Check className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </span>
                <span>
                  <span className="block text-xs text-slate-400">
                    Leksjon {i + 1}
                  </span>
                  <span className="font-medium text-slate-900">
                    {lesson.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-500">
                    {lesson.summary}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
