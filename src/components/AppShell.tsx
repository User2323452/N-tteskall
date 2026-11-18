"use client";

import Link from "next/link";
import { BookOpen, Home, Map, Route, UserRound } from "lucide-react";
import { IdeaFab } from "@/components/IdeaFab";
import { LogoMark } from "@/components/LogoMark";
import { usePathname } from "next/navigation";

const headerNav = [
  { href: "/", label: "Hjem", match: (p: string) => p === "/" },
  { href: "/lop", label: "Løp", match: (p: string) => p.startsWith("/lop") },
  {
    href: "/kart",
    label: "Kart",
    match: (p: string) => p.startsWith("/kart") || p.startsWith("/oversikt"),
  },
  {
    href: "/repeter",
    label: "Repeter",
    match: (p: string) => p.startsWith("/repeter"),
  },
  {
    href: "/sok",
    label: "Søk",
    match: (p: string) => p.startsWith("/sok") || p.startsWith("/begrep"),
  },
];

const pill = [
  { href: "/", label: "Hjem", icon: Home, match: (p: string) => p === "/" },
  { href: "/lop", label: "Løp", icon: Route, match: (p: string) => p.startsWith("/lop") },
  {
    href: "/kart",
    label: "Kart",
    icon: Map,
    match: (p: string) => p.startsWith("/kart") || p.startsWith("/oversikt"),
  },
  {
    href: "/repeter",
    label: "Repeter",
    icon: BookOpen,
    match: (p: string) => p.startsWith("/repeter"),
  },
  {
    href: "/profil",
    label: "Profil",
    icon: UserRound,
    match: (p: string) => p.startsWith("/profil"),
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
        <div className="mx-auto flex h-12 max-w-2xl items-center justify-between gap-3 px-5">
          <div className="min-w-0">
            {onHome ? (
              <span className="flex items-center gap-2">
                <LogoMark className="h-8 w-8 shrink-0" />
                <span className="hidden font-[family-name:var(--font-display)] text-lg text-[var(--accent)] md:inline">
                  Nøtteskall
                </span>
              </span>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg text-[var(--accent)]"
              >
                <LogoMark className="h-8 w-8 shrink-0" />
                <span className="hidden md:inline">Nøtteskall</span>
              </Link>
            )}
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            {headerNav.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-2 py-1.5 text-sm ${
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
              className={`hidden text-sm sm:inline ${
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

      <main className="mx-auto max-w-xl px-5 py-4 pb-32 sm:pb-16">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden"
        aria-label="Hovedmeny"
      >
        <ul className="mx-auto flex max-w-md items-stretch gap-0.5 rounded-full border border-[var(--line)] bg-white/95 px-1.5 py-1.5 shadow-[0_10px_30px_rgba(26,35,50,0.14)] backdrop-blur-md">
          {pill.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <li key={item.href} className="min-w-0 flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1 text-[11px] font-medium ${
                    active
                      ? "bg-[var(--ink)] text-white"
                      : "text-[var(--muted)]"
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
