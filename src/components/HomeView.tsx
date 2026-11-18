"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, PenLine, Shuffle } from "lucide-react";
import { db, ensureSeeded } from "@/lib/db";
import { AreaIcon } from "@/components/AreaIcon";
import { areaAccent } from "@/lib/theme";
import { isPageEmpty, type Area, type CareerGoal, type Group, type Page } from "@/types/mesterplan";
import { useLiveQuery } from "@/lib/useLiveQuery";
import { useRouter } from "next/navigation";

export function HomeView() {
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    void ensureSeeded().then(() => setReady(true));
  }, []);

  const areas = useLiveQuery(() => db.areas.orderBy("order").toArray(), ready);
  const groups = useLiveQuery(() => db.groups.orderBy("order").toArray(), ready);
  const pages = useLiveQuery(() => db.pages.orderBy("order").toArray(), ready);
  const terms = useLiveQuery(() => db.terms.toArray(), ready);
  const goals = useLiveQuery(
    () => db.careerGoals.orderBy("order").toArray(),
    ready
  );

  const groupsByArea = useMemo(() => {
    const map = new Map<string, Group[]>();
    for (const g of groups ?? []) {
      const list = map.get(g.areaId) ?? [];
      list.push(g);
      map.set(g.areaId, list);
    }
    return map;
  }, [groups]);

  const pagesByArea = useMemo(() => {
    const map = new Map<string, Page[]>();
    for (const p of pages ?? []) {
      const list = map.get(p.areaId) ?? [];
      list.push(p);
      map.set(p.areaId, list);
    }
    return map;
  }, [pages]);

  const filledPages = useMemo(
    () => (pages ?? []).filter((p) => !isPageEmpty(p.content)),
    [pages]
  );
  const emptyPages = useMemo(
    () => (pages ?? []).filter((p) => isPageEmpty(p.content)),
    [pages]
  );
  const termCount = terms?.length ?? 0;

  function openRandomEmpty() {
    if (!emptyPages.length) return;
    const pick = emptyPages[Math.floor(Math.random() * emptyPages.length)];
    router.push(`/tema/${pick.id}`);
  }

  function randomTopic() {
    if (!filledPages.length) return;
    const pick = filledPages[Math.floor(Math.random() * filledPages.length)];
    router.push(`/tema/${pick.id}?modus=test`);
  }

  if (!ready || !areas) {
    return (
      <p className="text-sm text-slate-500">Laster MesterPlan…</p>
    );
  }

  const memory = areas.find((a) => a.id === "hukommelse");
  const inbox = areas.find((a) => a.id === "innboks");
  const rest = areas.filter(
    (a) => a.id !== "hukommelse" && a.id !== "innboks"
  );

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 px-5 py-8 shadow-sm backdrop-blur">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-sky-100/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-amber-100/60 blur-2xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Økonomi i et nøtteskall
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-slate-900 sm:text-4xl">
          MesterPlan
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
          Skriv økonomi med egne ord. Repeter begreper. Test hva du husker. Alt
          lagres bare på denne telefonen.
        </p>

        <div className="mt-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            I dag
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/begrepsbanken?okt=1"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-white"
            >
              <BookOpen className="h-4 w-4" />
              Repeter begreper ({termCount})
            </Link>
            {emptyPages.length > 0 && (
              <button
                type="button"
                onClick={openRandomEmpty}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700"
              >
                <PenLine className="h-4 w-4" />
                Skriv på et tomt tema
              </button>
            )}
            {filledPages.length > 0 && (
              <button
                type="button"
                onClick={randomTopic}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm font-medium text-slate-600"
              >
                <Shuffle className="h-4 w-4" />
                Tilfeldig tema å teste
              </button>
            )}
          </div>
        </div>
      </section>

      {memory && (
        <MemoryCard area={memory} goals={goals ?? []} />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {rest.map((area) => (
          <AreaCard
            key={area.id}
            area={area}
            groups={groupsByArea.get(area.id) ?? []}
            pages={pagesByArea.get(area.id) ?? []}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        ))}
      </div>

      {inbox && (
        <AreaCard
          area={inbox}
          groups={groupsByArea.get(inbox.id) ?? []}
          pages={pagesByArea.get(inbox.id) ?? []}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          compact
        />
      )}
    </div>
  );
}

