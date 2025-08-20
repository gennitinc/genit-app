import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface FileHeaderProps {
  fileName: string;
  content: string;
}

export function FileHeader({ fileName, content }: FileHeaderProps) {
  const { theme } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      // You could add a toast notification here to confirm the copy action
      console.log("Content copied to clipboard");
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
          "flex items-center sticky z-10 justify-between px-2 py-1 border-b",
          theme === "dark"
            ? "bg-zinc-800 border-zinc-700"
            : "bg-white border-zinc-200"
        )}
      >
        <h2 className="text-xs font-medium truncate flex-1">{fileName}</h2>
        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-6 w-6 p-0"
              >
                <Download className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
