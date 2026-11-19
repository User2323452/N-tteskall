"use client";

import Link from "next/link";
import { BookOpen, Home, Map, Route, UserRound } from "lucide-react";
import { IdeaFab } from "@/components/IdeaFab";
import { LogoMark } from "@/components/LogoMark";
import { NavMemory } from "@/components/nav-memory";
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
    match: (p: string) => p.startsWith("/sok") || p.startsWith("/konsept"),
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

function screenKey(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "lop" && parts.length >= 2) return `lop/${parts[1]}`;
  return pathname || "/";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const showIdeaFab =
    pathname.startsWith("/notater") || pathname.startsWith("/tema");
  const onHome = pathname === "/";
  const detail =
    /^\/lop\/[^/]+/.test(pathname) || pathname.startsWith("/konsept/");

  return (
    <NavMemory>
    <div
      className={`flex h-dvh flex-col overflow-hidden bg-[var(--background)] text-[var(--ink)] ${detail ? "is-detail" : ""}`}
    >
      <header
        className={`z-30 shrink-0 bg-[var(--background)]/90 backdrop-blur-md ${
          detail || onHome ? "max-sm:hidden" : ""
        }`}
      >
        <div className="mx-auto flex h-12 max-w-2xl items-center justify-between gap-3 px-5">
          <div className="min-w-0">
            {!onHome && (
              <Link
                href="/"
                aria-label="Hjem"
                className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg text-[var(--accent)]"
              >
                <LogoMark className="h-9 w-9 shrink-0" />
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

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl px-5 pt-4 pb-8">
          <div
            key={screenKey(pathname)}
            className={detail ? "screen-fade" : "screen-enter"}
          >
            {children}
          </div>
        </div>
      </main>

      <nav
        className="z-40 flex shrink-0 items-start px-3 pt-1.5 sm:hidden"
        style={{
          height: "var(--pill-offset)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        aria-label="Hovedmeny"
      >
        <ul className="mx-auto flex w-full max-w-md items-stretch gap-0.5 rounded-full border border-[var(--line)] bg-white/95 px-1.5 py-1.5 shadow-[0_10px_30px_rgba(26,35,50,0.14)] backdrop-blur-md">
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
    </NavMemory>
  );
}
