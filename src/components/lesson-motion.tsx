"use client";

import { createContext, useContext } from "react";

export type LessonAdvance = {
  href: string;
  fromId: string;
  toId: string | null;
  commit: () => void;
  /** Konsepter som denne leksjonen legger i Repeter. */
  conceptsAdded: number;
  /** Denne leksjonen er dagens første aktivitet. */
  madeDay: boolean;
};

export type LessonMotion = {
  /** Ark ned, hake, strek, rull, hvile, neste ark opp. Ett trykk. */
  run: (advance: LessonAdvance) => void;
  close: () => void;
};

export const LessonMotionContext = createContext<LessonMotion | null>(null);

export function useLessonMotion() {
  return useContext(LessonMotionContext);
}
