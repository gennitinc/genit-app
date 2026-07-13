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
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CircleFadingArrowUp,
  Loader2,
  Pause,
  Plus,
  Play,
  Sparkles,
  X,
  ZoomIn,
  Globe2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// import { ColorManagement } from "./color-management";

interface ScrapedPin {
  id: string;
  image: string;
  alt: string;
  url: string;
  boardName?: string;
}

interface DesignInspirationResultsProps {
  results: ScrapedPin[];
  query: string;
  message?: any;
}

export function DesignInspirationResults({
  results,
  query,
  message,
}: DesignInspirationResultsProps) {
  const safeResults = results || [];
  const {
    selectedFiles,
    setSelectedFiles,
    setInputMode,
    setGenerationMode,
    project,
    isGenerating,
    isGeneratingImage,
    generateMessage,
    selectedColorScales,
    primaryFont,
  } = useProjectDesign();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [countdown, setCountdown] = useState(10);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const autoPickedRef = useRef(false);
  const storageKey = project?._id
    ? `design-inspiration-selection:${project._id}`
    : null;

  const isAutoSelected = safeResults.some((r: any) => r.isAutoSelected);
  const gridRef = useRef<HTMLDivElement>(null);

  // 🔒 Lock Logic
  const savedInspiration =
    message?.metadata?.selectedInspirationUrl ||
    message?.metadata?.finalizedSelections?.selectedInspirations?.[0];
  const isLocked = !!savedInspiration;

  // override local selections if locked
  const effectiveSelectedFiles = isLocked
    ? [savedInspiration]
    : selectedFiles;
  const hasSelection = safeResults.some((pin) =>
    effectiveSelectedFiles?.includes(pin.image)
  );

  // Remove chunking - we want a continuous carousel

  const isSelected = (image: string) =>
    effectiveSelectedFiles?.includes(image) ?? false;

  const handleSelect = (image: string) => {
    if (isLocked) return;
    autoPickedRef.current = true;
    setSelectedFiles((current: string[]) => {
      const next = current.includes(image) ? [] : [image];
      if (storageKey) {
        next.length
          ? window.localStorage.setItem(storageKey, next[0])
          : window.localStorage.removeItem(storageKey);
      }
      return next;
    });
  };

  useEffect(() => {
    if (isLocked || !storageKey || selectedFiles.length) return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved && safeResults.some((pin) => pin.image === saved)) {
      autoPickedRef.current = true;
      setSelectedFiles([saved]);
    }
  }, [isLocked, safeResults, selectedFiles.length, setSelectedFiles, storageKey]);

  useEffect(() => {
    autoPickedRef.current = false;
    setCountdown(10);
    setIsCountdownPaused(false);
  }, [query, safeResults]);

  useEffect(() => {
    if (
      isLocked ||
      isCountdownPaused ||
      hasSelection ||
      autoPickedRef.current ||
      !safeResults.length
    ) {
      return;
    }

    if (countdown <= 0) {
      const randomPin =
        safeResults[Math.floor(Math.random() * safeResults.length)];
      if (randomPin?.image) {
        autoPickedRef.current = true;
        setSelectedFiles([randomPin.image]);
        if (storageKey) {
          window.localStorage.setItem(storageKey, randomPin.image);
        }
      }
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((seconds) => seconds - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    countdown,
    hasSelection,
    isCountdownPaused,
    isLocked,
    safeResults,
    setSelectedFiles,
    storageKey,
  ]);

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
        <p className='text-[11px] text-blue-500 line-clamp-1 truncate'>
          {isAutoSelected
            ? "AI Selected Foundation"
            : "Deep Internet Search Results"}{" "}
          —{" "}
          <span className='text-foreground/70 font-mono normal-case italic'>
            "{query}"
          </span>
        </p>
      </div>

      {!isLocked && !hasSelection && (
        <div className='flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2'>
          <p className='text-muted-foreground text-[11px]'>
            {isCountdownPaused
              ? "Auto-pick paused until you select an inspiration."
              : `Auto-picking a random inspiration in ${countdown}s.`}
          </p>
          <button
            type='button'
            className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/70 hover:bg-white/12 hover:text-white'
            onClick={() => setIsCountdownPaused((paused) => !paused)}
            aria-label={
              isCountdownPaused
                ? "Resume inspiration countdown"
                : "Pause inspiration countdown"
            }
          >
            {isCountdownPaused ? (
              <Play className='h-3.5 w-3.5' />
            ) : (
              <Pause className='h-3.5 w-3.5' />
            )}
          </button>
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
                        ? "rounded-2xl border-2 border-blue-500/50 bg-blue-500/5 p-2 ring-4 ring-blue-500/10"
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
            {isAutoSelected
              ? "The AI has automatically selected a design foundation to begin generating your concept."
              : "Tap inspirations to use them as references for your next design."}
          </p>
        </div>
      </div>

      {/* ─── Color Management removed (moved to IdeaSection) ─── */}

      {/* ─── Proceed Button removed (automated in backend) ─── */}

      {/* ─── Preview Dialog ─── */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className='flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-black p-0 shadow-2xl'>
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
