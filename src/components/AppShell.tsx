"use client";

import Link from "next/link";
import { BookOpen, Home, Library, Search } from "lucide-react";
import { IdeaFab } from "@/components/IdeaFab";
import { DataBackup } from "@/components/DataBackup";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showIdeaFab =
    pathname?.startsWith("/notater") || pathname?.startsWith("/tema");

  const nav = [
    { href: "/", label: "Hjem", icon: Home, match: (p: string) => p === "/" },
    {
      href: "/repeter",
      label: "Repeter",
      icon: BookOpen,
      match: (p: string) => p.startsWith("/repeter") || p.startsWith("/begrepsbanken"),
    },
    {
      href: "/sok",
      label: "Søk",
      icon: Search,
      match: (p: string) => p.startsWith("/sok") || p.startsWith("/begrep"),
    },
  ];

  return (
    <div className="min-h-dvh bg-[var(--background)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-[11px] font-bold tracking-wide text-white">
              MP
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg tracking-tight text-slate-900">
              MesterPlan
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => {
              const active = pathname ? item.match(pathname) : false;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/notater"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm ${
                pathname?.startsWith("/notater") || pathname?.startsWith("/tema")
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
              title="Mine notater"
            >
              <Library className="h-4 w-4" />
              <span className="text-xs">Notater</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 pb-28">{children}</main>

      <footer className="mx-auto max-w-3xl px-4 pb-28">
        <DataBackup />
        <p className="mt-2 text-xs text-slate-400">
          Fremdrift og repetisjon lagres lokalt i nettleseren. Ta sikkerhetskopi
          før du bytter enhet.
        </p>
      </footer>

      {/* Mobil bunnnav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
        <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
          {nav.map((item) => {
            const active = pathname ? item.match(pathname) : false;
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                    active ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {showIdeaFab && <IdeaFab />}
    </div>
  );
}
