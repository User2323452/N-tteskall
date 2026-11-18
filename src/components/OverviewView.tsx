import Link from "next/link";
import { getConcept } from "@/data/learning";
import { overviewAreas } from "@/data/overview";

export function OverviewView() {
  return (
    <div className="mx-auto max-w-xl space-y-10">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink)]">
          Oversikt
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
          Kartet over økonomien: områder, temaer og begreper. Læringsløpene er
          en sti gjennom kartet — ikke en notatbok du må fylle selv.
        </p>
      </header>

      {overviewAreas.map((area) => (
        <section
          key={area.id}
          id={area.id}
          className="scroll-mt-20 border-l-2 pl-4"
          style={{ borderColor: area.accent }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            {area.name}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
            {area.summary}
          </p>
          {area.note && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
              {area.note}
            </p>
          )}

          <div className="mt-5 space-y-5">
            {area.themes.map((theme) => (
              <div key={theme.id} id={theme.id} className="scroll-mt-20">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  {theme.name}
                </h3>
                <ul className="mt-2 space-y-1">
                  {theme.conceptIds.map((id) => {
                    const concept = getConcept(id);
                    if (!concept) return null;
                    return (
                      <li key={id}>
                        <Link
                          href={`/begrep/${concept.id}`}
                          className="group flex items-baseline justify-between gap-3 py-1"
                        >
                          <span className="text-[15px] text-[var(--ink)] group-hover:text-[var(--accent)]">
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
            ))}
          </div>
        </section>
      ))}

      <p className="border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)]">
        Egne notater fra det gamle oppsettet ligger under{" "}
        <Link href="/notater" className="text-[var(--ink)] underline-offset-2 hover:underline">
          Notater
        </Link>
        .
      </p>
    </div>
  );
}
