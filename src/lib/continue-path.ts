import { getLessonsForPath, learningPaths } from "@/data/learning";
import type { LearningPath, Lesson } from "@/types/learning";
import { getAllPathProgress, nextLessonId } from "@/lib/progress";

export type ContinueTarget = {
  pathId: string;
  pathTitle: string;
  pathSubtitle: string;
  lessonId: string;
  lessonTitle: string;
  started: boolean;
  index: number;
  total: number;
  done: number;
  finishedAll: boolean;
};

/** Løpet du holder på med, ellers det første som ikke er ferdig. */
export function pickContinueTarget(): ContinueTarget | null {
  if (learningPaths.length === 0) return null;
  const progress = getAllPathProgress();
  const open: (ContinueTarget & { startedAt: string })[] = [];

  for (const path of learningPaths) {
    const prog = progress[path.id];
    const lessons = getLessonsForPath(path.id);
    const next = nextLessonId(path.lessonIds, prog?.completedLessonIds ?? []);
    if (!next) continue;
    const done = prog?.completedLessonIds.length ?? 0;
    const started = Boolean(prog?.startedAt) || done > 0;
    const found = lessons.findIndex((lesson) => lesson.id === next);
    const index = found >= 0 ? found : 0;
    open.push({
      pathId: path.id,
      pathTitle: path.title,
      pathSubtitle: path.subtitle,
      lessonId: next,
      lessonTitle: lessons[index]?.title ?? "Neste leksjon",
      started,
      index: index + 1,
      total: lessons.length,
      done,
      finishedAll: false,
      startedAt: prog?.startedAt ?? "",
    });
  }

  const inProgress = open
    .filter((item) => item.started)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const chosen = inProgress[0] ?? open[0];
  if (chosen) {
    return {
      pathId: chosen.pathId,
      pathTitle: chosen.pathTitle,
      pathSubtitle: chosen.pathSubtitle,
      lessonId: chosen.lessonId,
      lessonTitle: chosen.lessonTitle,
      started: chosen.started,
      index: chosen.index,
      total: chosen.total,
      done: chosen.done,
      finishedAll: false,
    };
  }

  const first = learningPaths[0];
  const lessons = getLessonsForPath(first.id);
  const last = lessons[lessons.length - 1];
  return {
    pathId: first.id,
    pathTitle: first.title,
    pathSubtitle: first.subtitle,
    lessonId: last?.id ?? first.lessonIds[0],
    lessonTitle: last?.title ?? first.title,
    started: true,
    index: lessons.length,
    total: lessons.length,
    done: lessons.length,
    finishedAll: true,
  };
}

export type TodaysPath = {
  pathId: string;
  pathTitle: string;
  pathSubtitle: string;
  index: number;
  total: number;
  done: number;
  /** Hele løpet er gjort. Vises avhuket, ikke som en ny start. */
  finished: boolean;
};

type PathRow = {
  path: LearningPath;
  lessons: Lesson[];
  doneIds: string[];
  startedAt: string;
  completedAt: string;
  complete: boolean;
};

function localDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dayOf(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return localDay(date);
}

function toTodaysPath(row: PathRow, finished: boolean): TodaysPath {
  const { path, lessons, doneIds } = row;
  const total = lessons.length;
  const done = path.lessonIds.filter((id) => doneIds.includes(id)).length;
  const next = nextLessonId(path.lessonIds, doneIds);
  const found = next ? lessons.findIndex((lesson) => lesson.id === next) : -1;
  return {
    pathId: path.id,
    pathTitle: path.title,
    pathSubtitle: path.subtitle,
    index: found >= 0 ? found + 1 : total,
    total,
    done: finished ? total : done,
    finished,
  };
}

/**
 * Løpet hjem skal vise i dag.
 * Et påbegynt løp går foran. Er dagens løp ferdig, blir det stående
 * avhuket ut dagen, i stedet for at neste løp blir en ny start.
 */
export function pickTodaysPath(): TodaysPath | null {
  if (learningPaths.length === 0) return null;
  const progress = getAllPathProgress();
  const rows: PathRow[] = learningPaths.map((path) => {
    const prog = progress[path.id];
    const doneIds = prog?.completedLessonIds ?? [];
    const done = new Set(doneIds);
    const complete =
      path.lessonIds.length > 0 &&
      (Boolean(prog?.completedAt) || path.lessonIds.every((id) => done.has(id)));
    return {
      path,
      lessons: getLessonsForPath(path.id),
      doneIds,
      startedAt: prog?.startedAt ?? "",
      completedAt: prog?.completedAt ?? "",
      complete,
    };
  });

  const active = rows
    .filter((row) => !row.complete && (row.startedAt || row.doneIds.length > 0))
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  if (active[0]) return toTodaysPath(active[0], false);

  const today = localDay(new Date());
  const finishedToday = rows
    .filter((row) => row.complete && dayOf(row.completedAt) === today)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  if (finishedToday[0]) return toTodaysPath(finishedToday[0], true);

  const nextOpen = rows.find((row) => !row.complete);
  if (nextOpen) return toTodaysPath(nextOpen, false);

  const lastDone = [...rows].sort((a, b) =>
    b.completedAt.localeCompare(a.completedAt)
  )[0];
  return lastDone ? toTodaysPath(lastDone, true) : null;
}
