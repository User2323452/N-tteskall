import { getLessonsForPath, learningPaths } from "@/data/learning";
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
