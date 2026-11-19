import { Flame } from "lucide-react";

/** Lys flamme for en fullført dag. Tomme dager bruker den ikke. */
export function StreakFlame({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <Flame
      className={className}
      strokeWidth={1.75}
      fill="#FDBA74"
      color="#C2410C"
      aria-hidden
    />
  );
}
