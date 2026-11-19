"use client";

import { srsConceptIds } from "@/data/learning";
import type {
  ActivityEntry,
  ConceptProgress,
  LearningBackup,
  PathProgress,
  RecallAttempt,
  RecallGrade,
  RecallStatus,
  ReturnProgress,
  ReviewEntry,
  SitterNotice,
} from "@/types/learning";

/**
 * Nøklene beholder «mesterplan»-prefikset med vilje, slik at fremdrift
 * som allerede ligger i nettleseren, ikke nullstilles når produktet heter Nøtteskall.
 */
const CONCEPT_KEY = "mesterplan.conceptProgress.v1";
const PATH_KEY = "mesterplan.pathProgress.v1";
const REVIEW_KEY = "mesterplan.reviewLog.v1";
const ACTIVITY_KEY = "mesterplan.activity.v1";
const RETURN_KEY = "mesterplan.return.v1";

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

/** Hele kalenderdager fra `fromIso` til `toIso`. Negativt tall betyr at målet ligger før. */
function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(fromIso.slice(0, 10) + "T12:00:00");
  const to = new Date(toIso.slice(0, 10) + "T12:00:00");
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
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

/**
 * Strek som skal vises i dag. Gårsdagen holder den i live.
 * En hel dag uten vurdering eller fullført leksjon nullstiller den.
 */
export function visibleStreak(
  lastActiveOn: string | undefined,
  streak: number,
  today: string
): number {
  if (!lastActiveOn || streak <= 0) return 0;
  const gap = daysBetween(lastActiveOn, today.slice(0, 10));
  if (gap > 1) return 0;
  return Math.floor(streak);
}

/** Neste lagrede strek etter en vurdering eller en fullført leksjon på `today`. */
export function advanceStreak(
  lastActiveOn: string | undefined,
  streak: number,
  today: string
): { lastActiveOn: string; streak: number } {
  const day = today.slice(0, 10);
  if (lastActiveOn === day) {
    return { lastActiveOn: day, streak: Math.max(1, Math.floor(streak) || 0) };
  }
  const gap = lastActiveOn ? daysBetween(lastActiveOn, day) : null;
  if (gap === 1) {
    return { lastActiveOn: day, streak: Math.max(0, Math.floor(streak)) + 1 };
  }
  return { lastActiveOn: day, streak: 1 };
}

/** «0 dager på rad», «1 dag på rad» eller «3 dager på rad». */
export function streakLabel(count: number): string {
  const n = Math.max(0, Math.floor(count));
  if (n === 1) return "1 dag på rad";
  return `${n} dager på rad`;
}

/**
 * Dagene i streken som fortsatt lever, eldste først.
 * Tom liste når synlig strek er 0. Hopper ikke over dager.
 */
export function streakDaysEnding(
  lastActiveOn: string | undefined,
  streak: number,
  today: string
): string[] {
  const count = visibleStreak(lastActiveOn, streak, today);
  if (!lastActiveOn || count <= 0) return [];
  const end = lastActiveOn.slice(0, 10);
  const days: string[] = [];
  for (let i = count - 1; i >= 0; i--) days.push(addDays(end, -i));
  return days;
}

export type StreakWorkLine = {
  key: "lop" | "repetisjon";
  title: "Dagens løp" | "Repetisjon";
  status: string;
  remaining: boolean;
};

/**
 * Hva som er igjen i dag, så streken forklarer seg.
 * En fullført leksjon eller et ferdig løp gjør dagens løp ferdig.
 * Repetisjon gjenstår så lenge noe forfaller i dag.
 */
export function streakWorkLines(input: {
  pathFinished: boolean;
  pathOpen: boolean;
  lessonDoneToday: boolean;
  dueCount: number;
  reviewedToday: boolean;
}): StreakWorkLine[] {
  const lopDone = input.pathFinished || input.lessonDoneToday;
  const lop: StreakWorkLine =
    !lopDone && !input.pathOpen
      ? { key: "lop", title: "Dagens løp", status: "ingen i dag", remaining: false }
      : lopDone
        ? { key: "lop", title: "Dagens løp", status: "ferdig", remaining: false }
        : { key: "lop", title: "Dagens løp", status: "gjenstår", remaining: true };

  const due = Math.max(0, Math.floor(input.dueCount));
  const repetisjon: StreakWorkLine =
    due > 0
      ? {
          key: "repetisjon",
          title: "Repetisjon",
          status: due === 1 ? "1 konsept gjenstår" : `${due} konsepter gjenstår`,
          remaining: true,
        }
      : input.reviewedToday
        ? { key: "repetisjon", title: "Repetisjon", status: "ferdig", remaining: false }
        : { key: "repetisjon", title: "Repetisjon", status: "ingen i dag", remaining: false };

  return [lop, repetisjon];
}

