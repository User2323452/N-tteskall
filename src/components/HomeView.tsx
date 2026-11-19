"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { concepts, getConcept, searchLearning } from "@/data/learning";
import { pickContinueTarget } from "@/lib/continue-path";
import { formatDueLabel, getDueConceptIds, listSchedule } from "@/lib/progress";

function todayIso() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export function HomeView() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
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

  const continueTarget = ready ? pickContinueTarget() : null;
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
  const today = todayIso();
  const upcoming = schedule.find((item) => item.dueOn > today);
  const upcomingTerm = upcoming ? getConcept(upcoming.id)?.term : undefined;

  const pct =
    continueTarget && continueTarget.total
      ? Math.round((continueTarget.done / continueTarget.total) * 100)
      : 0;

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
            placeholder="Søk begrep eller løp"
            className="w-full rounded-2xl border border-[var(--line)] bg-white py-3.5 pl-10 pr-4 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2"
            aria-label="Søk etter begrep eller læringsløp"
          />
        </form>

        {q.trim() && (
          <div className="mt-2 rounded-2xl border border-[var(--line)] bg-white p-2">
            {liveSearch.concepts.slice(0, 4).map((concept) => (
              <Link
                key={concept.id}
                href={`/begrep/${concept.id}`}
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
        <h2 className="text-sm font-semibold text-[var(--ink)]">I dag</h2>
        {!continueTarget ? (
          <div className="h-36 rounded-2xl bg-[var(--accent-soft)]" />
        ) : continueTarget.finishedAll ? (
          <Link
            href="/repeter"
            className="block rounded-2xl bg-[var(--accent-soft)] px-4 py-4"
          >
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--accent)]">
              Løp
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              Løpene er ferdige
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              Repeter begrepene du har lagt i køen.
            </p>
            <p className="mt-3 text-sm font-medium text-[var(--accent)]">
              Til repetisjon →
            </p>
          </Link>
        ) : (
          <Link
            href={`/lop/${continueTarget.pathId}/${continueTarget.lessonId}`}
            className="block rounded-2xl bg-[var(--accent-soft)] px-4 py-4"
          >
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--accent)]">
              {continueTarget.started ? "Fortsett" : "Start"}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {continueTarget.lessonTitle}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              {continueTarget.pathTitle}
            </p>
            <p className="mt-4 text-sm text-[var(--ink)]">
              Leksjon {continueTarget.index} av {continueTarget.total}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-3 text-sm font-medium text-[var(--accent)]">
              {continueTarget.started ? "Fortsett" : "Start"} →
            </p>
          </Link>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--ink)]">Til repetisjon</h2>
        {!ready ? (
          <div className="h-24 rounded-2xl border border-[var(--line)] bg-white" />
        ) : due.length === 0 ? (
          <div className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4">
            <p className="text-sm text-[var(--ink)]">Ingenting venter i dag.</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              {upcoming && upcomingTerm
                ? `Neste er ${upcomingTerm}, ${formatDueLabel(upcoming.dueOn)}.`
                : "Fullfør en leksjon, så legger vi nøkkelbegrepene her."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
            <ul className="px-4">
              {due.slice(0, 5).map((item) => (
                <li key={item.id} className="border-t border-[var(--line)] first:border-t-0">
                  <Link
                    href={`/begrep/${item.id}`}
                    className="flex min-h-12 items-baseline justify-between gap-3 py-3"
                  >
                    <span className="text-[15px] text-[var(--ink)]">{item.term}</span>
                    <span className="shrink-0 text-sm text-[var(--muted)]">
                      {item.dueOn ? formatDueLabel(item.dueOn) : "i dag"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {due.length > 5 && (
              <p className="px-4 pb-2 text-sm text-[var(--muted)]">
                og {due.length - 5} til
              </p>
            )}
            <Link
              href="/repeter"
              className="block border-t border-[var(--line)] px-4 py-3 text-sm font-medium text-[var(--accent)]"
            >
              Repeter →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
