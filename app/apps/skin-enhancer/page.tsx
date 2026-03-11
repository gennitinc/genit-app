"use client";

import React, { useState, useCallback } from "react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  HistoryIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  Download,
  MessageSquare,
  Settings2,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Compare } from "@/components/ui/compare";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { apiResponse } from "@/utils/apiResponse";

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
    <div className="flex items-center gap-1.5">
      {/* Label */}
      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 w-[90px] shrink-0 truncate">
        {label}
      </span>

      {/* Minus */}
      <button
        onClick={decrement}
        className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0"
        aria-label={`Decrease ${label}`}
      >
        <Minus className="size-2.5" />
      </button>

      {/* Bar */}
      <div
        className="relative flex-1 h-[18px] rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const raw = Math.round((x / rect.width) * (max - min) + min);
          onChange(Math.max(min, Math.min(max, raw)));
        }}
      >
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-l-md bg-neutral-300 dark:bg-neutral-700 transition-[width] duration-100"
          style={{ width: `${pct}%` }}
        />
        {/* Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-medium tabular-nums text-neutral-700 dark:text-neutral-200">
            {value}
            {unit}
          </span>
        </div>
      </div>

      {/* Plus */}
      <button
        onClick={increment}
        className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0"
        aria-label={`Increase ${label}`}
      >
        <Plus className="size-2.5" />
      </button>
    </div>
  );
};

