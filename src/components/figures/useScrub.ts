import { useCallback, useRef } from "react";

/** Server og nettleser kan skrive siste desimal ulikt. Avrundede koordinater gir lik SVG. */
export function round(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * Dra vannrett i en SVG for å velge en verdi. `touch-action: pan-y` på SVG-en
 * lar siden fortsatt rulle loddrett på telefonen.
 */
export function useScrub(
  viewWidth: number,
  plotLeft: number,
  plotRight: number,
  onPick: (share: number) => void
) {
  const active = useRef(false);

  const pick = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const box = event.currentTarget.getBoundingClientRect();
      if (box.width === 0) return;
      const x = ((event.clientX - box.left) / box.width) * viewWidth;
      const share = (x - plotLeft) / (plotRight - plotLeft);
      onPick(Math.min(1, Math.max(0, share)));
    },
    [viewWidth, plotLeft, plotRight, onPick]
  );

  return {
    style: { touchAction: "pan-y" as const, cursor: "ew-resize" },
    onPointerDown: (event: React.PointerEvent<SVGSVGElement>) => {
      active.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      pick(event);
    },
    onPointerMove: (event: React.PointerEvent<SVGSVGElement>) => {
      if (active.current) pick(event);
    },
    onPointerUp: () => {
      active.current = false;
    },
    onPointerCancel: () => {
      active.current = false;
    },
  };
}
