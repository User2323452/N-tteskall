"use client";

import { useEffect } from "react";

type Props = {
  message: string | null;
  onDone: () => void;
  durationMs?: number;
};

export function Toast({ message, onDone, durationMs = 2800 }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [message, onDone, durationMs]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
    >
      {message}
    </div>
  );
}
