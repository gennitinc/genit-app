"use client";

import React, { useCallback, useEffect, useRef } from "react";
import {
  EditorRoot,
  EditorContent,
  useEditor,
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  StarterKit,
  TiptapUnderline,
  TiptapLink,
  Placeholder,
  Command,
  renderItems,
  createSuggestionItems,
  TiptapImage,
  UploadImagesPlugin,
  createImageUpload,
  handleImagePaste,
  handleImageDrop,
  TaskList,
  TaskItem,
  handleCommandNavigation,
} from "novel";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Text,
  Image as ImageIcon,
  CheckSquare,
  MessageSquarePlus,
  TextQuote,
} from "lucide-react";
import { apiResponse } from "@/utils/apiResponse";
import { toast } from "sonner";

interface NotionEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// 1. Configure the custom image extension with the upload placeholder plugin
const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: "opacity-40 rounded-xl border border-zinc-800",
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "rounded-xl border border-zinc-850 max-w-full my-6 mx-auto block shadow-xl",
  },
});

// 2. Configure the image upload function connecting to our server backend
const onUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiResponse.post("/blog/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (res.data && res.data.url) {
    return res.data.url;
  }
  throw new Error("Failed to retrieve upload URL");
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported. Please select an image file.");
      return false;
    } else if (file.size / 1024 / 1024 > 10) {
      toast.error("File size too big. Maximum allowed size is 10MB.");
      return false;
    }
    return true;
  },
});

// 3. Custom suggestion items for the slash command list
const suggestionItems = createSuggestionItems([
  {
    title: "Send Feedback",
    description: "Let us know how we can improve.",
    searchTerms: ["feedback", "bug", "support", "help"],
    icon: <MessageSquarePlus className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      window.open("/feedback", "_blank");
    },
  },
  {
    title: "Text",
    description: "Start typing with plain text.",
    searchTerms: ["p", "paragraph", "text"],
    icon: <Text className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: <CheckSquare className="h-4 w-4" />,
    command: ({ editor, range }) => {
      (editor.chain().focus() as any).deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large", "h1"],
    icon: <Heading1 className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium", "h2"],
    icon: <Heading2 className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small", "h3"],
    icon: <Heading3 className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point", "bullet", "list"],
    icon: <List className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered", "list", "number"],
    icon: <ListOrdered className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote block.",
    searchTerms: ["blockquote", "quote"],
    icon: <TextQuote className="h-4 w-4" />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["code", "codeblock", "pre"],
    icon: <Code className="h-4 w-4" />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media", "image", "upload"],
    icon: <ImageIcon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFn(file, editor.view, pos);
        }
      };
      input.click();
    },
  },
]);

