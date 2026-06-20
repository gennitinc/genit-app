"use client";

import { Button } from "@/components/ui/button";
import { useProjectDesign } from "@/context/DesignProject";
import { useInpaint } from "@/hooks/use-inpaint";
import { cn } from "@/lib/utils";
import { serverUrlSocket } from "@/utils/apiResponse";
import { IconBrush } from "@tabler/icons-react";
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
  type?: string;
}

const getFullUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = serverUrlSocket
    ? serverUrlSocket.replace(/\/$/, "")
    : "http://localhost:8000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export const DesignNode = memo(
  ({ data, selected, id }: NodeProps<DesignNodeData>) => {
    const { url, title, instruction, generationGroupId, type } = data;
    const { project } = useProjectDesign();
    const { inpaint, isInpainting } = useInpaint();

    const isVideo =
      type?.startsWith("video/") ||
      url?.toLowerCase().endsWith(".mp4") ||
      url?.toLowerCase().endsWith(".webm") ||
      url?.toLowerCase().endsWith(".mov") ||
      url?.toLowerCase().endsWith(".ogg");

    const [isInpaintMode, setIsInpaintMode] = useState(false);
    const [brushSize, setBrushSize] = useState(40);
    const [inpaintPrompt, setInpaintPrompt] = useState("");

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDownload = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!url) return;
      try {
        const fullUrl = getFullUrl(url);
        const response = await fetch(fullUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = title || (isVideo ? "video.mp4" : "design.png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        window.open(getFullUrl(url), "_blank");
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
      <div
        className={cn(
          "group relative flex w-[340px] flex-col",
          selected && "z-20"
        )}
      >
        {/* Floating Header */}
        <div
          className={cn(
            "mb-1 flex h-9 items-center justify-between rounded-lg border border-zinc-200/60 bg-white px-2.5 transition-colors dark:border-zinc-800 dark:bg-zinc-900",
            selected &&
              "border-violet-400/40 bg-violet-50/40 dark:bg-violet-950/10"
          )}
        >
          <div className='flex min-w-0 items-center gap-1.5'>
            <span
              className='w-40 truncate text-xs font-medium text-zinc-700 dark:text-zinc-300'
              title={title || (isVideo ? "Video Variant" : "Design Variant")}
            >
              {title || (isVideo ? "Video Variant" : "Design Variant")}
            </span>
          </div>

          <div className='flex items-center gap-4'>
            {!isVideo && (
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation();
                  setIsInpaintMode(!isInpaintMode);
                }}
                className={cn(
                  "h-4 w-4 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  isInpaintMode &&
                    "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
                )}
              >
                <IconBrush className='h-3 w-3' />
              </Button>
            )}

            <Button
              variant='ghost'
              size='icon'
              onClick={handleDownload}
              className='h-4 w-4 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            >
              <Download className='h-3 w-3' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              onClick={(e) => {
                e.stopPropagation();
                window.open(getFullUrl(url), "_blank");
              }}
              className='h-4 w-4 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            >
              <ExternalLink className='h-3 w-3' />
            </Button>
          </div>
        </div>

        {/* Image/Video Surface */}
        <div
          className={cn(
            "dark:bg-zinc-955 relative overflow-hidden rounded-sm bg-white transition-all",
            selected && "ring-primary/20 ring-1"
          )}
        >
          {url ? (
            isVideo ? (
              <video
                src={getFullUrl(url)}
                className='block w-full border-b border-zinc-200 dark:border-zinc-800'
                controls
                preload='metadata'
              />
            ) : (
              <img
                src={getFullUrl(url)}
                alt={instruction || "Design"}
                className='block w-full'
                loading='lazy'
              />
            )
          ) : (
            <div className='flex h-[300px] flex-col items-center justify-center gap-2'>
              <ImageIcon className='h-8 w-8 text-zinc-400' />
              <span className='text-xs text-zinc-500'>No Content</span>
            </div>
          )}

          {isInpaintMode && !isVideo && (
            <div
              className='nodrag nopan absolute inset-0 z-40'
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <MaskEditor
                src={getFullUrl(url)}
                canvasRef={
                  canvasRef as React.MutableRefObject<HTMLCanvasElement>
                }
                cursorSize={brushSize}
                onCursorSizeChange={setBrushSize}
                maskOpacity={0.65}
                maskColor='#7c3aed'
                maskBlendMode='normal'
              />

              <div className='pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-3 py-1 text-[10px] text-white backdrop-blur'>
                Paint area to edit
              </div>
            </div>
          )}

          <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
        </div>

        {/* Inpaint Panel */}
        {isInpaintMode && (
          <div
            className='nodrag nopan mt-2 rounded-sm border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div className='space-y-2.5'>
              <div className='flex items-center justify-between'>
                <span className='text-[10px] font-medium tracking-wider text-zinc-500 uppercase'>
                  Brush Size
                </span>

                <span className='font-mono text-[10px] text-zinc-500'>
                  {brushSize}px
                </span>
              </div>

              <input
                type='range'
                min='10'
                max='100'
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className='accent-primary h-1.5 w-full cursor-pointer'
              />

              <textarea
                value={inpaintPrompt}
                onChange={(e) => setInpaintPrompt(e.target.value)}
                placeholder='Describe the change...'
                className='focus:border-primary min-h-[72px] w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-xs transition-all outline-none dark:border-zinc-800'
              />
            </div>

            <div className='mt-1 flex items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsInpaintMode(false)}
                className='h-9 w-9 rounded-xl'
                title='Cancel'
              >
                <X className='h-3.5 w-3.5' />
              </Button>

              <Button
                variant='outline'
                size='icon'
                onClick={() => {
                  setIsInpaintMode(false);
                  setTimeout(() => setIsInpaintMode(true), 10);
                }}
                className='h-9 w-9 rounded-xl'
              >
                <Eraser className='h-4 w-4' />
              </Button>

              <Button
                disabled={isInpainting || !inpaintPrompt.trim()}
                onClick={handleSubmitInpaint}
                className='h-9 flex-[1.4] rounded-xl'
              >
                {isInpainting ? (
                  <Loader2 className='mr-1 h-3.5 w-3.5 animate-spin' />
                ) : (
                  <Wand2 className='mr-1 h-3.5 w-3.5' />
                )}
                Generate
              </Button>
            </div>
          </div>
        )}

        <Handle
          type='target'
          position={Position.Top}
          style={{
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        <Handle
          type='source'
          position={Position.Bottom}
          style={{
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }
);

DesignNode.displayName = "DesignNode";
