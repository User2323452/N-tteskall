"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Search } from "lucide-react";
import { concepts, getConcept, learningPaths, searchLearning } from "@/data/learning";
import { pickContinueTarget, pickTodaysPath } from "@/lib/continue-path";
import { StreakFlame } from "@/components/StreakFlame";
import {
  ackSitterNotices,
  currentStreak,
  formatDueLabel,
  getDueConceptIds,
  hasLessonToday,
  hasReviewToday,
  idleWaitingLabel,
  listCompletedDays,
  listSchedule,
  peekSitterNotices,
  sitterHomeLine,
  streakWorkLines,
  todayLessonCount,
  todayReviewCount,
  type StreakWorkLine,
} from "@/lib/progress";
import type { SitterNotice } from "@/types/learning";

export function HomeView() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);
  const [sitter, setSitter] = useState<SitterNotice[]>([]);

  useEffect(() => {
    const pending = peekSitterNotices();
    setSitter(pending);
    setReady(true);
    if (pending.length === 0) return;
    const handle = window.setTimeout(() => {
      ackSitterNotices(pending);
    }, 0);
    return () => window.clearTimeout(handle);
  }, []);

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

  const todayPath = ready ? pickTodaysPath() : null;
  const schedule = ready ? listSchedule() : [];
  const dueIds = new Set(
    ready ? getDueConceptIds(concepts.map((concept) => concept.id)) : []
  );
  const due = schedule
    .filter((item) => dueIds.has(item.id))
    .map((item) => ({
      id: item.id,
      term: getConcept(item.id)?.term ?? item.id,
      dueOn: item.dueOn,
    }));

  const pct =
    todayPath && todayPath.total
      ? Math.round((todayPath.done / todayPath.total) * 100)
      : 0;
  const streak = ready ? currentStreak() : null;
  const work = ready
    ? streakWorkLines({
        pathFinished: Boolean(todayPath?.finished),
        pathOpen: Boolean(todayPath && !todayPath.finished),
        lessonDoneToday: hasLessonToday(),
        dueCount: due.length,
        reviewedToday: hasReviewToday(),
      })
    : null;
  const waitingText = ready && due.length === 0 ? idleWaitingLabel(schedule) : null;
  const freshStart =
    ready && (streak?.count ?? 0) === 0 && listCompletedDays().length === 0;
  const lessonHref = todayPath ? `/lop/${todayPath.pathId}` : "/lop";
  const lopLine = work?.find((line) => line.key === "lop");
  const reviewLine = work?.find((line) => line.key === "repetisjon");
  const reviewClear =
    reviewLine?.status === "ferdig" || reviewLine?.status === "ingen i dag";
  const dayComplete = Boolean(
    todayPath &&
      lopLine?.status === "ferdig" &&
      reviewClear &&
      (reviewLine?.status === "ferdig" || todayPath.finished)
  );
  const doneToday = ready
    ? { lessons: todayLessonCount(), concepts: todayReviewCount() }
    : { lessons: 0, concepts: 0 };
  const nextLesson =
    ready && dayComplete ? pickContinueTarget() : null;
  const minutes =
    todayPath && todayPath.total > 0
      ? Math.max(
          1,
          Math.round(
            (learningPaths.find((path) => path.id === todayPath.pathId)?.estimatedMinutes ??
              0) / todayPath.total
          )
        )
      : null;

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
            placeholder="Søk konsept eller løp"
            className="w-full rounded-2xl border border-[var(--line)] bg-white py-3.5 pl-10 pr-4 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2"
            aria-label="Søk etter konsept eller læringsløp"
          />
        </form>

        {q.trim() && (
          <div className="mt-2 rounded-2xl border border-[var(--line)] bg-white p-2">
            {liveSearch.concepts.slice(0, 4).map((concept) => (
              <Link
                key={concept.id}
                href={`/konsept/${concept.id}`}
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

      {streak && work && !freshStart && (
        <StreakPanel streak={streak} lines={work} lessonHref={lessonHref} />
      )}

      <section className="space-y-3">
        {!dayComplete && (
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
            Dagens løp
          </h2>
        )}
        {!todayPath ? (
          <div className="h-36 rounded-2xl bg-[var(--accent-soft)]" />
        ) : dayComplete ? (
          <div className="rounded-2xl bg-[var(--accent-soft)] px-4 py-4">
            <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              <StreakFlame className="h-6 w-6" />
              Ferdig for i dag
            </p>
            <p className="mt-2 text-sm text-[var(--ink)]">
              {doneSummary(doneToday.lessons, doneToday.concepts)}
            </p>
            {nextLesson && !nextLesson.finishedAll && (
              <p className="mt-1 text-sm text-[var(--muted)]">
                Neste: {nextLesson.lessonTitle}
              </p>
            )}
            {sitter.length > 0 && (
              <ul className="mt-3 space-y-1">
                {sitter.map((item) => (
                  <li key={`${item.conceptId}@${item.at}`} className="text-sm text-[var(--muted)]">
                    {sitterHomeLine(item.term)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : todayPath.finished ? (
          <Link
            href={`/lop/${todayPath.pathId}`}
            className="block rounded-2xl border border-[var(--line)] bg-white px-4 py-4"
          >
            <p className="text-xs font-semibold text-[var(--accent)]">Løp</p>
            <span className="mt-1 flex items-start gap-3">
              <span
                className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--accent)] text-white"
                aria-hidden
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="min-w-0">
                <span className="block font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                  {todayPath.pathTitle}
                </span>
                <span className="mt-1 block text-sm text-[var(--muted)]">Ferdig</span>
              </span>
            </span>
          </Link>
        ) : (
          <Link
            href={`/lop/${todayPath.pathId}`}
            className="block rounded-2xl bg-[var(--accent-soft)] px-4 py-4"
          >
            <p className="text-xs font-semibold text-[var(--accent)]">Løp</p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {todayPath.pathTitle}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              {todayPath.pathSubtitle}
            </p>
            <p className="mt-4 text-sm text-[var(--ink)]">
              Leksjon {todayPath.index} av {todayPath.total}
              {minutes ? ` · ca. ${minutes} min` : ""}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </Link>
        )}
        {waitingText && <p className="text-sm text-[var(--muted)]">{waitingText}</p>}
      </section>

      {due.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--ink)]">Til repetisjon</h2>
          <Link
            href="/repeter"
            className="block overflow-hidden rounded-2xl border border-[var(--line)] bg-white"
          >
            <ul className="px-4">
              {due.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="flex min-h-12 items-baseline justify-between gap-3 border-t border-[var(--line)] py-3 first:border-t-0"
                >
                  <span className="text-[15px] text-[var(--ink)]">{item.term}</span>
                  <span className="shrink-0 text-sm text-[var(--muted)]">
                    {item.dueOn ? formatDueLabel(item.dueOn) : "i dag"}
                  </span>
                </li>
              ))}
            </ul>
            {due.length > 5 && (
              <p className="px-4 pb-2 text-sm text-[var(--muted)]">
                og {due.length - 5} til
              </p>
            )}
            <p className="border-t border-[var(--line)] px-4 py-3 text-sm text-[var(--muted)]">
              Repeter
            </p>
          </Link>
        </section>
      )}
    </div>
  );
}

function doneSummary(lessons: number, concepts: number) {
  const parts: string[] = [];
  if (lessons === 1) parts.push("1 leksjon");
  else if (lessons > 1) parts.push(`${lessons} leksjoner`);
  if (concepts === 1) parts.push("1 konsept");
  else if (concepts > 1) parts.push(`${concepts} konsepter`);
  return parts.join(" · ") || "Dagen er tatt";
}

function StreakPanel({
  streak,
  lines,
  lessonHref,
}: {
  streak: { count: number; days: string[]; label: string };
  lines: StreakWorkLine[];
  lessonHref: string;
}) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4">
      <Link
        href="/profil"
        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        {streak.days.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-hidden>
            {streak.days.map((day) => (
              <li
                key={day}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF6ED]"
              >
                <StreakFlame className="h-6 w-6" />
              </li>
            ))}
          </ul>
        )}
        <p
          className={
            streak.count > 0
              ? "mt-2 text-sm font-medium text-[var(--ink)]"
              : "text-sm text-[var(--muted)]"
          }
        >
          {streak.label}
        </p>
        <span className="sr-only">Se dagene på profilen.</span>
      </Link>
      <ul className="mt-3 space-y-1.5 border-t border-[var(--line)] pt-3">
        {lines.map((line) => {
          const href = line.key === "lop" ? lessonHref : "/repeter";
          return (
            <li key={line.key}>
              <Link
                href={href}
                className="flex min-h-11 items-center justify-between gap-3 text-sm"
              >
                <span className="text-[var(--ink)]">{line.title}</span>
                <span
                  className={
                    line.remaining
                      ? "shrink-0 font-medium text-[var(--ink)]"
                      : "shrink-0 text-[var(--muted)]"
                  }
                >
                  {line.status}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
