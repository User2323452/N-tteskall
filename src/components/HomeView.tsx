"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Search } from "lucide-react";
import { concepts, getConcept, searchLearning } from "@/data/learning";
import { pickTodaysPath } from "@/lib/continue-path";
import {
  ackSitterNotices,
  formatDueLabel,
  getDueConceptIds,
  listSchedule,
  idleWaitingLabel,
  peekSitterNotices,
  sitterHomeLine,
  streakLabelForToday,
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
  const streakText = ready ? streakLabelForToday() : null;
  const waitingText = ready && due.length === 0 ? idleWaitingLabel(schedule) : null;

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

      <section className="space-y-3">
        {sitter.length > 0 && (
          <ul className="space-y-1">
            {sitter.map((item) => (
              <li key={`${item.conceptId}@${item.at}`} className="text-sm text-[var(--muted)]">
                {sitterHomeLine(item.term)}
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
            Dagens løp
          </h2>
          {streakText && (
            <p className="shrink-0 whitespace-nowrap text-sm text-[var(--muted)]">{streakText}</p>
          )}
        </div>
        {!todayPath ? (
          <div className="h-36 rounded-2xl bg-[var(--accent-soft)]" />
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
