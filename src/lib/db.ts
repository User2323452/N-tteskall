"use client";

import Dexie, { type Table } from "dexie";
import {
  seedAreas,
  seedCareerGoals,
  seedGroups,
  seedPages,
  seedTerms,
} from "@/data/seed";
import type {
  Area,
  Blurt,
  CareerGoal,
  ExportPayload,
  Group,
  Meta,
  Page,
  Term,
} from "@/types/mesterplan";

export class MesterPlanDB extends Dexie {
  areas!: Table<Area, string>;
  groups!: Table<Group, string>;
  pages!: Table<Page, string>;
  blurts!: Table<Blurt, string>;
  terms!: Table<Term, string>;
  careerGoals!: Table<CareerGoal, string>;
  meta!: Table<Meta, string>;

  constructor() {
    super("mesterplan");
    this.version(1).stores({
      areas: "id, order",
      groups: "id, areaId, order",
      pages: "id, areaId, groupId, order, updatedAt",
      blurts: "id, pageId, createdAt",
      terms: "id, areaId, status, term",
      careerGoals: "id, order",
      meta: "id",
    });
  }
}

export const db = new MesterPlanDB();

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const existing = await db.meta.get("seed");
      if (existing) return;

      await db.transaction(
        "rw",
        [
          db.areas,
          db.groups,
          db.pages,
          db.terms,
          db.careerGoals,
          db.meta,
        ],
        async () => {
          const again = await db.meta.get("seed");
          if (again) return;
          await db.areas.bulkPut(seedAreas);
          await db.groups.bulkPut(seedGroups);
          await db.pages.bulkPut(seedPages);
          await db.terms.bulkPut(seedTerms);
          await db.careerGoals.bulkPut(seedCareerGoals);
          await db.meta.put({
            id: "seed",
            seededAt: new Date().toISOString(),
            version: 1,
          });
        }
      );
    })();
  }
  return seedPromise;
}

export async function exportAll(): Promise<ExportPayload> {
  await ensureSeeded();
  const [areas, groups, pages, blurts, terms, careerGoals] = await Promise.all([
    db.areas.toArray(),
    db.groups.toArray(),
    db.pages.toArray(),
    db.blurts.toArray(),
    db.terms.toArray(),
    db.careerGoals.toArray(),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    areas,
    groups,
    pages,
    blurts,
    terms,
    careerGoals,
  };
}

export async function importAll(payload: ExportPayload): Promise<void> {
  await db.transaction(
    "rw",
    [
      db.areas,
      db.groups,
      db.pages,
      db.blurts,
      db.terms,
      db.careerGoals,
      db.meta,
    ],
    async () => {
      await Promise.all([
        db.areas.clear(),
        db.groups.clear(),
        db.pages.clear(),
        db.blurts.clear(),
        db.terms.clear(),
        db.careerGoals.clear(),
      ]);
      await db.areas.bulkPut(payload.areas ?? []);
      await db.groups.bulkPut(payload.groups ?? []);
      await db.pages.bulkPut(payload.pages ?? []);
      await db.blurts.bulkPut(payload.blurts ?? []);
      await db.terms.bulkPut(payload.terms ?? []);
      await db.careerGoals.bulkPut(payload.careerGoals ?? []);
      await db.meta.put({
        id: "seed",
        seededAt: new Date().toISOString(),
        version: payload.version ?? 1,
      });
    }
  );
}
