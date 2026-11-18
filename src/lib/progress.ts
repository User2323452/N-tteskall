"use client";

import { srsConceptIds } from "@/data/learning";
import type {
  ActivityEntry,
  ConceptProgress,
  LearningBackup,
  PathProgress,
  RecallGrade,
  RecallStatus,
  ReviewEntry,
} from "@/types/learning";

/**
 * Nøklene beholder «mesterplan»-prefikset med vilje, slik at fremdrift
 * som allerede ligger i nettleseren, ikke nullstilles når produktet heter Nøtteskall.
 */
const CONCEPT_KEY = "mesterplan.conceptProgress.v1";
const PATH_KEY = "mesterplan.pathProgress.v1";
const REVIEW_KEY = "mesterplan.reviewLog.v1";
const ACTIVITY_KEY = "mesterplan.activity.v1";

function localISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayISO(): string {
  return localISO();
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate.slice(0, 10) + "T12:00:00");
  d.setDate(d.getDate() + days);
  return localISO(d);
}

/** Kalenderdato på bokmål: «i dag, 18. nov.», «i morgen, 19. nov.» eller «24. nov.». */
export function formatDueLabel(iso: string): string {
  const day = iso.slice(0, 10);
  const date = new Date(day + "T12:00:00");
  const today = new Date(todayISO() + "T12:00:00");
  const diff = Math.round((date.getTime() - today.getTime()) / 86_400_000);
  const pretty = new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "short",
  }).format(date);
  if (diff < 0) return `forfalt ${pretty}`;
  if (diff === 0) return `i dag, ${pretty}`;
  if (diff === 1) return `i morgen, ${pretty}`;
  return pretty;
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

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(list));
}

export function isIntroduced(progress?: ConceptProgress): boolean {
  if (!progress) return false;
  if (progress.introduced) return true;
  if (progress.lastReviewed) return true;
  if (progress.status && progress.status !== "Ny") return true;
  return false;
}

export function getAllConceptProgress(): Record<string, ConceptProgress> {
  return readMap<ConceptProgress>(CONCEPT_KEY);
}

export function getConceptProgress(id: string): ConceptProgress {
  return getAllConceptProgress()[id] ?? { status: "Ny" };
}

/**
 * Kort intervall første gang, lengre for hver gang begrepet sitter.
 * Usikker nullstiller til 1 dag.
 * 0/1 dag → OK 3, Kan det 6. Deretter ×2 (OK) eller ×2,5 (Kan det).
 */
export function nextIntervalDays(
  previous: number | undefined,
  grade: RecallGrade
): number {
  if (grade === "Usikker") return 1;
  const current = previous && previous > 0 ? previous : 0;
  if (current <= 1) return grade === "OK" ? 3 : 6;
  if (grade === "OK") return Math.min(60, current * 2);
  return Math.min(120, Math.round(current * 2.5));
}

export function setConceptStatus(
  id: string,
  status: RecallStatus,
  term?: string
): ConceptProgress {
  const map = getAllConceptProgress();
  const prev = map[id];
  const lastReviewed = todayISO();
  const intervalDays =
    status === "Ny" ? prev?.intervalDays : nextIntervalDays(prev?.intervalDays, status);
  const dueOn =
    status === "Ny" || !intervalDays
      ? lastReviewed
      : addDays(lastReviewed, intervalDays);
  const next: ConceptProgress = {
    status,
    lastReviewed: status === "Ny" ? prev?.lastReviewed : lastReviewed,
    dueOn,
    introduced: true,
    reviewCount: (prev?.reviewCount ?? 0) + (status === "Ny" ? 0 : 1),
    intervalDays,
  };
  map[id] = next;
  writeMap(CONCEPT_KEY, map);

  if (status !== "Ny") {
    const reviews = readList<ReviewEntry>(REVIEW_KEY);
    reviews.unshift({
      conceptId: id,
      term: term ?? id,
      grade: status,
      at: new Date().toISOString(),
      intervalDays,
    });
    writeList(REVIEW_KEY, reviews.slice(0, 80));
    logActivity({
      label: `Vurderte ${term ?? id}`,
      href: `/begrep/${id}`,
    });
  }
  return next;
}

/** Legg begreper i køen. Leksjoner sender onlySrs, slik at ikke alt blir kort. */
export function introduceConcepts(
  ids: string[],
  opts?: { onlySrs?: boolean }
): void {
  const onlySrs = opts?.onlySrs ?? false;
  const map = getAllConceptProgress();
  const today = todayISO();
  let changed = false;
  for (const id of ids) {
    if (onlySrs && !srsConceptIds.has(id)) continue;
    const existing = map[id];
    if (isIntroduced(existing)) {
      if (existing && !existing.introduced) {
        map[id] = { ...existing, introduced: true };
        changed = true;
      }
      continue;
    }
    map[id] = {
      status: "Ny",
      dueOn: today,
      introduced: true,
      reviewCount: 0,
    };
    changed = true;
  }
  if (changed) writeMap(CONCEPT_KEY, map);
}

