"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DataBackup } from "@/components/DataBackup";
import { getConcept, getLessonsForPath, learningPaths } from "@/data/learning";
import {
  getActivity,
  getAllConceptProgress,
  getAllPathProgress,
  getReviews,
  isIntroduced,
} from "@/lib/progress";
import type { RecallStatus } from "@/types/learning";

function ScheduleSummary({
  progress,
  longest,
}: {
  progress: Record<string, { dueOn?: string; introduced?: boolean; status: string; lastReviewed?: string; intervalDays?: number }>;
  longest: number;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const queued = Object.entries(progress).filter(([, item]) => item.dueOn);
  const dueToday = queued.filter(([, item]) => item.dueOn! <= today);
  const later = queued
    .filter(([, item]) => item.dueOn! > today)
    .sort((a, b) => a[1].dueOn!.localeCompare(b[1].dueOn!));
  const next = later[0];
  const nextTerm = next ? getConcept(next[0])?.term : undefined;

  return (
    <div className="mt-3 space-y-1 text-sm leading-relaxed text-[var(--muted)]">
      <p>
        Intervallet starter kort. Hver gang du kan begrepet, blir det lengre.
        Usikker setter det tilbake til én dag.
      </p>
      {queued.length > 0 && (
        <p className="text-[var(--ink)]">
          {dueToday.length} venter i dag
          {nextTerm && next
            ? `. Neste etter det: ${nextTerm}, ${formatWhen(next[1].dueOn!)}`
            : ""}
          {longest > 1 ? `. Lengste intervall er ${longest} dager.` : "."}
        </p>
      )}
    </div>
  );
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const start = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const diff = Math.round((start(new Date()) - start(date)) / 86_400_000);
  if (diff === 0) return "i dag";
  if (diff === 1) return "i går";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function ProfileView() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <p className="text-sm text-[var(--muted)]">Laster profil…</p>;
  }

  const pathProgress = getAllPathProgress();
  const conceptProgress = getAllConceptProgress();
  const reviews = getReviews();
  const activity = getActivity();
  const last = activity[0];

  const introduced = Object.values(conceptProgress).filter((item) =>
    isIntroduced(item)
  );
  const reviewed = introduced.filter((item) => (item.reviewCount ?? 0) > 0 || item.lastReviewed);
  const counts: Record<RecallStatus, number> = {
    Ny: 0,
    Usikker: 0,
    OK: 0,
    "Kan det": 0,
  };
  for (const item of introduced) {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
  }

  const completedPaths = learningPaths.filter((path) => {
    const progress = pathProgress[path.id];
    if (!progress) return false;
    if (progress.completedAt) return true;
    return progress.completedLessonIds.length >= path.lessonIds.length;
  });

  return (
    <div className="mx-auto max-w-xl space-y-10">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink)]">
          Profil
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
          Fremdrift, repetisjon og siste aktivitet. Alt ligger bare på denne
          enheten.
        </p>
      </header>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Sist aktiv
        </h2>
        {last ? (
          <p className="mt-2 text-[15px] text-[var(--ink)]">
            <Link href={last.href} className="hover:text-[var(--accent)]">
              {last.label}
            </Link>
            <span className="text-[var(--muted)]"> · {formatWhen(last.at)}</span>
          </p>
        ) : (
          <p className="mt-2 text-[15px] text-[var(--muted)]">
            Ingen aktivitet ennå.{" "}
            <Link href="/lop/norsk-pengepolitikk" className="text-[var(--ink)] underline-offset-2 hover:underline">
              Start med norsk pengepolitikk
            </Link>
            .
          </p>
        )}
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Løp
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {completedPaths.length} av {learningPaths.length} løp fullført
        </p>
        <ul className="mt-3 divide-y divide-[var(--line)]">
          {learningPaths.map((path) => {
            const progress = pathProgress[path.id];
            const total = getLessonsForPath(path.id).length;
            const done = progress?.completedLessonIds.length ?? 0;
            const finished = Boolean(progress?.completedAt) || done >= total;
            let line = "Ikke startet";
            if (finished) {
              line = progress?.completedAt
                ? `Ferdig ${formatWhen(progress.completedAt)}`
                : "Ferdig";
            } else if (progress?.startedAt || done > 0) {
              line = `${done} av ${total} leksjoner`;
            }
            return (
              <li key={path.id} className="flex items-baseline justify-between gap-3 py-3">
                <Link href={`/lop/${path.id}`} className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  {path.title}
                </Link>
                <span className="shrink-0 text-sm text-[var(--muted)]">{line}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Repetisjon
        </h2>
        <p className="mt-2 text-[15px] text-[var(--ink)]">
          {reviewed.length} begreper vurdert
          <span className="text-[var(--muted)]">
            {" "}
            · {introduced.length} lagt i køen
          </span>
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Usikker {counts.Usikker} · OK {counts.OK} · Kan det {counts["Kan det"]}
        </p>
        <ScheduleSummary
          progress={conceptProgress}
          longest={introduced.reduce(
            (max, item) => Math.max(max, item.intervalDays ?? 0),
            0
          )}
        />
        {reviews.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {reviews.slice(0, 8).map((entry) => (
              <li key={`${entry.conceptId}-${entry.at}`} className="text-sm">
                <Link href={`/begrep/${entry.conceptId}`} className="text-[var(--ink)] hover:text-[var(--accent)]">
                  {entry.term}
                </Link>
                <span className="text-[var(--muted)]">
                  {" "}
                  · {entry.grade}
                  {entry.intervalDays
                    ? ` · ${entry.intervalDays} ${entry.intervalDays === 1 ? "dag" : "dager"}`
                    : ""}
                  {" · "}
                  {formatWhen(entry.at)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Vurderinger dukker opp her etter at du har repetert et begrep.
          </p>
        )}
      </section>

      <section className="border-t border-[var(--line)] pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Sikkerhetskopi
        </h2>
        <p className="mt-2 mb-3 text-sm leading-relaxed text-[var(--muted)]">
          Notater, begrepsbank og læringsfremdrift eksporteres samlet. Ta kopi
          før du bytter telefon.
        </p>
        <DataBackup />
      </section>
    </div>
  );
}
