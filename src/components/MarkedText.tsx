"use client";

import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getOrd } from "@/data/ordliste";
import { parseMarkup } from "@/lib/markup";

type OpenCard = {
  ordId: string;
  label: string;
  cardId: string;
  button: HTMLButtonElement;
};

type Ordlag = {
  open: OpenCard | null;
  toggle: (next: OpenCard) => void;
  close: () => void;
};

const OrdlagContext = createContext<Ordlag | null>(null);

export function OrdlagProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<OpenCard | null>(null);
  const openRef = useRef(open);
  openRef.current = open;

  function close() {
    const current = openRef.current;
    setOpen(null);
    current?.button.focus({ preventScroll: true });
  }

  function toggle(next: OpenCard) {
    if (openRef.current?.button === next.button) {
      close();
      return;
    }
    setOpen(next);
  }

  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  return (
    <OrdlagContext.Provider value={{ open, toggle, close }}>
      {children}
      {open && <OrdCard state={open} onClose={close} />}
    </OrdlagContext.Provider>
  );
}

function scrollParent(node: HTMLElement | null): EventTarget {
  let current = node?.parentElement ?? null;
  while (current) {
    const overflow = getComputedStyle(current).overflowY;
    if (overflow === "auto" || overflow === "scroll") return current;
    current = current.parentElement;
  }
  return window;
}

function OrdCard({ state, onClose }: { state: OpenCard; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const ord = getOrd(state.ordId);
  const [box, setBox] = useState<{ top: number; left: number; above: boolean } | null>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const button = state.button;
    if (!card) return;
    const place = () => {
      const rect = button.getBoundingClientRect();
      const width = Math.min(280, window.innerWidth - 24);
      card.style.width = `${width}px`;
      const height = card.offsetHeight;
      const margin = 12;
      let left = rect.left;
      if (left + width > window.innerWidth - margin) {
        left = window.innerWidth - margin - width;
      }
      if (left < margin) left = margin;
      const spaceBelow = window.innerHeight - rect.bottom;
      const above = spaceBelow < height + 8 && rect.top > height + 8;
      const top = above ? rect.top - height - 6 : rect.bottom + 6;
      setBox({ top, left, above });
    };
    place();
    card.focus({ preventScroll: true });
  }, [state]);

  useEffect(() => {
    const parent = scrollParent(state.button);
    const onScroll = () => onClose();
    parent.addEventListener("scroll", onScroll, { capture: true, passive: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (cardRef.current?.contains(target)) return;
      if (state.button.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      parent.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [onClose, state.button]);

  if (!ord || typeof document === "undefined") return null;
  const titleId = `${state.cardId}-title`;

  return createPortal(
    <div
      ref={cardRef}
      id={state.cardId}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed z-50 max-w-[280px] rounded-2xl border border-[var(--line)] bg-white p-3 shadow-[0_10px_30px_rgba(26,35,50,0.14)] outline-none"
      style={box ? { top: box.top, left: box.left } : { top: -9999, left: 0 }}
    >
      <p id={titleId} className="text-sm font-semibold text-[var(--ink)]">
        {ord.term}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{ord.kort}</p>
      {ord.konseptId && (
        <Link
          href={`/konsept/${ord.konseptId}`}
          className="mt-2 inline-flex text-sm font-medium text-[var(--accent)]"
          onClick={onClose}
        >
          Les mer om konseptet →
        </Link>
      )}
    </div>,
    document.body
  );
}

function Fagord({ id, label }: { id: string; label: string }) {
  const ctx = useContext(OrdlagContext);
  const reactId = useId();
  const cardId = `fagord-${reactId.replace(/:/g, "")}`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const open = ctx?.open?.cardId === cardId;

  if (!ctx) return <span>{label}</span>;

  return (
    <button
      ref={buttonRef}
      type="button"
      className="fagord"
      aria-expanded={open}
      aria-controls={open ? cardId : undefined}
      onClick={() => {
        const button = buttonRef.current;
        if (!button) return;
        ctx.toggle({ ordId: id, label, cardId, button });
      }}
    >
      {label}
    </button>
  );
}

/** Tekst med [[id]], [[id|vist tekst]] og {{sats:id}}. */
export function MarkedText({ text }: { text: string }) {
  const parts = parseMarkup(text);
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "text") return <span key={index}>{part.text}</span>;
        if (part.type === "sats") return <span key={index}>{part.text}</span>;
        return <Fagord key={index} id={part.id} label={part.label} />;
      })}
    </>
  );
}
