"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db, ensureSeeded } from "@/lib/db";
import { useLiveQuery } from "@/lib/useLiveQuery";

export function SearchView() {
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    void ensureSeeded().then(() => setReady(true));
  }, []);

  const pages = useLiveQuery(() => db.pages.toArray(), ready);
  const terms = useLiveQuery(() => db.terms.toArray(), ready);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return { pages: [], terms: [] };
    const pageHits = (pages ?? []).filter((p) => {
      const hay = `${p.title} ${JSON.stringify(p.content)} ${p.notes ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
    const termHits = (terms ?? []).filter((t) => {
      const hay = `${t.term} ${t.english ?? ""} ${t.explanation ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
    return { pages: pageHits, terms: termHits };
  }, [q, pages, terms]);

  return (
    <div className="space-y-4">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
        Søk
      </h1>
      <input
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-sky-500 focus:ring-2"
        placeholder="Søk i titler, notater og begreper…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      {q.trim() && (
        <div className="space-y-4">
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Temasider ({results.pages.length})
            </h2>
            <ul className="space-y-1">
              {results.pages.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/tema/${p.id}`}
                    className="block rounded-lg bg-white px-3 py-2 text-sm text-slate-800 shadow-sm ring-1 ring-slate-100"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
              {results.pages.length === 0 && (
                <p className="text-sm text-slate-500">Ingen treff.</p>
              )}
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Begreper ({results.terms.length})
            </h2>
            <ul className="space-y-1">
              {results.terms.map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-100"
                >
                  <span className="font-medium text-slate-900">{t.term}</span>
                  {t.english && (
                    <span className="text-slate-500"> · {t.english}</span>
                  )}
                </li>
              ))}
              {results.terms.length === 0 && (
                <p className="text-sm text-slate-500">Ingen treff.</p>
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
