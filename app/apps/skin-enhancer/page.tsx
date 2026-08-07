"use client";

import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MainContent } from "@/components/layout/main-content";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Compare } from "@/components/ui/compare";
import { GridPattern } from "@/components/ui/grid-pattern";
import { PremiumInput } from "@/components/ui/premium-input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import {
  ChevronLeft,
  ChevronRight,
  CircleFadingArrowUp,
  Download,
  HistoryIcon,
  MessageSquare,
  Minus,
  Plus,
  Settings2,
  Sparkles,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import { Toaster } from "sonner";
import React, { useCallback, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface GeneratedImage {
  id: string;
  url: string;
  name: string;
}

interface SkinEnhancerJob {
  _id: string;
  sourceImageUrl: string;
  realismLevel: number;
  beautySmoothing: number;
  prompt?: string;
  generatedImages: { _id: string; url: string; name: string }[];
  createdAt: string;
}

// ─── Slider Component ────────────────────────────────────────────────────────

const SliderControl = ({
  label,
  value,
  min,
  max,
  unit = "",
  step = 5,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  step?: number;
  onChange: (v: number) => void;
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <div className='flex items-center gap-1.5'>
      {/* Label */}
      <span className='w-[90px] shrink-0 truncate text-[10px] text-neutral-400 dark:text-neutral-500'>
        {label}
      </span>

      {/* Minus */}
      <button
        onClick={decrement}
        className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
        aria-label={`Decrease ${label}`}
      >
        <Minus className='size-2.5' />
      </button>

      {/* Bar */}
      <div
        className='relative h-[18px] flex-1 cursor-pointer overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800'
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const raw = Math.round((x / rect.width) * (max - min) + min);
          onChange(Math.max(min, Math.min(max, raw)));
        }}
      >
        {/* Fill */}
        <div
          className='absolute top-0 left-0 h-full rounded-l-md bg-neutral-300 transition-[width] duration-100 dark:bg-neutral-700'
          style={{ width: `${pct}%` }}
        />
        {/* Value */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-[10px] font-medium text-neutral-700 tabular-nums dark:text-neutral-200'>
            {value}
            {unit}
          </span>
        </div>
      </div>

      {/* Plus */}
      <button
        onClick={increment}
        className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
        aria-label={`Increase ${label}`}
      >
        <Plus className='size-2.5' />
      </button>
    </div>
  );
};

// ─── Section Heading ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className='text-muted-foreground my-2 pt-2 font-bold uppercase'>
    {children}
  </span>
);

// ─── Carousel ────────────────────────────────────────────────────────────────

