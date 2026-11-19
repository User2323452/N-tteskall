"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getConcept, getPath } from "@/data/learning";
import { areaPictures, overviewAreas } from "@/data/overview";
import { getAllConceptProgress, isIntroduced } from "@/lib/progress";

/**
 * To like kolonner som fyller raden. Et ord som er bredere enn halv rad
 * får hele raden, så det ikke blir et hull ved siden av.
 */
const chipRow =
  "flex min-h-12 max-w-full min-w-[min(100%,min-content)] flex-[1_1_calc(50%-0.25rem)] flex-col justify-center break-words rounded-lg px-2.5 py-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const conceptChip = `${chipRow} bg-[var(--background)] ring-1 ring-[var(--line)] ring-inset hover:bg-white focus-visible:outline-[var(--accent)]`;

const pathChip = `${chipRow} bg-[var(--accent)] text-[15px] leading-snug text-white focus-visible:outline-[var(--ink)]`;

export function KartView() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [progressReady, setProgressReady] = useState(false);

  useEffect(() => {
    const map = getAllConceptProgress();
    setSeen(
      new Set(
        Object.entries(map)
          .filter(([, progress]) => isIntroduced(progress))
          .map(([id]) => id)
      )
    );
    setProgressReady(true);
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const area = overviewAreas.find(
        (item) =>
          item.id === hash || item.themes.some((theme) => theme.id === hash)
      );
      if (area) setOpenId(area.id);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!openId || !hash) return;
    document.getElementById(hash)?.scrollIntoView({ block: "start" });
  }, [openId]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink)]">
          Kart
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
          Et kart over økonomien. Åpne et område, og temaene og konseptene ligger
          inni.
        </p>
      </header>

      <ul className="space-y-4">
        {overviewAreas.map((area) => {
          const open = openId === area.id;
          const picture = areaPictures[area.id];
          const conceptIds = [...new Set(area.themes.flatMap((theme) => theme.conceptIds))];
          const met = conceptIds.filter((id) => seen.has(id)).length;
          return (
            <li key={area.id} id={area.id} className="scroll-mt-20">
              <section className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : area.id)}
                  className="block w-full text-left"
                >
                  {picture && (
                    <Image
                      src={picture.src}
                      alt={picture.alt}
                      width={1200}
                      height={900}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  )}
                  <span className="flex items-start justify-between gap-3 px-4 py-4">
                    <span>
                      <span className="block font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                        {area.name}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">
                        {area.summary}
                      </span>
                      {progressReady && (
                        <span className="mt-1 block text-xs text-[var(--muted)]">
                          {met} av {conceptIds.length}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      className={`mt-1 h-5 w-5 shrink-0 text-[var(--muted)] transition-transform motion-reduce:transition-none ${
                        open ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </span>
                </button>

                {open && (
                  <div className="space-y-5 border-t border-[var(--line)] px-4 py-4">
                    {area.note && (
                      <p className="text-sm leading-relaxed text-[var(--ink)]">
                        {area.note}
                      </p>
                    )}
                    {area.themes.map((theme) => {
                      const path = theme.pathId ? getPath(theme.pathId) : undefined;
                      return (
                        <div key={theme.id} id={theme.id} className="scroll-mt-24">
                          <h3 className="text-xs text-[var(--muted)]">{theme.name}</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {theme.conceptIds.map((id) => {
                              const concept = getConcept(id);
                              if (!concept) return null;
                              return (
                                <Link
                                  key={id}
                                  href={`/konsept/${concept.id}`}
                                  className={conceptChip}
                                >
                                  {seen.has(id) && (
                                    <span
                                      className="mb-0.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                                      aria-hidden
                                    />
                                  )}
                                  <span className="text-[15px] leading-snug text-[var(--ink)]">
                                    {concept.term}
                                    {seen.has(id) && <span className="sr-only">, sett</span>}
                                  </span>
                                  {concept.english && (
                                    <span className="text-[11px] leading-snug text-[var(--muted)]">
                                      {concept.english}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                            {path && (
                              <Link href={`/lop/${path.id}`} className={pathChip}>
                                {path.title}
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </li>
          );
        })}
      </ul>

      <p className="text-sm text-[var(--muted)]">
        Egne notater fra det gamle oppsettet ligger under{" "}
        <Link href="/notater" className="text-[var(--ink)] underline-offset-2 hover:underline">
          Notater
        </Link>
        .
      </p>
    </div>
  );
}
