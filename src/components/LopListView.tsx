"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getLessonsForPath } from "@/data/learning";
import { overviewAreas, pathsInArea } from "@/data/overview";
import { getAllPathProgress, nextLessonId } from "@/lib/progress";

export function LopListView() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const pathProgress = useMemo(() => {
    if (!ready) return {};
    return getAllPathProgress();
  }, [ready]);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink)]">
          Løp
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
          Korte stier gjennom kartet. De er samlet etter område.
        </p>
      </header>

      {overviewAreas.map((area) => {
        const paths = pathsInArea(area);
        if (paths.length === 0) return null;
        return (
          <section key={area.id}>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              <Link href={`/kart#${area.id}`} className="hover:text-[var(--accent)]">
                {area.name}
              </Link>
            </h2>
            <ul className="mt-2 divide-y divide-[var(--line)]">
              {paths.map((path) => {
                const lessons = getLessonsForPath(path.id);
                const progress = pathProgress[path.id];
                const done = progress?.completedLessonIds.length ?? 0;
                const next = nextLessonId(path.lessonIds, progress?.completedLessonIds ?? []);
                const finished = !next;
                const href = next ? `/lop/${path.id}/${next}` : `/lop/${path.id}`;
                return (
                  <li key={path.id}>
                    <Link href={href} className="block py-3">
                      <span className="block text-[15px] text-[var(--ink)]">{path.title}</span>
                      <span className="mt-0.5 block text-sm text-[var(--muted)]">
                        {path.subtitle}
                      </span>
                      <span className="mt-1 block text-sm text-[var(--accent)]">
                        {finished
                          ? "Ferdig"
                          : done > 0
                            ? `${done} av ${lessons.length} leksjoner`
                            : `${lessons.length} leksjoner`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <p className="text-sm text-[var(--muted)]">
        Områder uten løp, som bank og metode, ligger på{" "}
        <Link href="/kart" className="text-[var(--ink)] underline-offset-2 hover:underline">
          kartet
        </Link>
        .
      </p>
    </div>
  );
}
