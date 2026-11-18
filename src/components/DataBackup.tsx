"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { exportAll, importAll } from "@/lib/db";
import { exportLearningState, importLearningState } from "@/lib/progress";
import type { ExportPayload } from "@/types/mesterplan";

export function DataBackup() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function onExport() {
    const data = { ...(await exportAll()), learning: exportLearningState() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notteskall-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Sikkerhetskopi lastet ned. På iPhone: bruk Del-arket om du vil lagre i Filer.");
  }

  async function onImport(file: File) {
    const ok = window.confirm(
      "Gjenoppretting overskriver dataene som ligger lokalt på denne enheten. Fortsette?"
    );
    if (!ok) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text) as ExportPayload;
      if (!payload.pages || !payload.areas) {
        throw new Error("Ugyldig fil");
      }
      await importAll(payload);
      importLearningState(payload.learning);
      setMsg("Gjenopprettet. Oppdaterer…");
      window.location.reload();
    } catch {
      setMsg("Kunne ikke gjenopprette fra filen.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void onExport()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        <Download className="h-3.5 w-3.5" />
        Ta sikkerhetskopi
      </button>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        <Upload className="h-3.5 w-3.5" />
        Gjenopprett fra sikkerhetskopi
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onImport(f);
          e.target.value = "";
        }}
      />
      {msg && <span className="text-xs text-slate-500">{msg}</span>}
    </div>
  );
}
