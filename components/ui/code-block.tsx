"use client"

import { useTheme } from "next-themes"
import { Copy } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
  showCopy?: boolean
}

export function CodeBlock({ code, language = "typescript", className, showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre
        className={cn(
          "mt-2 p-4 rounded-lg text-sm w-full overflow-x-auto",
          "bg-zinc-100 text-zinc-900",
          "dark:bg-zinc-900 dark:text-zinc-50",
          "border border-zinc-200 dark:border-zinc-800",
          className,
        )}
      >
        <code className={cn("block font-mono", language)}>{code}</code>
      </pre>
      {showCopy && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-4 top-4",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-zinc-200 dark:hover:bg-zinc-800",
          )}
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy code</span>
        </Button>
      )}
      {copied && (
        <div
          className={cn(
            "absolute right-4 top-4 px-2 py-1 text-sm rounded",
            "bg-zinc-200 text-zinc-900",
            "dark:bg-zinc-800 dark:text-zinc-50",
          )}
        >
          Copied!
        </div>
      )}
    </div>
  )
}

