import Image from "next/image";
import { MarkedText } from "@/components/MarkedText";
import type { FigureSpec, SketchKind, Tone } from "@/data/concept-figures";

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
      <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
        <MarkedText text={caption} />
      </p>
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
          <MarkedText text={spec.caption} />
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

  if (spec.type === "sketch") {
    return (
      <Frame title={spec.title} caption={spec.caption}>
        <Sketch kind={spec.kind} />
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

const INK = "#1A2332";
const MUTED = "#64748B";
const BLUE = "#3B6FD8";
const AMBER = "#B45309";
const GREEN = "#0f6e56";
const ROSE = "#BE123C";

const PANEL_W = 150;
const PANEL_H = 90;

function pointsOf(values: number[], width = PANEL_W, height = PANEL_H, pad = 8) {
  const step = (width - pad * 2) / (values.length - 1);
  return values.map((value, index) => [pad + index * step, height - pad - (value / 100) * (height - pad * 2)] as const);
}

function linePath(values: number[], width?: number, height?: number) {
  return pointsOf(values, width, height)
    .map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
}

function stepPath(values: number[], width?: number, height?: number) {
  const points = pointsOf(values, width, height);
  return points
    .map(([x, y], index) => (index ? `H${x.toFixed(1)} V${y.toFixed(1)}` : `M${x.toFixed(1)} ${y.toFixed(1)}`))
    .join(" ");
}

type LegendItem = { color: string; label: string; mark?: "line" | "dash" | "dot" | "box" };

function Legend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--ink)]">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <svg viewBox="0 0 16 10" className="h-2.5 w-4 shrink-0" aria-hidden>
            {item.mark === "dot" ? (
              <circle cx="8" cy="5" r="3.5" fill={item.color} />
            ) : item.mark === "box" ? (
              <rect x="2" y="0" width="12" height="10" rx="2" fill={item.color} />
            ) : (
              <line x1="0" x2="16" y1="5" y2="5" stroke={item.color} strokeWidth="2.5" strokeDasharray={item.mark === "dash" ? "4 3" : undefined} />
            )}
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function Panels({ labels, children }: { labels: [string, string]; children: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {labels.map((label, index) => (
        <div key={label} className="rounded-xl bg-[var(--accent-soft)] p-2">
          <p className="text-xs font-semibold text-[var(--accent)]">{label}</p>
          <svg viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} className="mt-1 w-full" aria-hidden>
            <line x1="8" x2={PANEL_W - 8} y1={PANEL_H - 4} y2={PANEL_H - 4} stroke="#CBD5E1" />
            {children[index]}
          </svg>
        </div>
      ))}
    </div>
  );
}

