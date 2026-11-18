"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getLessonsForPath, learningPaths, searchLearning } from "@/data/learning";
import { areaPictures, overviewAreas, pathsInArea } from "@/data/overview";
import { getAllPathProgress, nextLessonId } from "@/lib/progress";

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

  const continueTarget = useMemo(() => {
    for (const path of learningPaths) {
      const prog = pathProgress[path.id];
      const lessons = getLessonsForPath(path.id);
      const next = nextLessonId(path.lessonIds, prog?.completedLessonIds ?? []);
      if (!next) continue;
      const done = prog?.completedLessonIds.length ?? 0;
      const started = Boolean(prog?.startedAt) || done > 0;
      const index = lessons.findIndex((lesson) => lesson.id === next);
      return {
        path,
        lessonId: next,
        started,
        index: index >= 0 ? index + 1 : 1,
        total: lessons.length,
        done,
        finishedAll: false,
      };
    }
    const first = learningPaths[0];
    const lessons = getLessonsForPath(first.id);
    return {
      path: first,
      lessonId: first.lessonIds[0],
      started: true,
      index: lessons.length,
      total: lessons.length,
      done: lessons.length,
      finishedAll: true,
    };
  }, [pathProgress]);

  const liveSearch = useMemo(() => searchLearning(q), [q]);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) {
      router.push("/sok");
      return;
    }
    router.push(`/sok?q=${encodeURIComponent(trimmed)}`);
  }

  const pct = continueTarget.total
    ? Math.round((continueTarget.done / continueTarget.total) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-xl space-y-10">
      <section>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--accent)] sm:text-5xl">
          Nøtteskall
        </h1>
        <p className="mt-2 text-[15px] text-[var(--muted)]">
          Forstå økonomi. Tenk langsiktig.
        </p>

        <form onSubmit={onSearchSubmit} className="relative mt-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Søk begrep eller løp"
            className="w-full rounded-2xl border border-[var(--line)] bg-white py-3.5 pl-10 pr-4 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2"
            aria-label="Søk etter begrep eller læringsløp"
          />
        </form>

        {q.trim() && (
          <div className="mt-2 rounded-2xl border border-[var(--line)] bg-white p-2">
            {liveSearch.concepts.slice(0, 4).map((concept) => (
              <Link
                key={concept.id}
                href={`/begrep/${concept.id}`}
                className="block rounded-xl px-3 py-2 hover:bg-[var(--accent-soft)]"
              >
                <span className="text-sm font-medium text-[var(--ink)]">
                  {concept.term}
                </span>
                <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
                  {concept.definition}
                </span>
              </Link>
            ))}
            {liveSearch.paths.slice(0, 2).map((path) => (
              <Link
                key={path.id}
                href={`/lop/${path.id}`}
                className="block rounded-xl px-3 py-2 text-sm hover:bg-[var(--accent-soft)]"
              >
                <span className="text-xs text-[var(--muted)]">Løp</span>
                <span className="block text-[var(--ink)]">{path.title}</span>
              </Link>
            ))}
            {liveSearch.coming.slice(0, 2).map((path) => (
              <Link
                key={path.id}
                href={path.href}
                className="block rounded-xl px-3 py-2 text-sm hover:bg-[var(--accent-soft)]"
              >
                <span className="text-xs text-[var(--muted)]">På kartet</span>
                <span className="block text-[var(--ink)]">{path.title}</span>
              </Link>
            ))}
            {liveSearch.concepts.length === 0 &&
              liveSearch.paths.length === 0 &&
              liveSearch.coming.length === 0 && (
                <p className="px-3 py-2 text-sm text-[var(--muted)]">
                  Ingen treff. Prøv KPI, ASK eller styringsrente.
                </p>
              )}
          </div>
        )}
      </section>

      <section>
        {continueTarget.finishedAll ? (
          <Link
            href="/repeter"
            className="block rounded-2xl bg-[var(--accent-soft)] px-4 py-4"
          >
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--accent)]">
              Løp
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              Løpene er ferdige
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              Repeter begrepene du har lagt i køen.
            </p>
            <p className="mt-3 text-sm font-medium text-[var(--accent)]">
              Til repetisjon →
            </p>
          </Link>
        ) : (
          <Link
            href={`/lop/${continueTarget.path.id}/${continueTarget.lessonId}`}
            className="block rounded-2xl bg-[var(--accent-soft)] px-4 py-4"
          >
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--accent)]">
              {continueTarget.started ? "Fortsett" : "Start"}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {continueTarget.path.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              {continueTarget.path.subtitle}
            </p>
            <p className="mt-4 text-sm text-[var(--ink)]">
              Leksjon {continueTarget.index} av {continueTarget.total}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-3 text-sm font-medium text-[var(--accent)]">
              {continueTarget.started ? "Fortsett" : "Start"} →
            </p>
          </Link>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--ink)]">Områdene</h2>
        <p className="text-sm text-[var(--muted)]">
          Løpene ligger i kartet, samlet etter område.
        </p>
        <ul className="space-y-3">
          {overviewAreas.map((area) => {
            const picture = areaPictures[area.id];
            const paths = pathsInArea(area);
            return (
              <li key={area.id} className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
                <Link href={`/kart#${area.id}`} className="flex gap-3 p-3">
                  {picture && (
                    <Image
                      src={picture.src}
                      alt=""
                      width={160}
                      height={120}
                      className="h-16 w-20 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                      {area.name}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-[var(--muted)]">
                      {area.summary}
                    </span>
                  </span>
                </Link>
                <ul className="border-t border-[var(--line)] px-3">
                  {paths.length > 0 ? (
                    paths.map((path) => {
                      const total = getLessonsForPath(path.id).length;
                      const done = pathProgress[path.id]?.completedLessonIds.length ?? 0;
                      const current =
                        path.id === continueTarget.path.id &&
                        continueTarget.started &&
                        !continueTarget.finishedAll;
                      return (
                        <li key={path.id}>
                          <Link
                            href={`/lop/${path.id}`}
                            className="flex items-baseline justify-between gap-3 py-2.5"
                          >
                            <span>
                              <span className="block text-[15px] text-[var(--ink)]">
                                {path.title}
                                {current ? " · pågår" : ""}
                              </span>
                              <span className="text-sm text-[var(--muted)]">
                                {total} leksjoner
                                {done > 0 ? ` · ${done} ferdige` : ""}
                              </span>
                            </span>
                            <span aria-hidden className="text-[var(--muted)]">
                              →
                            </span>
                          </Link>
                        </li>
                      );
                    })
                  ) : (
                    <li>
                      <Link
                        href={`/kart#${area.id}`}
                        className="flex items-baseline justify-between gap-3 py-2.5 text-sm text-[var(--muted)]"
                      >
                        Temaer og begreper
                        <span aria-hidden>→</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
