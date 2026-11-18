"use client";

import { useEffect, useState } from "react";
import { liveQuery } from "dexie";

/** Minimal Dexie liveQuery hook (avoids dexie-react-hooks peer issues). */
export function useLiveQuery<T>(
  querier: () => Promise<T> | T,
  enabled = true,
  deps: unknown[] = []
): T | undefined {
  const [value, setValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    const observable = liveQuery(querier);
    const sub = observable.subscribe({
      next: (v) => setValue(v),
      error: (err) => console.error(err),
    });
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return value;
}
