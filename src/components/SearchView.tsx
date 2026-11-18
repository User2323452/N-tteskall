"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categoryLabel, searchLearning } from "@/data/learning";

export function SearchView() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const results = useMemo(() => searchLearning(q), [q]);

  return (
    <div className="space-y-5">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
        Søk
      </h1>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none ring-[var(--accent)] focus:ring-2"
        placeholder="Søk begreper og læringsløp…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      {!q.trim() && (
        <p className="text-sm text-slate-500">
          Prøv styringsrenten, inflasjon, ASK, renters rente…
        </p>
      )}

      {q.trim() && (
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Begreper ({results.concepts.length})
            </h2>
            <ul className="space-y-1.5">
              {results.concepts.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/begrep/${c.id}`}
                    className="block rounded-xl border border-slate-100 bg-white px-3.5 py-3 shadow-sm"
                  >
                    <span className="font-medium text-slate-900">{c.term}</span>
                    {c.english && (
                      <span className="text-slate-400"> · {c.english}</span>
                    )}
                    <span className="mt-0.5 block text-sm text-slate-500">
                      {c.definition}
                    </span>
                    <span className="mt-1 block text-[11px] uppercase tracking-wide text-slate-400">
                      {categoryLabel[c.category]}
                    </span>
                  </Link>
                </li>
              ))}
              {results.concepts.length === 0 && (
                <p className="text-sm text-slate-500">Ingen begreper.</p>
              )}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Læringsløp ({results.paths.length})
            </h2>
            <ul className="space-y-1.5">
              {results.paths.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/lop/${p.id}`}
                    className="block rounded-xl border border-slate-100 bg-white px-3.5 py-3 shadow-sm"
                  >
                    <span className="font-medium text-slate-900">{p.title}</span>
                    <span className="mt-0.5 block text-sm text-slate-500">
                      {p.subtitle}
                    </span>
                  </Link>
                </li>
              ))}
              {results.paths.length === 0 && (
                <p className="text-sm text-slate-500">Ingen læringsløp.</p>
              )}
            </ul>
          </section>

          {results.lessons.length > 0 && (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Leksjoner ({results.lessons.length})
              </h2>
              <ul className="space-y-1.5">
                {results.lessons.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/lop/${l.pathId}/${l.id}`}
                      className="block rounded-xl border border-slate-100 bg-white px-3.5 py-3 shadow-sm"
                    >
                      <span className="font-medium text-slate-900">
                        {l.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-500">
                        {l.summary}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
