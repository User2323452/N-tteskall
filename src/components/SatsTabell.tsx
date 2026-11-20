import {
  formatSjekket,
  formatVerdi,
  getSats,
  kildeNavn,
  visningsar,
  type Sats,
} from "@/data/satser";

function sameValue(a: number | string, b: number | string): boolean {
  if (typeof a === "number" && typeof b === "number") return a === b;
  return String(a) === String(b);
}

function direction(previous: number | string, next: number | string): -1 | 0 | 1 {
  if (sameValue(previous, next)) return 0;
  const left = typeof previous === "number" ? previous : Number.NaN;
  const right = typeof next === "number" ? next : Number.NaN;
  if (!Number.isNaN(left) && !Number.isNaN(right)) return right > left ? 1 : -1;
  return String(next) > String(previous) ? 1 : -1;
}

/** Maks fem rader. Siste kolonne er året som sammenlignes, og den er uthevet. */
export function SatsTabell({ ids }: { ids: string[] }) {
  const rows = ids
    .slice(0, 5)
    .map((id) => {
      try {
        return getSats(id);
      } catch {
        return null;
      }
    })
    .filter((sats): sats is Sats => Boolean(sats));
  if (rows.length === 0) return null;

  const [yearA, yearB] = visningsar(rows[0]);
  const sources = new Map<string, { navn: string; url: string; sjekket: string }>();
  for (const sats of rows) {
    const key = `${sats.kilde}|${sats.sistSjekket}`;
    if (!sources.has(key)) {
      sources.set(key, {
        navn: kildeNavn(sats.kilde),
        url: sats.kilde,
        sjekket: formatSjekket(sats.sistSjekket),
      });
    }
  }

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Tall som endres
      </h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-3 py-2 font-semibold">Hva</th>
              <th className="px-2 py-2 font-semibold tabular-nums">{yearA}</th>
              <th className="px-2 py-2 font-semibold tabular-nums text-slate-900">{yearB}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((sats) => {
              const left = sats.verdier[yearA];
              const right = sats.verdier[yearB];
              if (!left || !right) return null;
              const change = direction(left.verdi, right.verdi);
              return (
                <tr key={sats.id} className="border-t border-slate-100">
                  <th className="px-3 py-2.5 text-left font-medium text-slate-800">
                    {sats.kortNavn}
                  </th>
                  <td className="px-2 py-2.5 tabular-nums text-slate-600">
                    {formatVerdi(left.verdi, sats.enhet)}
                  </td>
                  <td className="px-2 py-2.5 font-semibold tabular-nums text-slate-900">
                    <span className="block">{formatVerdi(right.verdi, sats.enhet)}</span>
                    <span className="mt-0.5 block text-[11px] font-normal text-slate-400">
                      {change === 0 ? "uendret" : change > 0 ? "↑" : "↓"}
                      {right.status === "forslag" ? " · forslag" : ""}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="mt-2 space-y-1">
        {[...sources.values()].map((source) => (
          <li key={source.url} className="text-xs leading-relaxed text-slate-400">
            Kilde:{" "}
            <a href={source.url} className="underline decoration-slate-300 underline-offset-2">
              {source.navn}
            </a>{" "}
            · sjekket {source.sjekket}
          </li>
        ))}
      </ul>
    </section>
  );
}
