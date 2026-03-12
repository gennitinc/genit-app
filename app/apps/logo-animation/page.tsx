"use client";

import React, { useState, useEffect } from "react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Upload,
  Play,
  ImageIcon,
  RefreshCw,
  HistoryIcon,
  Trash2,
  X,
  Download,
  CheckCircle2,
} from "lucide-react";
import { PremiumInput } from "@/components/ui/premium-input";


import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiResponse } from "@/utils/apiResponse";

interface LogoAnimationJob {
  _id: string;
  sourceImageUrl: string;
  prompt: string;
  style?: string;
  exportFormat: string;
  generatedVideoUrl?: string;
  status: string;
  createdAt: string;
}

const LogoAnimationPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [exportFormat, setExportFormat] = useState<"Video" | "GIF">("Video");
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null,
  );
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [history, setHistory] = useState<LogoAnimationJob[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHistoryOpen) {
      fetchHistory();
    }
  }, [isHistoryOpen]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await apiResponse.get("/apps/logo-animation/history", {
        withCredentials: true,
      });
      if (res.data.success) {
        setHistory(res.data.data.jobs);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const freshFiles = e.target.files;
    if (!freshFiles || freshFiles.length === 0) return;

    const single = freshFiles[0];
    setFile(single);
    setError(null);
    setGeneratedVideoUrl(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(single);
    setPreviewUrl(url);
  };

  const handleGenerate = async () => {
    if (!file) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "prompt",
      prompt || "Smooth motion graphics lifecycle animation",
    );
    formData.append("exportFormat", exportFormat);

    try {
      const res = await apiResponse.post(
        "/apps/logo-animation/animate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setGeneratedVideoUrl(res.data.data.generatedVideoUrl);
      } else {
        setError(res.data.message || "Animation failed");
      }
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to animate logo");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await apiResponse.delete(`/apps/logo-animation/job/${id}`, {
        withCredentials: true,
      });
      setHistory((prev) => prev.filter((j) => j._id !== id));
      if (currentJobId === id) {
        setCurrentJobId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectJob = (job: LogoAnimationJob) => {
    setPreviewUrl(job.sourceImageUrl);
    setPrompt(job.prompt);
    setExportFormat(job.exportFormat as "Video" | "GIF");
    setGeneratedVideoUrl(job.generatedVideoUrl || null);
    setCurrentJobId(job._id);
    setIsHistoryOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <LandingPageBanner />
      <LandingNavbar />

      <main className="flex-grow mt-12 md:mb-20 relative">
        <div className="text-center animate-fadeInUp mb-10 px-2 md:px-4">
          <h1 className="font-bold tracking-tight text-2xl lg:text-5xl">
            Logo{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Animator
            </span>
          </h1>
          <p
            className="my-5 text-muted-foreground text-sm md:text-lg animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Breathe life into your brand with professional lifecycle animations.
          </p>
        </div>

        <div className="relative w-full border-y border-black/5 dark:border-white/10 overflow-hidden">
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className="absolute inset-0 z-0 opacity-90 dark:opacity-50"
          />

          <section className="sm:px-2 lg:px-8 lg:py-10 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 lg:gap-16 max-w-6xl mx-auto px-4 gap-y-6 items-center relative z-10">
            {/* Left Column: Controls */}
            <div className="flex flex-col gap-4 lg:gap-5">
              <div className="rounded-2xl bg-white/80 dark:bg-[#141415]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 flex flex-col shadow-2xl overflow-hidden p-6 gap-6">
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      1. Upload Logo
                    </label>
                    <label
                      htmlFor="logo-upload"
                      className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                    >
                      {previewUrl ? (
                        <div className="relative size-full p-2">
                          <img
                            src={previewUrl}
                            alt="Logo preview"
                            className="size-full object-contain rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <Upload className="size-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="p-2 rounded-full bg-primary/10 mb-2 group-hover:scale-110 transition-transform">
                            <Upload className="size-5 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            SVG, PNG, JPG (Max 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {/* Prompt Section */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      2. Animation Prompt
                    </label>
                    <PremiumInput
                      value={prompt}
                      onChange={setPrompt}
                      onSubmit={handleGenerate}
                      isGenerating={isGenerating}
                      placeholder="Describe how your logo should move..."
                      minHeight="100px"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["Morph", "Glow", "Lifecycle", "Clean Build"].map(
                        (style) => (
                          <button
                            key={style}
                            onClick={() => setPrompt(style)}
                            className="text-[9px] py-1 px-2.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            {style}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      3. Export Format
                    </label>
                    <Select
                      value={exportFormat}
                      onValueChange={(val: any) => setExportFormat(val)}
                    >
                      <SelectTrigger className="w-full bg-secondary/50 border-black/10 dark:border-white/10 h-10">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Video">
                          <div className="flex items-center gap-2">
                            <Play className="size-3.5" />
                            <span>Video (MP4)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="GIF">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="size-3.5" />
                            <span>GIF Animation</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 font-medium animate-pulse">
                    {error}
                  </p>
                )}

                <Button
                  className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all flex flex-row items-center justify-center gap-2"
                  disabled={!file || isGenerating}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="size-5 animate-spin" />
                      Animating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-5" />
                      Generate Animation
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column: Preview/Result */}
            <div className="relative rounded-2xl overflow-hidden flex flex-col items-stretch min-h-[50vh] border border-black/5 dark:border-white/5 bg-black">
              <div className="h-16 flex items-center justify-between px-8 shrink-0 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur z-20">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">Result</span>
                  {generatedVideoUrl && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="size-2.5" /> Ready
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  <HistoryIcon className="size-3.5" />
                  History
                </button>
              </div>

              <div className="flex-1 relative flex items-center justify-center p-6">
                {!generatedVideoUrl && !isGenerating && !previewUrl && (
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="relative isolate">
                      <img
                        src="https://i.pinimg.com/originals/46/5b/c4/465bc4bc137942ccd0a2a8ecb96387e8.gif"
                        alt="Demo"
                        className="w-fit object-cover max-h-[55vh] rounded-2xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white/50 uppercase tracking-widest">
                        Breathe Life Into Your Logo
                      </p>
                      <p className="text-xs text-white/30 italic">
                        Upload your logo and let AI do the rest
                      </p>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative size-20">
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                      <div className="absolute inset-0 rounded-full border-2 border-t-cyan-500 animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">
                        Animating Lifecycle
                      </p>
                      <p className="mt-1 text-xs text-white/40 italic">
                        This usually takes about 30-40 seconds...
                      </p>
                    </div>
                  </div>
                )}

                {!isGenerating && generatedVideoUrl && (
                  <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                    <video
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="size-full object-contain"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <a
                        href={generatedVideoUrl}
                        download="logo-animation.mp4"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-black/60 backdrop-blur hover:bg-blue-600 text-white transition-all shadow-xl"
                      >
                        <Download className="size-4" />
                      </a>
                    </div>
                  </div>
                )}

                {!isGenerating && !generatedVideoUrl && previewUrl && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-64 h-64 rounded-xl border border-white/10 overflow-hidden bg-white/5">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="size-full object-contain p-4"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Source Preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* History Sheet */}
      <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <HistoryIcon className="size-5" /> Animation History
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {isLoadingHistory ? (
              <div className="flex justify-center p-12">
                <RefreshCw className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground text-sm">
                No past animations found.
              </div>
            ) : (
              history.map((job) => (
                <div
                  key={job._id}
                  className="rounded-xl border border-border bg-card p-3 space-y-3 relative group cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleSelectJob(job)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={job.sourceImageUrl}
                        className="size-10 rounded object-contain bg-muted p-1 border"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate pr-8">
                          {job.prompt}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job._id);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  {job.generatedVideoUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <video
                        src={job.generatedVideoUrl}
                        className="size-full object-cover"
                        controls
                        muted
                      />
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <div className="text-[10px] font-medium px-2 py-1 bg-black/60 text-white rounded-md">
                          {job.exportFormat}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <LandingFooter />
    </div>
  );
};

export default LogoAnimationPage;
