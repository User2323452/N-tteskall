"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { StreakFlame } from "@/components/StreakFlame";
import type { Lesson } from "@/types/learning";

const ROW = 124;
const NODE = 48;
const CHECK_MS = 160;
const CURVE = "cubic-bezier(0.22, 1, 0.36, 1)";

type FigureKind =
  | "coins"
  | "rate"
  | "glass"
  | "growth"
  | "house"
  | "layers"
  | "drop"
  | "bars"
  | "bolt"
  | "exchange";

/** Small side figures. Most lessons stay bare so the path stays quiet. */
const figureForLesson: Record<string, FigureKind> = {
  "pp-1": "coins",
  "pp-3": "rate",
  "sk-1": "glass",
  "ps-1": "growth",
  "ps-5": "house",
  "bo-2": "house",
  "pe-4": "layers",
  "of-1": "drop",
  "ar-2": "bars",
  "st-1": "bolt",
  "kk-1": "exchange",
};

const pen = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function SideFigure({ kind }: { kind: FigureKind }) {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
      {kind === "glass" && (
        <>
          <path d="M16 9h16l-2.2 27a6 6 0 0 1-5.8 5h0a6 6 0 0 1-5.8-5Z" {...pen} />
          <path d="M17.2 18h13.6M17.8 26h12.4M18.4 34h11.2" {...pen} />
        </>
      )}
      {kind === "rate" && (
        <>
          <path d="M8 38h32M12 36V12" {...pen} />
          <path d="M14 30c6-1 8-12 12-13s6 3 12-7" {...pen} />
        </>
      )}
      {kind === "growth" && (
        <>
          <path d="M8 38h32M12 36V14" {...pen} />
          <path d="M14 32c8 0 10-2 14-8s6-8 12-14" {...pen} />
        </>
      )}
      {kind === "coins" && (
        <>
          <circle cx="24" cy="24" r="12" {...pen} />
          <text
            x="24"
            y="28"
            textAnchor="middle"
            fontSize="11"
            fill="currentColor"
            stroke="none"
          >
            kr
          </text>
        </>
      )}
      {kind === "house" && (
        <>
          <path d="M8 22 24 8l16 14" {...pen} />
          <path d="M13 20.5V38h22V20.5" {...pen} />
          <path d="M21 38V28h6v10" {...pen} />
        </>
      )}
      {kind === "layers" && (
        <>
          <rect x="8" y="32" width="32" height="6" rx="2" {...pen} />
          <rect x="13" y="21" width="22" height="6" rx="2" {...pen} />
          <rect x="18" y="10" width="12" height="6" rx="2" {...pen} />
        </>
      )}
      {kind === "drop" && (
        <path
          d="M24 7c6 8 12 14 12 22a12 12 0 0 1-24 0c0-8 6-14 12-22Z"
          {...pen}
        />
      )}
      {kind === "bars" && (
        <>
          <path d="M10 38h28" {...pen} />
          <rect x="14" y="20" width="7" height="18" rx="1.5" {...pen} />
          <rect x="27" y="12" width="7" height="26" rx="1.5" {...pen} />
        </>
      )}
      {kind === "bolt" && <path d="M26 6 16 26h8l-3 16 14-22h-8Z" {...pen} />}
      {kind === "exchange" && (
        <>
          <path d="M12 18h22M30 13l5 5-5 5" {...pen} />
          <path d="M36 30H14M18 25l-5 5 5 5" {...pen} />
        </>
      )}
    </svg>
  );
}

const FIG = 40;
const GAP = 10;
const EDGE = 6;

function sway(width: number) {
  const gutter = FIG + GAP + NODE / 2 + EDGE;
  const maxAmp = Math.max(28, width / 2 - gutter);
  return Math.min(width * 0.18, 68, maxAmp);
}

function xAt(index: number, width: number) {
  const swung = -Math.cos((index * Math.PI) / 2);
  return width / 2 + swung * sway(width);
}

function figureSide(index: number, width: number): "left" | "right" {
  const here = xAt(index, width);
  const mid = width / 2;
  if (here < mid - 12) return "left";
  if (here > mid + 12) return "right";
  const neighbor = index > 0 ? index - 1 : index + 1;
  return xAt(neighbor, width) >= mid ? "left" : "right";
}

