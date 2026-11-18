export type AreaId =
  | "hukommelse"
  | "makro"
  | "marked"
  | "bank"
  | "personlig"
  | "metode"
  | "innboks";

export type TermAreaId = Exclude<AreaId, "hukommelse" | "innboks">;

export type TermStatus = "Ny" | "Usikker" | "Kan det";

export interface Area {
  id: AreaId;
  name: string;
  icon: string;
  color: string;
  subtitle?: string;
  order: number;
}

export interface Group {
  id: string;
  areaId: AreaId;
  name: string;
  order: number;
  collapsedByDefault: boolean;
}

export interface Page {
  id: string;
  areaId: AreaId;
  groupId?: string;
  title: string;
  icon?: string;
  content: unknown;
  notes?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  notionUrl?: string;
}

export interface Blurt {
  id: string;
  pageId: string;
  text: string;
  createdAt: string;
}

export interface Term {
  id: string;
  term: string;
  english?: string;
  explanation?: string;
  areaId: TermAreaId;
  status: TermStatus;
  lastReviewed?: string;
}

export interface CareerGoal {
  id: string;
  text: string;
  order: number;
}

export interface Meta {
  id: string;
  seededAt: string;
  version: number;
}

export interface ExportPayload {
  version: number;
  exportedAt: string;
  areas: Area[];
  groups: Group[];
  pages: Page[];
  blurts: Blurt[];
  terms: Term[];
  careerGoals: CareerGoal[];
}

export const EMPTY_DOC = {
  type: "doc",
  content: [{ type: "paragraph" }],
} as const;

export function isPageEmpty(content: unknown): boolean {
  if (!content || typeof content !== "object") return true;
  const doc = content as { type?: string; content?: unknown[] };
  if (!doc.content || doc.content.length === 0) return true;
  if (doc.content.length === 1) {
    const first = doc.content[0] as {
      type?: string;
      content?: unknown[];
      text?: string;
    };
    if (first.type === "paragraph" && (!first.content || first.content.length === 0)) {
      return true;
    }
  }
  const text = JSON.stringify(content);
  // Strip structural keys and whitespace
  const stripped = text
    .replace(/"type":"[^"]*"/g, "")
    .replace(/"attrs":\{[^}]*\}/g, "")
    .replace(/[{}\[\]",:]/g, "")
    .replace(/content|text|paragraph|doc/g, "")
    .trim();
  return stripped.length === 0;
}
