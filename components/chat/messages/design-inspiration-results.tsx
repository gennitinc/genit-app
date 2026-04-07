"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ZoomIn, Check, Plus, X, Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectDesign } from "@/context/DesignProject";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  if (!results || results.length === 0) return null;
  
  const isAutoSelected = results.some((r: any) => r.isAutoSelected);
  const gridRef = useRef<HTMLDivElement>(null);

  // 🔒 Lock Logic
  const finalized = message?.metadata?.finalizedSelections;
  const isLocked = !!finalized;

  // override local selections if locked
  const effectiveSelectedFiles = isLocked
    ? finalized.selectedInspirations || []
    : selectedFiles;

  // Group into pages of 4
  const chunks: ScrapedPin[][] = [];
  for (let i = 0; i < results.length; i += 4) {
    chunks.push(results.slice(i, i + 4));
  }

  const isSelected = (image: string) =>
    effectiveSelectedFiles?.includes(image) ?? false;

  const handleSelect = (image: string) => {
    // Selection disabled - AI handles selection automatically
  };

  // Sync carousel position when dialog opens
  useEffect(() => {
    if (isPreviewOpen && api) {
      api.scrollTo(previewIndex, true);
    }
  }, [isPreviewOpen, api, previewIndex]);

  return (
    <div className="my-4 w-full space-y-3">
      {/* ─── Header ─── */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-primary shrink-0" />
        <p className="text-[11px] text-blue-500">
          {isAutoSelected ? "AI Selected Foundation" : "Design Inspirations Found"} —{" "}
          <span className="italic font-mono normal-case text-foreground/70">
            "{query}"
          </span>
        </p>
      </div>

      {/* ─── Design Grid Carousel (fixed height, no overflow) ─── */}
      <div ref={gridRef} className="w-full">
        <Carousel
          opts={{ align: "start", loop: false }}
          className="w-full group/carousel"
        >
          <CarouselContent className="-ml-3">
            {chunks.map((chunk, chunkIdx) => (
              <CarouselItem
                key={`chunk-${chunkIdx}`}
                className="pl-3 basis-full shrink-0"
              >
                {/* 2-col grid with fixed aspect ratio — height is stable */}
                <div className="grid grid-cols-2 gap-3 min-w-0">
                  {chunk.map((pin, i) => {
                    const globalIdx = chunkIdx * 4 + i;
                    const selected = isSelected(pin.image);
                    return (
                      <div
                        key={pin.id || `g-${globalIdx}`}
                        className={cn(
                          "flex flex-col gap-1.5 transition-all duration-300",
                          selected
                            ? "border-2 border-blue-500/50 p-2 rounded-2xl bg-blue-500/5 ring-4 ring-blue-500/10"
                            : "p-0 border-2 border-transparent",
                        )}
                      >
                        {/* Image card — aspect-square keeps height fixed */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className={cn(
                            "relative aspect-square overflow-hidden rounded-xl border cursor-pointer group/card transition-all duration-300",
                            selected
                              ? "border-primary/60 ring-1 ring-primary/30"
                              : "border-white/8 hover:border-white/20",
                          )}
                          onClick={() => {
                            setPreviewIndex(globalIdx);
                            setIsPreviewOpen(true);
                          }}
                        >
                          <img
                            src={pin.image}
                            alt={pin.alt}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                            loading="lazy"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="w-5 h-5 text-white/70" />
                          </div>
                          {/* Selected badge */}
                          {selected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </motion.div>

                        {/* Select control removed - AI selects automatically */}
                      </div>
                    );
                  })}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {chunks.length > 1 && (
            <div className="flex justify-end gap-1.5 mt-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200">
              <CarouselPrevious className="static translate-y-0 h-7 w-7 rounded-full border-white/10 bg-white/5 hover:bg-white/10" />
              <CarouselNext className="static translate-y-0 h-7 w-7 rounded-full border-white/10 bg-white/5 hover:bg-white/10" />
            </div>
          )}
        </Carousel>

        <div className="mt-4">
          <p className="text-[11px] text-muted-foreground">
            {isAutoSelected 
              ? "The AI has automatically selected a design foundation to begin generating your concept." 
              : "Inspirations considered for your design."}
          </p>
        </div>
      </div>

      {/* ─── Color Management removed (moved to IdeaSection) ─── */}


      {/* ─── Proceed Button removed (automated in backend) ─── */}


      {/* ─── Preview Dialog ─── */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[88vh] flex flex-col">
          {/* Close */}

          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "center" }}
            className="flex-1 flex flex-col min-h-0"
          >
            <CarouselContent className="flex-1 h-full ml-0">
              {results.map((pin, idx) => {
                const selected = isSelected(pin.image);
                return (
                  <CarouselItem
                    key={`preview-${idx}`}
                    className="basis-full h-full flex flex-col items-center justify-center p-6 pb-4"
                  >
                    {/* Image */}
                    <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
                      <img
                        src={pin.image}
                        alt={pin.alt}
                        className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                        style={{ maxHeight: "calc(88vh - 120px)" }}
                      />
                      {/* Select overlay removed */}
                    </div>

                    {/* Caption + nav */}
                    <div className="flex items-center justify-center gap-4 mt-3 w-full">
                      <CarouselPrevious className="static translate-y-0 size-7 rounded-full bg-white/10 hover:bg-white/20 border-none text-white" />
                      <div className="text-center">
                        <p className="text-[11px] text-white/60 line-clamp-1">
                          {pin.alt || "Design Concept"}
                        </p>
                        <p className="text-[9px] font-mono text-white/25 mt-0.5 tracking-widest">
                          {idx + 1} / {results.length}
                        </p>
                      </div>
                      <CarouselNext className="static translate-y-0 size-7 rounded-full bg-white/10 hover:bg-white/20 border-none text-white" />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}
