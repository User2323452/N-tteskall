"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { StreakFlame } from "@/components/StreakFlame";
import { searchLearning } from "@/data/learning";

/**
 * Skisse av nytt Hjem. Faste eksempeldata, ingen lagring.
 * Fargene er de samme tokenene som resten av appen.
 */
const LESSONS = 6;
const DONE = 1;
const MINUTES = 6;

function greeting(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 10) return "God morgen";
  if (hour >= 10 && hour < 17) return "God dag";
  if (hour >= 17 && hour < 23) return "God kveld";
  return "God natt";
}

function HomeSketch({
  logoOnCard,
  name,
}: {
  logoOnCard: boolean;
  name: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const hello = `${greeting(new Date())}${name ? `, ${name}` : ""}`;
  const hits = useMemo(() => (q.trim() ? searchLearning(q) : null), [q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {logoOnCard ? (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-white">
            <LogoMark className="h-9 w-9" />
          </span>
        ) : (
          <LogoMark className="h-9 w-9 shrink-0" />
        )}
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
          {hello}
        </h1>
      </div>

      <article className="rounded-2xl bg-[var(--accent-soft)] px-4 py-4">
        <p className="text-xs font-medium text-[var(--accent)]">
          Dagens leksjon · ca. {MINUTES} min
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
          Inflasjonsmålet
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Norsk pengepolitikk · {DONE + 1} av {LESSONS}
        </p>
        <div className="mt-4 flex gap-1.5" aria-hidden>
          {Array.from({ length: LESSONS }, (_, index) => {
            const done = index < DONE;
            const next = index === DONE;
            return (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full ${
                  done
                    ? "bg-[var(--accent)]"
                    : next
                      ? "bg-[var(--accent)]/35"
                      : "bg-white"
                }`}
              />
            );
          })}
        </div>
        <p className="sr-only">Leksjon {DONE} er ferdig. Neste er leksjon {DONE + 1}.</p>
        <span className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-medium text-white">
          Fortsett
          <ArrowRight className="h-4 w-4" />
        </span>
      </article>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-[var(--line)] bg-white px-3 py-3">
          <p className="text-xs text-[var(--muted)]">Til repetisjon</p>
          <p className="mt-2 text-lg font-semibold text-[var(--ink)]">3 konsepter</p>
          <p className="mt-0.5 text-sm text-[var(--muted)]">ca. 6 min</p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white px-3 py-3">
          <p className="text-xs text-[var(--muted)]">Konsepter som sitter</p>
          <p className="mt-2 text-lg font-semibold text-[var(--ink)]">1 av 125</p>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-sm text-[var(--ink)]">
        <StreakFlame className="h-4 w-4" />1 dag på rad
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = q.trim();
          router.push(trimmed ? `/sok?q=${encodeURIComponent(trimmed)}` : "/sok");
        }}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Søk konsept eller løp"
            aria-label="Søk etter konsept eller læringsløp"
            className="w-full rounded-2xl border border-[var(--line)] bg-white py-3.5 pl-10 pr-4 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2"
          />
        </div>
        {hits && (
          <div className="mt-2 rounded-2xl border border-[var(--line)] bg-white p-2">
            {hits.concepts.slice(0, 3).map((concept) => (
              <p key={concept.id} className="px-3 py-2 text-sm text-[var(--ink)]">
                {concept.term}
              </p>
            ))}
            {hits.paths.slice(0, 2).map((path) => (
              <p key={path.id} className="px-3 py-2 text-sm text-[var(--ink)]">
                {path.title}
              </p>
            ))}
            {hits.concepts.length === 0 && hits.paths.length === 0 && (
              <p className="px-3 py-2 text-sm text-[var(--muted)]">Ingen treff.</p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

function NameCard({ open }: { open: boolean }) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white px-4 py-4">
      <h2 className="text-sm font-semibold text-[var(--ink)]">Navn</h2>
      {open ? (
        <div className="mt-3 space-y-3">
          <label className="block text-sm text-[var(--muted)]" htmlFor={open ? "skisse-navn" : undefined}>
            Hva vil du at vi skal kalle deg?
          </label>
          <input
            id="skisse-navn"
            defaultValue="Oscar"
            maxLength={30}
            className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] focus:ring-2"
          />
          <span className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-medium text-white">
            Lagre
          </span>
        </div>
      ) : (
        <p className="mt-1 text-sm text-[var(--muted)]">Oscar</p>
      )}
    </section>
  );
}

export default function SkisseHjemPage() {
  return (
    <div data-skisse-hjem className="space-y-10 pb-4">
      <style>{`body:has([data-skisse-hjem]) > div > header { display: none; }`}</style>
      <p className="text-sm text-[var(--muted)]">
        Skisse. Samme flater, kant og grønnfarge som resten av appen.
      </p>

      <section className="space-y-3">
        <h2 className="text-xs font-medium text-[var(--muted)]">Variant 1</h2>
        <HomeSketch logoOnCard={false} name="Oscar" />
      </section>

      <section className="space-y-3 border-t border-[var(--line)] pt-8">
        <h2 className="text-xs font-medium text-[var(--muted)]">Variant 2</h2>
        <HomeSketch logoOnCard name="Oscar" />
      </section>

      <section className="space-y-3 border-t border-[var(--line)] pt-8">
        <h2 className="text-xs font-medium text-[var(--muted)]">Navn i Profil</h2>
        <NameCard open={false} />
        <NameCard open />
      </section>
    </div>
  );
}
