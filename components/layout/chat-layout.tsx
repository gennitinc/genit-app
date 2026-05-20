"use client";

import { PreviewPanel } from "../chat/preview-panel";
import { TextChatContent } from "../chat/text-chat-content";
import { AppSidebar } from "./app-sidebar";
import TopNavWithAurora from "./top-nav-with-aurora";
import { useSidebar } from "@/components/ui/sidebar";
import { AgentRunsProvider } from "@/context/AgentRunsContext";
import { useProjectDesign } from "@/context/DesignProject";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import React from "react";

export function ChatLayout() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  const { isGeneratingImage, liveNodes, messages, project } = useProjectDesign();
  const { setOpen: setSidebarOpen } = useSidebar();

  const isGenerationActive =
    Boolean(isGeneratingImage) || (liveNodes?.length ?? 0) > 0;

  const hasAnyPreview =
    isGenerationActive ||
    (messages?.some(
      (m: any) => (m.generationGroups?.length ?? 0) > 0
    ) ?? false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const prevActiveRef = useRef(false);
  const initialOpenForProjectRef = useRef<string | null>(null);

  // First load of a project: if there's existing preview history, open the panel once.
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

  // Collapse the app sidebar when the preview opens (more room for canvas);
  // re-expand it when the preview closes.
  useEffect(() => {
    if (!isDesktop) return;
    setSidebarOpen(!isPreviewOpen);
  }, [isPreviewOpen, isDesktop, setSidebarOpen]);

  return (
    <AgentRunsProvider>
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-[#09090b]'>
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className='relative flex h-full min-w-0 flex-1 flex-col overflow-hidden'
      >
        <div className='flex-none'>
          <TopNavWithAurora
            scrollContainerRef={
              scrollContainerRef as React.RefObject<HTMLDivElement>
            }
          />
        </div>

        {isDesktop ? (
          <div className='relative flex min-h-0 w-full flex-1 overflow-hidden'>
            <motion.div
              layout
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 220,
                mass: 0.8,
              }}
              className='relative flex h-full min-w-0 flex-1 flex-col overflow-hidden'
            >
              <div
                className={cn(
                  "flex h-full w-full flex-col transition-[max-width] duration-300 ease-out",
                  !isPreviewOpen && "mx-auto max-w-2xl"
                )}
              >
                <TextChatContent />
              </div>

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
            </motion.div>

            <AnimatePresence initial={false}>
              {isPreviewOpen && (
                <motion.div
                  key='preview-pane'
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "62.5%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 220,
                    mass: 0.8,
                  }}
                  className='relative h-full shrink-0 overflow-hidden bg-[#fafafa] dark:bg-[#09090b]'
                >
                  <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 40, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className='relative h-full w-full p-4'
                  >
                    <PreviewPanel />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className='flex min-h-0 w-full flex-1 flex-col overflow-hidden'>
            <div className='flex-1 overflow-hidden'>
              <TextChatContent />
            </div>
          </div>
        )}
      </div>
    </div>
    </AgentRunsProvider>
  );
}