function MemoryCard({
  area,
  goals,
}: {
  area: Area;
  goals: CareerGoal[];
}) {
  const accent = areaAccent[area.id];
  return (
    <section
      className={`rounded-2xl border ${accent.border} ${accent.soft} p-4 shadow-sm`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-lg bg-white/80 p-2 ${accent.text}`}>
          <AreaIcon name={area.icon} />
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
          {area.name}
        </h2>
      </div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Karrieremål
      </p>
      <ul className="mb-4 space-y-1.5">
        {goals.map((g) => (
          <li
            key={g.id}
            className="rounded-lg bg-white/70 px-3 py-2 text-sm text-slate-700"
          >
            {g.text}
          </li>
        ))}
      </ul>
      <Link
        href="/begrepsbanken"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-800 underline-offset-2 hover:underline"
      >
        <AreaIcon name="chart" className="h-4 w-4" />
        Begrepsbanken
      </Link>
    </section>
  );
}

function AreaCard({
  area,
  groups,
  pages,
  collapsed,
  setCollapsed,
  compact,
}: {
  area: Area;
  groups: Group[];
  pages: Page[];
  collapsed: Record<string, boolean>;
  setCollapsed: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  compact?: boolean;
}) {
  const accent = areaAccent[area.id];
  const ungrouped = pages
    .filter((p) => !p.groupId)
    .sort((a, b) => a.order - b.order);

  return (
    <section
      className={`rounded-2xl border ${accent.border} ${accent.soft} p-4 shadow-sm ${compact ? "md:col-span-2" : ""}`}
    >
      <div className="mb-1 flex items-start gap-2">
        <span className={`mt-0.5 rounded-lg bg-white/80 p-2 ${accent.text}`}>
          <AreaIcon name={area.icon} />
        </span>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg text-slate-900">
            {area.name}
          </h2>
          {area.subtitle && (
            <p className="text-xs leading-relaxed text-slate-500">
              {area.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {groups.map((g) => {
          const gPages = pages
            .filter((p) => p.groupId === g.id)
            .sort((a, b) => a.order - b.order);
          const isCollapsed =
            collapsed[g.id] ?? g.collapsedByDefault ?? false;
          return (
            <div key={g.id}>
              <button
                type="button"
                className="mb-1 flex w-full items-center gap-1 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                onClick={() =>
                  setCollapsed((c) => ({ ...c, [g.id]: !isCollapsed }))
                }
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition ${isCollapsed ? "-rotate-90" : ""}`}
                />
                {g.name}
              </button>
              {!isCollapsed && (
                <ul className="space-y-1">
                  {gPages.map((p) => (
                    <PageRow key={p.id} page={p} />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {ungrouped.length > 0 && (
          <ul className="space-y-1">
            {ungrouped.map((p) => (
              <PageRow key={p.id} page={p} />
            ))}
          </ul>
        )}
        {pages.length === 0 && (
          <p className="rounded-lg bg-white/60 px-3 py-2 text-sm text-slate-500">
            Ingen sider her ennå. Trykk + Idé for å fange noe fort.
          </p>
        )}
      </div>
    </section>
  );
}

function PageRow({ page }: { page: Page }) {
  const empty = isPageEmpty(page.content);
  return (
    <li>
      <Link
        href={`/tema/${page.id}`}
        className="flex items-center justify-between gap-2 rounded-lg bg-white/75 px-3 py-2 text-sm text-slate-800 transition hover:bg-white"
      >
        <span className="flex items-center gap-2 truncate">
          {page.icon && <AreaIcon name={page.icon} className="h-3.5 w-3.5 opacity-70" />}
          <span className="truncate">{page.title}</span>
        </span>
        {empty && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
            Ikke skrevet ennå
          </span>
        )}
      </Link>
    </li>
  );
}
