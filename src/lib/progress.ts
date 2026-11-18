"use client";

import type {
  ConceptProgress,
  PathProgress,
  RecallStatus,
} from "@/types/learning";

const CONCEPT_KEY = "mesterplan.conceptProgress.v1";
const PATH_KEY = "mesterplan.pathProgress.v1";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function readMap<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, T>;
  } catch {
    return {};
  }
}

function writeMap<T>(key: string, map: Record<string, T>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(map));
}

export function getAllConceptProgress(): Record<string, ConceptProgress> {
  return readMap<ConceptProgress>(CONCEPT_KEY);
}

export function getConceptProgress(id: string): ConceptProgress {
  return getAllConceptProgress()[id] ?? { status: "Ny" };
}

export function setConceptStatus(
  id: string,
  status: RecallStatus
): ConceptProgress {
  const map = getAllConceptProgress();
  const lastReviewed = todayISO();
  let dueOn = lastReviewed;
  if (status === "Usikker") dueOn = addDays(lastReviewed, 1);
  if (status === "Kan det") dueOn = addDays(lastReviewed, 4);
  if (status === "Ny") dueOn = lastReviewed;
  const next: ConceptProgress = { status, lastReviewed, dueOn };
  map[id] = next;
  writeMap(CONCEPT_KEY, map);
  return next;
}

/** Begreper som forfaller i dag eller tidligere (eller aldri vurdert). */
export function getDueConceptIds(allIds: string[]): string[] {
  const map = getAllConceptProgress();
  const today = todayISO();
  return allIds.filter((id) => {
    const p = map[id];
    if (!p || p.status === "Ny" || !p.dueOn) return true;
    return p.dueOn <= today;
  });
}

export function getAllPathProgress(): Record<string, PathProgress> {
  return readMap<PathProgress>(PATH_KEY);
}

export function getPathProgress(pathId: string): PathProgress {
  return (
    getAllPathProgress()[pathId] ?? {
      completedLessonIds: [],
    }
  );
}

export function markLessonComplete(pathId: string, lessonId: string): PathProgress {
  const map = getAllPathProgress();
  const current = map[pathId] ?? { completedLessonIds: [] as string[] };
  const completed = new Set(current.completedLessonIds);
  completed.add(lessonId);
  const next: PathProgress = {
    completedLessonIds: [...completed],
    startedAt: current.startedAt ?? new Date().toISOString(),
  };
  map[pathId] = next;
  writeMap(PATH_KEY, map);
  return next;
}

export function markPathComplete(pathId: string, allLessonIds: string[]): PathProgress {
  const map = getAllPathProgress();
  const next: PathProgress = {
    completedLessonIds: [...allLessonIds],
    startedAt: map[pathId]?.startedAt ?? new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
  map[pathId] = next;
  writeMap(PATH_KEY, map);
  return next;
}

export function nextLessonId(
  lessonIds: string[],
  completedLessonIds: string[]
): string | null {
  const done = new Set(completedLessonIds);
  return lessonIds.find((id) => !done.has(id)) ?? null;
}
