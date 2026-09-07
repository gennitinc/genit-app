"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProjectDesign } from "@/context/DesignProject";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import { motion } from "framer-motion";
import { Check, Globe2, Pause, Play, Plus, ZoomIn } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// import { ColorManagement } from "./color-management";

interface ScrapedPin {
  id: string;
  image: string;
  alt: string;
  url: string;
  boardName?: string;
  score?: number;
  reason?: string;
  source?: "pinterest" | "rag";
  isRecommended?: boolean;
}

interface DesignInspirationResultsProps {
  results: ScrapedPin[];
  query: string;
  message?: any;
  onSelect?: (image: string) => void | Promise<void>;
}

const AUTO_SELECT_SECONDS = 10;

export function DesignInspirationResults({
  results,
  query,
  message,
  onSelect,
}: DesignInspirationResultsProps) {
  const safeResults = results || [];
  const { selectedFiles, setSelectedFiles, project, setProject } =
    useProjectDesign();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [countdown, setCountdown] = useState(AUTO_SELECT_SECONDS);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const storageKey = project?._id
    ? `design-inspiration-selection:${project._id}`
    : null;

  const gridRef = useRef<HTMLDivElement>(null);

  const historicalInspiration =
    message?.metadata?.selectedInspirationUrl ||
    message?.metadata?.finalizedSelections?.selectedInspirations?.[0];
  const persistedInspiration = project?.metadata?.selectedInspirationUrl;
  const effectiveSelectedFiles = selectedFiles.length
    ? selectedFiles
    : persistedInspiration
      ? [persistedInspiration]
      : historicalInspiration
        ? [historicalInspiration]
        : [];
  const hasAnySelection = effectiveSelectedFiles.length > 0;
  const resultKey = safeResults.map((pin) => pin.image).join("|");

  // Remove chunking - we want a continuous carousel

  const isSelected = (image: string) =>
    effectiveSelectedFiles?.includes(image) ?? false;

  const handleSelect = async (image: string) => {
    const previous = effectiveSelectedFiles.slice(0, 1);
    const next = previous.includes(image) ? [] : [image];
    const nextInspiration = next[0] || null;

    setSelectedFiles(next);
    setProject((current) =>
      current
        ? {
            ...current,
            metadata: {
              ...(current.metadata || {}),
              selectedInspirationUrl: nextInspiration || undefined,
            },
          }
        : current
    );
    if (storageKey) {
      nextInspiration
        ? window.localStorage.setItem(storageKey, nextInspiration)
        : window.localStorage.removeItem(storageKey);
    }

    try {
      await apiResponse.patch(`/project/${project?._id}/inspiration`, {
        inspirationUrl: nextInspiration,
      });
      if (nextInspiration) await onSelect?.(nextInspiration);
    } catch (error) {
      console.error("Failed to save selected design inspiration", error);
      setSelectedFiles(previous);
      if (storageKey) {
        previous[0]
          ? window.localStorage.setItem(storageKey, previous[0])
          : window.localStorage.removeItem(storageKey);
      }
      setProject((current) =>
        current
          ? {
              ...current,
              metadata: {
                ...(current.metadata || {}),
                selectedInspirationUrl: previous[0] || undefined,
              },
            }
          : current
      );
    }
  };

  useEffect(() => {
    if (!storageKey || selectedFiles.length) return;
    const saved =
      persistedInspiration || window.localStorage.getItem(storageKey);
    if (saved && safeResults.some((pin) => pin.image === saved)) {
      setSelectedFiles([saved]);
    }
  }, [
    persistedInspiration,
    safeResults,
    selectedFiles.length,
    setSelectedFiles,
    storageKey,
  ]);

  useEffect(() => {
    setCountdown(AUTO_SELECT_SECONDS);
    setIsCountdownPaused(false);
  }, [query, resultKey]);

  useEffect(() => {
    if (hasAnySelection || isCountdownPaused || !safeResults[0]) return;

    if (countdown <= 0) {
      void handleSelect(safeResults[0].image);
      return;
    }

    const timer = window.setTimeout(
      () => setCountdown((seconds) => seconds - 1),
      1000
    );
    return () => window.clearTimeout(timer);
  }, [countdown, hasAnySelection, isCountdownPaused, resultKey]);

  // Sync carousel position when dialog opens
  useEffect(() => {
    if (isPreviewOpen && api) {
      api.scrollTo(previewIndex, true);
    }
  }, [isPreviewOpen, api, previewIndex]);

  if (safeResults.length === 0) return null;

  return (
    <div className='my-4 w-full space-y-3'>
      {/* ─── Header ─── */}
      <div className='flex items-center gap-2'>
        <Globe2 className='text-primary h-3 w-3 shrink-0' />
        <p className='line-clamp-1 truncate text-[11px] text-blue-500'>
          Pinterest + saved inspiration results ({safeResults.length}) —{" "}
          <span className='text-foreground/70 font-mono normal-case italic'>
            "{query}"
          </span>
        </p>
      </div>

      {!hasAnySelection && (
        <div className='flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2'>
          <p className='text-muted-foreground text-[11px]'>
            {isCountdownPaused
              ? `Paused at ${countdown}s. Take your time choosing an inspiration.`
              : `Choose within ${countdown}s, or AI will select the highest-ranked match.`}
          </p>
          <Button
            type='button'
            size='sm'
            className='h-7 shrink-0 gap-1.5 rounded-full bg-indigo-600 px-3 text-[11px] hover:bg-indigo-700'
            variant={isCountdownPaused ? "default" : "outline"}
            onClick={() => setIsCountdownPaused((paused) => !paused)}
            aria-label={
              isCountdownPaused
                ? "Resume AI selection countdown"
                : "Pause AI selection countdown"
            }
          >
            {isCountdownPaused ? (
              <Play className='h-3 w-3' />
            ) : (
              <Pause className='h-3 w-3' />
            )}
            {isCountdownPaused ? "Play" : "Pause"}
          </Button>
        </div>
      )}

      {/* ─── Design Grid Carousel (fixed height, no overflow) ─── */}
      <div ref={gridRef} className='w-full'>
        <Carousel
          opts={{ align: "start", loop: false }}
          className='group/carousel w-full'
        >
          <CarouselContent className='-ml-3'>
            {safeResults.map((pin, i) => {
              const selected = isSelected(pin.image);
              return (
                <CarouselItem
                  key={pin.id || `g-${i}`}
                  className='shrink-0 basis-1/2 pl-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
                >
                  <div
                    className={cn(
                      "flex flex-col gap-1.5 transition-all duration-300",
                      selected
                        ? "rounded-lg border-2 border-blue-500/50 bg-blue-500/5 p-2 ring-4 ring-blue-500/10"
                        : "border-2 border-transparent p-0"
                    )}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        "group/card relative aspect-square cursor-pointer overflow-hidden rounded-xl border transition-all duration-300",
                        selected
                          ? "border-primary/60 ring-primary/30 ring-1"
                          : "border-white/8 hover:border-white/20"
                      )}
                      onClick={() => handleSelect(pin.image)}
                    >
                      <img
                        src={pin.image}
                        alt={pin.alt}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105'
                        loading='lazy'
                      />
                      {/* Hover overlay */}
                      <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/card:opacity-100'>
                        <ZoomIn className='h-5 w-5 text-white/70' />
                      </div>
                      <button
                        type='button'
                        className={cn(
                          "absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full shadow-lg",
                          selected
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-black/60 text-white hover:bg-black/80"
                        )}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSelect(pin.image);
                        }}
                        aria-label={
                          selected ? "Remove inspiration" : "Use inspiration"
                        }
                      >
                        {selected ? (
                          <Check className='h-3.5 w-3.5' />
                        ) : (
                          <Plus className='h-3.5 w-3.5' />
                        )}
                      </button>
                      <span className='absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-0.5 text-[8px] font-medium tracking-wide text-white/75 uppercase'>
                        {pin.source === "rag" ? "Saved" : "Pinterest"}
                      </span>
                      <button
                        type='button'
                        className='absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white shadow-lg hover:bg-black/80'
                        onClick={(event) => {
                          event.stopPropagation();
                          setPreviewIndex(i);
                          setIsPreviewOpen(true);
                        }}
                        aria-label='Preview inspiration'
                      >
                        <ZoomIn className='h-3.5 w-3.5' />
                      </button>
                    </motion.div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {safeResults.length > 2 && (
            <div className='mt-2 flex justify-end gap-1.5 opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100'>
              <CarouselPrevious className='static h-7 w-7 translate-y-0 rounded-full border-white/10 bg-white/5 hover:bg-white/10' />
              <CarouselNext className='static h-7 w-7 translate-y-0 rounded-full border-white/10 bg-white/5 hover:bg-white/10' />
            </div>
          )}
        </Carousel>

        <div className='mt-4'>
          <p className='text-muted-foreground text-[11px]'>
            {hasAnySelection
              ? "Your selected inspiration will guide the next design."
              : "Results are ranked by relevance. Tap any inspiration to use it."}
          </p>
        </div>
      </div>

      {/* ─── Color Management removed (moved to IdeaSection) ─── */}

      {/* ─── Proceed Button removed (automated in backend) ─── */}

      {/* ─── Preview Dialog ─── */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className='flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-white/10 bg-black p-0 shadow-2xl'>
          {/* Close */}

          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "center" }}
            className='flex min-h-0 flex-1 flex-col'
          >
            <CarouselContent className='ml-0 h-full flex-1'>
              {safeResults.map((pin, idx) => {
                const selected = isSelected(pin.image);
                return (
                  <CarouselItem
                    key={`preview-${idx}`}
                    className='flex h-full basis-full flex-col items-center justify-center p-6 pb-4'
                  >
                    {/* Image */}
                    <div className='relative flex min-h-0 w-full flex-1 items-center justify-center'>
                      <img
                        src={pin.image}
                        alt={pin.alt}
                        className='max-h-full max-w-full rounded-xl object-contain shadow-2xl'
                        style={{ maxHeight: "calc(88vh - 120px)" }}
                      />
                      {/* Select overlay removed */}
                    </div>

                    {/* Caption */}
                    <div className='mt-3 flex w-full items-center justify-center'>
                      <div className='text-center'>
                        <p className='line-clamp-1 text-[11px] text-white/60'>
                          {pin.alt || "Design Concept"}
                        </p>
                        <p className='mt-0.5 font-mono text-[9px] tracking-widest text-white/25'>
                          {idx + 1} / {safeResults.length}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className='absolute top-1/2 left-4 z-10 size-9 -translate-y-1/2 rounded-full border-none bg-black/55 text-white backdrop-blur-sm hover:bg-black/75' />
            <CarouselNext className='absolute top-1/2 right-4 z-10 size-9 -translate-y-1/2 rounded-full border-none bg-black/55 text-white backdrop-blur-sm hover:bg-black/75' />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}
