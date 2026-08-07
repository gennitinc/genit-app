import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Copy, Download } from "lucide-react";
import { useTheme } from "next-themes";

interface FileHeaderProps {
  fileName: string;
  content: string;
}

export function FileHeader({ fileName, content }: FileHeaderProps) {
  const { theme } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      // You could add a toast notification here to confirm the copy action
    });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div
        className={cn(
          "sticky z-10 flex items-center justify-between border-b px-2 py-1",
          theme === "dark"
            ? "border-zinc-700 bg-zinc-800"
            : "border-zinc-200 bg-white"
        )}
      >
        <h2 className='flex-1 truncate text-xs font-medium'>{fileName}</h2>
        <div className='flex items-center space-x-1'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCopy}
                className='h-6 w-6 p-0'
              >
                <Copy className='h-3 w-3' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <LocalizedText text={"Copy"} />
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleDownload}
                className='h-6 w-6 p-0'
              >
                <Download className='h-3 w-3' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <LocalizedText text={"Download"} />
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
