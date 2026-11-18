"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getConcept, getPath } from "@/data/learning";
import { areaPictures, overviewAreas } from "@/data/overview";

export function KartView() {
  const [openId, setOpenId] = useState<string | null>(null);

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
          Et kart over økonomien. Åpne et område, og temaene og begrepene ligger
          inni.
        </p>
      </header>

      <ul className="space-y-4">
        {overviewAreas.map((area) => {
          const open = openId === area.id;
          const picture = areaPictures[area.id];
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
                          <h3 className="text-sm font-semibold text-[var(--ink)]">
                            {theme.name}
                          </h3>
                          {path && (
                            <Link
                              href={`/lop/${path.id}`}
                              className="mt-1 inline-block text-sm text-[var(--accent)]"
                            >
                              Løp: {path.title}
                            </Link>
                          )}
                          <ul className="mt-1">
                            {theme.conceptIds.map((id) => {
                              const concept = getConcept(id);
                              if (!concept) return null;
                              return (
                                <li key={id}>
                                  <Link
                                    href={`/begrep/${concept.id}`}
                                    className="flex items-baseline justify-between gap-3 py-1.5"
                                  >
                                    <span className="text-[15px] text-[var(--ink)]">
                                      {concept.term}
                                    </span>
                                    {concept.english && (
                                      <span className="shrink-0 text-xs text-[var(--muted)]">
                                        {concept.english}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
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
