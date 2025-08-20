"use client"

import { useEffect, useRef, useState } from "react"
import grapesjs from "grapesjs"
import gjsPreset from "grapesjs-preset-webpage"
import type { Editor } from "grapesjs"
import { Loader2 } from "lucide-react"

interface EditablePreviewProps {
  initialContent: string
  onChange?: (html: string) => void
}

export function EditablePreview({ initialContent, onChange }: EditablePreviewProps) {
  const editorRef = useRef<Editor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    editorRef.current = grapesjs.init({
      container: containerRef.current,
      fromElement: true,
      height: "100%",
      width: "auto",
      storageManager: false,
      plugins: [gjsPreset],
      pluginsOpts: {
        gjsPreset: {
          textCleanCanvas: true,
        },
      },
      canvas: {
        styles: ["https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"],
      },
      panels: {
        defaults: [
          {
            id: "basic-actions",
            buttons: [
              // "undo",
              // "redo",
              {
                id: "save",
                className: "fa fa-floppy-o",
                command: "save-page",
                attributes: { title: "Save" },
              },
            ],
          },
        ],
      },
    })

    const editor = editorRef.current

    editor.setComponents(initialContent)

    editor.on("component:update", () => {
      const html = editor.getHtml()
      onChange?.(html)
    })

    editor.on("load", () => {
      setIsLoading(false)
    })

    return () => {
      editor.destroy()
    }
  }, [initialContent, onChange])

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <div ref={containerRef} className="h-full" />
}

