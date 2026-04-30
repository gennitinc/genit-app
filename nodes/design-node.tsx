"use client";

import { Button } from "@/components/ui/button";
import { useProjectDesign } from "@/context/DesignProject";
import { useInpaint } from "@/hooks/use-inpaint";
import { cn } from "@/lib/utils";
import {
  Brush,
  Check,
  Download,
  Eraser,
  ExternalLink,
  ImageIcon,
  Loader2,
  Wand2,
  X,
} from "lucide-react";
import { MaskEditor, toMask } from "react-mask-editor";
import "react-mask-editor/dist/style.css";
import { Handle, NodeProps, Position } from "reactflow";
import { toast } from "sonner";
import { memo, useCallback, useEffect, useRef, useState } from "react";

export interface DesignNodeData {
  url: string;
  instruction?: string;
  title?: string;
  status?: string;
  generationGroupId?: string;
}

export const DesignNode = memo(
  ({ data, selected, id }: NodeProps<DesignNodeData>) => {
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
      <div className='group relative flex w-[350px] flex-col gap-2'>
        {/* Node Title */}
        <div className='flex items-center justify-between px-1'>
          <h4 className='text-muted-foreground flex flex-row items-center text-[10px] font-medium'>
            {title || "Design Variant"}
            {selected && !isInpaintMode && (
              <div className='flex flex-row items-center gap-2'>
                - active{" "}
                <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-green-500' />
              </div>
            )}
          </h4>
          {isInpaintMode && (
            <span className='text-primary animate-pulse text-[9px] font-bold tracking-tight uppercase'>
              Inpaint Mode
            </span>
          )}
        </div>

        {/* Main Image Card */}
        <div
          className={cn(
            "ring-offset-background relative border bg-white transition-all duration-500 dark:bg-zinc-900",
            selected
              ? "border-primary ring-primary z-20 scale-[1.02] shadow-[0_0_60px_-15px_rgba(var(--primary-rgb),0.6)] ring-2 ring-offset-2"
              : "border-border shadow-sm group-hover:border-zinc-400 dark:group-hover:border-zinc-500"
          )}
        >
          <div className='bg-muted/20 relative flex h-fit w-fit items-center justify-center overflow-hidden'>
            {url ? (
              <img
                src={url}
                alt={instruction || "Design"}
                className={cn(
                  "h-full w-fit object-cover transition-transform duration-500",
                  !isInpaintMode && "group-hover:scale-105"
                )}
                loading='lazy'
              />
            ) : (
              <div className='flex flex-col items-center gap-2 opacity-50'>
                <ImageIcon className='h-8 w-8' />
                <span className='text-xs font-medium'>No Image</span>
              </div>
            )}

            {/* MaskEditor Overlay */}
            {isInpaintMode && (
              <div className='absolute inset-0 z-40 bg-black/20'>
                <MaskEditor
                  src={url}
                  canvasRef={
                    canvasRef as React.MutableRefObject<HTMLCanvasElement>
                  }
                  cursorSize={brushSize}
                  onCursorSizeChange={setBrushSize}
                  maskOpacity={0.65}
                  maskColor='#7c3aed'
                  maskBlendMode='normal'
                />
                {/* Drawing Tooltip */}
                <div className='pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-3 py-1 text-[10px] text-white/80 backdrop-blur'>
                  Draw to highlight area
                </div>
              </div>
            )}

            {/* Hover Main Actions (Normal Mode) */}
            {!isInpaintMode && (
              <div className='absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-2 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0'>
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

                <div className='flex gap-1.5'>
                  <button
                    onClick={handleDownload}
                    className='flex h-fit items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-white transition-all hover:bg-white/90 hover:text-black'
                  >
                    <Download className='h-2 w-2' />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(url, "_blank");
                    }}
                    className='flex h-fit items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-white transition-all hover:bg-white/90 hover:text-black'
                  >
                    <ExternalLink className='h-2 w-2' />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Inpaint Controls Panel (Inpaint Mode Only) */}
          {isInpaintMode && (
            <div className='border-border animate-in slide-in-from-bottom space-y-4 border-t bg-zinc-50 p-4 duration-300 dark:bg-zinc-900'>
              {/* Brush & Prompt */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                    Brush Size
                  </span>
                  <span className='font-mono text-[10px]'>{brushSize}px</span>
                </div>
                <input
                  type='range'
                  min='10'
                  max='100'
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className='accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-800'
                />

                <div className='space-y-1.5'>
                  <span className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                    Instruction
                  </span>
                  <textarea
                    value={inpaintPrompt}
                    onChange={(e) => setInpaintPrompt(e.target.value)}
                    placeholder='What would you like to change in this area?'
                    className='border-border focus:ring-primary min-h-[80px] w-full resize-none rounded-xl border bg-white p-3 text-xs transition-all outline-none focus:ring-1 dark:bg-black'
                  />
                </div>
              </div>

              {/* Inpaint Actions */}
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setIsInpaintMode(false);
                  }}
                  className='border-border h-10 flex-1 gap-2 rounded-xl border'
                >
                  <X className='h-3.5 w-3.5' />
                  <span className='text-[11px] font-bold uppercase'>
                    Cancel
                  </span>
                </Button>

                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    // The MaskEditor doesn't have an easy clear ref, but we can re-toggle mode
                    setIsInpaintMode(false);
                    setTimeout(() => setIsInpaintMode(true), 10);
                  }}
                  className='border-border h-10 w-10 rounded-xl border'
                  title='Clear mask'
                >
                  <Eraser className='h-4 w-4' />
                </Button>

                <Button
                  size='sm'
                  disabled={isInpainting || !inpaintPrompt.trim()}
                  onClick={handleSubmitInpaint}
                  className='bg-primary hover:bg-primary/90 h-10 flex-[2] gap-2 rounded-xl text-white'
                >
                  {isInpainting ? (
                    <Loader2 className='h-3.5 w-3.5 animate-spin' />
                  ) : (
                    <Check className='h-3.5 w-3.5' />
                  )}
                  <span className='text-[11px] font-bold uppercase'>
                    Generate Edit
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Invisible Handles */}
        <Handle
          type='target'
          position={Position.Top}
          style={{ opacity: 0, pointerEvents: "none" }}
        />
        <Handle
          type='source'
          position={Position.Bottom}
          style={{ opacity: 0, pointerEvents: "none" }}
        />
      </div>
    );
  }
);

DesignNode.displayName = "DesignNode";
