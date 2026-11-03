"use client";

import { PreviewPanel } from "../chat/preview-panel";
import { TextChatContent } from "../chat/text-chat-content";
import {
  AgentRunsProvider,
  useAgentRunsContext,
} from "@/context/AgentRunsContext";
import { useProjectDesign } from "@/context/DesignProject";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  AUTOMATION_PREVIEW_ID,
  CanvasPreviewType,
  WORKFLOW_PREVIEW_ID,
  getItemPreviewType,
  getLatestAgentPreview,
  getLatestMessagePreview,
  isGraphicsProjectCategory,
} from "@/lib/chat-preview";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export function ChatLayout() {
  return (
    <AgentRunsProvider>
      <ChatLayoutInner />
    </AgentRunsProvider>
  );
}

// Preview width as a percentage of the split; the chat and preview keep
// these minimum pixel widths whatever the user drags to.
const PREVIEW_WIDTH_KEY = "genit:preview-width";
const DEFAULT_PREVIEW_WIDTH = 70;
const MIN_CHAT_PX = 340;
const MIN_PREVIEW_PX = 380;

export function clampPreviewWidth(percent: number, containerWidth: number) {
  if (!containerWidth) return percent;
  const min = (MIN_PREVIEW_PX / containerWidth) * 100;
  const max = 100 - (MIN_CHAT_PX / containerWidth) * 100;
  return Math.min(Math.max(percent, min), Math.max(min, max));
}

