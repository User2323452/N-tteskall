"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DataBackup } from "@/components/DataBackup";
import { getConcept, learningPaths } from "@/data/learning";
import {
  formatDueLabel,
  getActivity,
  getAllConceptProgress,
  getAllPathProgress,
  getReviews,
  isIntroduced,
  listSchedule,
} from "@/lib/progress";
import type { RecallStatus } from "@/types/learning";

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
          reviews.length === 0
            ? "Ingen vurderinger ennå"
            : `${reviews.length} vurderinger`
        }
        open={repeated}
        onToggle={() => setRepeated((open) => !open)}
      >
        {reviews.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Vurderinger dukker opp her etter at du har repetert et begrep.{" "}
            <Link href="/repeter" className="text-[var(--ink)] underline-offset-2 hover:underline">
              Gå til Repeter
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-2">
            {reviews.slice(0, 20).map((entry) => (
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