function figureLeft(index: number, width: number) {
  const center = xAt(index, width);
  if (figureSide(index, width) === "left") {
    return Math.max(EDGE, center - NODE / 2 - GAP - FIG);
  }
  return Math.min(width - FIG - EDGE, center + NODE / 2 + GAP);
}

function figureFits(index: number, width: number) {
  const left = figureLeft(index, width);
  const center = xAt(index, width);
  const nodeLeft = center - NODE / 2;
  const nodeRight = center + NODE / 2;
  if (left < EDGE || left + FIG > width - EDGE) return false;
  if (left + FIG + 8 <= nodeLeft) return true;
  if (left >= nodeRight + 8) return true;
  return false;
}

function titleBox(index: number, width: number, hasFigure: boolean) {
  const center = xAt(index, width);
  const onRight = hasFigure
    ? figureSide(index, width) === "left"
    : xAt(index, width) <= width / 2;
  if (onRight) {
    const left = center + NODE / 2 + GAP;
    const room = Math.max(0, Math.floor(width - left - EDGE));
    return {
      left,
      width: Math.min(176, room),
      align: "left" as const,
    };
  }
  const room = Math.max(0, Math.floor(center - NODE / 2 - GAP - EDGE));
  const box = Math.min(176, room);
  return {
    left: center - NODE / 2 - GAP - box,
    width: box,
    align: "right" as const,
  };
}

