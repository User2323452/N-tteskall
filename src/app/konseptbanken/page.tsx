import { Suspense } from "react";
import { KonseptbankenView } from "@/components/KonseptbankenView";

export default function KonseptbankenPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Laster konsepter…</p>}>
      <KonseptbankenView />
    </Suspense>
  );
}
