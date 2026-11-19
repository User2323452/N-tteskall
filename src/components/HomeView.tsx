"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Check, ChevronRight, Search } from "lucide-react";
import { concepts, getConcept, learningPaths, searchLearning } from "@/data/learning";
import { pickContinueTarget } from "@/lib/continue-path";
import { LogoMark } from "@/components/LogoMark";
import { StreakFlame } from "@/components/StreakFlame";
import {
  ackSitterNotices,
  currentStreak,
  dismissInstallHint,
  formatDueLabel,
  getAllConceptProgress,
  getDisplayName,
  getDueConceptIds,
  hasCompletedLesson,
  hasLessonToday,
  hasReviewToday,
  installHintDismissed,
  listSchedule,
  needsHomeScreenHint,
  peekSitterNotices,
  sitterHomeLine,
  todayReviewCount,
} from "@/lib/progress";
import type { SitterNotice } from "@/types/learning";

function timeGreeting(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 10) return "God morgen";
  if (hour >= 10 && hour < 17) return "God dag";
  if (hour >= 17 && hour < 23) return "God kveld";
  return "God natt";
}

function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function norwegianDate(date: Date) {
  const label = new Intl.DateTimeFormat("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function shortDue(iso: string) {
  const label = formatDueLabel(iso);
  if (label.startsWith("i morgen")) return "i morgen";
  return label;
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

  const now = ready ? new Date() : null;
  const target = ready ? pickContinueTarget() : null;
  const schedule = ready ? listSchedule() : [];
  const dueIds = ready ? getDueConceptIds(concepts.map((concept) => concept.id)) : [];
  const dueTerms = schedule
    .filter((item) => dueIds.includes(item.id))
    .map((item) => getConcept(item.id)?.term)
    .filter((term): term is string => Boolean(term));
  const reviewedToday = ready ? hasReviewToday() : false;
  const lessonDoneToday = ready ? hasLessonToday() : false;
  const reviewedCount = ready ? todayReviewCount() : 0;
  const sitting = ready
    ? Object.values(getAllConceptProgress()).filter((item) => item.status === "Sitter").length
    : 0;
  const streak = ready ? currentStreak() : null;
  const dayComplete = Boolean(target && lessonDoneToday && dueIds.length === 0);
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
  const greeting = now ? timeGreeting(now) : "";
  const lessonAction = Boolean(target && !dayComplete && !target.finishedAll);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 pt-1">
          <p className="text-sm text-[var(--muted)]">{now ? norwegianDate(now) : "\u00a0"}</p>
          <h1 className="mt-1 text-[2.35rem] font-bold leading-[1.05] tracking-tight text-[var(--ink)]">
            {greeting ? (
              <>
                {greeting}
                {name ? "," : ""}
                {name && <span className="block">{name}</span>}
              </>
            ) : (
              "\u00a0"
            )}
          </h1>
        </div>
        <LogoMark className="h-11 w-11 shrink-0" />
      </header>

      <form onSubmit={onSearchSubmit}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Søk"
            className="w-full rounded-2xl border border-[var(--line)] bg-white py-3 pl-10 pr-4 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2"
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

      <section>
        <h2 className="px-1 text-sm text-[var(--muted)]">I dag</h2>
        <div className="mt-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
          {target && (
            <LessonRow
              href={lessonAction ? `/lop/${target.pathId}/${target.lessonId}` : undefined}
              title={
                dayComplete
                  ? "Ferdig for i dag"
                  : target.finishedAll
                    ? target.pathTitle
                    : target.lessonTitle
              }
              meta={
                dayComplete
                  ? target.finishedAll
                    ? "Alt i løpet er tatt"
                    : `Neste: ${target.lessonTitle}`
                  : target.finishedAll
                    ? "Ferdig"
                    : `Leksjon ${target.index} av ${target.total}${minutes ? ` · ${minutes} min` : ""}`
              }
              done={dayComplete || target.finishedAll ? target.total : target.done}
              total={target.total}
              complete={dayComplete || target.finishedAll}
              action={lessonAction ? (target.started ? "Fortsett" : "Start") : undefined}
            />
          )}
          <Link
            href="/repeter"
            className="flex items-center gap-3 border-t border-[var(--line)] px-4 py-3.5 first:border-t-0"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <BookOpen className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-[var(--ink)]">
                {dueIds.length > 0 ? "Repeter" : reviewedToday ? "Repetert i dag" : "Neste repetisjon"}
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-[var(--muted)]">
                {dueIds.length > 0
                  ? dueTerms.slice(0, 3).join(", ")
                  : reviewedToday
                    ? reviewedCount === 1
                      ? "1 konsept"
                      : `${reviewedCount} konsepter`
                    : nextDue
                      ? shortDue(nextDue.dueOn)
                      : "Ingen venter"}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[var(--ink)]">
              {dueIds.length > 0 && <span className="text-base font-semibold">{dueIds.length}</span>}
              {dueIds.length === 0 && reviewedToday && (
                <Check className="h-4 w-4 text-[var(--accent)]" strokeWidth={3} />
              )}
              <ChevronRight className="h-4 w-4 text-[var(--muted)]" aria-hidden />
            </span>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="px-1 text-sm text-[var(--muted)]">Fremgang</h2>
        <div className="mt-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
          <Link
            href="/profil"
            className="flex min-h-14 items-center justify-between gap-3 px-4 py-4"
          >
            <span className="font-semibold text-[var(--ink)]">Konsepter som sitter</span>
            <span className="shrink-0 font-semibold text-[var(--ink)]">
              {sitting} av {concepts.length}
            </span>
          </Link>
          <Link
            href="/profil"
            className="flex min-h-14 items-center justify-between gap-3 border-t border-[var(--line)] px-4 py-4"
          >
            <span className="font-semibold text-[var(--ink)]">Dager på rad</span>
            <span className="flex shrink-0 items-center gap-1.5 font-semibold text-[var(--ink)]">
              {(streak?.count ?? 0) > 0 && <StreakFlame className="h-4 w-4" />}
              {streak?.count ?? 0}
            </span>
          </Link>
        </div>
        {sitter.length > 0 && (
          <ul className="mt-2 space-y-1 px-1">
            {sitter.map((item) => (
              <li key={`${item.conceptId}@${item.at}`} className="text-sm text-[var(--muted)]">
                {sitterHomeLine(item.term)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function LessonRow({
  href,
  title,
  meta,
  done,
  total,
  complete,
  action,
}: {
  href?: string;
  title: string;
  meta: string;
  done: number;
  total: number;
  complete: boolean;
  action?: string;
}) {
  const body = (
    <>
      <ProgressRing done={done} total={total} complete={complete} />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug text-[var(--ink)]">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-[var(--muted)]">{meta}</span>
      </span>
      {action && (
        <span className="shrink-0 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">
          {action}
        </span>
      )}
    </>
  );
  const className = "flex items-center gap-3 px-4 py-3.5";
  if (!href) return <div className={className}>{body}</div>;
  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}

function ProgressRing({
  done,
  total,
  complete,
}: {
  done: number;
  total: number;
  complete: boolean;
}) {
  const radius = 9;
  const length = 2 * Math.PI * radius;
  const pct = complete ? 1 : total > 0 ? Math.min(1, done / total) : 0;
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r={radius} fill="none" stroke="var(--line)" strokeWidth="2.25" />
      {pct > 0 && (
        <circle
          cx="12"
          cy="12"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeDasharray={`${Math.max(pct * length, 1)} ${length}`}
          transform="rotate(-90 12 12)"
        />
      )}
      {complete && (
        <path
          d="M8 12.2 10.6 14.8 16 9.4"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
