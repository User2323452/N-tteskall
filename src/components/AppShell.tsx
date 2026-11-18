"use client";

import Link from "next/link";
import { BookOpen, Home, Map, Search } from "lucide-react";
import { IdeaFab } from "@/components/IdeaFab";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Hjem", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/oversikt",
    label: "Oversikt",
    icon: Map,
    match: (p: string) => p.startsWith("/oversikt"),
  },
  {
    href: "/repeter",
    label: "Repeter",
    icon: BookOpen,
    match: (p: string) => p.startsWith("/repeter"),
  },
  {
    href: "/sok",
    label: "Søk",
    icon: Search,
    match: (p: string) => p.startsWith("/sok") || p.startsWith("/begrep"),
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const showIdeaFab =
    pathname.startsWith("/notater") || pathname.startsWith("/tema");
  const onHome = pathname === "/";

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--ink)]">
      <header className="sticky top-0 z-30 bg-[var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-xl items-center justify-between gap-3 px-5">
          <div className="min-w-0">
            {onHome ? (
              <span className="hidden font-[family-name:var(--font-display)] text-lg text-[var(--accent)] sm:inline">
                Nøtteskall
              </span>
            ) : (
              <Link
                href="/"
                className="font-[family-name:var(--font-display)] text-lg text-[var(--accent)]"
              >
                Nøtteskall
              </Link>
            )}
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-2.5 py-1.5 text-sm ${
                    active
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/notater"
              className={`hidden text-sm sm:inline ${
                pathname.startsWith("/notater") || pathname.startsWith("/tema")
                  ? "text-[var(--ink)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Notater
            </Link>
            <Link
              href="/profil"
              className={`text-sm ${
                pathname.startsWith("/profil")
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Profil
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 py-4 pb-28">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
        <ul className="mx-auto flex max-w-xl items-stretch justify-around px-2 pt-1">
          {nav.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                    active ? "text-[var(--accent)]" : "text-[var(--muted)]"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
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