function Wide({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 150" className="w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function Axes({ x, y }: { x: string; y: string }) {
  return (
    <>
      <path d="M36 10 V126 H310" fill="none" stroke="#94A3B8" />
      <text x="42" y="16" fontSize="12" fill={MUTED}>
        {y}
      </text>
      <text x="310" y="142" fontSize="12" fill={MUTED} textAnchor="end">
        {x}
      </text>
    </>
  );
}

const SPOT = [45, 25, 60, 18, 52, 35, 72, 28, 50, 64, 30, 55];
const STYRING = [25, 25, 25, 40, 40, 55, 55, 55, 45, 45, 35, 35];
const SMALL_NOISE = [0, 3, -2, 4, -3, 2, -4, 3, -1, 2, -3, 1];
const AKSJE_A = [30, 45, 38, 58, 46, 66, 55, 72, 60, 80, 68, 85];
const AKSJE_B_FRI = [62, 48, 66, 40, 58, 45, 70, 38, 52, 60, 44, 50];
const SPREDNING = [-1, 1, -0.6, 0.8, -0.3, 0.5, -0.9, 0.7];
const OLJE = [40, 52, 47, 70, 62, 85, 55, 35, 48, 66, 58, 74, 60];
const OLS_AVVIK = [-14, 10, -6, 16, -10, 4, 12, -16, 8, -4, 14, -8];

function trend(index: number, length: number) {
  return 25 + (50 * index) / (length - 1);
}

function Sketch({ kind }: { kind: SketchKind }) {
  if (kind === "fastpris") {
    return (
      <>
        <Panels labels={["Fastpris", "Spot"]}>
          <path d={linePath(SPOT.map(() => 48))} fill="none" stroke={GREEN} strokeWidth="2.5" />
          <path d={linePath(SPOT)} fill="none" stroke={AMBER} strokeWidth="2.5" strokeLinejoin="round" />
        </Panels>
        <Legend items={[{ color: GREEN, label: "Kraftpris, fast" }, { color: AMBER, label: "Kraftpris, spot" }]} />
      </>
    );
  }

  if (kind === "fastrente") {
    const flytende = STYRING.map((value) => value + 20);
    return (
      <>
        <Panels labels={["Fastrente", "Flytende rente"]}>
          <>
            <path d={stepPath(STYRING)} fill="none" stroke={MUTED} strokeWidth="1.5" strokeDasharray="4 3" />
            <path d={linePath(STYRING.map(() => 62))} fill="none" stroke={GREEN} strokeWidth="2.5" />
          </>
          <>
            <path d={stepPath(STYRING)} fill="none" stroke={MUTED} strokeWidth="1.5" strokeDasharray="4 3" />
            <path d={stepPath(flytende)} fill="none" stroke={BLUE} strokeWidth="2.5" />
          </>
        </Panels>
        <Legend
          items={[
            { color: GREEN, label: "Fastrente" },
            { color: BLUE, label: "Flytende rente" },
            { color: MUTED, label: "Styringsrenten", mark: "dash" },
          ]}
        />
      </>
    );
  }

  if (kind === "volatilitet") {
    const bane = SMALL_NOISE.map((_, index) => trend(index, SMALL_NOISE.length));
    return (
      <>
        <Panels labels={["Lav volatilitet", "Høy volatilitet"]}>
          <>
            <path d={linePath(bane)} fill="none" stroke={MUTED} strokeWidth="1.5" strokeDasharray="4 3" />
            <path d={linePath(bane.map((value, index) => value + SMALL_NOISE[index]))} fill="none" stroke={BLUE} strokeWidth="2.5" />
          </>
          <>
            <path d={linePath(bane)} fill="none" stroke={MUTED} strokeWidth="1.5" strokeDasharray="4 3" />
            <path
              d={linePath(bane.map((value, index) => Math.max(0, Math.min(100, value + SMALL_NOISE[index] * 7))))}
              fill="none"
              stroke={BLUE}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </>
        </Panels>
        <Legend items={[{ color: BLUE, label: "Avkastningen" }, { color: MUTED, label: "Jevn bane, samme snitt", mark: "dash" }]} />
      </>
    );
  }

  if (kind === "korrelasjon") {
    return (
      <>
        <Panels labels={["Høy korrelasjon", "Lav korrelasjon"]}>
          <>
            <path d={linePath(AKSJE_A)} fill="none" stroke={BLUE} strokeWidth="2.5" />
            <path d={linePath(AKSJE_A.map((value, index) => value - 20 + SMALL_NOISE[index]))} fill="none" stroke={AMBER} strokeWidth="2.5" />
          </>
          <>
            <path d={linePath(AKSJE_A)} fill="none" stroke={BLUE} strokeWidth="2.5" />
            <path d={linePath(AKSJE_B_FRI)} fill="none" stroke={AMBER} strokeWidth="2.5" />
          </>
        </Panels>
        <Legend items={[{ color: BLUE, label: "Aksje A" }, { color: AMBER, label: "Aksje B" }]} />
      </>
    );
  }

  if (kind === "spredning") {
    const dots = (size: number) => {
      const points = pointsOf(SPREDNING.map((offset) => 50 + offset * size));
      const meanY = PANEL_H / 2;
      return (
        <>
          <line x1="8" x2={PANEL_W - 8} y1={meanY} y2={meanY} stroke={MUTED} strokeWidth="1.5" strokeDasharray="4 3" />
          {points.map(([x, y]) => (
            <g key={x}>
              <line x1={x} x2={x} y1={meanY} y2={y} stroke={ROSE} strokeWidth="1.2" />
              <circle cx={x} cy={y} r="4" fill={BLUE} />
            </g>
          ))}
        </>
      );
    };
    return (
      <>
        <Panels labels={["Lavt standardavvik", "Høyt standardavvik"]}>
          {dots(8)}
          {dots(42)}
        </Panels>
        <Legend
          items={[
            { color: BLUE, label: "Punktene", mark: "dot" },
            { color: MUTED, label: "Snittet", mark: "dash" },
            { color: ROSE, label: "Avstand til snittet" },
          ]}
        />
      </>
    );
  }

  if (kind === "ols") {
    const lineY = (x: number) => 120 - 0.3 * (x - 40);
    return (
      <>
        <Wide label="Punkter og den rette linjen som bommer minst">
          <Axes x="Markedet" y="Aksjen" />
          <line x1="44" x2="306" y1={lineY(44)} y2={lineY(306)} stroke={INK} strokeWidth="2" />
          {OLS_AVVIK.map((offset, index) => {
            const x = 52 + index * 22;
            const y = lineY(x) + offset;
            return (
              <g key={x}>
                <line x1={x} x2={x} y1={lineY(x)} y2={y} stroke={ROSE} strokeWidth="1.5" />
                <circle cx={x} cy={y} r="4" fill={BLUE} />
              </g>
            );
          })}
        </Wide>
        <Legend
          items={[
            { color: BLUE, label: "Punktene", mark: "dot" },
            { color: INK, label: "Linjen" },
            { color: ROSE, label: "Avvik som kvadreres" },
          ]}
        />
      </>
    );
  }

  if (kind === "prislinje") {
    return (
      <Wide label="En prislinje som går opp og ned over tid">
        <Axes x="Tid" y="Pris" />
        <path
          d={pointsOf(OLJE, 320, 150, 0)
            .map(([x, y], index) => `${index ? "L" : "M"}${(44 + (x / 320) * 262).toFixed(1)} ${(126 - ((150 - y) / 150) * 104).toFixed(1)}`)
            .join(" ")}
          fill="none"
          stroke={AMBER}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </Wide>
    );
  }

  if (kind === "noytral-rente") {
    const ys = [104, 104, 94, 82, 62, 50, 50, 50, 64, 78, 96, 100];
    const step = 270 / (ys.length - 1);
    const d = ys.map((y, index) => (index ? `H${36 + index * step} V${y}` : `M36 ${y}`)).join(" ");
    return (
      <>
        <Wide label="Styringsrenten over og under linjen for nøytral rente">
          <rect x="30" y="8" width="284" height="67" fill="#FFE4E6" opacity="0.6" />
          <rect x="30" y="75" width="284" height="67" fill="#D1FAE5" opacity="0.6" />
          <text x="38" y="24" fontSize="12" fill={ROSE}>
            Over: stram
          </text>
          <text x="38" y="134" fontSize="12" fill={GREEN}>
            Under: romslig
          </text>
          <line x1="30" x2="314" y1="75" y2="75" stroke={MUTED} strokeWidth="2" strokeDasharray="5 4" />
          <path d={d} fill="none" stroke={BLUE} strokeWidth="2.5" />
        </Wide>
        <Legend items={[{ color: BLUE, label: "Styringsrenten" }, { color: MUTED, label: "Nøytral rente, et anslag", mark: "dash" }]} />
      </>
    );
  }

  if (kind === "konjunktur") {
    const trendY = (x: number) => 110 - (70 * (x - 10)) / 300;
    const wave = Array.from({ length: 61 }, (_, index) => {
      const x = 10 + index * 5;
      return [x, trendY(x) - 22 * Math.sin((2 * Math.PI * (x - 10)) / 150)] as const;
    });
    const wavePoints = wave.map(([x, y]) => `${x},${y.toFixed(1)}`).join(" ");
    return (
      <>
        <Wide label="Aktiviteten svinger i en bølge rundt en jevn trend">
          <defs>
            <clipPath id="konjunktur-over">
              <polygon points={`10,0 310,0 310,${trendY(310)} 10,${trendY(10)}`} />
            </clipPath>
            <clipPath id="konjunktur-under">
              <polygon points={`10,${trendY(10)} 310,${trendY(310)} 310,150 10,150`} />
            </clipPath>
          </defs>
          <polygon points={wavePoints} fill="#A7F3D0" clipPath="url(#konjunktur-over)" />
          <polygon points={wavePoints} fill="#FECDD3" clipPath="url(#konjunktur-under)" />
          <line x1="10" x2="310" y1={trendY(10)} y2={trendY(310)} stroke={MUTED} strokeWidth="2" strokeDasharray="5 4" />
          <polyline points={wavePoints} fill="none" stroke={BLUE} strokeWidth="2.5" />
          <text x="310" y="142" fontSize="12" fill={MUTED} textAnchor="end">
            Tid
          </text>
        </Wide>
        <Legend
          items={[
            { color: BLUE, label: "Aktiviteten" },
            { color: MUTED, label: "Trenden", mark: "dash" },
            { color: "#A7F3D0", label: "Over: høykonjunktur", mark: "box" },
            { color: "#FECDD3", label: "Under: lavkonjunktur", mark: "box" },
          ]}
        />
      </>
    );
  }

  const supplyY = (x: number) => 116 - (96 / 230) * (x - 60);
  const demandY = (x: number) => 24 + (94 / 230) * (x - 60);
  const demand2Y = (x: number) => 46 + (78 / 190) * (x - 60);
  const cross = 60 + 92 / (96 / 230 + 94 / 230);
  const cross2 = 60 + 70 / (96 / 230 + 78 / 190);
  return (
    <>
      <Wide label="Tilbudskurven og etterspørselskurven krysser hverandre">
        <Axes x="Mengde" y="Pris" />
        <line x1="60" x2="290" y1={supplyY(60)} y2={supplyY(290)} stroke={BLUE} strokeWidth="2.5" />
        <line x1="60" x2="290" y1={demandY(60)} y2={demandY(290)} stroke={AMBER} strokeWidth="2.5" />
        <line x1="60" x2="250" y1={demand2Y(60)} y2={demand2Y(250)} stroke={AMBER} strokeWidth="2" strokeDasharray="5 4" />
        {[cross, cross2].map((x, index) => (
          <g key={x}>
            <path d={`M36 ${supplyY(x)} H${x} V126`} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="2 3" />
            <circle cx={x} cy={supplyY(x)} r="4.5" fill={index ? "white" : INK} stroke={INK} strokeWidth="1.5" />
          </g>
        ))}
      </Wide>
      <Legend
        items={[
          { color: BLUE, label: "Tilbud" },
          { color: AMBER, label: "Etterspørsel" },
          { color: AMBER, label: "Etterspørsel etter høyere rente", mark: "dash" },
          { color: INK, label: "Krysset: pris og mengde", mark: "dot" },
        ]}
      />
    </>
  );
}
