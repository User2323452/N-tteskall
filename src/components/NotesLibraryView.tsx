"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { db, ensureSeeded } from "@/lib/db";
import { AreaIcon } from "@/components/AreaIcon";
import { areaAccent } from "@/lib/theme";
import { isPageEmpty, type Area, type Group, type Page } from "@/types/mesterplan";
import { useLiveQuery } from "@/lib/useLiveQuery";

/** Demoted personal notes map — not the primary learning experience. */
export function NotesLibraryView() {
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void ensureSeeded().then(() => setReady(true));
  }, []);

  const areas = useLiveQuery(() => db.areas.orderBy("order").toArray(), ready);
  const groups = useLiveQuery(() => db.groups.orderBy("order").toArray(), ready);
  const pages = useLiveQuery(() => db.pages.orderBy("order").toArray(), ready);

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

  if (!ready || !areas) {
    return <p className="text-sm text-slate-500">Laster notater…</p>;
  }

  const rest = areas.filter((a) => a.id !== "hukommelse");

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Til læringsplattformen
      </Link>

      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Mine notater
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
          Valgfritt bibliotek for egne sider. Læring skjer via{" "}
          <Link href="/" className="font-medium text-slate-800 underline-offset-2 hover:underline">
            læringsløp og konsepter
          </Link>
          — du trenger ikke fylle tomme sider først.
        </p>
      </header>

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
    </div>
  );
}

function AreaCard({
  area,
  groups,
  pages,
  collapsed,
  setCollapsed,
}: {
  area: Area;
  groups: Group[];
  pages: Page[];
  collapsed: Record<string, boolean>;
  setCollapsed: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const accent = areaAccent[area.id];
  const ungrouped = pages
    .filter((p) => !p.groupId)
    .sort((a, b) => a.order - b.order);

  return (
    <section
      className={`rounded-2xl border ${accent.border} ${accent.soft} p-4`}
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
            Ingen sider her ennå.
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
        <span className="truncate">{page.title}</span>
        {empty && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
            Ikke skrevet ennå
          </span>
        )}
      </Link>
    </li>
  );
}
