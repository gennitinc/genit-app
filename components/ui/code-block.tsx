"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
}

export function CodeBlock({
  code,
  language = "typescript",
  className,
  showCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='group relative'>
      <pre
        className={cn(
          "mt-2 w-full overflow-x-auto rounded-lg p-4 text-sm",
          "bg-zinc-100 text-zinc-900",
          "dark:bg-zinc-900 dark:text-zinc-50",
          "border border-zinc-200 dark:border-zinc-800",
          className
        )}
      >
        <code className={cn("block font-mono", language)}>{code}</code>
      </pre>
      {showCopy && (
        <Button
          variant='ghost'
          size='icon'
          className={cn(
            "absolute top-4 right-4",
            "opacity-0 transition-opacity group-hover:opacity-100",
            "hover:bg-zinc-200 dark:hover:bg-zinc-800"
          )}
          onClick={copyToClipboard}
        >
          <Copy className='h-4 w-4' />
          <span className='sr-only'>
            <LocalizedText text={"Copy code"} />
          </span>
        </Button>
      )}
      {copied && (
        <div
          className={cn(
            "absolute top-4 right-4 rounded px-2 py-1 text-sm",
            "bg-zinc-200 text-zinc-900",
            "dark:bg-zinc-800 dark:text-zinc-50"
          )}
        >
          <LocalizedText text={"Copied!"} />
        </div>
      )}
    </div>
  );
}
