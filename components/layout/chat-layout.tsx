"use client";

import { PreviewPanel } from "../chat/preview-panel";
import { TextChatContent } from "../chat/text-chat-content";
import { AppSidebar } from "./app-sidebar";
import TopNavWithAurora from "./top-nav-with-aurora";
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
} from "@/lib/chat-preview";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
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

function ChatLayoutInner() {
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
          : null;
  const previewType =
    focusedPreviewType || latestPreview?.type || categoryPreviewType;

  const hasAnyPreview =
    isGenerationActive || Boolean(artifactPreview) || Boolean(previewType);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  // Auto-open on rising edge of active generation (overrides a prior manual close).
  useEffect(() => {
    if (isGenerationActive && !prevActiveRef.current) {
      setIsPreviewOpen(true);
    }
    prevActiveRef.current = isGenerationActive;
  }, [isGenerationActive]);

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
        "relative flex w-full [overflow-anchor:none]",
        useDocumentScroll ? "min-h-[100dvh]" : "h-[100dvh] overflow-hidden"
      )}
    >
      <AppSidebar
        className={cn(
          useDocumentScroll && isDesktop && "sticky top-0 h-[100dvh] self-start"
        )}
      />
      <div
        ref={scrollContainerRef}
        className={cn(
          "relative flex min-w-0 flex-1 flex-col bg-white dark:bg-black",
          useDocumentScroll ? "min-h-[100dvh]" : "h-full overflow-hidden"
        )}
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />

        {isDesktop ? (
          <div
            className={cn(
              "relative flex min-h-0 w-full flex-1",
              isPreviewOpen ? "overflow-hidden" : "overflow-visible"
            )}
          >
            <motion.div
              layout
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

              {hasAnyPreview && (
                <button
                  type='button'
                  onClick={() => setIsPreviewOpen((v) => !v)}
                  className='border-border/50 bg-background/80 hover:bg-accent absolute top-0 right-3 z-30 inline-flex h-8 w-8 items-center justify-center rounded-md border backdrop-blur'
                  aria-label={
                    isPreviewOpen ? "Close preview panel" : "Open preview panel"
                  }
                  title={isPreviewOpen ? "Hide preview" : "Show preview"}
                >
                  <AnimatePresence initial={false} mode='wait'>
                    <motion.span
                      key={isPreviewOpen ? "close" : "open"}
                      initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.7, rotate: 90 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className='inline-flex'
                    >
                      {isPreviewOpen ? (
                        <PanelRightClose className='h-4 w-4' />
                      ) : (
                        <PanelRightOpen className='h-4 w-4' />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              )}
            </motion.div>

            <AnimatePresence initial={false}>
              {isPreviewOpen && (
                <motion.div
                  key='preview-pane'
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: isFullscreen ? "100%" : "62.5%",
                    opacity: 1,
                  }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 220,
                    mass: 0.8,
                  }}
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
    </div>
  );
}