const LESSON_HREF = /^\/lop\/[^/]+\/[^/]+$/;

function asCalendarDay(value: string | undefined): string | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return localISO(date);
}

/**
 * Dager med en vurdering eller en fullført leksjon.
 * Strek-vinduet fyller inn dager som loggen kan ha kuttet.
 * Samme dag telles én gang. En startet løp-rad er ikke en fullført leksjon.
 */
export function completedDaySet(input: {
  activeDays?: string[];
  lastActiveOn?: string;
  streak?: number;
  reviews?: { at: string }[];
  activities?: { at: string; href: string }[];
}): string[] {
  const days = new Set<string>();
  const add = (value: string | undefined) => {
    const day = asCalendarDay(value);
    if (day) days.add(day);
  };
  for (const day of input.activeDays ?? []) add(day);
  const streak = Math.max(0, Math.floor(input.streak ?? 0));
  if (input.lastActiveOn && streak > 0) {
    for (let i = 0; i < streak; i++) add(addDays(input.lastActiveOn, -i));
  }
  for (const review of input.reviews ?? []) add(review.at);
  for (const entry of input.activities ?? []) {
    if (!LESSON_HREF.test(entry.href)) continue;
    add(entry.at);
  }
  return [...days].sort();
}

/**
 * Neste dato når ingenting forfaller i dag.
 * «3 konsepter i morgen», eller «2 konsepter 24. nov.» lenger frem.
 * Null når køen for i dag ikke er tom.
 */
export function nextQueueLabel(
  items: { dueOn: string }[],
  today = todayISO()
): string | null {
  const day = today.slice(0, 10);
  const days = items
    .map((item) => item.dueOn?.slice(0, 10))
    .filter((due): due is string => Boolean(due));
  if (days.length === 0 || days.some((due) => due <= day)) return null;
  const nextDay = [...days].sort()[0];
  const count = days.filter((due) => due === nextDay).length;
  const noun = count === 1 ? "konsept" : "konsepter";
  if (daysBetween(day, nextDay) === 1) return `${count} ${noun} i morgen`;
  const pretty = new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "short",
  }).format(new Date(nextDay + "T12:00:00"));
  return `${count} ${noun} ${pretty}`;
}

/**
 * Linje under Dagens løp når ingenting forfaller i dag.
 * Neste dato, eller «Ingenting venter» når både køen og fremtiden er tom.
 * Kall den ikke når noe allerede forfaller: da viser Hjem «Til repetisjon».
 */
export function idleWaitingLabel(
  items: { dueOn: string }[],
  today = todayISO()
): string {
  return nextQueueLabel(items, today) ?? "Ingenting venter";
}

