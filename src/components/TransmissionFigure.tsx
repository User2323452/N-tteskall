const steps = [
  "Norges Bank",
  "Pengemarked",
  "Bankrente",
  "Etterspørsel",
  "Priser",
];

/** Statisk transmisjonskjede. Pedagogisk figur, ikke en prognose. */
export function TransmissionFigure() {
  return (
    <figure className="my-6 rounded-2xl border border-[var(--line)] bg-white px-4 py-4">
      <figcaption className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
        Transmisjon
      </figcaption>
      <ol className="mt-3">
        {steps.map((step, index) => (
          <li key={step}>
            <div className="rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-center text-sm text-[var(--ink)]">
              {step}
            </div>
            {index < steps.length - 1 && (
              <div aria-hidden className="py-1 text-center text-sm text-[var(--muted)]">
                ↓
              </div>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        Forenklet kjede fra styringsrente til priser. Pedagogisk modell, ikke en
        prognose.
      </p>
    </figure>
  );
}