export function PreviewResizeHandle({
  width,
  onChange,
  onResizingChange,
  containerRef,
}: {
  width: number;
  onChange: (width: number, persist?: boolean) => void;
  onResizingChange: (resizing: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [dragging, setDragging] = useState(false);
  const widthAt = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return width;
    return clampPreviewWidth(
      ((rect.right - clientX) / rect.width) * 100,
      rect.width
    );
  };
  const setResizing = (value: boolean) => {
    setDragging(value);
    onResizingChange(value);
  };

  return (
    <>
      <div
        role='separator'
        aria-orientation='vertical'
        aria-label='Resize chat and preview'
        aria-valuenow={Math.round(100 - width)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        title='Drag to resize · double-click to reset'
        className='group absolute top-0 bottom-0 z-40 flex w-3 -translate-x-1/2 cursor-col-resize touch-none justify-center outline-none'
        style={{ left: `${100 - width}%` }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          setResizing(true);
        }}
        onPointerMove={(event) => {
          if (dragging) onChange(widthAt(event.clientX));
        }}
        onPointerUp={(event) => {
          if (!dragging) return;
          event.currentTarget.releasePointerCapture(event.pointerId);
          setResizing(false);
          onChange(widthAt(event.clientX), true);
        }}
        onPointerCancel={() => setResizing(false)}
        onDoubleClick={() => {
          const rect = containerRef.current?.getBoundingClientRect();
          onChange(
            clampPreviewWidth(DEFAULT_PREVIEW_WIDTH, rect?.width || 0),
            true
          );
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          const rect = containerRef.current?.getBoundingClientRect();
          const step = event.key === "ArrowLeft" ? 2 : -2;
          onChange(clampPreviewWidth(width + step, rect?.width || 0), true);
        }}
      >
        <span
          className={cn(
            "my-auto h-10 w-1 rounded-full bg-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-zinc-600",
            dragging && "bg-blue-500 opacity-100 dark:bg-blue-500"
          )}
        />
      </div>
      {/* Keeps iframes (live browser, documents) from swallowing the drag. */}
      {dragging && (
        <div className='fixed inset-0 z-[60] cursor-col-resize select-none' />
      )}
    </>
  );
}

function PreviewToggle({
  isOpen,
  onToggle,
  className,
  style,
}: {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type='button'
      onClick={onToggle}
      style={style}
      className={cn(
        "border-border/50 bg-background/90 hover:bg-accent pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-md border shadow-sm backdrop-blur transition-transform duration-150 active:scale-[0.97]",
        className
      )}
      aria-label={isOpen ? "Close preview panel" : "Open preview panel"}
      title={isOpen ? "Hide preview" : "Show preview"}
    >
      {isOpen ? (
        <PanelRightClose className='h-4 w-4' />
      ) : (
        <PanelRightOpen className='h-4 w-4' />
      )}
    </button>
  );
}

function ChatLayoutInner() {
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const {
    artifactPreview,
    setArtifactPreview,
    isGeneratingImage,
    liveNodes,
    messages,
    project,
    isGenerating,
    focusedGenerationId,
    setFocusedGenerationId,
  } = useProjectDesign();
  const { runs } = useAgentRunsContext();
  const isGenerationActive =
    Boolean(isGeneratingImage) || (liveNodes?.length ?? 0) > 0;
  const activeAgentRun = [...runs]
    .reverse()
    .find((run) => run.status === "running");
  const isWorkActive = isGenerationActive || Boolean(activeAgentRun);

  const latestMessagePreview = useMemo(
    () => getLatestMessagePreview(messages),
    [messages]
  );
  const latestAgentPreview = useMemo(() => getLatestAgentPreview(runs), [runs]);
  const latestPreview = [latestMessagePreview, latestAgentPreview]
    .filter((value) => value !== null)
    .sort((a, b) => a.createdAt - b.createdAt)
    .at(-1);
  const focusedPreviewType = useMemo(() => {
    if (!focusedGenerationId) return null;
    if (focusedGenerationId === AUTOMATION_PREVIEW_ID) return "automation";
    if (focusedGenerationId === WORKFLOW_PREVIEW_ID) return "workflow";
    for (const message of messages || []) {
      for (const group of message.generationGroups || []) {
        const item = (group.items || []).find(
          (entry: any) =>
            entry.id === focusedGenerationId ||
            entry.filePath === focusedGenerationId ||
            entry.url === focusedGenerationId
        );
        if (item) return getItemPreviewType(item);
      }
    }
    // Agent-generated designs use their result id/url and are not duplicated
    // into the legacy generation groups.
    return "graphics";
  }, [focusedGenerationId, messages]);
  const categoryPreviewType: CanvasPreviewType | "website" | null =
    project?.category === "automation" &&
    searchParams.get("preview") === "automation"
      ? "automation"
      : project?.category === "workflow"
        ? "workflow"
        : project?.category?.includes("website") ||
            project?.category?.includes("landing")
          ? "website"
          : isGraphicsProjectCategory(project?.category)
            ? "graphics"
            : null;
  const previewType =
    focusedPreviewType || latestPreview?.type || categoryPreviewType;

  const hasAnyPreview =
    isWorkActive || Boolean(artifactPreview) || Boolean(previewType);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(DEFAULT_PREVIEW_WIDTH);
  const [isResizingPreview, setIsResizingPreview] = useState(false);
  const splitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(PREVIEW_WIDTH_KEY));
      if (saved > 0 && saved < 100) setPreviewWidth(saved);
    } catch {}
  }, []);

  // Keep both panes above their minimum widths when the window shrinks.
  useEffect(() => {
    const clampToWindow = () =>
      setPreviewWidth((width) =>
        clampPreviewWidth(width, splitRef.current?.clientWidth || 0)
      );
    window.addEventListener("resize", clampToWindow);
    return () => window.removeEventListener("resize", clampToWindow);
  }, []);

  const changePreviewWidth = (width: number, persist = false) => {
    setPreviewWidth(width);
    if (!persist) return;
    try {
      localStorage.setItem(
        PREVIEW_WIDTH_KEY,
        String(Math.round(width * 10) / 10)
      );
    } catch {}
  };
  const useDocumentScroll = !isDesktop || !isPreviewOpen;
  const prevActiveRef = useRef(false);
  const initialOpenForProjectRef = useRef<string | null>(null);
  const latestPreviewKeyRef = useRef<string | null>(null);

  // New results take control of the preview; manual selection remains stable
  // until another result is generated.
  useEffect(() => {
    if (!latestPreview || latestPreviewKeyRef.current === latestPreview.key)
      return;
    latestPreviewKeyRef.current = latestPreview.key;
    setArtifactPreview(null);
    setFocusedGenerationId(latestPreview.itemId || null);
    setIsPreviewOpen(true);
  }, [latestPreview, setArtifactPreview, setFocusedGenerationId]);

  // Open once when the project first exposes any useful preview.
  useEffect(() => {
    const pid = project?._id?.toString?.() ?? null;
    if (!pid) return;
    if (initialOpenForProjectRef.current === pid) return;
    if (hasAnyPreview) {
      setIsPreviewOpen(true);
      initialOpenForProjectRef.current = pid;
    }
  }, [project?._id, hasAnyPreview]);

  // Auto-open on the rising edge of any agent work (overrides a prior manual close).
  useEffect(() => {
    if (isWorkActive && !prevActiveRef.current) {
      setIsPreviewOpen(true);
    }
    prevActiveRef.current = isWorkActive;
  }, [isWorkActive]);

  useEffect(() => {
    if (artifactPreview) setIsPreviewOpen(true);
  }, [artifactPreview]);

  useEffect(() => {
    if (!hasAnyPreview) {
      setIsPreviewOpen(false);
      setIsFullscreen(false);
    }
  }, [hasAnyPreview]);

  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-1 flex-col bg-white [overflow-anchor:none] dark:bg-black",
        useDocumentScroll ? "min-h-full" : "h-full overflow-hidden"
      )}
    >
      {isDesktop && !isPreviewOpen && (
        <div className='pointer-events-none sticky top-12 z-50 h-0 w-full shrink-0'>
          <div className='mx-auto flex w-full max-w-2xl justify-end px-3'>
            <PreviewToggle
              isOpen={false}
              onToggle={() => setIsPreviewOpen(true)}
            />
          </div>
        </div>
      )}

      {isDesktop ? (
        <div
          ref={splitRef}
          className={cn(
            "relative flex min-h-0 w-full flex-1",
            isPreviewOpen ? "overflow-hidden" : "overflow-visible",
            isResizingPreview && "select-none"
          )}
        >
          {isPreviewOpen && (
            <PreviewToggle
              isOpen
              onToggle={() => setIsPreviewOpen(false)}
              className={cn(
                "absolute top-2 z-50",
                isFullscreen ? "left-3" : "-translate-x-1/2"
              )}
              style={
                isFullscreen ? undefined : { left: `${100 - previewWidth}%` }
              }
            />
          )}
          {isPreviewOpen && !isFullscreen && (
            <PreviewResizeHandle
              width={previewWidth}
              onChange={changePreviewWidth}
              onResizingChange={setIsResizingPreview}
              containerRef={splitRef}
            />
          )}
          <motion.div
            layout={isPreviewOpen && !isResizingPreview}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 220,
              mass: 0.8,
            }}
            className={cn(
              "relative flex min-w-0 flex-col",
              isPreviewOpen
                ? "h-full overflow-hidden"
                : "flex-1 overflow-visible",
              isFullscreen ? "hidden" : "flex-1"
            )}
          >
            <div
              className={cn(
                "flex w-full flex-col transition-[max-width] duration-300 ease-out",
                isPreviewOpen ? "h-full" : "flex-1",
                !isPreviewOpen && "mx-auto max-w-2xl"
              )}
            >
              <TextChatContent useDocumentScroll={!isPreviewOpen} />
            </div>
          </motion.div>

          <AnimatePresence initial={false}>
            {isPreviewOpen && (
              <motion.div
                key='preview-pane'
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: isFullscreen ? "100%" : `${previewWidth}%`,
                  opacity: 1,
                }}
                exit={{ width: 0, opacity: 0 }}
                // Follow the pointer exactly while dragging the divider.
                transition={
                  isResizingPreview
                    ? { duration: 0 }
                    : { type: "spring", damping: 30, stiffness: 220, mass: 0.8 }
                }
                className={cn(
                  "relative h-full shrink-0 overflow-hidden",
                  isFullscreen ? "p-0" : "p-2"
                )}
              >
                <motion.div
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 40, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className='relative h-full w-full'
                >
                  <PreviewPanel
                    previewType={previewType}
                    thinking={activeAgentRun?.thinking}
                    isThinking={Boolean(activeAgentRun)}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className='flex min-h-0 w-full flex-1 flex-col'>
          <div className='flex flex-1 flex-col'>
            <TextChatContent useDocumentScroll />
          </div>
        </div>
      )}
    </div>
  );
}
