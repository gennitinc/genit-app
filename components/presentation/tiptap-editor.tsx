"use client";

import { TiptapToolbar } from "./tiptap-toolbar";
import { cn } from "@/lib/utils";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "@tiptap/extension-font-size";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  showToolbar?: boolean;
  containerElement?: HTMLElement | null;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  className,
  editable = true,
  showToolbar = true,
  containerElement,
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontFamily,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none",
          "prose-headings:font-bold prose-p:my-2",
          className
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className='relative w-full'>
      <EditorContent
        editor={editor}
        className={cn("min-h-[100px] w-full", className)}
      />
      {showToolbar && editable && (
        <TiptapToolbar editor={editor} containerElement={containerElement} />
      )}
    </div>
  );
}
