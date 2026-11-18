"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

function CalloutView({ node, updateAttributes }: NodeViewProps) {
  return (
    <NodeViewWrapper className="my-3">
      <div className="rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2">
        <input
          className="mb-1 w-full bg-transparent text-sm font-semibold text-sky-900 outline-none placeholder:text-sky-400"
          value={node.attrs.title ?? ""}
          placeholder="Tittel på uthevet boks (valgfritt)"
          onChange={(e) => updateAttributes({ title: e.target.value })}
        />
        <NodeViewContent className="text-[15px] leading-relaxed text-slate-800" />
      </div>
    </NodeViewWrapper>
  );
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      title: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "callout" }),
      0,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CalloutView);
  },
});

function ToggleView({ node, updateAttributes }: NodeViewProps) {
  const [open, setOpen] = useState(true);
  return (
    <NodeViewWrapper className="my-2">
      <div className="rounded-lg border border-slate-200 bg-white">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-800"
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronRight
            className={`h-4 w-4 shrink-0 text-slate-500 transition ${open ? "rotate-90" : ""}`}
          />
          <input
            className="flex-1 bg-transparent outline-none"
            value={node.attrs.title ?? ""}
            placeholder="Tittel på sammenleggbar"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateAttributes({ title: e.target.value })}
          />
        </button>
        {open && (
          <div className="border-t border-slate-100 px-3 py-2">
            <NodeViewContent className="text-[15px] leading-relaxed" />
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const ToggleBlock = Node.create({
  name: "toggleBlock",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      title: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="toggle"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "toggle" }),
      0,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ToggleView);
  },
});
