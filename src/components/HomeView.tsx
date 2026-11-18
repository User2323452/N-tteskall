"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Clock, Search } from "lucide-react";
import {
  categoryLabel,
  concepts,
  getLessonsForPath,
  learningPaths,
  searchLearning,
} from "@/data/learning";
import {
  getAllPathProgress,
  getDueConceptIds,
  nextLessonId,
} from "@/lib/progress";

export function HomeView() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [progressTick, setProgressTick] = useState(0);

  useEffect(() => {
    setProgressTick((n) => n + 1);
  }, []);

  const pathProgress = useMemo(() => {
    void progressTick;
    return getAllPathProgress();
  }, [progressTick]);

  const dueCount = useMemo(() => {
    void progressTick;
    return getDueConceptIds(concepts.map((c) => c.id)).length;
  }, [progressTick]);

  const continueTarget = useMemo(() => {
    for (const path of learningPaths) {
      const prog = pathProgress[path.id];
      const next = nextLessonId(path.lessonIds, prog?.completedLessonIds ?? []);
      if (next) {
        return { path, lessonId: next, started: (prog?.completedLessonIds.length ?? 0) > 0 };
      }
    }
    return null;
  }, [pathProgress]);

  const liveSearch = useMemo(() => searchLearning(q), [q]);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    if (liveSearch.concepts.length === 1 && liveSearch.paths.length === 0) {
      router.push(`/begrep/${liveSearch.concepts[0].id}`);
      return;
    }
    router.push(`/sok?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden pt-2">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-48 w-48 rounded-full bg-sky-100/80 blur-3xl" />

        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Økonomi i et nøtteskall
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[2.35rem] leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
          MesterPlan
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-600">
          Lær økonomi gjennom korte læringsløp — eller søk opp et begrep og få
          det forklart på bokmål.
        </p>

        <form onSubmit={onSearchSubmit} className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Søk begrep — f.eks. styringsrenten, ASK…"
            className="w-full rounded-2xl border border-slate-200/90 bg-white py-3.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none ring-[var(--accent)] transition placeholder:text-slate-400 focus:ring-2"
            aria-label="Søk etter økonomisk begrep"
          />
        </form>

        {q.trim() && (
          <div className="mt-3 max-w-xl space-y-1 rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-sm backdrop-blur">
            {liveSearch.concepts.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/begrep/${c.id}`}
                className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">{c.term}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {c.definition}
                </span>
              </Link>
            ))}
            {liveSearch.paths.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                href={`/lop/${p.id}`}
                className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Læringsløp
                </span>
                <span className="block font-medium text-slate-900">{p.title}</span>
              </Link>
            ))}
            {liveSearch.concepts.length === 0 && liveSearch.paths.length === 0 && (
              <p className="px-3 py-2 text-sm text-slate-500">
                Ingen treff. Prøv «inflasjon» eller «ASK».
              </p>
            )}
            <Link
              href={`/sok?q=${encodeURIComponent(q.trim())}`}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-[var(--accent)]"
            >
              Se alle treff <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {continueTarget ? (
            <Link
              href={`/lop/${continueTarget.path.id}/${continueTarget.lessonId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <BookOpen className="h-4 w-4" />
              {continueTarget.started
                ? `Fortsett: ${continueTarget.path.title}`
                : `Start: ${continueTarget.path.title}`}
            </Link>
          ) : (
            <Link
              href={`/lop/${learningPaths[0].id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              <BookOpen className="h-4 w-4" />
              Se læringsløp
            </Link>
          )}
          <Link
            href="/repeter"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            Repeter begreper
            {dueCount > 0 && (
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                {dueCount}
              </span>
            )}
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
              Læringsløp
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Kuraterte stier — ingen tomme sider å fylle først.
            </p>
          </div>
        </div>

        <ul className="space-y-3">
          {learningPaths.map((path) => {
            const lessons = getLessonsForPath(path.id);
            const done = pathProgress[path.id]?.completedLessonIds.length ?? 0;
            const total = lessons.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            const next = nextLessonId(
              path.lessonIds,
              pathProgress[path.id]?.completedLessonIds ?? []
            );
            return (
              <li key={path.id}>
                <Link
                  href={next ? `/lop/${path.id}/${next}` : `/lop/${path.id}`}
                  className="group block rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {categoryLabel[path.category]}
                      </p>
                      <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-slate-900 group-hover:text-[var(--accent)]">
                        {path.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {path.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      ca. {path.estimatedMinutes} min
                    </span>
                    <span>
                      {done}/{total} leksjoner
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t border-slate-200/70 pt-6">
        <p className="text-sm text-slate-500">
          Trenger du egne notater?{" "}
          <Link href="/notater" className="font-medium text-slate-800 underline-offset-2 hover:underline">
            Åpne notatbiblioteket
          </Link>{" "}
          — det er valgfritt, ikke starten.
        </p>
      </section>
    </div>
  );
}
