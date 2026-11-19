"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PathGlyph } from "@/components/PathGlyph";
import { getLessonsForPath } from "@/data/learning";
import { overviewAreas, pathsInArea } from "@/data/overview";
import { pickContinueTarget } from "@/lib/continue-path";
import { getAllPathProgress } from "@/lib/progress";

function lessonMeta(total: number, done: number) {
  const count = total === 1 ? "1 leksjon" : `${total} leksjoner`;
  if (done <= 0) return count;
  if (done >= total) return `${count} · ferdig`;
  if (done === 1) return `${count} · 1 ferdig`;
  return `${count} · ${done} ferdige`;
}

export function LopListView() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const pathProgress = ready ? getAllPathProgress() : {};
  const current = ready ? pickContinueTarget() : null;
  const currentId = current && current.started && !current.finishedAll ? current.pathId : null;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink)]">
          Løp
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
          Alle løpene, samlet etter område.
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
            <ul className="mt-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-white px-3">
              {paths.map((path) => {
                const total = getLessonsForPath(path.id).length;
                const done = pathProgress[path.id]?.completedLessonIds.length ?? 0;
                const ongoing = path.id === currentId;
                return (
                  <li key={path.id} className="border-t border-[var(--line)] first:border-t-0">
                    <Link
                      href={`/lop/${path.id}`}
                      className="flex min-h-12 items-center gap-3 py-3"
                    >
                      <PathGlyph id={path.id} />
                      <span className="min-w-0">
                        <span className="block text-[15px] text-[var(--ink)]">
                          {path.title}
                          {ongoing ? " · pågår" : ""}
                        </span>
                        <span className="text-sm text-[var(--muted)]">
                          {lessonMeta(total, done)}
                        </span>
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