/** Én stille linje: «KPI · Sitter». */
export function sitterHomeLine(term: string): string {
  return `${term} · Sitter`;
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

function emptyReturn(): ReturnProgress {
  return { streak: 0, activeDays: [], sitterPending: [], sitterSeen: [] };
}

function normalizeDays(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return completedDaySet({
    activeDays: raw.filter((day): day is string => typeof day === "string"),
  });
}

function sitterEventKey(conceptId: string, at: string): string {
  return `${conceptId}@${at}`;
}

function normalizeReturn(raw: unknown): ReturnProgress {
  if (!raw || typeof raw !== "object") return emptyReturn();
  const data = raw as Record<string, unknown>;
  const streakRaw = data.streak;
  const streak =
    typeof streakRaw === "number" && Number.isFinite(streakRaw)
      ? Math.max(0, Math.floor(streakRaw))
      : 0;
  const lastActiveOn =
    typeof data.lastActiveOn === "string" && /^\d{4}-\d{2}-\d{2}/.test(data.lastActiveOn)
      ? data.lastActiveOn.slice(0, 10)
      : undefined;
  const sitterSeen = Array.isArray(data.sitterSeen)
    ? [
        ...new Set(
          data.sitterSeen.filter((id): id is string => typeof id === "string" && id.length > 0)
        ),
      ]
    : [];
  const seen = new Set(sitterSeen);
  const sitterPending: SitterNotice[] = [];
  if (Array.isArray(data.sitterPending)) {
    for (const item of data.sitterPending) {
      if (!item || typeof item !== "object") continue;
      const record = item as Record<string, unknown>;
      if (typeof record.conceptId !== "string" || !record.conceptId) continue;
      if (typeof record.term !== "string" || !record.term.trim()) continue;
      const at = typeof record.at === "string" ? record.at : "";
      if (seen.has(sitterEventKey(record.conceptId, at))) continue;
      if (sitterPending.some((existing) => existing.conceptId === record.conceptId)) continue;
      sitterPending.push({ conceptId: record.conceptId, term: record.term.trim(), at });
    }
  }
  return {
    streak: lastActiveOn ? streak : 0,
    lastActiveOn,
    activeDays: normalizeDays(data.activeDays),
    sitterPending,
    sitterSeen,
  };
}

function readReturn(): ReturnProgress {
  if (typeof window === "undefined") return emptyReturn();
  try {
    const raw = localStorage.getItem(RETURN_KEY);
    if (!raw) return emptyReturn();
    return normalizeReturn(JSON.parse(raw));
  } catch {
    return emptyReturn();
  }
}

function writeReturn(state: ReturnProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RETURN_KEY, JSON.stringify(state));
}

function sameDays(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((day, index) => day === right[index]);
}

/** Én dag teller én gang, enten den kom fra en vurdering eller en fullført leksjon. */
function noteReturnActivity(): void {
  const state = readReturn();
  const today = todayISO();
  const next = advanceStreak(state.lastActiveOn, state.streak, today);
  const activeDays = completedDaySet({
    activeDays: [...state.activeDays, today],
    lastActiveOn: next.lastActiveOn,
    streak: next.streak,
    reviews: getReviews(),
    activities: getActivity(),
  });
  if (
    next.lastActiveOn === state.lastActiveOn &&
    next.streak === state.streak &&
    sameDays(state.activeDays, activeDays)
  ) {
    return;
  }
  writeReturn({ ...state, lastActiveOn: next.lastActiveOn, streak: next.streak, activeDays });
}

function sitterAlreadyNoted(state: ReturnProgress, conceptId: string): boolean {
  if (state.sitterPending.some((item) => item.conceptId === conceptId)) return true;
  return state.sitterSeen.some((key) => key === conceptId || key.startsWith(`${conceptId}@`));
}

/** Første gang et konsept settes til Sitter med 30 dager. Samme konsept vises ikke igjen. */
function noteSitterMilestone(conceptId: string, term: string): void {
  const state = readReturn();
  if (sitterAlreadyNoted(state, conceptId)) return;
  const at = new Date().toISOString();
  state.sitterPending.push({ conceptId, term, at });
  writeReturn(state);
}

export function streakLabelForToday(): string {
  const state = readReturn();
  return streakLabel(visibleStreak(state.lastActiveOn, state.streak, todayISO()));
}

/** Synlig strek i dag, som en rekke dager. Tom når den er 0. */
export function currentStreak(): { count: number; days: string[]; label: string } {
  const state = readReturn();
  const today = todayISO();
  const count = visibleStreak(state.lastActiveOn, state.streak, today);
  return {
    count,
    days: streakDaysEnding(state.lastActiveOn, state.streak, today),
    label: streakLabel(count),
  };
}

function onCalendarDay(value: string, day: string): boolean {
  return asCalendarDay(value) === day.slice(0, 10);
}

export function hasLessonToday(): boolean {
  const today = todayISO();
  return getActivity().some(
    (entry) => LESSON_HREF.test(entry.href) && onCalendarDay(entry.at, today)
  );
}

export function hasReviewToday(): boolean {
  const today = todayISO();
  return getReviews().some((entry) => onCalendarDay(entry.at, today));
}