function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const pull = (b.y - a.y) * 0.62;
  return `C ${a.x.toFixed(1)} ${(a.y + pull).toFixed(1)}, ${b.x.toFixed(1)} ${(b.y - pull).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

function LessonMark({ drawing, completed }: { drawing: boolean; completed: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    if (!drawing) {
      el.style.transition = "none";
      el.style.strokeDashoffset = "0";
      return;
    }
    el.style.transition = "none";
    el.style.strokeDashoffset = "24";
    void el.getBoundingClientRect();
    el.style.transition = `stroke-dashoffset ${CHECK_MS}ms linear`;
    el.style.strokeDashoffset = "0";
  }, [drawing]);

  if (!completed && !drawing) return null;

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        ref={pathRef}
        d="M5 12.5 L10 17.5 L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="24"
        style={{ strokeDashoffset: drawing ? 24 : 0 }}
      />
    </svg>
  );
}

export function clearLessonLinks() {
  document.querySelectorAll<SVGPathElement>("[data-lesson-stroke]").forEach((el) => {
    el.style.transition = "none";
    el.style.opacity = "0";
  });
}

export function drawLessonLink(fromId: string, toId: string, ms: number) {
  const line = document.getElementById(`lesson-link-${fromId}-${toId}`);
  if (!(line instanceof SVGPathElement)) return false;
  const len = line.getTotalLength();
  if (len <= 0) return false;
  line.style.transition = "none";
  line.style.opacity = "1";
  line.style.strokeDasharray = `${len}`;
  line.style.strokeDashoffset = `${len}`;
  void line.getBoundingClientRect();
  line.style.transition = `stroke-dashoffset ${ms}ms ${CURVE}`;
  line.style.strokeDashoffset = "0";
  return true;
}

export function PathSnake({
  pathId,
  lessons,
  done,
  nextId,
  drawingId,
  receipt = null,
}: {
  pathId: string;
  lessons: Lesson[];
  done: Set<string>;
  nextId: string | null;
  drawingId: string | null;
  receipt?: { lessonId: string; conceptsAdded: number; madeDay: boolean } | null;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const height = lessons.length * ROW;
  const points =
    width > 0
      ? lessons.map((_, index) => ({
          x: xAt(index, width),
          y: index * ROW + ROW / 2,
        }))
      : [];
  const spine =
    points.length > 1
      ? `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} ${points
          .slice(1)
          .map((point, index) => curve(points[index], point))
          .join(" ")}`
      : "";

  return (
    <ol
      ref={listRef}
      aria-label="Leksjoner"
      className="relative mt-8"
      style={{ height }}
    >
      {width > 0 && points.length > 1 && (
        <svg
          aria-hidden
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="absolute left-0 top-0 overflow-visible"
        >
          <path d={spine} fill="none" stroke="#c5ced6" strokeWidth="1.5" strokeLinecap="round" />
          {points.slice(1).map((point, index) => (
            <path
              key={lessons[index + 1].id}
              id={`lesson-link-${lessons[index].id}-${lessons[index + 1].id}`}
              data-lesson-stroke=""
              d={`M ${points[index].x.toFixed(1)} ${points[index].y.toFixed(1)} ${curve(points[index], point)}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: 0 }}
            />
          ))}
        </svg>
      )}

      {width > 0 &&
        lessons.map((lesson, index) => {
          const completed = done.has(lesson.id);
          const drawing = drawingId === lesson.id;
          const lit = lesson.id === nextId;
          const kind = figureForLesson[lesson.id];
          const showFigure = Boolean(kind && figureFits(index, width));
          const center = xAt(index, width);
          const title = titleBox(index, width, showFigure);
          const state = lit ? "lit" : completed || drawing ? "done" : "later";
          const label = `${lit ? "Nå. " : completed ? "Ferdig. " : ""}Leksjon ${index + 1}. ${lesson.title}`;

          return (
            <li
              key={lesson.id}
              id={`lesson-row-${lesson.id}`}
              className="absolute inset-x-0"
              style={{ top: index * ROW, height: ROW }}
            >
              {showFigure && kind && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute text-slate-400"
                  style={{ left: figureLeft(index, width), top: ROW / 2 - 20 }}
                >
                  <SideFigure kind={kind} />
                </span>
              )}
              <Link
                href={`/lop/${pathId}/${lesson.id}`}
                aria-label={label}
                aria-current={lit ? "step" : undefined}
                className="group absolute inset-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <span
                  id={`lesson-mark-${lesson.id}`}
                  className={`absolute grid h-12 w-12 place-items-center rounded-full border-2 bg-white ${
                    state === "lit"
                      ? "border-[var(--accent)] text-[var(--accent)] shadow-[0_0_0_5px_var(--accent-soft)]"
                      : state === "done"
                        ? "border-slate-200 text-[var(--accent)] group-hover:border-slate-300"
                        : "border-slate-200 text-slate-400 group-hover:border-slate-300"
                  }`}
                  style={{
                    left: center,
                    top: ROW / 2,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {state === "done" ? (
                    <LessonMark completed drawing={drawing} />
                  ) : (
                    <span className="text-sm font-medium tabular-nums">{index + 1}</span>
                  )}
                </span>
                <span
                  className={`absolute top-1/2 z-10 -translate-y-1/2 bg-[var(--background)] px-1 text-[13px] leading-snug ${
                    title.align === "right" ? "text-right" : "text-left"
                  } ${
                    state === "lit"
                      ? "font-medium text-slate-900"
                      : state === "done"
                        ? "text-slate-600"
                        : "text-slate-500"
                  }`}
                  style={{ left: title.left, width: title.width }}
                >
                  {lit && (
                    <span className="mb-0.5 block text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)]">
                      Nå
                    </span>
                  )}
                  {lesson.title}
                </span>
              </Link>
              {receipt?.lessonId === lesson.id && (receipt.conceptsAdded > 0 || receipt.madeDay) && (
                <p className="pointer-events-none absolute left-1/2 top-[calc(50%+1.7rem)] w-44 -translate-x-1/2 text-center text-[11px] leading-snug text-[var(--muted)]">
                  {receipt.conceptsAdded > 0 && (
                    <span className="block">
                      {receipt.conceptsAdded === 1
                        ? "1 konsept lagt i Repeter"
                        : `${receipt.conceptsAdded} konsepter lagt i Repeter`}
                    </span>
                  )}
                  {receipt.madeDay && (
                    <span className="mt-0.5 inline-flex items-center justify-center gap-1 text-[var(--ink)]">
                      <StreakFlame className="h-3.5 w-3.5" />
                      1 dag på rad
                    </span>
                  )}
                </p>
              )}
            </li>
          );
        })}
    </ol>
  );
}
