/** Læringsmodell for personfradrag, inntektsåret 2026. Ikke et skattevedtak. */
export const GLASS_YEAR = 2026;
export const PERSONFRADRAG = 114_540;
export const MINSTE_SATS = 0.46;
export const MINSTE_TAK = 95_700;
export const AKSJE_FAKTOR = 1.72;
export const ALMINNELIG_SATS = 0.22;

export interface GlassFill {
  minst: number;
  lonnPlass: number;
  rentePlass: number;
  aksjePlass: number;
  total: number;
  iGlass: number;
  over: number;
  skatt: number;
  ledigForGevinst: number;
  maksFriGevinst: number;
}

export function fillGlass(lonn: number, rente: number, gevinst: number): GlassFill {
  const safeLonn = Math.max(0, lonn);
  const minst = Math.min(safeLonn * MINSTE_SATS, MINSTE_TAK);
  const lonnPlass = Math.max(0, safeLonn - minst);
  const rentePlass = Math.max(0, rente);
  const aksjePlass = Math.max(0, gevinst) * AKSJE_FAKTOR;
  const total = lonnPlass + rentePlass + aksjePlass;
  const iGlass = Math.min(total, PERSONFRADRAG);
  const over = Math.max(0, total - PERSONFRADRAG);
  const ledigForGevinst = Math.max(0, PERSONFRADRAG - lonnPlass - rentePlass);
  return {
    minst,
    lonnPlass,
    rentePlass,
    aksjePlass,
    total,
    iGlass,
    over,
    skatt: over * ALMINNELIG_SATS,
    ledigForGevinst,
    maksFriGevinst: ledigForGevinst / AKSJE_FAKTOR,
  };
}

function assertGlass() {
  const sample = fillGlass(108_000, 10_000, 26_500);
  if (sample.lonnPlass !== 58_320) {
    throw new Error(`Lønn i glasset ble ${sample.lonnPlass}`);
  }
  if (sample.aksjePlass !== 45_580) {
    throw new Error(`Aksjeplass ble ${sample.aksjePlass}`);
  }
  if (sample.ledigForGevinst !== 46_220) {
    throw new Error(`Ledig plass ble ${sample.ledigForGevinst}`);
  }
  if (sample.over !== 0) throw new Error("Eksempelet skal få plass");
  const capped = fillGlass(300_000, 0, 0);
  if (capped.minst !== MINSTE_TAK) throw new Error("Minstefradraget skal treffe taket");
}

assertGlass();