/** Begreper brukeren har møtt, og som forfaller i dag eller tidligere. */
export function getDueConceptIds(allIds: string[]): string[] {
  const map = getAllConceptProgress();
  const today = todayISO();
  return allIds.filter((id) => {
    const progress = map[id];
    if (!isIntroduced(progress)) return false;
    if (!progress?.dueOn) return true;
    return progress.dueOn <= today;
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

export function touchPath(pathId: string, label: string): void {
  const map = getAllPathProgress();
  const current = map[pathId] ?? { completedLessonIds: [] as string[] };
  if (current.startedAt) return;
  map[pathId] = { ...current, startedAt: new Date().toISOString() };
  writeMap(PATH_KEY, map);
  logActivity({ label: `Startet ${label}`, href: `/lop/${pathId}` });
}

export function markLessonComplete(
  pathId: string,
  lessonId: string,
  label?: string
): PathProgress {
  const map = getAllPathProgress();
  const current = map[pathId] ?? { completedLessonIds: [] as string[] };
  const completed = new Set(current.completedLessonIds);
  const wasNew = !completed.has(lessonId);
  completed.add(lessonId);
  const next: PathProgress = {
    completedLessonIds: [...completed],
    startedAt: current.startedAt ?? new Date().toISOString(),
    completedAt: current.completedAt,
  };
  map[pathId] = next;
  writeMap(PATH_KEY, map);
  if (wasNew && label) {
    logActivity({ label, href: `/lop/${pathId}/${lessonId}` });
  }
  return next;
}

export function markPathComplete(
  pathId: string,
  allLessonIds: string[],
  label?: string
): PathProgress {
  const map = getAllPathProgress();
  const already = Boolean(map[pathId]?.completedAt);
  const next: PathProgress = {
    completedLessonIds: [...allLessonIds],
    startedAt: map[pathId]?.startedAt ?? new Date().toISOString(),
    completedAt: map[pathId]?.completedAt ?? new Date().toISOString(),
  };
  map[pathId] = next;
  writeMap(PATH_KEY, map);
  if (!already && label) {
    logActivity({ label, href: `/lop/${pathId}` });
  }
  return next;
}

export function nextLessonId(
  lessonIds: string[],
  completedLessonIds: string[]
): string | null {
  const done = new Set(completedLessonIds);
  return lessonIds.find((id) => !done.has(id)) ?? null;
}

export function getReviews(): ReviewEntry[] {
  return readList<ReviewEntry>(REVIEW_KEY);
}

export function getActivity(): ActivityEntry[] {
  return readList<ActivityEntry>(ACTIVITY_KEY);
}

export function logActivity(entry: { label: string; href: string }): void {
  const list = readList<ActivityEntry>(ACTIVITY_KEY);
  list.unshift({ ...entry, at: new Date().toISOString() });
  writeList(ACTIVITY_KEY, list.slice(0, 40));
}

export function exportLearningState(): LearningBackup {
  return {
    conceptProgress: getAllConceptProgress(),
    pathProgress: getAllPathProgress(),
    reviews: getReviews(),
    activity: getActivity(),
  };
}

export function importLearningState(data: LearningBackup | undefined): void {
  if (!data) return;
  if (data.conceptProgress) writeMap(CONCEPT_KEY, data.conceptProgress);
  if (data.pathProgress) writeMap(PATH_KEY, data.pathProgress);
  if (Array.isArray(data.reviews)) writeList(REVIEW_KEY, data.reviews);
  if (Array.isArray(data.activity)) writeList(ACTIVITY_KEY, data.activity);
}

export interface ScheduledConcept {
  id: string;
  dueOn: string;
  intervalDays?: number;
  status: RecallStatus;
}

/** Begreper i køen, tidligste neste dato først. */
export function listSchedule(): ScheduledConcept[] {
  const map = getAllConceptProgress();
  return Object.entries(map)
    .filter((entry): entry is [string, ConceptProgress] =>
      Boolean(entry[1]?.dueOn) && isIntroduced(entry[1])
    )
    .map(([id, progress]) => ({
      id,
      dueOn: progress.dueOn as string,
      intervalDays: progress.intervalDays,
      status: progress.status,
    }))
    .sort((a, b) => a.dueOn.localeCompare(b.dueOn) || a.id.localeCompare(b.id, "nb"));
}

/** Datoen denne vurderingen ville satt, med intervallengde. */
export function gradeHint(conceptId: string, grade: RecallGrade): string {
  const days = nextIntervalDays(getConceptProgress(conceptId).intervalDays, grade);
  const due = addDays(todayISO(), days);
  const when = formatDueLabel(due);
  const span = days === 1 ? "1 dag" : `${days} dager`;
  return `${span} · ${when}`;
}

function assertSchedule() {
  const cases: [number | undefined, RecallGrade, number][] = [
    [undefined, "Usikker", 1],
    [undefined, "OK", 3],
    [undefined, "Kan det", 6],
    [6, "Kan det", 15],
    [15, "Usikker", 1],
    [1, "OK", 3],
    [12, "OK", 24],
  ];
  for (const [prev, grade, expected] of cases) {
    const actual = nextIntervalDays(prev, grade);
    if (actual !== expected) {
      throw new Error(`Intervall ${String(prev)} + ${grade} ble ${actual}, ventet ${expected}`);
    }
  }
  if (addDays("2026-01-15", 1) !== "2026-01-16") {
    throw new Error("Én dag frem skal være neste kalenderdato");
  }
  if (addDays("2026-01-15", 6) !== "2026-01-21") {
    throw new Error("Seks dager frem skal være 21. januar");
  }
}

assertSchedule();