// Inner component to handle initial content and links
function EditorInner({ value, onChange }: NotionEditorProps) {
  const { editor } = useEditor();
  const hasInitialized = useRef(false);

  // Sync editor content when value changes from outside (e.g., AI generation)
  useEffect(() => {
    if (!editor) return;

    // Initial load
    if (!hasInitialized.current && value) {
      editor.commands.setContent(value);
      hasInitialized.current = true;
      return;
    }

    // Programmatic update: only set content if it actually differs
    // This avoids cursor jumps during normal user typing
    if (hasInitialized.current && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter Target URL:", previousUrl || "https://");

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="relative w-full">
      {/* Floating selection bubble menu */}
      <EditorBubble
        pluginKey="bubbleMenu"
        className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 px-1.5 py-1 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-100"
      >
        <EditorBubbleItem
          onSelect={(editor) => editor.chain().focus().toggleBold().run()}
        >
          <button
            type="button"
            className={`p-1.5 rounded-lg cursor-pointer hover:bg-zinc-850 transition ${
              editor.isActive("bold") ? "text-cyan-400" : "text-zinc-400"
            }`}
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
        </EditorBubbleItem>
        <EditorBubbleItem
          onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
        >
          <button
            type="button"
            className={`p-1.5 rounded-lg cursor-pointer hover:bg-zinc-855 transition ${
              editor.isActive("italic") ? "text-cyan-400" : "text-zinc-400"
            }`}
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
        </EditorBubbleItem>
        <EditorBubbleItem
          onSelect={(editor) => editor.chain().focus().toggleUnderline().run()}
        >
          <button
            type="button"
            className={`p-1.5 rounded-lg cursor-pointer hover:bg-zinc-855 transition ${
              editor.isActive("underline") ? "text-cyan-400" : "text-zinc-400"
            }`}
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </button>
        </EditorBubbleItem>
        <EditorBubbleItem
          onSelect={setLink}
        >
          <button
            type="button"
            className={`p-1.5 rounded-lg cursor-pointer hover:bg-zinc-855 transition ${
              editor.isActive("link") ? "text-cyan-400" : "text-zinc-400"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>
        </EditorBubbleItem>
      </EditorBubble>

      {/* Slash commands menu */}
      <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 px-1 py-1 shadow-2xl transition-all">
        <EditorCommandEmpty className="px-3 py-2 text-xs text-zinc-500">
          No results found
        </EditorCommandEmpty>
        <EditorCommandList>
          {suggestionItems.map((item) => (
            <EditorCommandItem
              value={item.title}
              onCommand={(val) => item.command?.(val)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-900 aria-selected:bg-zinc-900 cursor-pointer transition"
              key={item.title}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-850 bg-zinc-900 text-zinc-400">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-xs text-zinc-200">{item.title}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{item.description}</p>
              </div>
            </EditorCommandItem>
          ))}
        </EditorCommandList>
      </EditorCommand>
    </div>
  );
}

export function NotionEditor({ value, onChange }: NotionEditorProps) {
  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    TiptapUnderline,
    TiptapLink.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-cyan-400 underline cursor-pointer",
      },
    }),
    Placeholder.configure({
      placeholder: "Press '/' for commands, drag and drop images, or highlight text for formatting...",
    }),
    Command.configure({
      suggestion: {
        items: () => suggestionItems,
        render: renderItems,
      },
    }),
    tiptapImage,
    TaskList,
    TaskItem.configure({
      HTMLAttributes: {
        class: "flex items-start my-4",
      },
      nested: true,
    }),
  ];

  const editorProps = {
    attributes: {
      class:
        "prose prose-invert max-w-none min-h-[380px] outline-none text-zinc-300 leading-relaxed p-6 focus:outline-none",
    },
    handlePaste: (view: any, event: any) => handleImagePaste(view, event, uploadFn),
    handleDrop: (view: any, event: any, _slice: any, moved: any) =>
      handleImageDrop(view, event, moved, uploadFn),
    handleKeyDown: (view: any, event: any) => handleCommandNavigation(event),
  };

  return (
    <div className="relative overflow-hidden flex flex-col group transition">
      <EditorRoot>
        <EditorContent
          extensions={extensions as any}
          editorProps={editorProps as any}
          immediatelyRender={false}
          onUpdate={({ editor }) => {
            onChange(editor.getHTML());
          }}
        >
          <EditorInner value={value} onChange={onChange} />
        </EditorContent>
      </EditorRoot>

      {/* Notion styling helper styles */}
      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #52525b;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror pre {
          background: #09090b;
          font-family: var(--font-mono), monospace;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid #27272a;
          color: #e4e4e7;
          margin: 1rem 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #06b6d4;
          padding-left: 1rem;
          font-style: italic;
          color: #d4d4d8;
          margin: 1.5rem 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror a {
          color: #22d3ee;
          text-decoration: underline;
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0.5rem;
        }
        .ProseMirror li[data-type="taskItem"] {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror li[data-type="taskItem"] > label {
          margin-top: 0.2rem;
          user-select: none;
        }
        .ProseMirror li[data-type="taskItem"] > div {
          flex: 1;
        }
        .ProseMirror li[data-type="taskItem"][data-checked="true"] > div {
          text-decoration: line-through;
          color: #71717a;
        }
      `}</style>
    </div>
  );
}
