import { getOrd } from "@/data/ordliste";
import { formatSatsInline, getSats } from "@/data/satser";

export type MarkupPart =
  | { type: "text"; text: string }
  | { type: "ord"; id: string; label: string }
  | { type: "sats"; id: string; text: string };

const TOKEN = /\[\[([^\]|]+)(?:\|([^\]]*))?\]\]|\{\{sats:([^}]+)\}\}/g;

/** Synlig tekst uten [[id]] og {{sats:id}}. Brukes i søk og flate lister. */
export function stripMarkup(text: string): string {
  return text.replace(TOKEN, (_match, ordId: string, custom: string | undefined, satsId: string | undefined) => {
    if (satsId) {
      try {
        return formatSatsInline(satsId.trim());
      } catch {
        return satsId;
      }
    }
    const id = ordId.trim();
    if (custom !== undefined && custom.length > 0) return custom;
    return getOrd(id)?.term ?? id;
  });
}

export function parseMarkup(text: string): MarkupPart[] {
  const parts: MarkupPart[] = [];
  const re = new RegExp(TOKEN.source, "g");
  let cursor = 0;
  for (const match of text.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > cursor) parts.push({ type: "text", text: text.slice(cursor, index) });
    if (match[3]) {
      const id = match[3].trim();
      let shown = id;
      try {
        shown = formatSatsInline(id);
      } catch {
        shown = id;
      }
      parts.push({ type: "sats", id, text: shown });
    } else {
      const id = match[1].trim();
      const custom = match[2];
      const label = custom !== undefined && custom.length > 0 ? custom : (getOrd(id)?.term ?? id);
      parts.push({ type: "ord", id, label });
    }
    cursor = index + match[0].length;
  }
  if (cursor < text.length) parts.push({ type: "text", text: text.slice(cursor) });
  return parts;
}

/** Id-er merket med [[id]] i teksten, i rekkefølge. */
export function ordIdsIn(text: string): string[] {
  const ids: string[] = [];
  const re = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
  for (const match of text.matchAll(re)) ids.push(match[1].trim());
  return ids;
}

export function satsIdsIn(text: string): string[] {
  const ids: string[] = [];
  const re = /\{\{sats:([^}]+)\}\}/g;
  for (const match of text.matchAll(re)) ids.push(match[1].trim());
  return ids;
}

export function hasMarkup(text: string): boolean {
  return text.includes("[[") || text.includes("{{");
}

/** Kaster hvis en {{sats:id}} ikke finnes. */
export function assertSatsRefs(text: string, label: string) {
  for (const id of satsIdsIn(text)) {
    try {
      getSats(id);
    } catch {
      throw new Error(`${label} viser ukjent sats ${id}`);
    }
  }
}
