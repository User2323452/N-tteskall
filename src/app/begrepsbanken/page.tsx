import { Suspense } from "react";
import { BegrepsbankenView } from "@/components/BegrepsbankenView";

export default function BegrepsbankenPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Laster begreper…</p>}>
      <BegrepsbankenView />
    </Suspense>
  );
}
