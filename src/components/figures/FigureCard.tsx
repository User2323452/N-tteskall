import { MarkedText } from "@/components/MarkedText";

export function FigureCard({
  title,
  year,
  children,
  note,
}: {
  title: string;
  year?: string;
  children: React.ReactNode;
  note: string;
}) {
  return (
    <figure className="rounded-2xl border border-[var(--line)] bg-white p-4">
      <figcaption className="text-sm font-semibold text-[var(--ink)]">{title}</figcaption>
      {year && <p className="mt-1 text-xs text-[var(--muted)]">{year}</p>}
      <div className="mt-4 space-y-4">{children}</div>
      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        <MarkedText text={note} />
      </p>
    </figure>
  );
}

export function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="mr-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-sm align-middle"
      style={{ background: color }}
    />
  );
}

/** Tallet og grafen står over glidebryterne, så de er synlige mens du drar. */
export function StickyView({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sticky z-10 -mx-4 space-y-3 bg-white/95 px-4 pb-3 pt-1 backdrop-blur"
      style={{ top: "var(--app-header)" }}
    >
      {children}
    </div>
  );
}
