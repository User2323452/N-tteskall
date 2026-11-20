/**
 * Lite bilde per løp. Det skal si hva løpet lærer, uten kort eller pil.
 * Skatt er glasset med en kant. Pengepolitikk er rentebanen.
 */

const ink = "#1A2332";
const accent = "#0F6E56";
const soft = "#E6F4EF";
const amber = "#C4843A";
const blue = "#3B6FD8";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9 shrink-0" aria-hidden>
      {children}
    </svg>
  );
}

function Pengepolitikk() {
  return (
    <Frame>
      <path d="M4 28h28" stroke="#E2E8F0" strokeWidth="1.25" />
      <path
        d="M5 22c6 0 7.5-10 13.5-11S29 10 31 10"
        fill="none"
        stroke={accent}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="5" cy="22" r="2" fill={ink} />
      <circle cx="18.5" cy="11" r="1.5" fill={accent} />
      <circle cx="31" cy="10" r="1.5" fill={accent} />
    </Frame>
  );
}

function Sparing() {
  return (
    <Frame>
      <ellipse cx="8" cy="26" rx="4.4" ry="2.2" fill={soft} stroke={ink} strokeWidth="1.45" />
      <path d="M5.2 26h5.6" stroke={ink} strokeWidth="0.9" strokeLinecap="round" opacity="0.45" />
      <ellipse cx="17" cy="18" rx="5.2" ry="2.5" fill={soft} stroke={accent} strokeWidth="1.45" />
      <path d="M13.6 18h6.8" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.45" />
      <ellipse cx="27.2" cy="9.2" rx="6" ry="2.85" fill={accent} />
      <path d="M23.2 9.2h8" stroke={soft} strokeWidth="1.05" strokeLinecap="round" />
    </Frame>
  );
}

function Skatt() {
  return (
    <Frame>
      <defs>
        <clipPath id="lop-glass">
          <path d="M12.4 9.2 14.6 29.2Q18 32.4 21.4 29.2L23.6 9.2Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#lop-glass)">
        <rect x="8" y="18.2" width="20" height="16" fill={blue} />
        <rect x="8" y="15.4" width="20" height="3" fill={amber} />
        <path d="M13 11.4h10M13.4 13.3h9.2" stroke="#BE123C" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <path
        d="M11.2 8.6 14.2 29.6Q18 33.2 21.8 29.6L24.8 8.6"
        fill="none"
        stroke={ink}
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      <ellipse cx="18" cy="8.6" rx="7" ry="2.15" fill="none" stroke={ink} strokeWidth="1.35" />
      <path
        d="M13 15.4h10"
        fill="none"
        stroke={ink}
        strokeWidth="1.15"
        strokeDasharray="1.6 1.45"
        strokeLinecap="round"
      />
    </Frame>
  );
}

function Pensjon() {
  return (
    <Frame>
      <rect x="4" y="24" width="28" height="6" rx="1.6" fill={accent} />
      <rect x="9" y="16" width="18" height="6" rx="1.6" fill={accent} opacity="0.72" />
      <rect x="13" y="8" width="10" height="6" rx="1.6" fill={accent} opacity="0.4" />
    </Frame>
  );
}

function Bolig() {
  return (
    <Frame>
      <path
        d="M9 16.2V29h18V16.2"
        fill={soft}
        stroke={ink}
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 16.8 18 6.8l11.5 10"
        fill="none"
        stroke={ink}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 24.4h18V29H9Z" fill={accent} />
      <path d="M16 29v-5.6h4V29" fill="#F7F8FA" stroke={ink} strokeWidth="1.15" />
    </Frame>
  );
}

function Oljefond() {
  return (
    <Frame>
      <circle cx="18" cy="18" r="11" fill={soft} stroke={accent} strokeWidth="1.5" />
      <path d="M18 18 18 7a11 11 0 0 1 4.15.78Z" fill="#D97706" />
    </Frame>
  );
}

function Arbeidsliv() {
  return (
    <Frame>
      <path
        d="M4 19.2 8 13l4 6.2 4-6.2 4 6.2V29H4Z"
        fill={soft}
        stroke={ink}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M20 19.2H32" stroke={accent} strokeWidth="1.7" strokeLinecap="round" />
    </Frame>
  );
}

function Strom() {
  return (
    <Frame>
      <path d="M6.5 29 10 8l3.5 21" fill="none" stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.1 20.2h3.8M8.8 14.4h2.4" stroke={ink} strokeWidth="1.15" strokeLinecap="round" />
      <path d="M22.5 29 26 8l3.5 21" fill="none" stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M24.1 20.2h3.8M24.8 14.4h2.4" stroke={ink} strokeWidth="1.15" strokeLinecap="round" />
      <path
        d="M10 9.2c3.2 6.4 5.2 6.2 8 4.2"
        fill="none"
        stroke="#0284C7"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M18 13.4c2.4-2.2 5-3.6 8-4.2"
        fill="none"
        stroke="#D97706"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Frame>
  );
}

function Kronekurs() {
  return (
    <Frame>
      <circle cx="10" cy="23" r="6.2" fill={soft} stroke={ink} strokeWidth="1.4" />
      <circle cx="26" cy="13" r="6.2" fill="none" stroke={accent} strokeWidth="1.4" />
      <text
        x="10"
        y="25"
        textAnchor="middle"
        fontSize="6.4"
        fontWeight="600"
        fill={ink}
        fontFamily="inherit"
      >
        kr
      </text>
      <text
        x="26"
        y="15.4"
        textAnchor="middle"
        fontSize="8"
        fontWeight="600"
        fill={accent}
        fontFamily="inherit"
      >
        €
      </text>
    </Frame>
  );
}

function StartHer() {
  return (
    <Frame>
      <circle cx="18" cy="18" r="10" fill={soft} stroke={accent} strokeWidth="1.5" />
      <path d="M18 12.5v11M12.5 18h11" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
    </Frame>
  );
}

const glyphs: Record<string, () => React.ReactNode> = {
  "start-her": StartHer,
  "norsk-pengepolitikk": Pengepolitikk,
  "personlig-sparing": Sparing,
  "skatt-for-privatpersoner": Skatt,
  pensjon: Pensjon,
  bolig: Bolig,
  "oljefondet-og-handlingsregelen": Oljefond,
  arbeidsliv: Arbeidsliv,
  "strom-og-kraft": Strom,
  "kronekurs-og-eos": Kronekurs,
};

export function PathGlyph({ id }: { id: string }) {
  const Glyph = glyphs[id];
  if (!Glyph) return null;
  return <Glyph />;
}