/** Dager som skal merkes i måneden på Profil. */
export function listCompletedDays(): string[] {
  const state = readReturn();
  return completedDaySet({
    activeDays: state.activeDays,
    lastActiveOn: state.lastActiveOn,
    streak: state.streak,
    reviews: getReviews(),
    activities: getActivity(),
  });
}

/** Skriver dagene inn i fremdriften, så en avkuttet logg ikke tømmer måneden. */
export function syncCompletedDays(): string[] {
  const state = readReturn();
  const activeDays = listCompletedDays();
  if (!sameDays(state.activeDays, activeDays)) {
    writeReturn({ ...state, activeDays });
  }
  return activeDays;
}

/** Sitter-linjer som ennå ikke er vist. Leser bare. */
export function peekSitterNotices(): SitterNotice[] {
  return readReturn().sitterPending;
}

/** Merk linjene som vist, så samme hendelse ikke kommer tilbake. */
export function ackSitterNotices(notices: { conceptId: string; at: string }[]): void {
  if (notices.length === 0) return;
  const state = readReturn();
  const seen = new Set(state.sitterSeen);
  const ackKeys = new Set(notices.map((item) => sitterEventKey(item.conceptId, item.at)));
  for (const key of ackKeys) seen.add(key);
  state.sitterSeen = [...seen];
  state.sitterPending = state.sitterPending.filter(
    (item) => !ackKeys.has(sitterEventKey(item.conceptId, item.at))
  );
  writeReturn(state);
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
 * Kort intervall første gang, lengre når det sitter.
 * Usikker er alltid neste dag.
 * Første treff (ingen intervall, eller 1 dag): OK 3, Kan det 12, Sitter 30.
 * Deretter ×2 for OK (maks 60) og ×2,5 for Kan det (maks 120).
 * Sitter er minst 30 dager, og dobles videre (maks 180).
 */
export function nextIntervalDays(
  previous: number | undefined,
  grade: RecallGrade
): number {
  if (grade === "Usikker") return 1;
  const current = previous && previous > 0 ? previous : 0;
  if (grade === "OK") {
    if (current <= 1) return 3;
    return Math.min(60, current * 2);
  }
  if (grade === "Kan det") {
    if (current <= 1) return 12;
    return Math.min(120, Math.round(current * 2.5));
  }
  if (current < 30) return 30;
  return Math.min(180, current * 2);
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
  // Nytt objekt uten recall: et vurdert kort skal ikke åpne med forrige forsøk.
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
      href: `/konsept/${id}`,
    });
    noteReturnActivity();
    if (status === "Sitter" && intervalDays === 30) {
      noteSitterMilestone(id, term ?? id);
    }
  }
  return next;
}

/** Legg konsepter i køen. Leksjoner sender onlySrs, slik at ikke alt blir kort. */
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

/**
 * Lagrer eller fjerner gjenkallingen på et konsept som allerede ligger i køen.
 * `null` sletter utkastet. Tom, uavslørt tekst skal ikke ligge igjen som et forsøk.
 */
export function setRecallAttempt(
  id: string,
  attempt: RecallAttempt | null
): void {
  const map = getAllConceptProgress();
  const prev = map[id];
  if (!prev) return;
  if (!attempt || (!attempt.revealed && attempt.text.trim().length === 0)) {
    if (!prev.recall) return;
    const next = { ...prev };
    delete next.recall;
    map[id] = next;
    writeMap(CONCEPT_KEY, map);
    return;
  }
  const text = attempt.revealed ? attempt.text.trim() : attempt.text;
  if (prev.recall?.text === text && prev.recall.revealed === attempt.revealed) return;
  map[id] = { ...prev, recall: { text, revealed: attempt.revealed } };
  writeMap(CONCEPT_KEY, map);
}

/** Konsepter brukeren har møtt, og som forfaller i dag eller tidligere. */
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
  if (wasNew) {
    if (label) logActivity({ label, href: `/lop/${pathId}/${lessonId}` });
    noteReturnActivity();
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
    returnProgress: readReturn(),
  };
}