const GeneratedCarousel = ({
  images,
  jobId,
  onDelete,
}: {
  images: GeneratedImage[];
  jobId: string;
  onDelete: (imageId: string) => void;
}) => {
  const [current, setCurrent] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await apiResponse.delete(`/apps/skin-enhancer/job/${jobId}/image/${id}`, {
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
      <div className='relative flex w-full flex-1 items-center justify-center'>
        <img
          key={img.id}
          src={img.url}
          alt={`Enhanced ${current + 1}`}
          className='max-h-[52vh] w-full rounded-xl object-contain'
        />
        <button
          onClick={() => handleDelete(img.id)}
          disabled={deletingId === img.id}
          className='absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-red-600 disabled:opacity-50'
          title='Delete this image'
        >
          {deletingId === img.id ? (
            <div className='size-3 animate-spin rounded-full border border-white border-t-transparent' />
          ) : (
            <Trash className='size-3.5' />
          )}
        </button>
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
    </div>
  );
};

// ─── History Card ────────────────────────────────────────────────────────────

const HistoryCard = ({
  job,
  onDeleteJob,
  onDeleteImage,
  onSelect,
}: {
  job: SkinEnhancerJob;
  onDeleteJob: (jobId: string) => void;
  onDeleteImage: (jobId: string, imageId: string) => void;
  onSelect: (job: SkinEnhancerJob) => void;
}) => {
  const [deletingJob, setDeletingJob] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  const handleDeleteJob = async () => {
    setDeletingJob(true);
    try {
      await apiResponse.delete(`/apps/skin-enhancer/job/${job._id}`, {
        withCredentials: true,
      });
      onDeleteJob(job._id);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingJob(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    setDeletingImage(imageId);
    try {
      await apiResponse.delete(
        `/apps/skin-enhancer/job/${job._id}/image/${imageId}`,
        { withCredentials: true }
      );
      onDeleteImage(job._id, imageId);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingImage(null);
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
              <LocalizedText text={"Realism"} />
              {job.realismLevel}
              <LocalizedText text={"% · Smoothing"} />
              {job.beautySmoothing}%
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
                  handleDeleteImage(img._id);
                }}
                disabled={deletingImage === img._id}
                className='absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover/img:opacity-100 hover:bg-red-600'
              >
                {deletingImage === img._id ? (
                  <div className='size-2 animate-spin rounded-full border border-white border-t-transparent' />
                ) : (
                  <Trash className='size-2.5' />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-muted-foreground py-2 text-center text-[10px]'>
          <LocalizedText text={"All images deleted"} />
        </p>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const SkinEnhancerPage = () => {
  // Skin Realism
  const [skinTextureIntensity, setSkinTextureIntensity] = useState(70);
  const [poreVisibility, setPoreVisibility] = useState(60);
  const [imperfectionLevel, setImperfectionLevel] = useState(30);
  const [oilShineLevel, setOilShineLevel] = useState(40);

  // Hair
  const [facialHairDensity, setFacialHairDensity] = useState(50);
  const [bodyHairVisibility, setBodyHairVisibility] = useState(40);
  const [hairStrandRealism, setHairStrandRealism] = useState(60);

  // Enhancement
  const [beautySmoothing, setBeautySmoothing] = useState(20);
  const [realismLevel, setRealismLevel] = useState(90);
  const [ageRealism, setAgeRealism] = useState(70);
  const [skinToneVariation, setSkinToneVariation] = useState(50);

  // Prompt
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Auto / Advanced
  const [autoMode, setAutoMode] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // File
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "controls">("upload");

  // Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // History
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<SkinEnhancerJob[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const selected = e.target.files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setActiveTab("controls");
    setGeneratedImages([]);
    setCurrentJobId(null);
  };

  // Generate
  const handleEnhance = async () => {
    if (!file || isGenerating) return;
    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedImages([]);
    setCurrentJobId(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("autoMode", String(autoMode));
      formData.append("skinTextureIntensity", String(skinTextureIntensity));
      formData.append("poreVisibility", String(poreVisibility));
      formData.append("imperfectionLevel", String(imperfectionLevel));
      formData.append("oilShineLevel", String(oilShineLevel));
      formData.append("facialHairDensity", String(facialHairDensity));
      formData.append("bodyHairVisibility", String(bodyHairVisibility));
      formData.append("hairStrandRealism", String(hairStrandRealism));
      formData.append("beautySmoothing", String(beautySmoothing));
      formData.append("realismLevel", String(realismLevel));
      formData.append("ageRealism", String(ageRealism));
      formData.append("skinToneVariation", String(skinToneVariation));
      if (showPrompt && prompt.trim()) {
        formData.append("prompt", prompt.trim());
      }

      const res = await apiResponse.post(
        "/apps/skin-enhancer/enhance",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = res.data;
      if (!data.success) throw new Error(data.message || "Enhancement failed");

      const imgs: GeneratedImage[] = data.data.generatedImages.map(
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
        err?.response?.data?.message || err.message || "Failed to enhance"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // History
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await apiResponse.get("/apps/skin-enhancer/history", {
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

  const handleDeleteCurrentImage = (imageId: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleHistoryDeleteJob = (jobId: string) => {
    setHistory((prev) => prev.filter((j) => j._id !== jobId));
  };

  const handleHistoryDeleteImage = (jobId: string, imageId: string) => {
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

  const handleSelectJob = (job: SkinEnhancerJob) => {
    setPreviewUrl(job.sourceImageUrl);
    setRealismLevel(job.realismLevel);
    setBeautySmoothing(job.beautySmoothing);
    setPrompt(job.prompt || "");
    setShowPrompt(!!job.prompt);
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
      <div className='scroll-container flex flex-1 flex-col overflow-auto will-change-scroll'>
        <TopNavWithAurora />
        <div
          id='main-content'
          className='mr-2 ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <main className='flex-grow pt-12 md:mb-20'>
            {/* Hero */}

            <div className='animate-fadeInUp mb-10 px-2 text-center md:px-4'>
              <h1 className='text-2xl font-semibold tracking-tight lg:text-4xl'>
                <LocalizedText text={"Skin"} />
                <span className='from-primary to-accent ml-1 bg-gradient-to-r bg-clip-text text-transparent'>
                  <LocalizedText text={"Enhancer"} />
                </span>
              </h1>
              <p
                className='text-muted-foreground animate-fadeInUp my-2 text-sm md:text-lg'
                style={{ animationDelay: "0.2s" }}
              >
                <LocalizedText
                  text={
                    "Achieve professional, true-to-life skin textures in seconds."
                  }
                />
              </p>
            </div>

            {/* Main layout */}
            <div className='relative w-full border-y border-black/5 dark:border-white/10'>
              <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className='absolute inset-0 z-0 opacity-90 dark:opacity-50'
              />
              <section className='relative mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 gap-y-6 px-4 sm:px-2 md:grid-cols-[1fr_1.4fr] lg:gap-16 lg:px-8 lg:py-10'>
                {/* Left: Controls */}
                <div className='flex flex-col gap-4 lg:gap-5'>
                  <div className='z-1 max-h-fit w-full md:static md:h-full md:w-auto md:max-w-[360px]'>
                    <div className='flex h-full flex-col overflow-hidden rounded-md border border-black/5 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-[#141415]/80'>
                      {/* Skin-tone preview orb */}
                      <div
                        className={cn(
                          "relative flex items-center justify-center",
                          "h-[300px]",
                          "bg-black/[0.02] dark:bg-white/[0.03]",
                          "border-b border-black/5 dark:border-white/10"
                        )}
                      >
                        <div className='pointer-events-none absolute top-4 z-10 space-y-1 px-4 text-center'>
                          <p className='text-foreground text-[10px] font-bold uppercase'>
                            <LocalizedText text={"Skin Preview"} />
                          </p>
                          <p className='text-foreground text-[10px]'>
                            <LocalizedText
                              text={
                                "Controls affect AI output, not this preview"
                              }
                            />
                          </p>
                        </div>

                        <div className='relative mt-8 flex size-28 items-center justify-center md:size-48'>
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt='Skin preview'
                              className='size-full rounded-lg border border-white/10 object-cover shadow-2xl'
                            />
                          ) : (
                            <label
                              htmlFor='skinUploadFile'
                              className='flex size-full cursor-pointer items-center justify-center rounded-lg border border-black/10 bg-gradient-to-br from-rose-200/60 via-amber-100/50 to-orange-200/40 shadow-2xl transition-colors hover:border-blue-400 dark:border-white/10 dark:from-rose-400/20 dark:via-amber-200/15 dark:to-orange-300/10'
                            >
                              <div className='flex flex-col items-center gap-1'>
                                <Sparkles className='text-muted-foreground size-5' />
                                <span className='text-muted-foreground text-[8px] font-bold uppercase'>
                                  <LocalizedText text={"Upload"} />
                                </span>
                              </div>
                            </label>
                          )}
                          <div className='pointer-events-none absolute inset-0 rounded-full border border-blue-300/20 dark:border-blue-400/10' />
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
                          <TabsTrigger value='upload'>
                            <LocalizedText text={"Upload"} />
                          </TabsTrigger>
                          <TabsTrigger value='controls'>
                            <LocalizedText text={"Controls"} />
                          </TabsTrigger>
                        </TabsList>

                        {/* Upload Tab */}
                        <TabsContent value='upload' className='w-full'>
                          <div className='flex items-center justify-center px-2 py-1'>
                            <label
                              htmlFor='skinUploadFile'
                              className='flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white text-base font-semibold text-slate-500 transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-500/5'
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
                                  <LocalizedText text={"Upload photo"} />
                                </span>
                              )}
                              <input
                                type='file'
                                id='skinUploadFile'
                                className='hidden'
                                accept='image/png,image/jpeg,image/webp'
                                onChange={handleFileChange}
                              />
                              <p className='mt-2 text-xs font-medium text-slate-400 dark:text-slate-500'>
                                <LocalizedText
                                  text={"PNG, JPG and WEBP are Allowed."}
                                />
                              </p>
                            </label>
                          </div>
                        </TabsContent>

                        {/* Controls Tab */}
                        <TabsContent value='controls'>
                          <div className='max-h-[40vh] space-y-3 overflow-y-auto bg-black/[0.02] px-2 py-2 dark:bg-black/20'>
                            {/* Auto Mode Checkbox */}
                            <label className='flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors'>
                              <input
                                type='checkbox'
                                checked={autoMode}
                                onChange={(e) => {
                                  setAutoMode(e.target.checked);
                                  setShowAdvanced(true);
                                  // if (e.target.checked) setShowAdvanced(true);
                                }}
                                className='size-3 border-slate-300 accent-blue-600 dark:border-slate-700'
                              />
                              {autoMode ? (
                                <span className='text-foreground text-xs font-normal'>
                                  <LocalizedText text={"Auto (Recommended)"} />
                                </span>
                              ) : (
                                <div className='flex items-center gap-2'>
                                  <Settings2 className='text-muted-foreground size-3.5' />
                                  <span className='text-xs'>
                                    <LocalizedText text={"Advanced Controls"} />
                                  </span>
                                </div>
                              )}
                            </label>

                            {autoMode && (
                              <p className='text-muted-foreground text-start text-[10px]'>
                                <LocalizedText
                                  text={
                                    "AI will use balanced realism settings automatically."
                                  }
                                />
                              </p>
                            )}

                            {/* Advanced Toggle */}
                            {/* {!autoMode && (
                          <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/[0.06] transition-colors text-sm text-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <Settings2 className="size-3.5 text-muted-foreground" />
                              <span>Advanced Controls</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {showAdvanced ? "Hide" : "Show"}
                            </span>
                          </button>
                        )} */}

                            {/* Detailed Sliders — only visible in manual + advanced mode */}
                            {!autoMode && showAdvanced && (
                              <div className='space-y-3 px-2'>
                                {/* Skin Realism */}
                                <SectionLabel>
                                  <LocalizedText text={"Skin Realism"} />
                                </SectionLabel>
                                <SliderControl
                                  label='Skin Texture'
                                  value={skinTextureIntensity}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setSkinTextureIntensity}
                                />
                                <SliderControl
                                  label='Pore Visibility'
                                  value={poreVisibility}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setPoreVisibility}
                                />
                                <SliderControl
                                  label='Imperfections'
                                  value={imperfectionLevel}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setImperfectionLevel}
                                />
                                <SliderControl
                                  label='Oil / Shine'
                                  value={oilShineLevel}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setOilShineLevel}
                                />

                                {/* Hair */}
                                <SectionLabel>
                                  <LocalizedText text={"Hair Details"} />
                                </SectionLabel>
                                <SliderControl
                                  label='Facial Hair Density'
                                  value={facialHairDensity}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setFacialHairDensity}
                                />
                                <SliderControl
                                  label='Body Hair'
                                  value={bodyHairVisibility}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setBodyHairVisibility}
                                />
                                <SliderControl
                                  label='Hair Strand Realism'
                                  value={hairStrandRealism}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setHairStrandRealism}
                                />

                                {/* Enhancement */}
                                <SectionLabel>
                                  <LocalizedText text={"Enhancement"} />
                                </SectionLabel>
                                <SliderControl
                                  label='Beauty Smoothing'
                                  value={beautySmoothing}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setBeautySmoothing}
                                />
                                <SliderControl
                                  label='Realism Level'
                                  value={realismLevel}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setRealismLevel}
                                />
                                <SliderControl
                                  label='Age Realism'
                                  value={ageRealism}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setAgeRealism}
                                />
                                <SliderControl
                                  label='Skin Tone Variation'
                                  value={skinToneVariation}
                                  min={0}
                                  max={100}
                                  unit='%'
                                  onChange={setSkinToneVariation}
                                />
                              </div>
                            )}

                            {/* Prompt Toggle */}
                            <div className='pt-1'>
                              <label className='flex cursor-pointer items-center gap-2 rounded-lg border border-black/5 bg-black/5 px-3 py-2 transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]'>
                                <input
                                  type='checkbox'
                                  checked={showPrompt}
                                  onChange={(e) =>
                                    setShowPrompt(e.target.checked)
                                  }
                                  className='size-3 border-slate-300 accent-blue-600 dark:border-slate-700'
                                />
                                <MessageSquare className='text-muted-foreground size-3' />
                                <span className='text-foreground text-sm font-normal'>
                                  <LocalizedText text={"Add Prompt"} />
                                </span>
                              </label>
                            </div>

                            {/* Prompt Input */}
                            {showPrompt && (
                              <PremiumInput
                                value={prompt}
                                onChange={setPrompt}
                                onSubmit={handleEnhance}
                                isGenerating={isGenerating}
                                placeholder='Describe additional details...'
                                minHeight='50px'
                              />
                            )}
                          </div>

                          {/* Sticky Enhance Button */}
                          <div className='sticky bottom-0 border-t border-black/5 bg-white/90 px-2 py-2 backdrop-blur-sm dark:border-white/5 dark:bg-[#141415]/90'>
                            {generateError && (
                              <p className='mb-2 text-center text-[10px] text-red-400'>
                                {generateError}
                              </p>
                            )}
                            <Button
                              className='flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:bg-indigo-700/90 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800'
                              disabled={!file || isGenerating}
                              onClick={handleEnhance}
                            >
                              <span className='text-sm'>
                                {isGenerating ? "Enhancing..." : "Enhance"}
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
                <div className='relative flex min-h-[40vh] flex-col items-stretch overflow-hidden rounded-lg border border-black/5 bg-black dark:border-white/5 dark:bg-black'>
                  {/* Header */}
                  <div className='flex h-fit shrink-0 items-center justify-between border-b border-white/5 bg-[#0A0A0A]/50 px-8 py-2 backdrop-blur'>
                    <div className='flex items-center gap-3'>
                      <span className='text-base font-bold text-white'>
                        <LocalizedText text={"Result"} />
                      </span>
                      {generatedImages.length > 0 && (
                        <span className='rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-400'>
                          {generatedImages.length}{" "}
                          <LocalizedText text={"image"} />
                          {generatedImages.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={openHistory}
                      className='inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/[0.05] dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white'
                      title='View history'
                    >
                      <HistoryIcon className='size-3.5' />
                      <LocalizedText text={"History"} />
                    </button>
                  </div>

                  {/* Body */}
                  {isGenerating ? (
                    <div className='flex flex-1 flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 p-8 dark:border-white/10'>
                      <div className='relative size-16'>
                        <div className='absolute inset-0 animate-ping rounded-full border-2 border-blue-500/30' />
                        <div className='absolute inset-0 animate-spin rounded-full border-2 border-t-blue-500' />
                        <div className='absolute inset-2 rounded-full bg-gradient-to-br from-blue-500/20 to-pink-500/20' />
                      </div>
                      <div className='text-center'>
                        <p className='text-sm font-bold text-white'>
                          <LocalizedText text={"Enhancing..."} />
                        </p>
                        <p className='mt-1 text-xs text-white/40'>
                          <LocalizedText
                            text={"Applying skin retouching with AI"}
                          />
                        </p>
                      </div>
                    </div>
                  ) : generatedImages.length > 0 && currentJobId ? (
                    <GeneratedCarousel
                      images={generatedImages}
                      jobId={currentJobId}
                      onDelete={handleDeleteCurrentImage}
                    />
                  ) : previewUrl ? (
                    <div className='flex flex-1 flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 p-6 dark:border-white/10'>
                      <div className='relative w-full max-w-lg overflow-hidden rounded-lg border border-white/10 shadow-2xl'>
                        <img
                          src={previewUrl}
                          alt='Uploaded preview'
                          className='max-h-[55vh] w-full rounded-lg object-contain'
                        />
                      </div>
                      <div className='flex flex-col items-center gap-1'>
                        <p className='text-[10px] font-bold tracking-widest text-white/50 uppercase'>
                          <LocalizedText text={"Uploaded Image"} />
                        </p>
                        <p className='text-[10px] text-white/30 italic'>
                          <LocalizedText
                            text={"Adjust controls and hit Enhance"}
                          />
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='group relative isolate h-fit w-full border-2 border-dashed border-gray-200 dark:border-white/10'>
                      <Compare
                        firstImage='https://d2qrb904tbc8rh.cloudfront.net/images/v2-Input.png'
                        secondImage='https://d2qrb904tbc8rh.cloudfront.net/images/v2-Smooth.jpg'
                        firstImageClassName='object-cover object-left-top'
                        secondImageClassname='object-cover object-left-top'
                        className='mx-2 mt-4 h-[500px] w-full md:h-[500px] md:w-[500px] lg:mx-auto'
                        slideMode='hover'
                      />
                      <div className='flex flex-col items-center gap-1 py-2'>
                        <p className='text-[10px] font-bold tracking-widest text-white/50 uppercase'>
                          <LocalizedText
                            text={"Upload a photo to get started"}
                          />
                        </p>
                        <p className='text-[10px] text-white/30 italic'>
                          <LocalizedText
                            text={
                              "AI will enhance skin with hyper-realistic detail"
                            }
                          />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </main>

          {/* History Sheet */}
          <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
            <SheetContent className='flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-md'>
              <SheetHeader className='border-border bg-background sticky top-0 z-10 border-b px-6 py-4'>
                <SheetTitle className='flex items-center gap-2 font-normal'>
                  <HistoryIcon className='size-4' />
                  <LocalizedText text={"History"} />
                </SheetTitle>
              </SheetHeader>

              <div className='flex-1 space-y-3 overflow-y-auto px-4 py-4'>
                {historyLoading ? (
                  <div className='flex items-center justify-center py-12'>
                    <div className='border-primary size-8 animate-spin rounded-full border-2 border-t-transparent' />
                  </div>
                ) : history.length === 0 ? (
                  <div className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
                    <HistoryIcon className='text-muted-foreground/30 size-10' />
                    <p className='text-muted-foreground text-sm'>
                      <LocalizedText text={"No history yet."} />
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      <LocalizedText
                        text={"Enhance a photo to see results here."}
                      />
                    </p>
                  </div>
                ) : (
                  history.map((job) => (
                    <HistoryCard
                      key={job._id}
                      job={job}
                      onDeleteJob={handleHistoryDeleteJob}
                      onDeleteImage={handleHistoryDeleteImage}
                      onSelect={handleSelectJob}
                    />
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default SkinEnhancerPage;
