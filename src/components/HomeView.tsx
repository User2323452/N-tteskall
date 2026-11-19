"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Search } from "lucide-react";
import { concepts, learningPaths, searchLearning } from "@/data/learning";
import { pickContinueTarget } from "@/lib/continue-path";
import { LogoMark } from "@/components/LogoMark";
import { StreakFlame } from "@/components/StreakFlame";
import {
  ackSitterNotices,
  dismissInstallHint,
  formatDueLabel,
  getAllConceptProgress,
  getDisplayName,
  getDueConceptIds,
  hasCompletedLesson,
  hasLessonToday,
  hasReviewToday,
  installHintDismissed,
  listCompletedDays,
  listSchedule,
  needsHomeScreenHint,
  peekSitterNotices,
  sitterHomeLine,
  todayReviewCount,
  currentStreak,
} from "@/lib/progress";
import type { SitterNotice } from "@/types/learning";

/** Ca. to minutter per konsept som venter. */
const MINUTES_PER_CONCEPT = 2;

function timeGreeting(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 10) return "God morgen";
  if (hour >= 10 && hour < 17) return "God dag";
  if (hour >= 17 && hour < 23) return "God kveld";
  return "God natt";
}

function conceptCount(count: number) {
  return count === 1 ? "1 konsept" : `${count} konsepter`;
}