// ─── Section Heading ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-bold text-muted-foreground uppercase pt-2 my-2">
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
    <div className="flex-1 flex flex-col items-center justify-center gap-0 relative select-none">
      <div className="relative w-full flex-1 flex items-center justify-center">
        <img
          key={img.id}
          src={img.url}
          alt={`Enhanced ${current + 1}`}
          className="w-full object-contain max-h-[52vh] rounded-xl"
        />
        <button
          onClick={() => handleDelete(img.id)}
          disabled={deletingId === img.id}
          className="absolute top-3 right-3 size-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          title="Delete this image"
        >
          {deletingId === img.id ? (
            <div className="size-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <X className="size-3.5" />
          )}
        </button>
        <a
          href={img.url}
          download={img.name}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-12 size-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
          title="Download"
        >
          <Download className="size-3.5" />
        </a>
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-4 py-3">
          <button
            onClick={prev}
            className="size-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-[10px] font-mono text-white/50">
            {current + 1} / {images.length}
          </span>
          <button
            onClick={next}
            className="size-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="size-4" />
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
        { withCredentials: true },
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
      className="rounded-xl border border-border bg-card p-3 space-y-3 cursor-pointer hover:border-primary/50 transition-colors"
      onClick={() => onSelect(job)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={job.sourceImageUrl}
            alt="source"
            className="size-8 rounded-lg object-cover flex-shrink-0 border border-border"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-foreground truncate">
              Realism {job.realismLevel}% · Smoothing {job.beautySmoothing}%
            </p>
            <p className="text-[10px] text-muted-foreground">
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
          className="flex-shrink-0 size-6 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors disabled:opacity-50"
        >
          {deletingJob ? (
            <div className="size-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="size-3" />
          )}
        </button>
      </div>

      {job.generatedImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-1.5">
          {job.generatedImages.map((img) => (
            <div
              key={img._id}
              className="relative group/img aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(img._id);
                }}
                disabled={deletingImage === img._id}
                className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-600"
              >
                {deletingImage === img._id ? (
                  <div className="size-2 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <X className="size-2.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-muted-foreground text-center py-2">
          All images deleted
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
        },
      );

      const data = res.data;
      if (!data.success) throw new Error(data.message || "Enhancement failed");

      const imgs: GeneratedImage[] = data.data.generatedImages.map(
        (i: any) => ({
          id: i.id,
          url: i.url,
          name: i.name,
        }),
      );

      setGeneratedImages(imgs);
      setCurrentJobId(data.data.jobId);
    } catch (err: any) {
      setGenerateError(
        err?.response?.data?.message || err.message || "Failed to enhance",
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
                (img) => img._id !== imageId,
              ),
            }
          : j,
      ),
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
      })),
    );
    setCurrentJobId(job._id);
    setActiveTab("controls");
    setHistoryOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <LandingPageBanner />
      <LandingNavbar />

      <main className="flex-grow pt-12 md:mb-20">
        {/* Hero */}
        <div className="text-center animate-fadeInUp mb-10 px-2 md:px-4">
          <h1 className="font-bold tracking-tight text-2xl lg:text-5xl">
            Flawless Skin{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Retouch
            </span>
          </h1>
          <p
            className="my-5 text-muted-foreground text-sm md:text-lg animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Achieve professional, true-to-life skin textures in seconds.
          </p>
        </div>

        {/* Main layout */}
        <div className="relative w-full border-y border-black/5 dark:border-white/10">
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className="absolute inset-0 z-0 opacity-90 dark:opacity-50"
          />
          <section className="sm:px-2 lg:px-8 lg:py-10 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 lg:gap-16 max-w-6xl mx-auto px-4 gap-y-6 items-start relative">
            {/* Left: Controls */}
            <div className="flex flex-col gap-4 lg:gap-5">
              <div className="z-1 w-full max-h-fit md:static md:w-auto md:h-full md:max-w-[360px]">
                <div className="rounded-md bg-white/80 dark:bg-[#141415]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 flex flex-col h-full shadow-2xl overflow-hidden">
                  {/* Skin-tone preview orb */}
                  <div
                    className={cn(
                      "relative flex items-center justify-center",
                      "h-[300px]",
                      "bg-black/[0.02] dark:bg-white/[0.03]",
                      "border-b border-black/5 dark:border-white/10",
                    )}
                  >
                    <div className="absolute top-4 z-10 text-center space-y-1 pointer-events-none px-4">
                      <p className="text-[10px] font-bold text-foreground uppercase">
                        Skin Preview
                      </p>
                      <p className="text-[10px] text-foreground">
                        Controls affect AI output, not this preview
                      </p>
                    </div>

                    <div className="relative size-28 md:size-48 flex items-center justify-center mt-8">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Skin preview"
                          className="size-full rounded-2xl object-cover shadow-2xl border border-white/10"
                        />
                      ) : (
                        <label
                          htmlFor="skinUploadFile"
                          className="size-full rounded-2xl shadow-2xl cursor-pointer flex items-center justify-center bg-gradient-to-br from-rose-200/60 via-amber-100/50 to-orange-200/40 dark:from-rose-400/20 dark:via-amber-200/15 dark:to-orange-300/10 border border-black/10 dark:border-white/10 hover:border-blue-400 transition-colors"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Sparkles className="size-5 text-muted-foreground" />
                            <span className="text-[8px] font-bold text-muted-foreground uppercase">
                              Upload
                            </span>
                          </div>
                        </label>
                      )}
                      <div className="absolute inset-0 rounded-full border border-blue-300/20 dark:border-blue-400/10 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) =>
                      setActiveTab(v as "upload" | "controls")
                    }
                    className="w-full mt-1"
                  >
                    <TabsList className="w-fit ml-2">
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                      <TabsTrigger value="controls">Controls</TabsTrigger>
                    </TabsList>

                    {/* Upload Tab */}
                    <TabsContent value="upload" className="w-full">
                      <div className="px-2 py-1 flex items-center justify-center">
                        <label
                          htmlFor="skinUploadFile"
                          className="bg-white dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 font-semibold text-base rounded-xl w-full h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-200 dark:border-white/10 border-dashed hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 mb-3 fill-gray-400 dark:fill-slate-500"
                            viewBox="0 0 32 32"
                          >
                            <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
                            <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
                          </svg>
                          {file ? (
                            <span className="text-sm text-blue-500 font-medium">
                              {file.name}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              Upload photo
                            </span>
                          )}
                          <input
                            type="file"
                            id="skinUploadFile"
                            className="hidden"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleFileChange}
                          />
                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">
                            PNG, JPG and WEBP are Allowed.
                          </p>
                        </label>
                      </div>
                    </TabsContent>

                    {/* Controls Tab */}
                    <TabsContent value="controls">
                      <div className="px-2 py-2 space-y-3 bg-black/[0.02] dark:bg-black/20 max-h-[40vh] overflow-y-auto">
                        {/* Auto Mode Checkbox */}
                        <label className="flex items-center gap-2 py-2 px-3 rounded-lg border cursor-pointer  transition-colors">
                          <input
                            type="checkbox"
                            checked={autoMode}
                            onChange={(e) => {
                              setAutoMode(e.target.checked);
                              setShowAdvanced(true);
                              // if (e.target.checked) setShowAdvanced(true);
                            }}
                            className="size-3 border-slate-300 dark:border-slate-700 accent-blue-600"
                          />
                          {autoMode ? (
                            <span className="text-xs font-normal text-foreground">
                              Auto (Recommended)
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Settings2 className="size-3.5 text-muted-foreground" />
                              <span className="text-xs">Advanced Controls</span>
                            </div>
                          )}
                        </label>

                        {autoMode && (
                          <p className="text-[10px] text-muted-foreground text-start">
                            AI will use balanced realism settings automatically.
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
                          <div className="space-y-3 px-2">
                            {/* Skin Realism */}
                            <SectionLabel>Skin Realism</SectionLabel>
                            <SliderControl
                              label="Skin Texture"
                              value={skinTextureIntensity}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setSkinTextureIntensity}
                            />
                            <SliderControl
                              label="Pore Visibility"
                              value={poreVisibility}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setPoreVisibility}
                            />
                            <SliderControl
                              label="Imperfections"
                              value={imperfectionLevel}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setImperfectionLevel}
                            />
                            <SliderControl
                              label="Oil / Shine"
                              value={oilShineLevel}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setOilShineLevel}
                            />

                            {/* Hair */}
                            <SectionLabel>Hair Details</SectionLabel>
                            <SliderControl
                              label="Facial Hair Density"
                              value={facialHairDensity}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setFacialHairDensity}
                            />
                            <SliderControl
                              label="Body Hair"
                              value={bodyHairVisibility}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setBodyHairVisibility}
                            />
                            <SliderControl
                              label="Hair Strand Realism"
                              value={hairStrandRealism}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setHairStrandRealism}
                            />

                            {/* Enhancement */}
                            <SectionLabel>Enhancement</SectionLabel>
                            <SliderControl
                              label="Beauty Smoothing"
                              value={beautySmoothing}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setBeautySmoothing}
                            />
                            <SliderControl
                              label="Realism Level"
                              value={realismLevel}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setRealismLevel}
                            />
                            <SliderControl
                              label="Age Realism"
                              value={ageRealism}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setAgeRealism}
                            />
                            <SliderControl
                              label="Skin Tone Variation"
                              value={skinToneVariation}
                              min={0}
                              max={100}
                              unit="%"
                              onChange={setSkinToneVariation}
                            />
                          </div>
                        )}

                        {/* Prompt Toggle */}
                        <div className="pt-1">
                          <label className="flex items-center gap-2 py-2 px-3 rounded-lg bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/[0.06] transition-colors">
                            <input
                              type="checkbox"
                              checked={showPrompt}
                              onChange={(e) => setShowPrompt(e.target.checked)}
                              className="size-3 border-slate-300 dark:border-slate-700 accent-blue-600"
                            />
                            <MessageSquare className="size-3 text-muted-foreground" />
                            <span className="text-sm font-normal text-foreground">
                              Add Prompt
                            </span>
                          </label>
                        </div>

                        {/* Prompt Input */}
                        {showPrompt && (
                          <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe additional details... (e.g. blonde hair, light freckles, warm skin tone)"
                            rows={3}
                            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                          />
                        )}
                      </div>

                      {/* Sticky Enhance Button */}
                      <div className="sticky bottom-0 px-2 py-2 border-t border-black/5 dark:border-white/5 bg-white/90 dark:bg-[#141415]/90 backdrop-blur-sm">
                        {generateError && (
                          <p className="text-[10px] text-red-400 text-center mb-2">
                            {generateError}
                          </p>
                        )}
                        <Button
                          className="w-full text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all flex flex-row items-center justify-center gap-2"
                          disabled={!file || isGenerating}
                          onClick={handleEnhance}
                        >
                          <span className="text-sm">
                            {isGenerating ? "Enhancing..." : "Enhance"}
                          </span>
                          {!isGenerating && (
                            <Sparkles className="size-4 text-white" />
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Right: Result Panel */}
            <div className="relative rounded-2xl overflow-hidden flex flex-col items-stretch min-h-[40vh] border border-black/5 dark:border-white/5 bg-black dark:bg-black">
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-8 shrink-0 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">Result</span>
                  {generatedImages.length > 0 && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded-full font-medium">
                      {generatedImages.length} image
                      {generatedImages.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <button
                  onClick={openHistory}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-black/5 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/[0.08] hover:text-black dark:hover:text-white transition-colors"
                  title="View history"
                >
                  <HistoryIcon className="size-3.5" />
                  History
                </button>
              </div>

              {/* Body */}
              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <div className="relative size-16">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500/20 to-pink-500/20" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">Enhancing...</p>
                    <p className="mt-1 text-xs text-white/40">
                      Applying skin retouching with AI
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
                <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img
                      src={previewUrl}
                      alt="Uploaded preview"
                      className="w-full object-contain max-h-[55vh] rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Uploaded Image
                    </p>
                    <p className="text-[10px] text-white/30 italic">
                      Adjust controls and hit Enhance
                    </p>
                  </div>
                </div>
              ) : (
                <div className="group relative isolate h-fit w-full border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <Compare
                    firstImage="https://d2qrb904tbc8rh.cloudfront.net/images/v2-Input.png"
                    secondImage="https://d2qrb904tbc8rh.cloudfront.net/images/v2-Smooth.jpg"
                    firstImageClassName="object-cover object-left-top"
                    secondImageClassname="object-cover object-left-top"
                    className="h-[500px] w-full md:h-[500px] md:w-[500px] lg:mx-auto mt-4 mx-2"
                    slideMode="hover"
                  />
                  <div className="flex flex-col items-center gap-1 py-2">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Upload a photo to get started
                    </p>
                    <p className="text-[10px] text-white/30 italic">
                      AI will enhance skin with hyper-realistic detail
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />

      {/* History Sheet */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
            <SheetTitle className="flex items-center gap-2">
              <HistoryIcon className="size-4" />
              Enhancement History
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
            {historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <HistoryIcon className="size-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No history yet.</p>
                <p className="text-xs text-muted-foreground">
                  Enhance a photo to see results here.
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
  );
};

export default SkinEnhancerPage;
