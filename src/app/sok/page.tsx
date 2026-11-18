import { Suspense } from "react";
import { SearchView } from "@/components/SearchView";

export default function SokPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Laster søk…</p>}>
      <SearchView />
    </Suspense>
  );
}
