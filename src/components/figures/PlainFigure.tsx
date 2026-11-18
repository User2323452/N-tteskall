import Image from "next/image";
import type { FigureSpec, Tone } from "@/data/concept-figures";

const toneClass: Record<Tone, string> = {
  teal: "bg-teal-700",
  blue: "bg-blue-700",
  amber: "bg-amber-600",
  green: "bg-[#0f6e56]",
  rose: "bg-rose-700",
  slate: "bg-slate-500",
};

function Frame({
  title,
  caption,
  children,
}: {
  title?: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="rounded-2xl border border-[var(--line)] bg-white p-3">
      {title && (
        <figcaption className="text-xs font-semibold text-[var(--ink)]">
          {title}
        </figcaption>
      )}
      <div className={title ? "mt-2" : undefined}>{children}</div>
      <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{caption}</p>
    </figure>
  );
}

export function PlainFigure({ spec }: { spec: Exclude<FigureSpec, { type: "interactive" }> }) {
  if (spec.type === "photo") {
    return (
      <figure>
        <Image
          src={spec.src}
          alt={spec.alt}
          width={1200}
          height={900}
          className="aspect-[4/3] w-full rounded-xl object-cover"
        />
        <figcaption className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
          {spec.caption}
        </figcaption>
      </figure>
    );
  }

  if (spec.type === "flow") {
    return (
      <Frame title={spec.title} caption={spec.caption}>
        <ol>
          {spec.steps.map((step, index) => (
            <li key={step}>
              <div className="rounded-lg bg-[var(--accent-soft)] px-2 py-1.5 text-center text-xs text-[var(--ink)]">
                {step}
              </div>
              {index < spec.steps.length - 1 && (
                <div aria-hidden className="py-0.5 text-center text-xs text-[var(--muted)]">
                  ↓
                </div>
              )}
            </li>
          ))}
        </ol>
      </Frame>
    );
  }

  if (spec.type === "compare") {
    return (
      <Frame title={spec.title} caption={spec.caption}>
        <div className="grid grid-cols-2 gap-2">
          {[
            [spec.leftLabel, spec.left],
            [spec.rightLabel, spec.right],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl bg-[var(--accent-soft)] p-2">
              <p className="text-[11px] font-semibold text-[var(--accent)]">{label}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--ink)]">{text}</p>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  if (spec.type === "stack") {
    return (
      <Frame title={spec.title} caption={spec.caption}>
        <ol className="space-y-1">
          {spec.layers.map((layer) => (
            <li
              key={layer.label}
              className={`rounded-lg px-2 py-1.5 text-white ${toneClass[layer.tone]}`}
            >
              <span className="block text-xs font-medium">{layer.label}</span>
              <span className="block text-[11px] text-white/80">{layer.note}</span>
            </li>
          ))}
        </ol>
      </Frame>
    );
  }

  if (spec.type === "split") {
    return (
      <Frame title={spec.title} caption={spec.caption}>
        <div className="flex h-8 overflow-hidden rounded-full" role="img" aria-label={spec.title}>
          {spec.parts.map((part) => (
            <div
              key={part.label}
              className={`flex items-center justify-center px-1 text-[10px] text-white ${toneClass[part.tone]}`}
              style={{ width: `${part.share}%` }}
            >
              {part.share >= 16 ? part.label : ""}
            </div>
          ))}
        </div>
        <ul className="mt-2 space-y-1">
          {spec.parts.map((part) => (
            <li key={part.label} className="flex items-center gap-2 text-[11px] text-[var(--ink)]">
              <span className={`h-2 w-2 rounded-full ${toneClass[part.tone]}`} aria-hidden />
              {part.label}
            </li>
          ))}
        </ul>
      </Frame>
    );
  }

  if (spec.type === "formula") {
    return (
      <Frame title={spec.title} caption={spec.caption}>
        <p className="rounded-lg bg-[var(--accent-soft)] px-2 py-2 text-center text-xs font-medium text-[var(--ink)]">
          {spec.expression}
        </p>
        <dl className="mt-2 space-y-1">
          {spec.bits.map((bit) => (
            <div key={bit.name}>
              <dt className="text-[11px] font-semibold text-[var(--ink)]">{bit.name}</dt>
              <dd className="text-[11px] leading-relaxed text-[var(--muted)]">{bit.means}</dd>
            </div>
          ))}
        </dl>
      </Frame>
    );
  }

  if (spec.type === "pair") {
    return (
      <Frame title={spec.title} caption={spec.caption}>
        <div className="space-y-1 text-center">
          <p className="rounded-lg bg-[var(--accent-soft)] px-2 py-1.5 text-xs text-[var(--ink)]">{spec.a}</p>
          <p className="text-[11px] text-[var(--muted)]">{spec.link}</p>
          <p className="rounded-lg bg-[var(--accent-soft)] px-2 py-1.5 text-xs text-[var(--ink)]">{spec.b}</p>
        </div>
      </Frame>
    );
  }

  const max = Math.max(...spec.items.map((item) => item.value), 1);
  return (
    <Frame title={spec.title} caption={spec.caption}>
      <div className="flex h-24 items-end gap-1.5">
        {spec.items.map((item) => (
          <div key={item.label} className="flex h-full flex-1 flex-col justify-end">
            <div
              className="rounded-t bg-[#0f6e56]"
              style={{ height: `${(item.value / max) * 100}%` }}
            />
            <p className="mt-1 text-center text-[10px] text-[var(--ink)]">{item.label}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}