export function importLearningState(data: LearningBackup | undefined): void {
  if (!data) return;
  if (data.conceptProgress) writeMap(CONCEPT_KEY, data.conceptProgress);
  if (data.pathProgress) writeMap(PATH_KEY, data.pathProgress);
  if (Array.isArray(data.reviews)) writeList(REVIEW_KEY, data.reviews);
  if (Array.isArray(data.activity)) writeList(ACTIVITY_KEY, data.activity);
  if (data.returnProgress && typeof data.returnProgress === "object") {
    writeReturn(normalizeReturn(data.returnProgress));
  }
}

export interface ScheduledConcept {
  id: string;
  dueOn: string;
  intervalDays?: number;
  status: RecallStatus;
}

/** Konsepter i køen, tidligste neste dato først. */
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
    [undefined, "Kan det", 12],
    [undefined, "Sitter", 30],
    [1, "Sitter", 30],
    [12, "Sitter", 30],
    [30, "Sitter", 60],
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

  if (visibleStreak(undefined, 0, "2026-11-19") !== 0) {
    throw new Error("Ingen aktivitet skal gi strek 0");
  }
  if (visibleStreak("2026-11-19", 4, "2026-11-19") !== 4) {
    throw new Error("Strek fra i dag skal vises");
  }
  if (visibleStreak("2026-11-18", 4, "2026-11-19") !== 4) {
    throw new Error("Strek fra i går skal fortsatt vises");
  }
  if (visibleStreak("2026-11-17", 4, "2026-11-19") !== 0) {
    throw new Error("En hoppet dag skal nullstille streken");
  }
  if (visibleStreak("2026-11-30", 3, "2026-12-02") !== 0) {
    throw new Error("En hoppet dag over månedsskifte skal nullstille streken");
  }

  const started = advanceStreak(undefined, 0, "2026-11-19");
  if (started.streak !== 1 || started.lastActiveOn !== "2026-11-19") {
    throw new Error("Første aktive dag skal være 1 dag");
  }
  const again = advanceStreak("2026-11-19", 1, "2026-11-19");
  if (again.streak !== 1) {
    throw new Error("Samme dag skal ikke telle dobbelt");
  }
  const nextDay = advanceStreak("2026-11-19", 1, "2026-11-20");
  if (nextDay.streak !== 2) {
    throw new Error("Dagen etter skal øke streken");
  }
  const missed = advanceStreak("2026-11-18", 5, "2026-11-20");
  if (missed.streak !== 1) {
    throw new Error("Et opphold skal starte streken på nytt");
  }
  const month = advanceStreak("2026-11-30", 3, "2026-12-01");
  if (month.streak !== 4 || month.lastActiveOn !== "2026-12-01") {
    throw new Error("Strek skal fortsette over månedsskifte");
  }
  if (
    streakLabel(0) !== "0 dager på rad" ||
    streakLabel(1) !== "1 dag på rad" ||
    streakLabel(3) !== "3 dager på rad"
  ) {
    throw new Error("Strek-teksten skal være stille og på bokmål, også ved null");
  }
  if (streakDaysEnding(undefined, 0, "2026-11-19").length !== 0) {
    throw new Error("Strek 0 skal ikke ha dager");
  }
  if (streakDaysEnding("2026-11-17", 4, "2026-11-19").join(",") !== "") {
    throw new Error("En brutt strek skal ikke tegnes som flammer");
  }
  const alive = streakDaysEnding("2026-11-19", 3, "2026-11-20");
  if (alive.join(",") !== "2026-11-17,2026-11-18,2026-11-19") {
    throw new Error(`Levende strek ble ${alive.join(", ")}`);
  }
  if (streakDaysEnding("2026-11-19", 1, "2026-11-19").join(",") !== "2026-11-19") {
    throw new Error("Én dag skal være én flamme");
  }
  const openDay = streakWorkLines({
    pathFinished: false,
    pathOpen: true,
    lessonDoneToday: false,
    dueCount: 2,
    reviewedToday: false,
  });
  if (
    openDay[0]?.status !== "gjenstår" ||
    openDay[1]?.status !== "2 konsepter gjenstår" ||
    openDay[1]?.title !== "Repetisjon"
  ) {
    throw new Error("Åpen dag skal si hva som gjenstår");
  }
  const lessonDone = streakWorkLines({
    pathFinished: false,
    pathOpen: true,
    lessonDoneToday: true,
    dueCount: 1,
    reviewedToday: true,
  });
  if (lessonDone[0]?.status !== "ferdig" || lessonDone[1]?.status !== "1 konsept gjenstår") {
    throw new Error("En leksjon i dag gjør løpet ferdig, repetisjon kan fortsatt gjenstå");
  }
  const quiet = streakWorkLines({
    pathFinished: false,
    pathOpen: false,
    lessonDoneToday: false,
    dueCount: 0,
    reviewedToday: false,
  });
  if (quiet[0]?.status !== "ingen i dag" || quiet[1]?.status !== "ingen i dag") {
    throw new Error("Tom dag skal være stille");
  }
  const reviewed = streakWorkLines({
    pathFinished: true,
    pathOpen: false,
    lessonDoneToday: false,
    dueCount: 0,
    reviewedToday: true,
  });
  if (reviewed[0]?.remaining || reviewed[1]?.status !== "ferdig") {
    throw new Error("Ferdig løp og vurdert kø skal ikke stå som gjenstår");
  }

  const tomorrow = nextQueueLabel(
    [{ dueOn: "2026-11-20" }, { dueOn: "2026-11-20" }, { dueOn: "2026-11-20" }],
    "2026-11-19"
  );
  if (tomorrow !== "3 konsepter i morgen") {
    throw new Error(`Neste dato ble «${tomorrow}», ventet «3 konsepter i morgen»`);
  }
  if (nextQueueLabel([{ dueOn: "2026-11-20" }], "2026-11-19") !== "1 konsept i morgen") {
    throw new Error("Ett konsept i morgen skal stå i entall");
  }
  const laterOnly = nextQueueLabel(
    [{ dueOn: "2026-11-20" }, { dueOn: "2026-11-24" }, { dueOn: "2026-11-24" }],
    "2026-11-19"
  );
  if (laterOnly !== "1 konsept i morgen") {
    throw new Error("Bare neste dato skal telles");
  }
  const later = nextQueueLabel(
    [{ dueOn: "2026-11-24" }, { dueOn: "2026-11-24" }],
    "2026-11-19"
  );
  if (later !== "2 konsepter 24. nov.") {
    throw new Error(`Senere dato ble «${later}», ventet «2 konsepter 24. nov.»`);
  }
  if (nextQueueLabel([{ dueOn: "2026-11-19" }, { dueOn: "2026-11-20" }], "2026-11-19") !== null) {
    throw new Error("Neste dato skal skjules når noe forfaller i dag");
  }
  if (nextQueueLabel([{ dueOn: "2026-11-18" }], "2026-11-19") !== null) {
    throw new Error("Neste dato skal skjules når noe har forfalt");
  }
  if (nextQueueLabel([], "2026-11-19") !== null) {
    throw new Error("Tom kø skal ikke ha en neste dato");
  }
  if (idleWaitingLabel([], "2026-11-19") !== "Ingenting venter") {
    throw new Error("Tom kø og tom fremtid skal si Ingenting venter");
  }
  if (
    idleWaitingLabel(
      [{ dueOn: "2026-11-20" }, { dueOn: "2026-11-20" }, { dueOn: "2026-11-20" }],
      "2026-11-19"
    ) !== "3 konsepter i morgen"
  ) {
    throw new Error("Ventelinjen skal si hvor mange konsepter som kommer i morgen");
  }
  const marked = completedDaySet({
    lastActiveOn: "2026-11-19",
    streak: 2,
    reviews: [{ at: "2026-10-03T12:00:00.000Z" }, { at: "2026-11-19T12:00:00.000Z" }],
    activities: [
      { at: "2026-11-02T12:00:00.000Z", href: "/lop/norsk-pengepolitikk/inflasjon" },
      { at: "2026-11-02T12:00:00.000Z", href: "/lop/norsk-pengepolitikk" },
    ],
  });
  if (marked.join(",") !== "2026-10-03,2026-11-02,2026-11-18,2026-11-19") {
    throw new Error(`Fullførte dager ble ${marked.join(", ")}`);
  }
  if (sitterHomeLine("KPI") !== "KPI · Sitter") {
    throw new Error("Sitter-linjen skal være konseptnavnet og ordet Sitter");
  }
}

assertSchedule();
