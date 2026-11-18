"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { db, ensureSeeded } from "@/lib/db";
import { TopicEditor } from "@/components/TopicEditor";
import { isPageEmpty, type Page } from "@/types/mesterplan";
import { areaAccent } from "@/lib/theme";
import { v4 as uuid } from "uuid";
import { useSearchParams } from "next/navigation";

export function TopicPageView({ pageId }: { pageId: string }) {
  const [page, setPage] = useState<Page | null | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "lagrer" | "lagret">(
    "idle"
  );
  const [blurtMode, setBlurtMode] = useState(false);
  const [blurtText, setBlurtText] = useState("");
  const [compare, setCompare] = useState(false);
  const search = useSearchParams();

  useEffect(() => {
    void (async () => {
      await ensureSeeded();
      const p = await db.pages.get(pageId);
      setPage(p ?? null);
      setNotes(p?.notes ?? "");
    })();
  }, [pageId]);

  useEffect(() => {
    if (search.get("modus") === "blurt") setBlurtMode(true);
  }, [search]);

  async function saveContent(content: unknown) {
    if (!page) return;
    setSaveState("lagrer");
    const updatedAt = new Date().toISOString();
    await db.pages.update(page.id, { content, updatedAt });
    setPage({ ...page, content, updatedAt });
    setSaveState("lagret");
  }

  async function saveNotes(value: string) {
    if (!page) return;
    setNotes(value);
    setSaveState("lagrer");
    const updatedAt = new Date().toISOString();
    await db.pages.update(page.id, { notes: value, updatedAt });
    setPage({ ...page, notes: value, updatedAt });
    setSaveState("lagret");
  }

  async function saveBlurt() {
    if (!page || !blurtText.trim()) return;
    await db.blurts.add({
      id: uuid(),
      pageId: page.id,
      text: blurtText.trim(),
      createdAt: new Date().toISOString(),
    });
  }

  if (page === undefined) {
    return <p className="text-sm text-slate-500">Laster tema…</p>;
  }
  if (!page) {
    return (
      <div>
        <p className="mb-3 text-sm text-slate-600">Fant ikke temasiden.</p>
        <Link href="/" className="text-sm text-sky-700 underline">
          Til forsiden
        </Link>
      </div>
    );
  }

  const accent = areaAccent[page.areaId];
  const empty = isPageEmpty(page.content);

  if (blurtMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              setBlurtMode(false);
              setCompare(false);
              setBlurtText("");
            }}
            className="inline-flex items-center gap-1 text-sm text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Avslutt test
          </button>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Blurting
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
          {page.title}
        </h1>
        {!compare ? (
          <>
            <p className="text-sm text-slate-600">
              Skriv alt du husker. Notatene er skjult.
            </p>
            <textarea
              className="min-h-[240px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[15px] outline-none ring-sky-500 focus:ring-2"
              placeholder="Hva husker du?"
              value={blurtText}
              onChange={(e) => setBlurtText(e.target.value)}
            />
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
              onClick={() => setCompare(true)}
            >
              Sammenlign
            </button>
          </>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ditt blurt
              </h2>
              <div className="whitespace-pre-wrap rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-sm leading-relaxed text-slate-800">
                {blurtText || "—"}
              </div>
              <button
                type="button"
                className="mt-3 text-sm text-slate-600 underline"
                onClick={() => void saveBlurt()}
              >
                Lagre blurt i historikk
              </button>
            </div>
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Original
              </h2>
              <TopicEditor content={page.content} onChange={() => {}} editable={false} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Forside
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {saveState === "lagrer" && "Lagrer…"}
          {saveState === "lagret" && "Lagret"}
          {empty && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium uppercase tracking-wide text-slate-500">
              Tom side
            </span>
          )}
        </div>
      </div>

      <div className={`rounded-2xl border ${accent.border} ${accent.soft} px-4 py-3`}>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-slate-900 sm:text-3xl">
          {page.title}
        </h1>
        <button
          type="button"
          onClick={() => setBlurtMode(true)}
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-medium text-white"
        >
          <FlaskConical className="h-4 w-4" />
          Test meg
        </button>
      </div>

      <TopicEditor content={page.content} onChange={(json) => void saveContent(json)} />

      <section>
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-lg text-slate-900">
          Mine notater
        </h2>
        <textarea
          className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
          placeholder="Frie notater til denne siden…"
          value={notes}
          onChange={(e) => void saveNotes(e.target.value)}
        />
      </section>
    </div>
  );
}
