"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  categoryLabel,
  getLessonsForPath,
  getPath,
} from "@/data/learning";
import { getPathProgress, nextLessonId } from "@/lib/progress";
import {
  LessonMotionContext,
  type LessonAdvance,
} from "@/components/lesson-motion";
import { BackLink, useNav } from "@/components/nav-memory";
import { clearLessonLinks, drawLessonLink, PathSnake } from "@/components/PathSnake";

const SHEET_DOWN_MS = 200;
const CHECK_MS = 160;
const STROKE_MS = 340;
const SCROLL_MS = 400;
const REST_MS = 300;
const SHEET_UP_MS = 240;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type Sheet = { y: "open" | "down"; ms: number };

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function lessonIdFromPath(pathname: string, pathId: string) {
  const prefix = `/lop/${pathId}/`;
  if (!pathname.startsWith(prefix)) return null;
  const id = pathname.slice(prefix.length).split("/")[0];
  return id || null;
}

export function PathView({
  pathId,
  children,
}: {
  pathId: string;
  children?: ReactNode;
}) {
  const router = useRouter();
  const nav = useNav();
  const pathname = usePathname() ?? "";
  const lessonId = lessonIdFromPath(pathname, pathId);
  const path = getPath(pathId);
  const lessons = getLessonsForPath(pathId);
  const [tick, setTick] = useState(0);
  const [sheet, setSheet] = useState<Sheet>({ y: "down", ms: 0 });
  const [drawingId, setDrawingId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const gen = useRef(0);
  const pendingUp = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    return () => {
      gen.current += 1;
    };
  }, [lessonId]);

  useEffect(() => {
    if (!lessonId) {
      setSheet({ y: "down", ms: 0 });
      return;
    }
    const rising = pendingUp.current;
    if (prefersReducedMotion()) {
      pendingUp.current = false;
      setSheet({ y: "open", ms: 0 });
      return;
    }
    if (rising) {
      pendingUp.current = false;
      setSheet({ y: "down", ms: 0 });
      let fired = false;
      const id = window.setTimeout(() => {
        fired = true;
        setSheet({ y: "open", ms: SHEET_UP_MS });
      }, 32);
      return () => {
        window.clearTimeout(id);
        if (!fired) pendingUp.current = true;
      };
    }
    setSheet((current) =>
      current.y === "open" ? current : { y: "down", ms: 0 }
    );
    const id = window.setTimeout(() => {
      setSheet((current) =>
        current.y === "open" ? current : { y: "open", ms: SHEET_UP_MS }
      );
    }, 32);
    return () => window.clearTimeout(id);
  }, [lessonId]);

  useEffect(() => {
    if (sheet.y !== "open") return;
    const id = window.setTimeout(() => {
      clearLessonLinks();
      const flow = flowRef.current;
      if (flow) {
        flow.style.transition = "none";
        flow.style.transform = "";
      }
    }, sheet.ms);
    return () => window.clearTimeout(id);
  }, [sheet.y, sheet.ms]);

  useEffect(() => {
    if (!lessonId || sheet.y !== "open") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [lessonId, sheet.y]);

  const progress = useMemo(() => {
    if (!ready) return { completedLessonIds: [] as string[] };
    void tick;
    return getPathProgress(pathId);
  }, [pathId, tick, ready]);
  const done = new Set(progress.completedLessonIds);
  const next = nextLessonId(path?.lessonIds ?? [], progress.completedLessonIds);

  const scrollRowUnderHeader = useCallback(async (id: string) => {
    const row = document.getElementById(`lesson-row-${id}`);
    const header = headerRef.current;
    const flow = flowRef.current;
    if (!row || !header || !flow) return wait(SCROLL_MS);
    const delta =
      row.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
    flow.style.transition = "none";
    void flow.offsetHeight;
    flow.style.transition = `transform ${SCROLL_MS}ms ${EASE}`;
    flow.style.transform = `translateY(${-delta}px)`;
    return wait(SCROLL_MS);
  }, []);

  const goAfterLesson = useCallback(
    (href: string) => {
      const pathHref = `/lop/${pathId}`;
      if (!nav) {
        router.push(href);
        return;
      }
      if (href === pathHref && nav.backTarget(pathHref) === pathHref) {
        nav.back(pathHref);
        return;
      }
      nav.replace(href);
    },
    [nav, pathId, router]
  );

  const run = useCallback(
    async (advance: LessonAdvance) => {
      const token = ++gen.current;
      const alive = () => gen.current === token;
      if (prefersReducedMotion()) {
        advance.commit();
        setTick((n) => n + 1);
        goAfterLesson(advance.href);
        return;
      }
      setSheet({ y: "down", ms: SHEET_DOWN_MS });
      await wait(SHEET_DOWN_MS);
      if (!alive()) return;
      advance.commit();
      setTick((n) => n + 1);
      setDrawingId(advance.fromId);
      await wait(CHECK_MS);
      if (!alive()) return;
      setDrawingId(null);
      if (advance.toId) {
        if (drawLessonLink(advance.fromId, advance.toId, STROKE_MS)) {
          await wait(STROKE_MS);
          if (!alive()) return;
        }
        await scrollRowUnderHeader(advance.toId);
        if (!alive()) return;
        await wait(REST_MS);
        if (!alive()) return;
      }
      pendingUp.current = advance.toId !== null;
      goAfterLesson(advance.href);
    },
    [goAfterLesson, scrollRowUnderHeader]
  );

  const close = useCallback(() => {
    gen.current += 1;
    clearLessonLinks();
    setDrawingId(null);
    if (flowRef.current) {
      flowRef.current.style.transition = "none";
      flowRef.current.style.transform = "";
    }
    const pathHref = `/lop/${pathId}`;
    if (!lessonId || prefersReducedMotion()) {
      goAfterLesson(pathHref);
      return;
    }
    setSheet({ y: "down", ms: SHEET_DOWN_MS });
    window.setTimeout(() => {
      goAfterLesson(pathHref);
    }, SHEET_DOWN_MS);
  }, [goAfterLesson, lessonId, pathId]);

  const motion = useMemo(() => ({ run, close }), [run, close]);

  if (!path) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">Fant ikke læringsløpet.</p>
        <Link href="/lop" className="text-sm font-medium text-slate-900 underline">
          Tilbake til løp
        </Link>
      </div>
    );
  }

  const total = lessons.length;
  const fraction = total ? done.size / total : 0;

  return (
    <LessonMotionContext.Provider value={motion}>
      <div className="mx-auto max-w-2xl">
        <div className="sticky top-0 z-10 -mx-5 bg-[var(--background)] px-5">
          <BackLink fallback="/lop" />
        </div>
        <header ref={headerRef} className="pb-3 pt-1">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-slate-900 sm:text-4xl">
            {path.title}
          </h1>
          <div
            className="mt-3 h-0.5 overflow-hidden rounded-full bg-slate-100"
            aria-hidden
          >
            <div
              className="h-full bg-[var(--accent)] motion-reduce:transition-none"
              style={{ width: `${fraction * 100}%` }}
            />
          </div>
        </header>

        <div className="overflow-hidden">
        <div ref={flowRef} id="lesson-flow" className="relative z-0">
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {categoryLabel[path.category]} · ca. {path.estimatedMinutes} min
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {path.subtitle}
        </p>
        {!next && done.size > 0 && (
          <p className="mt-5 text-sm font-medium text-emerald-700">
            Du har fullført dette læringsløpet. Repeter begrepene for å feste dem.
          </p>
        )}

        <PathSnake
          pathId={path.id}
          lessons={lessons}
          done={done}
          nextId={next}
          drawingId={drawingId}
        />
        </div>
        </div>
      </div>

      {lessonId && (
        <div
          id="lesson-sheet"
          className="fixed inset-x-0 bottom-0 z-20 overflow-y-auto overscroll-contain bg-[var(--background)]"
          style={{
            top: "var(--app-header)",
            bottom: "var(--pill-offset)",
            transform: sheet.y === "open" ? "translateY(0)" : "translateY(100%)",
            transition: sheet.ms ? `transform ${sheet.ms}ms ${EASE}` : "none",
            pointerEvents: sheet.y === "open" ? "auto" : "none",
          }}
        >
          <div className="mx-auto max-w-xl px-5 pt-4 pb-10">{children}</div>
        </div>
      )}
    </LessonMotionContext.Provider>
  );
}
