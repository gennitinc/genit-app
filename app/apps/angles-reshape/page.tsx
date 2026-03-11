"use client";

import React, { useState, useRef, useCallback } from "react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ImageIcon,
  HistoryIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  Download,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { apiResponse } from "@/utils/apiResponse";

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
}: {
  images: GeneratedAngle[];
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
    <div className="flex-1 flex flex-col items-center justify-center gap-0 relative select-none">
      {/* Main image */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        <img
          key={img.id}
          src={img.url}
          alt={`Generated angle ${current + 1}`}
          className="w-full object-contain max-h-[52vh] rounded-xl"
        />

        {/* Delete button */}
        <button
          onClick={() => handleDelete(img.id)}
          disabled={deletingId === img.id}
          className="absolute top-3 right-3 size-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          title="Delete this angle"
        >
          {deletingId === img.id ? (
            <div className="size-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <X className="size-3.5" />
          )}
        </button>

        {/* Download button */}
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

      {/* Controls */}
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

      {/* Dot strip */}
      {images.length > 1 && (
        <div className="flex gap-1.5 pb-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "rounded-full transition-all",
                i === current
                  ? "size-2 bg-cyan-400"
                  : "size-1.5 bg-white/20 hover:bg-white/40",
              )}
            />
          ))}
        </div>
      )}
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
        { withCredentials: true },
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
              {job.bestAngles
                ? "Auto — 10 Best Angles"
                : `R:${job.rotation}° T:${job.tilt}°`}
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

      {/* Generated images grid */}
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
                  handleDeleteAngle(img._id);
                }}
                disabled={deletingAngle === img._id}
                className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-600"
              >
                {deletingAngle === img._id ? (
                  <div className="size-2 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <X className="size-2.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-muted-foreground italic text-center py-2">
          All images deleted
        </p>
      )}
    </div>
  );
};

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
        },
      );

      const data = res.data;
      if (!data.success) throw new Error(data.message || "Generation failed");

      const imgs: GeneratedAngle[] = data.data.generatedImages.map(
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
        err?.response?.data?.message || err.message || "Failed to generate",
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
                (img) => img._id !== imageId,
              ),
            }
          : j,
      ),
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

      <main className="flex-grow mt-12 md:mb-20 relative">
        <div className="bg-grid-black/[0.1] dark:bg-grid-white/[0.2] absolute inset-0" />
        <div className="text-center animate-fadeInUp mb-10 px-2 md:px-4">
          <h1 className="font-bold tracking-tight text-2xl lg:text-5xl">
            Cinematic Angles{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Position
            </span>
          </h1>
          <p
            className="my-5 text-muted-foreground text-sm md:text-lg animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Precision tools built for creators who demand control.
          </p>
        </div>

        <div className="relative w-full border-y border-black/5 dark:border-white/10">
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className="absolute inset-0 z-0 opacity-90 dark:opacity-50"
          />
          <section className="sm:px-2 lg:px-8 lg:py-10 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 lg:gap-16 max-w-6xl mx-auto px-4 gap-y-6 items-center">
            {/* Left: Controls */}
            <div className="flex flex-col gap-4 lg:gap-5">
              <div className="z-1 w-full max-h-fit md:static md:w-auto md:h-full md:max-w-[360px]">
                <div className="rounded-md bg-white/80 dark:bg-[#141415]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 flex flex-col h-full shadow-2xl overflow-hidden">
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
                        ? "opacity-50 cursor-not-allowed"
                        : isDragging
                          ? "cursor-grabbing"
                          : "cursor-grab",
                    )}
                  >
                    <div className="absolute top-4 z-10 text-center space-y-1 pointer-events-none px-4">
                      <p className="text-[10px] font-bold text-foreground uppercase">
                        Hold and drag to change
                      </p>
                      <p className="text-[10px] text-foreground italic">
                        camera angle
                      </p>
                    </div>

                    <div className="relative size-40 md:size-48 flex items-center justify-center [perspective:1000px]">
                      {/* Subject at Center */}
                      <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d] pointer-events-none">
                        {previewUrl ? (
                          <div
                            className="size-24 md:size-28 bg-white/10 rounded-lg overflow-hidden border border-white/20 shadow-2xl"
                            style={{
                              transform: `rotateY(${-rotation}deg) rotateX(${-tilt}deg)`,
                            }}
                          >
                            <img
                              src={previewUrl}
                              alt="Subject"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="size-20 md:size-24 rounded-full bg-blue-500/20 blur-2xl" />
                        )}
                      </div>

                      {/* Sphere Cage */}
                      <div
                        className="absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-out [transform-style:preserve-3d] pointer-events-none"
                        style={{
                          transform: `rotateY(${rotation}deg) rotateX(${tilt}deg)`,
                        }}
                      >
                        {[0, 30, 60, 90, 120, 150].map((rot) => (
                          <div
                            key={`v-${rot}`}
                            className="absolute inset-0 rounded-full border border-black/30 dark:border-white/30 opacity-40"
                            style={{ transform: `rotateY(${rot}deg)` }}
                          />
                        ))}
                        {[-45, -25, 0, 25, 45].map((rot) => (
                          <div
                            key={`h-${rot}`}
                            className="absolute inset-0 rounded-full border border-black/30 dark:border-white/30 opacity-60"
                            style={{
                              transform: `rotateX(90deg) translateZ(${rot * 1.4}px) scale(${Math.cos((rot * Math.PI) / 180)})`,
                            }}
                          />
                        ))}
                      </div>

                      {/* Orbiting Camera — click to upload when empty */}
                      <label
                        htmlFor="uploadFile1"
                        className={cn(
                          "absolute size-10 md:size-12 bg-white dark:bg-[#1a1a1c] border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-150 ease-out overflow-hidden pointer-events-auto",
                          !previewUrl &&
                            "cursor-pointer hover:border-blue-400 hover:shadow-blue-500/20 hover:shadow-lg",
                          previewUrl && "pointer-events-none",
                        )}
                        style={{
                          transform: `perspective(1000px) rotateY(${rotation - 180}deg) rotateX(${tilt}deg) translateZ(95px) rotateX(${-tilt}deg) rotateY(${-(rotation - 180)}deg)`,
                        }}
                        title={
                          previewUrl ? undefined : "Click to upload an image"
                        }
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Viewfinder"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-0.5">
                            <ImageIcon className="size-3.5 md:size-4 text-blue-500" />
                            <span className="text-[6px] font-bold text-gray-500 uppercase tracking-wide leading-none">
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
                          htmlFor="uploadFile1"
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
                              Upload file
                            </span>
                          )}
                          <input
                            type="file"
                            id="uploadFile1"
                            className="hidden"
                            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                            onChange={handleFileUpload}
                          />
                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">
                            PNG, JPG, SVG, WEBP, and GIF are Allowed.
                          </p>
                        </label>
                      </div>
                    </TabsContent>

                    {/* Controls Tab */}
                    <TabsContent value="controls">
                      <div className="px-2 py-2 space-y-4 bg-black/[0.02] dark:bg-black/20">
                        <div className="space-y-3">
                          {/* Rotation */}
                          {(() => {
                            const pct = (rotation / 360) * 100;
                            return (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 w-[60px] shrink-0 truncate">
                                  Rotation
                                </span>
                                <button
                                  onClick={() =>
                                    setRotation(Math.max(0, rotation - 5))
                                  }
                                  disabled={bestAngles}
                                  className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="size-2.5" />
                                </button>
                                <div
                                  className="relative flex-1 h-[18px] rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden cursor-pointer"
                                  onClick={(e) => {
                                    if (bestAngles) return;
                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    const raw = Math.round(
                                      ((e.clientX - rect.left) / rect.width) *
                                        360,
                                    );
                                    setRotation(
                                      Math.max(0, Math.min(360, raw)),
                                    );
                                  }}
                                >
                                  <div
                                    className="absolute left-0 top-0 h-full rounded-l-md bg-neutral-300 dark:bg-neutral-700 transition-[width] duration-100"
                                    style={{ width: `${pct}%` }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] font-medium tabular-nums text-neutral-700 dark:text-neutral-200">
                                      {rotation}°
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setRotation(Math.min(360, rotation + 5))
                                  }
                                  disabled={bestAngles}
                                  className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="size-2.5" />
                                </button>
                              </div>
                            );
                          })()}
                          {/* Tilt */}
                          {(() => {
                            const pct = ((tilt + 90) / 180) * 100;
                            return (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 w-[60px] shrink-0 truncate">
                                  Tilt
                                </span>
                                <button
                                  onClick={() =>
                                    setTilt(Math.max(-90, tilt - 5))
                                  }
                                  disabled={bestAngles}
                                  className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="size-2.5" />
                                </button>
                                <div
                                  className="relative flex-1 h-[18px] rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden cursor-pointer"
                                  onClick={(e) => {
                                    if (bestAngles) return;
                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    const raw = Math.round(
                                      ((e.clientX - rect.left) / rect.width) *
                                        180 -
                                        90,
                                    );
                                    setTilt(Math.max(-90, Math.min(90, raw)));
                                  }}
                                >
                                  <div
                                    className="absolute left-0 top-0 h-full rounded-l-md bg-neutral-300 dark:bg-neutral-700 transition-[width] duration-100"
                                    style={{ width: `${pct}%` }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] font-medium tabular-nums text-neutral-700 dark:text-neutral-200">
                                      {tilt}°
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setTilt(Math.min(90, tilt + 5))
                                  }
                                  disabled={bestAngles}
                                  className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="size-2.5" />
                                </button>
                              </div>
                            );
                          })()}
                          {/* Zoom */}
                          {(() => {
                            const pct = ((zoom - 1) / 9) * 100;
                            return (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 w-[60px] shrink-0 truncate">
                                  Zoom
                                </span>
                                <button
                                  onClick={() => setZoom(Math.max(1, zoom - 1))}
                                  disabled={bestAngles}
                                  className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="size-2.5" />
                                </button>
                                <div
                                  className="relative flex-1 h-[18px] rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden cursor-pointer"
                                  onClick={(e) => {
                                    if (bestAngles) return;
                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    const raw = Math.round(
                                      ((e.clientX - rect.left) / rect.width) *
                                        9 +
                                        1,
                                    );
                                    setZoom(Math.max(1, Math.min(10, raw)));
                                  }}
                                >
                                  <div
                                    className="absolute left-0 top-0 h-full rounded-l-md bg-neutral-300 dark:bg-neutral-700 transition-[width] duration-100"
                                    style={{ width: `${pct}%` }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] font-medium tabular-nums text-neutral-700 dark:text-neutral-200">
                                      {zoom}x
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setZoom(Math.min(10, zoom + 1))
                                  }
                                  disabled={bestAngles}
                                  className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="size-2.5" />
                                </button>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Auto-generate checkbox */}
                        <label className="flex items-center gap-2 py-2 px-3 rounded-lg bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/[0.06] transition-colors">
                          <input
                            type="checkbox"
                            checked={bestAngles}
                            onChange={(e) => setBestAngles(e.target.checked)}
                            className="size-3 border-slate-300 dark:border-slate-700 accent-blue-600"
                          />
                          <span className="text-sm font-normal text-foreground">
                            Auto-Generate 10 Best Angles
                          </span>
                        </label>

                        {/* Error */}
                        {generateError && (
                          <p className="text-[10px] text-red-400 text-center">
                            {generateError}
                          </p>
                        )}

                        <Button
                          className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all flex flex-row items-center justify-center gap-2"
                          disabled={!file || isGenerating}
                          onClick={handleGenerate}
                        >
                          <span className="text-sm">
                            {isGenerating ? "Generating..." : "Generate"}
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
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[10px] rounded-full font-medium">
                      {generatedImages.length} angles
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
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-cyan-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">
                      {bestAngles
                        ? "Generating 10 best angles..."
                        : "Generating..."}
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      {bestAngles
                        ? "This may take a minute"
                        : "Processing your image"}
                    </p>
                  </div>
                </div>
              ) : generatedImages.length > 0 && currentJobId ? (
                <GeneratedCarousel
                  images={generatedImages}
                  jobId={currentJobId}
                  onDelete={handleDeleteCurrentAngle}
                />
              ) : previewUrl ? (
                /* Live preview (pre-generation) */
                <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img
                      src={previewUrl}
                      alt="Live preview"
                      className="w-full object-contain max-h-[55vh] rounded-2xl"
                      style={{
                        transform: `perspective(1200px) rotateY(${(rotation - 180) * 0.06}deg) rotateX(${tilt * 0.06}deg) scale(${0.88 + zoom * 0.02})`,
                        transition: "transform 0.12s ease-out",
                      }}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Live Preview
                    </p>
                    <p className="text-[10px] text-white/30 italic">
                      Drag the globe or use sliders to adjust angle
                    </p>
                  </div>
                </div>
              ) : (
                /* Empty / demo state */
                <div className="group relative isolate max-h-[55vh] w-full border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <img
                    src="https://i.pinimg.com/736x/1d/e5/29/1de52947cf871b610fb4276053dd137f.jpg"
                    alt="Demo preview"
                    className="w-full object-cover max-h-[55vh] rounded-2xl"
                    style={{
                      transform: `perspective(1200px) rotateY(${(rotation - 180) * 0.06}deg) rotateX(${tilt * 0.06}deg) scale(${0.88 + zoom * 0.02})`,
                      transition: "transform 0.12s ease-out",
                    }}
                  />
                  <div className="flex flex-col items-center gap-1 absolute bottom-4 inset-x-0">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      You have the canvas, No Camera needed
                    </p>
                    <p className="text-[10px] text-white/30 italic">
                      Upload an image and generate
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
              Generation History
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
                  Generate some angles to see them here.
                </p>
              </div>
            ) : (
              history.map((job) => (
                <HistoryCard
                  key={job._id}
                  job={job}
                  onDeleteJob={handleHistoryDeleteJob}
                  onDeleteAngle={handleHistoryDeleteAngle}
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

export default AnglesReshapePage;
