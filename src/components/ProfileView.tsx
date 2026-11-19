"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DataBackup } from "@/components/DataBackup";
import { getConcept, learningPaths } from "@/data/learning";
import { formatWhen } from "@/lib/format";
import {
  formatDueLabel,
  getActivity,
  getAllConceptProgress,
  getAllPathProgress,
  getReviews,
  isIntroduced,
  listSchedule,
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
  const [backup, setBackup] = useState(false);

  useEffect(() => {
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
            empty="Ingen begreper i køen som du fortsatt studerer."
            rows={studying.map(([id, item]) => ({
              id,
              href: `/begrep/${id}`,
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
            empty="Ingen begreper er merket Kan det eller Sitter."
            rows={knows.map(([id, item]) => ({
              id,
              href: `/begrep/${id}`,
              label: getConcept(id)?.term ?? id,
              meta: item.status,
            }))}
          />
        )}
      </section>

      <Section
        title="Det du har repetert"
        summary={
          repeatedRows.length === 0
            ? "Ingen vurderinger ennå"
            : repeatedRows.length === 1
              ? "1 begrep"
              : `${repeatedRows.length} begreper`
        }
        open={repeated}
        onToggle={() => setRepeated((open) => !open)}
      >
        {repeatedRows.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Vurderinger dukker opp her etter at du har repetert et begrep.{" "}
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
                  href={`/begrep/${row.conceptId}`}
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
            Datoene kommer når et begrep ligger i køen.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {schedule.slice(0, 12).map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-3 text-sm">
                <Link href={`/begrep/${item.id}`} className="text-[var(--ink)] hover:text-[var(--accent)]">
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
