"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { v4 as uuid } from "uuid";
import { db, ensureSeeded } from "@/lib/db";
import { useLiveQuery } from "@/lib/useLiveQuery";
import { areaAccent, termStatusStyle } from "@/lib/theme";
import type { Term, TermAreaId, TermStatus } from "@/types/mesterplan";

const areaFilters: { id: TermAreaId | "alle"; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "makro", label: "Makro" },
  { id: "marked", label: "Marked" },
  { id: "bank", label: "Bank" },
  { id: "personlig", label: "Personlig" },
  { id: "metode", label: "Metode" },
];

const statuses: TermStatus[] = ["Ny", "Usikker", "Kan det"];

export function BegrepsbankenView() {
  const [ready, setReady] = useState(false);
  const [areaFilter, setAreaFilter] = useState<TermAreaId | "alle">("alle");
  const [statusFilter, setStatusFilter] = useState<TermStatus | "alle">("alle");
  const [hideExplanation, setHideExplanation] = useState(false);
  const [revealId, setRevealId] = useState<string | null>(null);
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

  async function updateStatus(term: Term, status: TermStatus) {
    await db.terms.update(term.id, {
      status,
      lastReviewed: new Date().toISOString().slice(0, 10),
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

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Begrepsbanken
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Alle begreper fra MesterPlan samlet på ett sted. Legg til nye
          fortløpende. Filtrer på område for å repetere ett felt om gangen. Slik
          repeterer du: Skjul forklaring, les begrepet, si forklaringen høyt og
          sjekk. Oppdater status og sist repetert.
        </p>
      </header>

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
        <label className="inline-flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={hideExplanation}
            onChange={(e) => {
              setHideExplanation(e.target.checked);
              setRevealId(null);
            }}
          />
          Repetisjonsmodus (skjul forklaring)
        </label>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((t) => (
          <TermCard
            key={t.id}
            term={t}
            hideExplanation={hideExplanation}
            revealed={revealId === t.id}
            onReveal={() => setRevealId(t.id)}
            onStatus={(s) => void updateStatus(t, s)}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Begrep</th>
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
              const show =
                !hideExplanation || revealId === t.id;
              return (
                <tr key={t.id} className="border-b border-slate-50 align-top">
                  <td className="px-3 py-2 font-medium text-slate-900">
                    {t.term}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{t.english ?? "—"}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {show ? (
                      t.explanation ?? "—"
                    ) : (
                      <button
                        type="button"
                        className="text-sky-700 underline"
                        onClick={() => setRevealId(t.id)}
                      >
                        Vis
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs ${accent.soft} ${accent.text}`}
                    >
                      {t.areaId}
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
          + Nytt begrep
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
            placeholder="Begrep"
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
            placeholder="Forklaring (dine ord)"
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
  hideExplanation,
  revealed,
  onReveal,
  onStatus,
}: {
  term: Term;
  hideExplanation: boolean;
  revealed: boolean;
  onReveal: () => void;
  onStatus: (s: TermStatus) => void;
}) {
  const accent = areaAccent[term.areaId];
  const show = !hideExplanation || revealed;
  return (
    <article className={`rounded-xl border ${accent.border} bg-white p-3 shadow-sm`}>
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-900">{term.term}</h3>
        <span className={`rounded-md px-2 py-0.5 text-[10px] ${accent.soft} ${accent.text}`}>
          {term.areaId}
        </span>
      </div>
      {term.english && (
        <p className="mb-2 text-xs text-slate-500">{term.english}</p>
      )}
      {show ? (
        <p className="mb-3 text-sm leading-relaxed text-slate-700">
          {term.explanation ?? "—"}
        </p>
      ) : (
        <button
          type="button"
          onClick={onReveal}
          className="mb-3 text-sm text-sky-700 underline"
        >
          Vis forklaring
        </button>
      )}
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
