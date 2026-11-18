"use client";

import { createContext, useContext } from "react";

export type LessonAdvance = {
  href: string;
  fromId: string;
  toId: string | null;
  commit: () => void;
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
