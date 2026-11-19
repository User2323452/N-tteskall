"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataBackup } from "@/components/DataBackup";
import { StreakFlame } from "@/components/StreakFlame";
import { getConcept, learningPaths } from "@/data/learning";
import { formatWhen } from "@/lib/format";
import {
  currentStreak,
  formatDueLabel,
  getActivity,
  getAllConceptProgress,
  getAllPathProgress,
  getReviews,
  isIntroduced,
  listCompletedDays,
  listSchedule,
  syncCompletedDays,
} from "@/lib/progress";
import type { ConceptProgress, RecallStatus, ReviewEntry } from "@/types/learning";

function repeatedConcepts(reviews: ReviewEntry[], progress: Record<string, ConceptProgress>) {
  const byId = new Map<string, ReviewEntry[]>();
  for (const entry of reviews) {
    const list = byId.get(entry.conceptId) ?? [];
    list.push(entry);
    byId.set(entry.conceptId, list);
  }
  return [...byId.entries()]
    .map(([conceptId, entries]) => {
      const sorted = [...entries].sort((a, b) => b.at.localeCompare(a.at));
      const latest = sorted[0];
      return {
        conceptId,
        term: getConcept(conceptId)?.term ?? latest?.term ?? conceptId,
        grade: latest?.grade ?? "OK",
        dueOn: progress[conceptId]?.dueOn,
        at: latest?.at ?? "",
      };
    })
    .sort((a, b) => b.at.localeCompare(a.at));
}

function Section({
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-[var(--ink)]">{title}</span>
          <span className="mt-0.5 block text-sm text-[var(--muted)]">{summary}</span>
        </span>
        <ChevronRight
          className={`h-5 w-5 shrink-0 text-[var(--muted)] transition-transform ${open ? "rotate-90" : ""}`}
          aria-hidden
        />
      </button>
      {open && <div className="border-t border-[var(--line)] px-4 py-3">{children}</div>}
    </section>
  );
}

