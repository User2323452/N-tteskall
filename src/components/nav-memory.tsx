"use client";

import { createContext, useContext, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPath } from "@/data/learning";

type NavApi = {
  backTarget: (fallback: string) => string | null;
  replace: (href: string) => void;
  back: (fallback: string) => void;
};

const NavContext = createContext<NavApi | null>(null);

export function useNav() {
  return useContext(NavContext);
}

function isPathOverview(path: string) {
  return /^\/lop\/[^/]+$/.test(path);
}

export function placeLabel(path: string): string {
  if (path === "/") return "Hjem";
  if (path === "/lop") return "Løp";
  if (path.startsWith("/kart") || path.startsWith("/oversikt")) return "Kart";
  if (path.startsWith("/repeter")) return "Repeter";
  if (path.startsWith("/profil")) return "Profil";
  if (path.startsWith("/sok")) return "Søk";
  if (path.startsWith("/notater") || path.startsWith("/tema")) return "Notater";
  const lesson = path.match(/^\/lop\/([^/]+)\//);
  if (lesson) return getPath(lesson[1])?.title ?? "Løpet";
  if (path.startsWith("/lop/")) return "Løpet";
  if (path.startsWith("/begrep/")) return "Begrepet";
  return "Tilbake";
}

export function NavMemory({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const stack = useRef<string[]>([pathname]);
  const pathnameRef = useRef(pathname);
  const replaceNext = useRef(false);
  const skipRecord = useRef(false);

  if (replaceNext.current) {
    replaceNext.current = false;
    stack.current[stack.current.length - 1] = pathname;
    pathnameRef.current = pathname;
  } else if (pathnameRef.current !== pathname) {
    const history = stack.current;
    if (skipRecord.current) {
      skipRecord.current = false;
      if (history[history.length - 1] !== pathname) history.push(pathname);
    } else if (history.length >= 2 && history[history.length - 2] === pathname) {
      history.pop();
    } else if (history[history.length - 1] !== pathname) {
      history.push(pathname);
    }
    if (history.length > 40) history.splice(0, history.length - 40);
    pathnameRef.current = pathname;
  }

  const api = useMemo<NavApi>(() => {
    function findBackIndex() {
      const history = stack.current;
      const current = history[history.length - 1] ?? "";
      for (let i = history.length - 2; i >= 0; i -= 1) {
        const candidate = history[i];
        if (!candidate || candidate === current) continue;
        if (isPathOverview(current) && candidate.startsWith(`${current}/`)) continue;
        return i;
      }
      return -1;
    }

    return {
      backTarget(fallback: string) {
        const index = findBackIndex();
        return index < 0 ? null : (stack.current[index] ?? fallback);
      },
      replace(href: string) {
        replaceNext.current = true;
        router.replace(href);
      },
      back(fallback: string) {
        const history = stack.current;
        const index = findBackIndex();
        if (index < 0) {
          router.push(fallback);
          return;
        }
        const steps = history.length - 1 - index;
        if (steps === 1) {
          router.back();
          return;
        }
        const target = history[index] ?? fallback;
        history.splice(index + 1);
        skipRecord.current = true;
        router.push(target);
      },
    };
  }, [router]);

  return <NavContext.Provider value={api}>{children}</NavContext.Provider>;
}

export function BackLink({
  fallback,
  label,
  className,
}: {
  fallback: string;
  /** Fast tekst, for eksempel «Avslutt». Ellers navnet på forrige sted. */
  label?: string;
  className?: string;
}) {
  const nav = useNav();
  const target = nav?.backTarget(fallback) ?? null;
  const text = label ?? (target ? placeLabel(target) : placeLabel(fallback));
  const cls =
    className ??
    "inline-flex min-h-11 items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--ink)]";

  if (!nav || !target) {
    return (
      <Link href={fallback} className={cls}>
        <ArrowLeft className="h-4 w-4" />
        {text}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => nav.back(fallback)} className={cls}>
      <ArrowLeft className="h-4 w-4" />
      {text}
    </button>
  );
}
