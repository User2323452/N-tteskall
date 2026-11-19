"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { v4 as uuid } from "uuid";
import { db, ensureSeeded } from "@/lib/db";
import { useLiveQuery } from "@/lib/useLiveQuery";
import { areaAccent, labelForTermArea, termStatusStyle } from "@/lib/theme";
import type { Term, TermAreaId, TermStatus } from "@/types/mesterplan";
import { useSearchParams } from "next/navigation";

const areaFilters: { id: TermAreaId | "alle"; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "makro", label: "Makro" },
  { id: "marked", label: "Marked" },
  { id: "bank", label: "Bank" },
  { id: "personlig", label: "Personlig" },
  { id: "metode", label: "Metode" },
];

const statuses: TermStatus[] = ["Ny", "Usikker", "Kan det"];

export function KonseptbankenView() {
  const search = useSearchParams();
  const [ready, setReady] = useState(false);
  const [areaFilter, setAreaFilter] = useState<TermAreaId | "alle">("alle");
  const [statusFilter, setStatusFilter] = useState<TermStatus | "alle">("alle");
  const [session, setSession] = useState<{
    ids: string[];
    index: number;
    revealed: boolean;
  } | null>(null);
  const [draft, setDraft] = useState({
    term: "",
    english: "",
    explanation: "",
    areaId: "makro" as TermAreaId,
  });

  useEffect(() => {
    void ensureSeeded().then(() => setReady(true));
  }, []);

  const terms = useLiveQuery(() => db.terms.toArray(), ready);

  const filtered = useMemo(() => {
    let list = [...(terms ?? [])];
    if (areaFilter !== "alle") {
      list = list.filter((t) => t.areaId === areaFilter);
    }
    if (statusFilter !== "alle") {
      list = list.filter((t) => t.status === statusFilter);
    }
    list.sort((a, b) => {
      const da = a.lastReviewed ?? "";
      const db_ = b.lastReviewed ?? "";
      if (da !== db_) return da.localeCompare(db_);
      return a.term.localeCompare(b.term, "nb");
    });
    return list;
  }, [terms, areaFilter, statusFilter]);

  useEffect(() => {
    if (!ready || !terms || session) return;
    if (search.get("okt") === "1" && terms.length > 0) {
      startSession(terms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start once when seed ready + ?okt=1
  }, [ready, terms, search]);

  function startSession(pool: Term[]) {
    const sorted = [...pool].sort((a, b) => {
      const statusRank = (s: TermStatus) =>
        s === "Ny" ? 0 : s === "Usikker" ? 1 : 2;
      const rank = statusRank(a.status) - statusRank(b.status);
      if (rank !== 0) return rank;
      const da = a.lastReviewed ?? "";
      const db_ = b.lastReviewed ?? "";
      if (da !== db_) return da.localeCompare(db_);
      return a.term.localeCompare(b.term, "nb");
    });
    setSession({
      ids: sorted.map((t) => t.id),
      index: 0,
      revealed: false,
    });
  }

  async function updateStatus(term: Term, status: TermStatus) {
    await db.terms.update(term.id, {
      status,
      lastReviewed: new Date().toISOString().slice(0, 10),
    });
  }

  async function gradeInSession(status: TermStatus) {
    if (!session || !terms) return;
    const current = terms.find((t) => t.id === session.ids[session.index]);
    if (!current) return;
    await updateStatus(current, status);
    if (session.index + 1 >= session.ids.length) {
      setSession(null);
      return;
    }
    setSession({
      ...session,
      index: session.index + 1,
      revealed: false,
    });
  }

  async function addTerm() {
    if (!draft.term.trim()) return;
    await db.terms.add({
      id: `term-${uuid()}`,
      term: draft.term.trim(),
      english: draft.english.trim() || undefined,
      explanation: draft.explanation.trim() || undefined,
      areaId: draft.areaId,
      status: "Ny",
    });
    setDraft({ term: "", english: "", explanation: "", areaId: draft.areaId });
  }

  const sessionTerm =
    session && terms
      ? terms.find((t) => t.id === session.ids[session.index])
      : null;

  if (session && sessionTerm) {
    const accent = areaAccent[sessionTerm.areaId];
    return (
      <div className="fixed inset-0 z-40 flex flex-col bg-[radial-gradient(ellipse_at_top,_#eef4f9_0%,_#f7f5f1_45%,_#f3efe8_100%)]">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-6 pt-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">
              {session.index + 1} / {session.ids.length}
            </p>
            <button
              type="button"
              onClick={() => setSession(null)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-white/70"
            >
              <X className="h-4 w-4" />
              Avslutt
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <article
              className={`rounded-2xl border ${accent.border} bg-white p-5 shadow-sm`}
            >
              <span
                className={`mb-3 inline-flex rounded-md px-2 py-0.5 text-xs ${accent.soft} ${accent.text}`}
              >
                {labelForTermArea(sessionTerm.areaId)}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
                {sessionTerm.term}
              </h1>
              {sessionTerm.english && (
                <p className="mt-1 text-sm text-slate-500">
                  {sessionTerm.english}
                </p>
              )}

              {!session.revealed ? (
                <button
                  type="button"
                  onClick={() => setSession({ ...session, revealed: true })}
                  className="mt-8 w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white"
                >
                  Vis forklaring
                </button>
              ) : (
                <div className="mt-6 space-y-4">
                  <p className="text-base leading-relaxed text-slate-800">
                    {sessionTerm.explanation ?? "Ingen forklaring lagret ennå."}
                  </p>
                  <p className="text-xs text-slate-500">
                    Hvordan gikk det? Sett status — neste kort kommer etterpå.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {statuses.map((s) => {
                      const st = termStatusStyle[s];
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => void gradeInSession(s)}
                          className={`min-h-12 rounded-xl px-2 py-3 text-sm font-medium ${st.bg} ${st.text}`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
            {!session.revealed && (
              <p className="mt-4 text-center text-sm text-slate-500">
                Si forklaringen høyt før du sjekker.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (session && !sessionTerm) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">Økten er ferdig.</p>
        <button
          type="button"
          onClick={() => setSession(null)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Tilbake til biblioteket
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Konseptbanken
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Utvidet ordliste du kan redigere selv. For kuraterte forklaringer og
          læringsløp: start på forsiden eller bruk{" "}
          <Link
            href="/repeter"
            className="font-medium text-slate-800 underline-offset-2 hover:underline"
          >
            Repeter
          </Link>
          . Her: trykk <strong>Start repetisjon</strong>, si forklaringen høyt,
          sjekk, og sett status.
        </p>
      </header>

      <button
        type="button"
        disabled={!filtered.length}
        onClick={() => startSession(filtered)}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50 sm:w-auto"
      >
        Start repetisjon
        {filtered.length > 0 ? ` (${filtered.length})` : ""}
      </button>

      <div className="flex flex-wrap gap-2">
        {areaFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setAreaFilter(f.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              areaFilter === f.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as TermStatus | "alle")
          }
        >
          <option value="alle">Alle statuser</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">Bibliotek — filtrer og bla.</p>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((t) => (
          <TermCard
            key={t.id}
            term={t}
            onStatus={(s) => void updateStatus(t, s)}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Konsept</th>
              <th className="px-3 py-2 font-medium">Engelsk</th>
              <th className="px-3 py-2 font-medium">Forklaring</th>
              <th className="px-3 py-2 font-medium">Område</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Sist repetert</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const accent = areaAccent[t.areaId];
              const st = termStatusStyle[t.status];
              return (
                <tr key={t.id} className="border-b border-slate-50 align-top">
                  <td className="px-3 py-2 font-medium text-slate-900">
                    {t.term}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{t.english ?? "—"}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {t.explanation ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs ${accent.soft} ${accent.text}`}
                    >
                      {labelForTermArea(t.areaId)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className={`rounded-md px-2 py-1 text-xs ${st.bg} ${st.text}`}
                      value={t.status}
                      onChange={(e) =>
                        void updateStatus(t, e.target.value as TermStatus)
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-slate-500">
                    {t.lastReviewed ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-3">
        <h2 className="mb-2 text-sm font-semibold text-slate-800">
          Nytt konsept
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
            placeholder="Konsept"
            value={draft.term}
            onChange={(e) => setDraft({ ...draft, term: e.target.value })}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
            placeholder="Engelsk"
            value={draft.english}
            onChange={(e) => setDraft({ ...draft, english: e.target.value })}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none sm:col-span-2"
            placeholder="Forklaring med egne ord (ikke lim inn AI-tekst)"
            value={draft.explanation}
            onChange={(e) =>
              setDraft({ ...draft, explanation: e.target.value })
            }
          />
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={draft.areaId}
            onChange={(e) =>
              setDraft({ ...draft, areaId: e.target.value as TermAreaId })
            }
          >
            {areaFilters
              .filter((a) => a.id !== "alle")
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={() => void addTerm()}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Legg til
          </button>
        </div>
      </section>
    </div>
  );
}

function TermCard({
  term,
  onStatus,
}: {
  term: Term;
  onStatus: (s: TermStatus) => void;
}) {
  const accent = areaAccent[term.areaId];
  return (
    <article className={`rounded-xl border ${accent.border} bg-white p-3 shadow-sm`}>
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-900">{term.term}</h3>
        <span className={`rounded-md px-2 py-0.5 text-[10px] ${accent.soft} ${accent.text}`}>
          {labelForTermArea(term.areaId)}
        </span>
      </div>
      {term.english && (
        <p className="mb-2 text-xs text-slate-500">{term.english}</p>
      )}
      <p className="mb-3 text-sm leading-relaxed text-slate-700">
        {term.explanation ?? "—"}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {statuses.map((s) => {
          const st = termStatusStyle[s];
          return (
            <button
              key={s}
              type="button"
              onClick={() => onStatus(s)}
              className={`rounded-md px-2 py-1 text-xs ${
                term.status === s
                  ? `${st.bg} ${st.text} ring-1 ring-slate-300`
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        Sist repetert: {term.lastReviewed ?? "—"}
      </p>
    </article>
  );
}
