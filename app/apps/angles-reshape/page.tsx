"use client";

import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import { ChevronLeft, ChevronRight, Download, HistoryIcon, ImageIcon, Minus, Plus, Sparkles, Trash, Trash2, X } from "lucide-react";
import { Toaster } from "sonner";
import React, { useCallback, useEffect, useRef, useState } from "react";




















interface GeneratedAngle {
  id: string;
  url: string;
  name: string;
}

interface AngleReshapeJob {
  _id: string;
  sourceImageUrl: string;
  rotation: number;
  tilt: number;
  zoom: number;
  bestAngles: boolean;
  generatedImages: { _id: string; url: string; name: string }[];
  createdAt: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Carousel for generated images */
const GeneratedCarousel = ({
  images,
  jobId,
  onDelete,
  initialIndex = 0,
}: {
  images: GeneratedAngle[];
  jobId: string;
  onDelete: (imageId: string) => void;
  initialIndex?: number;
}) => {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await apiResponse.delete(`/apps/angle-reshape/job/${jobId}/angle/${id}`, {
        withCredentials: true,
      });
      onDelete(id);
      if (current >= images.length - 1)
        setCurrent(Math.max(0, images.length - 2));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const img = images[current];

  return (
    <div className='relative flex flex-1 flex-col items-center justify-center gap-0 select-none'>
      {/* Main image */}
      <div className='relative flex w-full flex-1 items-center justify-center'>
        <img
          key={img.id}
          src={img.url}
          alt={`Generated angle ${current + 1}`}
          className='max-h-[52vh] w-full rounded-xl object-contain'
        />

        {/* Delete button */}
        <button
          onClick={() => handleDelete(img.id)}
          disabled={deletingId === img.id}
          className='absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-red-600 disabled:opacity-50'
          title='Delete this angle'
        >
          {deletingId === img.id ? (
            <div className='size-3 animate-spin rounded-full border border-white border-t-transparent' />
          ) : (
            <Trash className='size-3.5' />
          )}
        </button>

        {/* Download button */}
        <a
          href={img.url}
          download={img.name}
          target='_blank'
          rel='noopener noreferrer'
          className='absolute top-3 right-12 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-blue-600'
          title='Download'
        >
          <Download className='size-3.5' />
        </a>
      </div>

      {/* Controls */}
      {images.length > 1 && (
        <div className='flex items-center gap-4 py-3'>
          <button
            onClick={prev}
            className='flex size-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
          >
            <ChevronLeft className='size-4' />
          </button>
          <span className='font-mono text-[10px] text-white/50'>
            {current + 1} / {images.length}
          </span>
          <button
            onClick={next}
            className='flex size-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
          >
            <ChevronRight className='size-4' />
          </button>
        </div>
      )}

      {/* Dot strip */}
      {images.length > 1 && (
        <div className='flex gap-1.5 pb-2'>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "rounded-full transition-all",
                i === current
                  ? "size-2 bg-cyan-400"
                  : "size-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** Responsive Carousel Modal */
const ResponsiveCarouselModal = ({
  isOpen,
  onOpenChange,
  images,
  jobId,
  onDelete,
  initialIndex = 0,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  images: GeneratedAngle[];
  jobId: string;
  onDelete: (imageId: string) => void;
  initialIndex?: number;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <div className='flex flex-col items-center bg-black p-4 pt-8 md:p-6'>
      <GeneratedCarousel
        images={images}
        jobId={jobId}
        onDelete={onDelete}
        initialIndex={initialIndex}
      />
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-4xl overflow-hidden border-white/10 bg-black p-0'>
          <DialogHeader className='sr-only'>
            <DialogTitle>View Angle</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className='border-white/10 bg-black'>
        <DrawerHeader className='sr-only'>
          <DrawerTitle>View Angle</DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
};

/** Grid for generated images */
const GeneratedGrid = ({
  images,
  onImageClick,
}: {
  images: GeneratedAngle[];
  onImageClick: (index: number) => void;
}) => {
  return (
    <div className='flex-1 overflow-y-auto bg-black/40 p-4 md:p-6'>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4'>
        {images.map((img, idx) => (
          <div
            key={img.id}
            className='group bg-muted relative aspect-square cursor-pointer overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10 transition-all hover:ring-cyan-500/50'
            onClick={() => onImageClick(idx)}
          >
            <img
              src={img.url}
              alt={`Angle ${idx + 1}`}
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20' />
            <div className='absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[8px] text-white/70 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100'>
              Angle {idx + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** History job card */
const HistoryCard = ({
  job,
  onDeleteJob,
  onDeleteAngle,
  onSelect,
}: {
  job: AngleReshapeJob;
  onDeleteJob: (jobId: string) => void;
  onDeleteAngle: (jobId: string, imageId: string) => void;
  onSelect: (job: AngleReshapeJob) => void;
}) => {
  const [deletingJob, setDeletingJob] = useState(false);
  const [deletingAngle, setDeletingAngle] = useState<string | null>(null);

  const handleDeleteJob = async () => {
    setDeletingJob(true);
    try {
      await apiResponse.delete(`/apps/angle-reshape/job/${job._id}`, {
        withCredentials: true,
      });
      onDeleteJob(job._id);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingJob(false);
    }
  };

  const handleDeleteAngle = async (imageId: string) => {
    setDeletingAngle(imageId);
    try {
      await apiResponse.delete(
        `/apps/angle-reshape/job/${job._id}/angle/${imageId}`,
        { withCredentials: true }
      );
      onDeleteAngle(job._id, imageId);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingAngle(null);
    }
  };

  return (
    <div
      className='border-border bg-card hover:border-primary/50 cursor-pointer space-y-3 rounded-xl border p-3 transition-colors'
      onClick={() => onSelect(job)}
    >
      <div className='flex items-center justify-between gap-2'>
        <div className='flex min-w-0 items-center gap-2'>
          <img
            src={job.sourceImageUrl}
            alt='source'
            className='border-border size-8 flex-shrink-0 rounded-lg border object-cover'
          />
          <div className='min-w-0'>
            <p className='text-foreground truncate text-[11px] font-medium'>
              {job.bestAngles
                ? "Auto — 10 Best Angles"
                : `R:${job.rotation}° T:${job.tilt}°`}
            </p>
            <p className='text-muted-foreground text-[10px]'>
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteJob();
          }}
          disabled={deletingJob}
          className='flex size-6 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-50'
        >
          {deletingJob ? (
            <div className='size-3 animate-spin rounded-full border border-red-400 border-t-transparent' />
          ) : (
            <Trash2 className='size-3' />
          )}
        </button>
      </div>

      {/* Generated images grid */}
      {job.generatedImages.length > 0 ? (
        <div className='grid grid-cols-3 gap-1.5'>
          {job.generatedImages.map((img) => (
            <div
              key={img._id}
              className='group/img bg-muted relative aspect-square overflow-hidden rounded-lg'
            >
              <img
                src={img.url}
                alt={img.name}
                className='h-full w-full object-cover'
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAngle(img._id);
                }}
                disabled={deletingAngle === img._id}
                className='absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover/img:opacity-100 hover:bg-red-600'
              >
                {deletingAngle === img._id ? (
                  <div className='size-2 animate-spin rounded-full border border-white border-t-transparent' />
                ) : (
                  <Trash className='size-2.5' />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-muted-foreground py-2 text-center text-[10px] italic'>
          All images deleted
        </p>
      )}
    </div>
  );
};

/** History Content Helper */
const HistoryContent = ({
  loading,
  history,
  onDeleteJob,
  onDeleteAngle,
  onSelect,
}: {
  loading: boolean;
  history: AngleReshapeJob[];
  onDeleteJob: (jobId: string) => void;
  onDeleteAngle: (jobId: string, imageId: string) => void;
  onSelect: (job: AngleReshapeJob) => void;
}) => (
  <>
    <div className='border-border bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4'>
      <h2 className='flex items-center gap-2 text-lg font-normal'>
        <HistoryIcon className='size-4' />
        Angle History
      </h2>
    </div>

    <div className='flex-1 space-y-3 overflow-y-auto px-4 py-4'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='border-primary size-8 animate-spin rounded-full border-2 border-t-transparent' />
        </div>
      ) : history.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
          <HistoryIcon className='text-muted-foreground/30 size-10' />
          <p className='text-muted-foreground text-sm'>No history yet.</p>
          <p className='text-muted-foreground text-xs'>
            Generate some angles to see them here.
          </p>
        </div>
      ) : (
        history.map((job) => (
          <HistoryCard
            key={job._id}
            job={job}
            onDeleteJob={onDeleteJob}
            onDeleteAngle={onDeleteAngle}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  </>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const AnglesReshapePage = () => {
  const [rotation, setRotation] = useState(180);
  const [tilt, setTilt] = useState(-31);
  const [zoom, setZoom] = useState(5);
  const [bestAngles, setBestAngles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startValues = useRef({ rotation: 0, tilt: 0 });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "controls">("upload");

  // Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedAngle[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // History sheet
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<AngleReshapeJob[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setGeneratedImages([]);
    setCurrentJobId(null);
    setActiveTab("controls");
    // Reset camera to neutral so user starts fresh
    setRotation(0);
    setTilt(0);
    setZoom(5);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (bestAngles) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    startValues.current = { rotation, tilt };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    let newRotation = (startValues.current.rotation + deltaX * 0.5) % 360;
    if (newRotation < 0) newRotation += 360;
    let newTilt = startValues.current.tilt - deltaY * 0.5;
    newTilt = Math.max(-90, Math.min(90, newTilt));
    setRotation(Math.round(newRotation));
    setTilt(Math.round(newTilt));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Generate
  const handleGenerate = async () => {
    if (!file || isGenerating) return;
    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedImages([]);
    setCurrentJobId(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("rotation", String(rotation));
      formData.append("tilt", String(tilt));
      formData.append("zoom", String(zoom));
      formData.append("bestAngles", String(bestAngles));

      const res = await apiResponse.post(
        "/apps/angle-reshape/generate",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = res.data;
      if (!data.success) throw new Error(data.message || "Generation failed");

      const imgs: GeneratedAngle[] = data.data.generatedImages.map(
        (i: any) => ({
          id: i.id,
          url: i.url,
          name: i.name,
        })
      );

      setGeneratedImages(imgs);
      setCurrentJobId(data.data.jobId);
    } catch (err: any) {
      setGenerateError(
        err?.response?.data?.message || err.message || "Failed to generate"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // History
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await apiResponse.get("/apps/angle-reshape/history", {
        withCredentials: true,
      });
      if (res.data.success) setHistory(res.data.data.jobs);
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const openHistory = () => {
    setHistoryOpen(true);
    loadHistory();
  };

  const handleDeleteCurrentAngle = (imageId: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleHistoryDeleteJob = (jobId: string) => {
    setHistory((prev) => prev.filter((j) => j._id !== jobId));
  };

  const handleHistoryDeleteAngle = (jobId: string, imageId: string) => {
    setHistory((prev) =>
      prev.map((j) =>
        j._id === jobId
          ? {
              ...j,
              generatedImages: j.generatedImages.filter(
                (img) => img._id !== imageId
              ),
            }
          : j
      )
    );
  };

  const handleSelectJob = (job: AngleReshapeJob) => {
    setPreviewUrl(job.sourceImageUrl);
    setRotation(job.rotation);
    setTilt(job.tilt);
    setZoom(job.zoom);
    setBestAngles(job.bestAngles);
    setGeneratedImages(
      job.generatedImages.map((i) => ({
        id: i._id,
        url: i.url,
        name: i.name,
      }))
    );
    setCurrentJobId(job._id);
    setActiveTab("controls");
    setHistoryOpen(false);
  };

  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div
        // ref={scrollContainerRef}
        className='scroll-container flex flex-1 flex-col overflow-auto will-change-scroll'
      >
        <TopNavWithAurora
        // scrollContainerRef={
        //   scrollContainerRef as React.RefObject<HTMLDivElement>
        // }
        />
        <div
          id='main-content'
          className='flex-1 rounded-t-2xl border-2 border-b-0'
          // style={{
          //   transform: "translateZ(0)",
          //   willChange: "transform",
          // }}
        >
          <main className='relative mt-12 flex-grow md:mb-20'>
            <div className='bg-grid-black/[0.1] dark:bg-grid-white/[0.2] absolute inset-0' />
            <div className='animate-fadeInUp mb-10 px-2 text-center md:px-4'>
              <h1 className='text-2xl font-semibold tracking-tight lg:text-4xl'>
                Cinematic
                <span className='from-primary to-accent ml-1 bg-gradient-to-r bg-clip-text text-transparent'>
                  Angles
                </span>
              </h1>
              <p
                className='text-muted-foreground animate-fadeInUp my-2 text-sm md:text-lg'
                style={{ animationDelay: "0.2s" }}
              >
                Precision tools built for creators who demand control.
              </p>
            </div>

            <div className='relative w-full border-y border-black/5 dark:border-white/10'>
              <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className='absolute inset-0 z-0 opacity-90 dark:opacity-50'
              />
              <section className='mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 gap-y-6 px-4 sm:px-2 md:grid-cols-[1fr_1.4fr] lg:gap-16 lg:px-8 lg:py-10'>
                {/* Left: Controls */}
                <div className='flex flex-col gap-4 lg:gap-5'>
                  <div className='z-1 max-h-fit w-full md:static md:h-full md:w-auto md:max-w-[360px]'>
                    <div className='flex h-full flex-col overflow-hidden rounded-md border border-black/5 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-[#141415]/80'>
                      {/* Visualizer */}
                      <div
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        className={cn(
                          "relative flex items-center justify-center",
                          "h-[300px]",
                          "bg-black/[0.02] dark:bg-white/[0.03]",
                          "border-b border-black/5 dark:border-white/10",
                          "group transition-all duration-200",
                          bestAngles
                            ? "cursor-not-allowed opacity-50"
                            : isDragging
                              ? "cursor-grabbing"
                              : "cursor-grab"
                        )}
                      >
                        <div className='pointer-events-none absolute top-4 z-10 space-y-1 px-4 text-center'>
                          <p className='text-foreground text-[10px] font-bold uppercase'>
                            Hold and drag to change
                          </p>
                          <p className='text-foreground text-[10px] italic'>
                            camera angle
                          </p>
                        </div>

                        <div className='relative flex size-40 items-center justify-center [perspective:1000px] md:size-48'>
                          {/* Subject at Center */}
                          <div className='pointer-events-none absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]'>
                            {previewUrl ? (
                              <div
                                className='size-24 overflow-hidden rounded-lg border border-white/20 bg-white/10 shadow-2xl md:size-28'
                                style={{
                                  transform: `rotateY(${-rotation}deg) rotateX(${-tilt}deg)`,
                                }}
                              >
                                <img
                                  src={previewUrl}
                                  alt='Subject'
                                  className='h-full w-full object-contain'
                                />
                              </div>
                            ) : (
                              <div className='size-20 rounded-full bg-blue-500/20 blur-2xl md:size-24' />
                            )}
                          </div>

                          {/* Sphere Cage */}
                          <div
                            className='pointer-events-none absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-out [transform-style:preserve-3d]'
                            style={{
                              transform: `rotateY(${rotation}deg) rotateX(${tilt}deg)`,
                            }}
                          >
                            {[0, 30, 60, 90, 120, 150].map((rot) => (
                              <div
                                key={`v-${rot}`}
                                className='absolute inset-0 rounded-full border border-black/30 opacity-40 dark:border-white/30'
                                style={{ transform: `rotateY(${rot}deg)` }}
                              />
                            ))}
                            {[-45, -25, 0, 25, 45].map((rot) => (
                              <div
                                key={`h-${rot}`}
                                className='absolute inset-0 rounded-full border border-black/30 opacity-60 dark:border-white/30'
                                style={{
                                  transform: `rotateX(90deg) translateZ(${rot * 1.4}px) scale(${Math.cos((rot * Math.PI) / 180)})`,
                                }}
                              />
                            ))}
                          </div>

                          {/* Orbiting Camera — click to upload when empty */}
                          <label
                            htmlFor='uploadFile1'
                            className={cn(
                              "pointer-events-auto absolute flex size-10 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg transition-all duration-150 ease-out md:size-12 dark:border-white/10 dark:bg-[#1a1a1c]",
                              !previewUrl &&
                                "cursor-pointer hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20",
                              previewUrl && "pointer-events-none"
                            )}
                            style={{
                              transform: `perspective(1000px) rotateY(${rotation - 180}deg) rotateX(${tilt}deg) translateZ(95px) rotateX(${-tilt}deg) rotateY(${-(rotation - 180)}deg)`,
                            }}
                            title={
                              previewUrl
                                ? undefined
                                : "Click to upload an image"
                            }
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt='Viewfinder'
                                className='h-full w-full object-cover'
                              />
                            ) : (
                              <div className='flex flex-col items-center justify-center gap-0.5'>
                                <ImageIcon className='size-3.5 text-blue-500 md:size-4' />
                                <span className='text-[6px] leading-none font-bold tracking-wide text-gray-500 uppercase'>
                                  Upload
                                </span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Tabs */}
                      <Tabs
                        value={activeTab}
                        onValueChange={(v) =>
                          setActiveTab(v as "upload" | "controls")
                        }
                        className='mt-1 w-full'
                      >
                        <TabsList className='ml-2 w-fit'>
                          <TabsTrigger value='upload'>Upload</TabsTrigger>
                          <TabsTrigger value='controls'>Controls</TabsTrigger>
                        </TabsList>

                        {/* Upload Tab */}
                        <TabsContent value='upload' className='w-full'>
                          <div className='flex items-center justify-center px-2 py-1'>
                            <label
                              htmlFor='uploadFile1'
                              className='flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white text-base font-semibold text-slate-500 transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-500/5'
                            >
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='mb-3 w-10 fill-gray-400 dark:fill-slate-500'
                                viewBox='0 0 32 32'
                              >
                                <path d='M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z' />
                                <path d='M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z' />
                              </svg>
                              {file ? (
                                <span className='text-sm font-medium text-blue-500'>
                                  {file.name}
                                </span>
                              ) : (
                                <span className='text-sm text-slate-600 dark:text-slate-300'>
                                  Upload file
                                </span>
                              )}
                              <input
                                type='file'
                                id='uploadFile1'
                                className='hidden'
                                accept='image/png,image/jpeg,image/webp,image/gif,image/svg+xml'
                                onChange={handleFileUpload}
                              />
                              <p className='mt-2 text-xs font-medium text-slate-400 dark:text-slate-500'>
                                PNG, JPG, SVG, WEBP, and GIF are Allowed.
                              </p>
                            </label>
                          </div>
                        </TabsContent>

                        {/* Controls Tab */}
                        <TabsContent value='controls'>
                          <div className='space-y-4 bg-black/[0.02] px-2 py-2 dark:bg-black/20'>
                            <div className='space-y-3'>
                              {/* Rotation */}
                              {(() => {
                                const pct = (rotation / 360) * 100;
                                return (
                                  <div className='flex items-center gap-1.5'>
                                    <span className='w-[60px] shrink-0 truncate text-[10px] text-neutral-400 dark:text-neutral-500'>
                                      Rotation
                                    </span>
                                    <button
                                      onClick={() =>
                                        setRotation(Math.max(0, rotation - 5))
                                      }
                                      disabled={bestAngles}
                                      className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                    >
                                      <Minus className='size-2.5' />
                                    </button>
                                    <div
                                      className='relative h-[18px] flex-1 cursor-pointer overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800'
                                      onClick={(e) => {
                                        if (bestAngles) return;
                                        const rect =
                                          e.currentTarget.getBoundingClientRect();
                                        const raw = Math.round(
                                          ((e.clientX - rect.left) /
                                            rect.width) *
                                            360
                                        );
                                        setRotation(
                                          Math.max(0, Math.min(360, raw))
                                        );
                                      }}
                                    >
                                      <div
                                        className='absolute top-0 left-0 h-full rounded-l-md bg-neutral-300 transition-[width] duration-100 dark:bg-neutral-700'
                                        style={{ width: `${pct}%` }}
                                      />
                                      <div className='absolute inset-0 flex items-center justify-center'>
                                        <span className='text-[10px] font-medium text-neutral-700 tabular-nums dark:text-neutral-200'>
                                          {rotation}°
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        setRotation(Math.min(360, rotation + 5))
                                      }
                                      disabled={bestAngles}
                                      className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                    >
                                      <Plus className='size-2.5' />
                                    </button>
                                  </div>
                                );
                              })()}
                              {/* Tilt */}
                              {(() => {
                                const pct = ((tilt + 90) / 180) * 100;
                                return (
                                  <div className='flex items-center gap-1.5'>
                                    <span className='w-[60px] shrink-0 truncate text-[10px] text-neutral-400 dark:text-neutral-500'>
                                      Tilt
                                    </span>
                                    <button
                                      onClick={() =>
                                        setTilt(Math.max(-90, tilt - 5))
                                      }
                                      disabled={bestAngles}
                                      className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                    >
                                      <Minus className='size-2.5' />
                                    </button>
                                    <div
                                      className='relative h-[18px] flex-1 cursor-pointer overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800'
                                      onClick={(e) => {
                                        if (bestAngles) return;
                                        const rect =
                                          e.currentTarget.getBoundingClientRect();
                                        const raw = Math.round(
                                          ((e.clientX - rect.left) /
                                            rect.width) *
                                            180 -
                                            90
                                        );
                                        setTilt(
                                          Math.max(-90, Math.min(90, raw))
                                        );
                                      }}
                                    >
                                      <div
                                        className='absolute top-0 left-0 h-full rounded-l-md bg-neutral-300 transition-[width] duration-100 dark:bg-neutral-700'
                                        style={{ width: `${pct}%` }}
                                      />
                                      <div className='absolute inset-0 flex items-center justify-center'>
                                        <span className='text-[10px] font-medium text-neutral-700 tabular-nums dark:text-neutral-200'>
                                          {tilt}°
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        setTilt(Math.min(90, tilt + 5))
                                      }
                                      disabled={bestAngles}
                                      className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                    >
                                      <Plus className='size-2.5' />
                                    </button>
                                  </div>
                                );
                              })()}
                              {/* Zoom */}
                              {(() => {
                                const pct = ((zoom - 1) / 9) * 100;
                                return (
                                  <div className='flex items-center gap-1.5'>
                                    <span className='w-[60px] shrink-0 truncate text-[10px] text-neutral-400 dark:text-neutral-500'>
                                      Zoom
                                    </span>
                                    <button
                                      onClick={() =>
                                        setZoom(Math.max(1, zoom - 1))
                                      }
                                      disabled={bestAngles}
                                      className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                    >
                                      <Minus className='size-2.5' />
                                    </button>
                                    <div
                                      className='relative h-[18px] flex-1 cursor-pointer overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800'
                                      onClick={(e) => {
                                        if (bestAngles) return;
                                        const rect =
                                          e.currentTarget.getBoundingClientRect();
                                        const raw = Math.round(
                                          ((e.clientX - rect.left) /
                                            rect.width) *
                                            9 +
                                            1
                                        );
                                        setZoom(Math.max(1, Math.min(10, raw)));
                                      }}
                                    >
                                      <div
                                        className='absolute top-0 left-0 h-full rounded-l-md bg-neutral-300 transition-[width] duration-100 dark:bg-neutral-700'
                                        style={{ width: `${pct}%` }}
                                      />
                                      <div className='absolute inset-0 flex items-center justify-center'>
                                        <span className='text-[10px] font-medium text-neutral-700 tabular-nums dark:text-neutral-200'>
                                          {zoom}x
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        setZoom(Math.min(10, zoom + 1))
                                      }
                                      disabled={bestAngles}
                                      className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                    >
                                      <Plus className='size-2.5' />
                                    </button>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Auto-generate checkbox */}
                            <label className='flex cursor-pointer items-center gap-2 rounded-lg border border-black/5 bg-black/5 px-3 py-2 transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]'>
                              <input
                                type='checkbox'
                                checked={bestAngles}
                                onChange={(e) =>
                                  setBestAngles(e.target.checked)
                                }
                                className='size-3 border-slate-300 accent-blue-600 dark:border-slate-700'
                              />
                              <span className='text-foreground text-sm font-normal'>
                                Auto-Generate 10 Best Angles
                              </span>
                            </label>

                            {/* Error */}
                            {generateError && (
                              <p className='text-center text-[10px] text-red-400'>
                                {generateError}
                              </p>
                            )}

                            <Button
                              className='flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-gradient-to-bl focus:ring-4 focus:ring-cyan-300 focus:outline-none dark:focus:ring-cyan-800'
                              disabled={!file || isGenerating}
                              onClick={handleGenerate}
                            >
                              <span className='text-sm'>
                                {isGenerating ? "Generating..." : "Generate"}
                              </span>
                              {!isGenerating && (
                                <Sparkles className='size-4 text-white' />
                              )}
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>

                {/* Right: Result Panel */}
                <div className='relative flex min-h-[40vh] flex-col items-stretch overflow-hidden rounded-2xl border border-black/5 bg-black dark:border-white/5 dark:bg-black'>
                  {/* Header */}
                  <div className='flex h-fit shrink-0 items-center justify-between border-b border-white/5 bg-[#0A0A0A]/50 px-8 py-2 backdrop-blur'>
                    <div className='flex items-center gap-2'>
                      <span className='text-base font-bold text-white'>
                        Result
                      </span>
                      {generatedImages.length > 0 && (
                        <span className='rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-medium text-cyan-400'>
                          {generatedImages.length} angles
                        </span>
                      )}
                    </div>
                    <button
                      onClick={openHistory}
                      className='inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/[0.05] dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white'
                      title='View history'
                    >
                      <HistoryIcon className='size-3.5' />
                      History
                    </button>
                  </div>

                  {/* Body */}
                  {isGenerating ? (
                    <div className='flex flex-1 flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 p-8 dark:border-white/10'>
                      <div className='relative size-16'>
                        <div className='absolute inset-0 animate-ping rounded-full border-2 border-cyan-500/30' />
                        <div className='absolute inset-0 animate-spin rounded-full border-2 border-t-cyan-500' />
                        <div className='absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20' />
                      </div>
                      <div className='text-center'>
                        <p className='text-sm font-bold text-white'>
                          {bestAngles
                            ? "Generating 10 best angles..."
                            : "Generating..."}
                        </p>
                        <p className='mt-1 text-xs text-white/40'>
                          {bestAngles
                            ? "This may take a minute"
                            : "Processing your image"}
                        </p>
                      </div>
                    </div>
                  ) : generatedImages.length > 0 && currentJobId ? (
                    <>
                      {generatedImages.length > 1 ? (
                        <GeneratedGrid
                          images={generatedImages}
                          onImageClick={(idx) => {
                            setSelectedIndex(idx);
                            setModalOpen(true);
                          }}
                        />
                      ) : (
                        <GeneratedCarousel
                          images={generatedImages}
                          jobId={currentJobId}
                          onDelete={handleDeleteCurrentAngle}
                        />
                      )}
                      <ResponsiveCarouselModal
                        isOpen={modalOpen}
                        onOpenChange={setModalOpen}
                        images={generatedImages}
                        jobId={currentJobId}
                        onDelete={handleDeleteCurrentAngle}
                        initialIndex={selectedIndex}
                      />
                    </>
                  ) : previewUrl ? (
                    /* Live preview (pre-generation) */
                    <div className='flex flex-1 flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 p-2 dark:border-white/10'>
                      <img
                        src={previewUrl}
                        alt='Live preview'
                        className='max-h-[55vh] w-full rounded-2xl object-contain'
                        style={{
                          transform: `perspective(1200px) rotateY(${(rotation - 180) * 0.06}deg) rotateX(${tilt * 0.06}deg) scale(${0.88 + zoom * 0.02})`,
                          transition: "transform 0.12s ease-out",
                        }}
                      />
                      <div className='flex flex-col items-center gap-1'>
                        <p className='text-[10px] font-bold tracking-widest text-white/50 uppercase'>
                          Live Preview
                        </p>
                        <p className='text-[10px] text-white/30 italic'>
                          Drag the globe or use sliders to adjust angle
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Empty / demo state */
                    <div className='group relative isolate max-h-[55vh] w-full border-2 border-dashed border-gray-200 dark:border-white/10'>
                      <img
                        src='https://i.pinimg.com/736x/1d/e5/29/1de52947cf871b610fb4276053dd137f.jpg'
                        alt='Demo preview'
                        className='max-h-[55vh] w-full rounded-2xl object-cover'
                        style={{
                          transform: `perspective(1200px) rotateY(${(rotation - 180) * 0.06}deg) rotateX(${tilt * 0.06}deg) scale(${0.88 + zoom * 0.02})`,
                          transition: "transform 0.12s ease-out",
                        }}
                      />
                      <div className='absolute inset-x-0 bottom-4 flex flex-col items-center gap-1'>
                        <p className='text-[10px] font-bold tracking-widest text-white/50 uppercase'>
                          You have the canvas, No Camera needed
                        </p>
                        <p className='text-[10px] text-white/30 italic'>
                          Upload an image and generate
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </main>

          {/* History Responsive Container */}
          {isDesktop ? (
            <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
              <SheetContent className='flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-md'>
                <HistoryContent
                  loading={historyLoading}
                  history={history}
                  onDeleteJob={handleHistoryDeleteJob}
                  onDeleteAngle={handleHistoryDeleteAngle}
                  onSelect={handleSelectJob}
                />
              </SheetContent>
            </Sheet>
          ) : (
            <Drawer open={historyOpen} onOpenChange={setHistoryOpen}>
              <DrawerContent className='h-[80vh]'>
                <HistoryContent
                  loading={historyLoading}
                  history={history}
                  onDeleteJob={handleHistoryDeleteJob}
                  onDeleteAngle={handleHistoryDeleteAngle}
                  onSelect={handleSelectJob}
                />
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnglesReshapePage;