export function ProfileView() {
  const [ready, setReady] = useState(false);
  const [bucket, setBucket] = useState<"studerer" | "fullfort" | "kan" | null>(null);
  const [repeated, setRepeated] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [daysOpen, setDaysOpen] = useState(false);
  const [backup, setBackup] = useState(false);

  useEffect(() => {
    syncCompletedDays();
    setReady(true);
  }, []);

  if (!ready) {
    return <p className="text-sm text-[var(--muted)]">Laster profil…</p>;
  }

  const pathProgress = getAllPathProgress();
  const conceptProgress = getAllConceptProgress();
  const reviews = getReviews();
  const repeatedRows = repeatedConcepts(reviews, conceptProgress);
  const activity = getActivity();
  const last = activity[0];
  const introduced = Object.entries(conceptProgress).filter(([, item]) => isIntroduced(item));
  const studying = introduced.filter(([, item]) => item.status !== "Kan det" && item.status !== "Sitter");
  const knows = introduced.filter(([, item]) => item.status === "Kan det" || item.status === "Sitter");
  const completedPaths = learningPaths.filter((path) => {
    const progress = pathProgress[path.id];
    if (!progress) return false;
    if (progress.completedAt) return true;
    return progress.completedLessonIds.length >= path.lessonIds.length;
  });

  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const completedDays = listCompletedDays();
  const streakNow = currentStreak();
  const monthBit = monthDaySummary(completedDays, today);
  const schedule = listSchedule();
  const dueNow = schedule.filter((item) => item.dueOn <= todayIso);
  const later = schedule.filter((item) => item.dueOn > todayIso);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <header className="pb-2">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink)]">
          Profil
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
          Fremdrift og repetisjon. Alt ligger bare på denne enheten.
        </p>
        {last ? (
          <p className="mt-2 text-sm text-[var(--ink)]">
            Sist:{" "}
            <Link href={last.href} className="hover:text-[var(--accent)]">
              {last.label}
            </Link>
            <span className="text-[var(--muted)]"> · {formatWhen(last.at)}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">
            Ingen aktivitet ennå.{" "}
            <Link href="/lop/norsk-pengepolitikk" className="text-[var(--ink)] underline-offset-2 hover:underline">
              Start med norsk pengepolitikk
            </Link>
            .
          </p>
        )}
      </header>

      <section className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4">
        <h2 className="text-sm font-semibold text-[var(--ink)]">Fremdrift</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ["studerer", studying.length, "Studerer"],
              ["fullfort", completedPaths.length, "Fullført"],
              ["kan", knows.length, "Kan det"],
            ] as const
          ).map(([id, count, label]) => {
            const open = bucket === id;
            return (
              <button
                key={id}
                type="button"
                aria-expanded={open}
                onClick={() => setBucket(open ? null : id)}
                className={`rounded-xl px-2 py-3 text-center ${
                  open ? "bg-[var(--accent-soft)]" : "bg-[var(--background)]"
                }`}
              >
                <span className="block text-2xl font-semibold tabular-nums text-[var(--ink)]">
                  {count}
                </span>
                <span className="mt-1 block text-[11px] text-[var(--muted)]">{label}</span>
              </button>
            );
          })}
        </div>
        {bucket === "studerer" && (
          <ConceptList
            empty="Ingen konsepter i køen som du fortsatt studerer."
            rows={studying.map(([id, item]) => ({
              id,
              href: `/konsept/${id}`,
              label: getConcept(id)?.term ?? id,
              meta: item.status,
            }))}
          />
        )}
        {bucket === "fullfort" && (
          <ConceptList
            empty="Ingen løp er fullført ennå."
            rows={completedPaths.map((path) => ({
              id: path.id,
              href: `/lop/${path.id}`,
              label: path.title,
              meta: "Ferdig løp",
            }))}
          />
        )}
        {bucket === "kan" && (
          <ConceptList
            empty="Ingen konsepter er merket Kan det eller Sitter."
            rows={knows.map(([id, item]) => ({
              id,
              href: `/konsept/${id}`,
              label: getConcept(id)?.term ?? id,
              meta: item.status,
            }))}
          />
        )}
      </section>

      <Section
        title="Fullførte dager"
        summary={`${streakNow.label} · ${monthBit.charAt(0).toLowerCase()}${monthBit.slice(1)}`}
        open={daysOpen}
        onToggle={() => setDaysOpen((open) => !open)}
      >
        <CompletedMonth completed={completedDays} today={todayIso} />
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          En flamme er en dag du vurderte et konsept eller fullførte en leksjon. Tomme dager er stille.
        </p>
      </Section>

      <Section
        title="Det du har repetert"
        summary={
          repeatedRows.length === 0
            ? "Ingen vurderinger ennå"
            : repeatedRows.length === 1
              ? "1 konsept"
              : `${repeatedRows.length} konsepter`
        }
        open={repeated}
        onToggle={() => setRepeated((open) => !open)}
      >
        {repeatedRows.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Vurderinger dukker opp her etter at du har repetert et konsept.{" "}
            <Link href="/repeter" className="text-[var(--ink)] underline-offset-2 hover:underline">
              Gå til Repeter
            </Link>
            .
          </p>
        ) : (
          <ul>
            {repeatedRows.map((row) => (
              <li key={row.conceptId} className="border-t border-[var(--line)] first:border-t-0">
                <Link
                  href={`/konsept/${row.conceptId}`}
                  className="flex min-h-12 items-center justify-between gap-3 py-3"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium text-[var(--ink)]">
                      {row.term}
                    </span>
                    <span className="mt-0.5 block text-sm text-[var(--muted)]">
                      {row.grade}
                      {row.dueOn ? ` · ${formatDueLabel(row.dueOn)}` : ""}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[var(--muted)]" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Neste repetisjon"
        summary={
          schedule.length === 0
            ? "Ingenting i køen"
            : dueNow.length > 0
              ? `${dueNow.length} venter i dag`
              : later[0]
                ? `Neste ${formatDueLabel(later[0].dueOn)}`
                : "Ingen datoer"
        }
        open={scheduleOpen}
        onToggle={() => setScheduleOpen((open) => !open)}
      >
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Usikker er neste dag, OK er 3 dager, Kan det er 12 dager, og Sitter er
          30 dager første gang. Deretter blir datoen lenger når det sitter.
        </p>
        {schedule.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            Datoene kommer når et konsept ligger i køen.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {schedule.slice(0, 12).map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-3 text-sm">
                <Link href={`/konsept/${item.id}`} className="text-[var(--ink)] hover:text-[var(--accent)]">
                  {getConcept(item.id)?.term ?? item.id}
                </Link>
                <span className="shrink-0 text-[var(--muted)]">{formatDueLabel(item.dueOn)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Sikkerhetskopi"
        summary="Notater og fremdrift på denne enheten"
        open={backup}
        onToggle={() => setBackup((open) => !open)}
      >
        <p className="mb-3 text-sm leading-relaxed text-[var(--muted)]">
          Eksporter før du bytter telefon. Ingenting synkroniseres til en konto.
        </p>
        <DataBackup />
      </Section>

      <p className="px-1 pt-1 text-xs leading-relaxed text-slate-400">
        Repetisjonen bygger på glemselskurven til Hermann Ebbinghaus.
      </p>
    </div>
  );
}

const WEEKDAYS = ["ma", "ti", "on", "to", "fr", "lø", "sø"] as const;

function monthDaySummary(days: string[], today: Date): string {
  const prefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-`;
  const count = days.filter((day) => day.startsWith(prefix)).length;
  const name = new Intl.DateTimeFormat("nb-NO", { month: "long" }).format(today);
  if (count === 0) return `Ingen dager i ${name}`;
  if (count === 1) return `1 dag i ${name}`;
  return `${count} dager i ${name}`;
}

function CompletedMonth({ completed, today }: { completed: string[]; today: string }) {
  const done = new Set(completed);
  const now = new Date(`${today}T12:00:00`);
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const atCurrent = cursor.year === now.getFullYear() && cursor.month === now.getMonth();
  const first = new Date(cursor.year, cursor.month, 1);
  const monthLabel = new Intl.DateTimeFormat("nb-NO", {
    month: "long",
    year: "numeric",
  }).format(first);
  const lead = (first.getDay() + 6) % 7;
  const count = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: count }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  function shift(delta: number) {
    const next = new Date(cursor.year, cursor.month + delta, 1);
    const nextKey = next.getFullYear() * 12 + next.getMonth();
    const maxKey = now.getFullYear() * 12 + now.getMonth();
    if (nextKey > maxKey) return;
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--background)]"
          aria-label="Forrige måned"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <p className="text-sm text-[var(--ink)]">{monthLabel}</p>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={atCurrent}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--background)] disabled:pointer-events-none disabled:opacity-30"
          aria-label="Neste måned"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 text-center text-[11px] text-[var(--muted)]">
        {WEEKDAYS.map((name) => (
          <span key={name} className="py-1">
            {name}
          </span>
        ))}
      </div>
      <div className="space-y-1" role="grid" aria-label={monthLabel}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} role="row" className="grid grid-cols-7 justify-items-center">
            {week.map((day, index) => {
              if (!day) return <span key={`empty-${weekIndex}-${index}`} className="h-12 w-10" />;
              const iso = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const marked = done.has(iso);
              const isToday = iso === today;
              const spoken = new Intl.DateTimeFormat("nb-NO", {
                day: "numeric",
                month: "long",
              }).format(new Date(cursor.year, cursor.month, day));
              return (
                <span
                  key={iso}
                  role="gridcell"
                  aria-label={`${spoken}${isToday ? ", i dag" : ""}${marked ? ", fullført" : ""}`}
                  className={`flex h-12 w-10 flex-col items-center justify-center rounded-xl tabular-nums ${
                    marked
                      ? "bg-[#FFF6ED] text-[var(--ink)]"
                      : isToday
                        ? "text-[var(--ink)] ring-1 ring-[var(--accent)]"
                        : "text-[var(--muted)]"
                  } ${marked && isToday ? "ring-1 ring-[var(--accent)]" : ""}`}
                >
                  {marked ? <StreakFlame className="h-5 w-5" /> : null}
                  <span className={marked ? "mt-0.5 text-[11px] leading-none" : "text-sm leading-none"}>
                    {day}
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ConceptList({
  rows,
  empty,
}: {
  rows: { id: string; href: string; label: string; meta: RecallStatus | string }[];
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="mt-3 text-sm text-[var(--muted)]">{empty}</p>;
  }
  return (
    <ul className="mt-3 divide-y divide-[var(--line)]">
      {rows.map((row) => (
        <li key={row.id} className="flex items-baseline justify-between gap-3 py-2">
          <Link href={row.href} className="text-sm text-[var(--ink)] hover:text-[var(--accent)]">
            {row.label}
          </Link>
          <span className="shrink-0 text-xs text-[var(--muted)]">{row.meta}</span>
        </li>
      ))}
    </ul>
  );
}
