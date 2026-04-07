"use client";

import { memo, useState, useRef, useEffect, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { ImageIcon, Download, ExternalLink, Brush, X, Check, Loader2, Eraser, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useInpaint } from "@/hooks/use-inpaint";
import { useProjectDesign } from "@/context/DesignProject";
import { toast } from "sonner";
import { MaskEditor, toMask } from "react-mask-editor";
import "react-mask-editor/dist/style.css";

export interface DesignNodeData {
  url: string;
  instruction?: string;
  title?: string;
  status?: string;
  generationGroupId?: string;
}

export const DesignNode = memo(({ data, selected, id }: NodeProps<DesignNodeData>) => {
  const { url, title, instruction, generationGroupId } = data;
  const { project } = useProjectDesign();
  const { inpaint, isInpainting } = useInpaint();

  const [isInpaintMode, setIsInpaintMode] = useState(false);
  const [brushSize, setBrushSize] = useState(40);
  const [inpaintPrompt, setInpaintPrompt] = useState("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = title || "design.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, "_blank");
    }
  };

  const handleSubmitInpaint = async () => {
    if (!canvasRef.current || !project?._id || !inpaintPrompt.trim()) {
      toast.error("Please provide an instruction/prompt");
      return;
    }

    // Convert mask canvas to blob
    const maskCanvas = canvasRef.current;
    maskCanvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await inpaint({
          projectId: project._id,
          originalImageUrl: url,
          prompt: inpaintPrompt,
          maskBlob: blob,
          generationGroupId: generationGroupId,
        });
        setIsInpaintMode(false);
        setInpaintPrompt("");
      } catch (err) {
        // Error handled in hook
      }
    }, "image/png");
  };

  return (
    <div className="group relative flex flex-col gap-2 w-[350px]">
      {/* Node Title */}
      <div className="px-1 flex items-center justify-between">
        <h4 className="text-[10px] font-medium text-muted-foreground flex flex-row items-center">
          {title || "Design Variant"}
          {selected && !isInpaintMode && (
            <div className="flex flex-row items-center gap-2">
              - active{" "}
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          )}
        </h4>
        {isInpaintMode && (
          <span className="text-[9px] font-bold text-primary animate-pulse uppercase tracking-tight">
            Inpaint Mode
          </span>
        )}
      </div>

      {/* Main Image Card */}
      <div
        className={cn(
          "relative bg-white dark:bg-zinc-900 border transition-all duration-500 ring-offset-background",
          selected
            ? "border-primary shadow-[0_0_60px_-15px_rgba(var(--primary-rgb),0.6)] ring-2 ring-primary ring-offset-2 scale-[1.02] z-20"
            : "border-border shadow-sm group-hover:border-zinc-400 dark:group-hover:border-zinc-500",
        )}
      >
        <div className="relative w-fit h-fit bg-muted/20 flex items-center justify-center overflow-hidden">
          {url ? (
            <img
              src={url}
              alt={instruction || "Design"}
              className={cn(
                "w-fit h-full object-cover transition-transform duration-500",
                !isInpaintMode && "group-hover:scale-105",
              )}
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-50">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs font-medium">No Image</span>
            </div>
          )}

          {/* MaskEditor Overlay */}
          {isInpaintMode && (
            <div className="absolute inset-0 z-40 bg-black/20">
              <MaskEditor
                src={url}
                canvasRef={canvasRef as React.MutableRefObject<HTMLCanvasElement>}
                cursorSize={brushSize}
                onCursorSizeChange={setBrushSize}
                maskOpacity={0.65}
                maskColor="#7c3aed"
                maskBlendMode="normal"
              />
              {/* Drawing Tooltip */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur rounded-full text-[10px] text-white/80 pointer-events-none z-50">
                Draw to highlight area
              </div>
            </div>
          )}

          {/* Hover Main Actions (Normal Mode) */}
          {!isInpaintMode && (
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-between gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsInpaintMode(true);
                }}
                className="h-fit p-2 rounded-full bg-white/10 border-white/20 hover:bg-white text-white hover:text-black flex items-center gap-2 backdrop-blur-md"
              >
                <Brush className="w-2.5 h-2.5" />
                <span className="text-[11px] font-bold">Inpaint</span>
              </Button> */}

              <div className="flex gap-1.5">
                <button
                  onClick={handleDownload}
                  className="p-2 h-fit rounded-full bg-white/10 hover:bg-white/90 flex items-center justify-center border border-white/20 text-white hover:text-black transition-all"
                >
                  <Download className="w-2 h-2" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(url, "_blank");
                  }}
                  className="p-2 h-fit rounded-full bg-white/10 hover:bg-white/90 flex items-center justify-center border border-white/20 text-white hover:text-black transition-all"
                >
                  <ExternalLink className="w-2 h-2" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inpaint Controls Panel (Inpaint Mode Only) */}
        {isInpaintMode && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-border space-y-4 animate-in slide-in-from-bottom duration-300">
            {/* Brush & Prompt */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Brush Size
                </span>
                <span className="text-[10px] font-mono">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full accent-primary h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Instruction
                </span>
                <textarea
                  value={inpaintPrompt}
                  onChange={(e) => setInpaintPrompt(e.target.value)}
                  placeholder="What would you like to change in this area?"
                  className="w-full bg-white dark:bg-black border border-border rounded-xl p-3 text-xs min-h-[80px] focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Inpaint Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsInpaintMode(false);
                }}
                className="flex-1 rounded-xl h-10 gap-2 border border-border"
              >
                <X className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase">Cancel</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // The MaskEditor doesn't have an easy clear ref, but we can re-toggle mode
                  setIsInpaintMode(false);
                  setTimeout(() => setIsInpaintMode(true), 10);
                }}
                className="w-10 h-10 rounded-xl border border-border"
                title="Clear mask"
              >
                <Eraser className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                disabled={isInpainting || !inpaintPrompt.trim()}
                onClick={handleSubmitInpaint}
                className="flex-[2] rounded-xl h-10 gap-2 bg-primary hover:bg-primary/90 text-white"
              >
                {isInpainting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span className="text-[11px] font-bold uppercase">
                  Generate Edit
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Invisible Handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
});

DesignNode.displayName = "DesignNode";
