"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { v4 as uuid } from "uuid";
import { db, ensureSeeded } from "@/lib/db";
import type { AreaId } from "@/types/mesterplan";
import { useRouter } from "next/navigation";

const areaOptions: { id: AreaId | ""; label: string }[] = [
  { id: "", label: "Innboks (standard)" },
  { id: "makro", label: "Makro & pengepolitikk" },
  { id: "marked", label: "Marked & verdsettelse" },
  { id: "bank", label: "Bank & kreditt" },
  { id: "personlig", label: "Personlig økonomi" },
  { id: "metode", label: "Metode & regnskap" },
];

function ideaContent(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Spørsmål å utforske:" }],
      },
      {
        type: "bulletList",
        content: [
          { type: "listItem", content: [{ type: "paragraph" }] },
          { type: "listItem", content: [{ type: "paragraph" }] },
          { type: "listItem", content: [{ type: "paragraph" }] },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Mine notater:" }],
      },
      { type: "paragraph" },
    ],
  };
}

export function IdeaFab() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [areaId, setAreaId] = useState<AreaId | "">("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    void ensureSeeded();
  }, []);

  async function save() {
    if (!text.trim()) return;
    setSaving(true);
    await ensureSeeded();
    const target: AreaId = areaId || "innboks";
    const id = `idea-${uuid()}`;
    const now = new Date().toISOString();
    const siblings = await db.pages.where("areaId").equals(target).count();
    await db.pages.put({
      id,
      areaId: target,
      title: text.trim().slice(0, 80) || "Ny idé",
      content: ideaContent(text.trim()),
      notes: "",
      order: siblings,
      createdAt: now,
      updatedAt: now,
    });
    setText("");
    setAreaId("");
    setOpen(false);
    setSaving(false);
    router.push(`/tema/${id}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        Idé
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-lg text-slate-900">
                Ny idé
              </h2>
              <button
                type="button"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setOpen(false)}
                aria-label="Lukk"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <textarea
              className="mb-3 min-h-[110px] w-full rounded-xl border border-slate-200 px-3 py-2 text-[15px] outline-none ring-sky-500 focus:ring-2"
              placeholder="Skriv idéen med egne ord…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Område (valgfritt)
            </label>
            <select
              className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value as AreaId | "")}
            >
              {areaOptions.map((o) => (
                <option key={o.label} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!text.trim() || saving}
              onClick={() => void save()}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Lagrer…" : "Lagre idé"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