export function HomeView() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [sitter, setSitter] = useState<SitterNotice[]>([]);
  const [installHint, setInstallHint] = useState(false);

  useEffect(() => {
    const pending = peekSitterNotices();
    setSitter(pending);
    setName(getDisplayName());
    setInstallHint(
      hasCompletedLesson() && !installHintDismissed() && needsHomeScreenHint()
    );
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
    router.push(trimmed ? `/sok?q=${encodeURIComponent(trimmed)}` : "/sok");
  }

  const target = ready ? pickContinueTarget() : null;
  const schedule = ready ? listSchedule() : [];
  const dueCount = ready
    ? getDueConceptIds(concepts.map((concept) => concept.id)).length
    : 0;
  const reviewedToday = ready ? hasReviewToday() : false;
  const lessonDoneToday = ready ? hasLessonToday() : false;
  const reviewedCount = ready ? todayReviewCount() : 0;
  const sitting = ready
    ? Object.values(getAllConceptProgress()).filter((item) => item.status === "Sitter").length
    : 0;
  const streak = ready ? currentStreak() : null;
  const freshStart =
    ready && (streak?.count ?? 0) === 0 && listCompletedDays().length === 0;
  const dayComplete = Boolean(target && lessonDoneToday && dueCount === 0);
  const minutes =
    target && target.total > 0
      ? Math.max(
          1,
          Math.round(
            (learningPaths.find((path) => path.id === target.pathId)?.estimatedMinutes ?? 0) /
              target.total
          )
        )
      : null;
  const nextDue = schedule.find((item) => item.dueOn.slice(0, 10) > localToday());
  const hello = ready ? `${timeGreeting(new Date())}${name ? `, ${name}` : ""}` : "";

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex min-h-12 items-center gap-3">
        <LogoMark className="h-9 w-9 shrink-0" />
        {hello && (
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
            {hello}
          </h1>
        )}
      </div>

      {installHint && (
        <div className="flex items-start justify-between gap-3 text-sm leading-relaxed text-[var(--muted)]">
          <p>
            Legg Nøtteskall på Hjem-skjermen, så blir fremdriften værende. Trykk Del,
            så Legg til på Hjem-skjerm.
          </p>
          <button
            type="button"
            onClick={() => {
              dismissInstallHint();
              setInstallHint(false);
            }}
            className="shrink-0 text-sm text-[var(--ink)] underline-offset-2 hover:underline"
          >
            Skjul
          </button>
        </div>
      )}

      {target && dayComplete && (
        <div className="rounded-2xl bg-[var(--accent-soft)] px-4 py-4">
          <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white">
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
            Ferdig for i dag
          </p>
          {!target.finishedAll && (
            <p className="mt-2 text-sm text-[var(--muted)]">Neste: {target.lessonTitle}</p>
          )}
        </div>
      )}

      {target && !dayComplete && !target.finishedAll && (
        <Link
          href={`/lop/${target.pathId}/${target.lessonId}`}
          className="block rounded-2xl bg-[var(--accent-soft)] px-4 py-4"
        >
          <p className="text-xs font-medium text-[var(--accent)]">
            Dagens leksjon{minutes ? ` · ca. ${minutes} min` : ""}
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
            {target.lessonTitle}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {target.pathTitle} · {target.index} av {target.total}
          </p>
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {Array.from({ length: target.total }, (_, index) => {
              const done = index < target.done;
              const next = index === target.done;
              return (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${
                    done ? "bg-[var(--accent)]" : next ? "bg-[var(--accent)]/35" : "bg-white"
                  }`}
                />
              );
            })}
          </div>
          <span className="sr-only">
            {target.done} av {target.total} leksjoner er ferdige.
          </span>
          <span className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-medium text-white">
            {target.started ? "Fortsett" : "Start"}
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      )}

      {target && !dayComplete && target.finishedAll && (
        <div className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4">
          <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white">
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
            {target.pathTitle}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">Ferdig</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/repeter"
          className="rounded-2xl border border-[var(--line)] bg-white px-3 py-3"
        >
          {dueCount > 0 ? (
            <>
              <p className="text-xs text-[var(--muted)]">Til repetisjon</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                {conceptCount(dueCount)}
              </p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">
                ca. {Math.max(MINUTES_PER_CONCEPT, dueCount * MINUTES_PER_CONCEPT)} min
              </p>
            </>
          ) : reviewedToday ? (
            <>
              <p className="text-xs text-[var(--muted)]">Repetert i dag</p>
              <p className="mt-2 flex items-center gap-1.5 text-lg font-semibold text-[var(--ink)]">
                <Check className="h-4 w-4 text-[var(--accent)]" strokeWidth={3} />
                {conceptCount(reviewedCount)}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-[var(--muted)]">Neste repetisjon</p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                {nextDue ? shortDue(nextDue.dueOn) : "Ingen venter"}
              </p>
            </>
          )}
        </Link>
        <Link
          href="/profil"
          className="rounded-2xl border border-[var(--line)] bg-white px-3 py-3"
        >
          <p className="text-xs text-[var(--muted)]">Konsepter som sitter</p>
          <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
            {sitting} av {concepts.length}
          </p>
        </Link>
      </div>

      {sitter.length > 0 && (
        <ul className="space-y-1">
          {sitter.map((item) => (
            <li key={`${item.conceptId}@${item.at}`} className="text-sm text-[var(--muted)]">
              {sitterHomeLine(item.term)}
            </li>
          ))}
        </ul>
      )}

      {streak && !freshStart && (
        <Link href="/profil" className="inline-flex items-center gap-1.5 text-sm text-[var(--ink)]">
          {streak.count > 0 && <StreakFlame className="h-4 w-4" />}
          {streak.label}
        </Link>
      )}

      <form onSubmit={onSearchSubmit}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Søk konsept eller løp"
            className="w-full rounded-2xl border border-[var(--line)] bg-white py-3.5 pl-10 pr-4 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2"
            aria-label="Søk etter konsept eller læringsløp"
          />
        </div>
        {q.trim() && (
          <div className="mt-2 rounded-2xl border border-[var(--line)] bg-white p-2">
            {liveSearch.concepts.slice(0, 4).map((concept) => (
              <Link
                key={concept.id}
                href={`/konsept/${concept.id}`}
                className="block rounded-xl px-3 py-2 hover:bg-[var(--accent-soft)]"
              >
                <span className="text-sm font-medium text-[var(--ink)]">{concept.term}</span>
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
      </form>
    </div>
  );
}

function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function shortDue(iso: string) {
  const label = formatDueLabel(iso);
  if (label.startsWith("i morgen")) return "i morgen";
  return label;
}
