"use client";

import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";
import { IdeaFab } from "@/components/IdeaFab";
import { DataBackup } from "@/components/DataBackup";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,_#eef4f9_0%,_#f7f5f1_45%,_#f3efe8_100%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white">
              MP
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg tracking-tight text-slate-900">
              MesterPlan
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm ${
                pathname === "/"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Hjem</span>
            </Link>
            <Link
              href="/begrepsbanken"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm ${
                pathname?.startsWith("/begrepsbanken")
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Begrepsbanken</span>
            </Link>
            <Link
              href="/sok"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm ${
                pathname === "/sok"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Søk</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-28">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 pb-24">
        <DataBackup />
        <p className="mt-2 text-xs text-slate-400">
          Lokal lagring i nettleseren. Ta backup med eksporter JSON.
        </p>
      </footer>
      <IdeaFab />
    </div>
  );
}
