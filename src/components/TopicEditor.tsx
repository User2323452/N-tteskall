"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEffect, useRef } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  MessageSquareQuote,
  ChevronsUpDown,
} from "lucide-react";
import { Callout, ToggleBlock } from "@/lib/tiptap-extensions";

type Props = {
  content: unknown;
  onChange: (json: unknown) => void;
  editable?: boolean;
};

export function TopicEditor({ content, onChange, editable = true }: Props) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Skriv med egne ord…",
      }),
      Callout,
      ToggleBlock,
    ],
    content: content as object,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[220px] focus:outline-none px-1 py-2 text-[15px] leading-relaxed",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        onChange(ed.getJSON());
      }, 400);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  if (!editor) return null;

  const btn =
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40";

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {editable && (
        <div className="flex flex-wrap gap-1 border-b border-slate-100 px-2 py-1.5">
          <button
            type="button"
            className={btn}
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-label="Fet"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Kursiv"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            aria-label="Overskrift 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            aria-label="Overskrift 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Punktliste"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="Nummerert liste"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "callout",
                  attrs: { title: "" },
                  content: [{ type: "paragraph" }],
                })
                .run()
            }
            aria-label="Callout"
          >
            <MessageSquareQuote className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "toggleBlock",
                  attrs: { title: "Toggle" },
                  content: [{ type: "paragraph" }],
                })
                .run()
            }
            aria-label="Toggle"
          >
            <ChevronsUpDown className="h-4 w-4" />
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
