"use client";

import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { PremiumInput } from "@/components/ui/premium-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import {
  CheckCircle2,
  CircleFadingArrowUp,
  Download,
  HistoryIcon,
  ImageIcon,
  Play,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

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
    null
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
      prompt || "Smooth motion graphics lifecycle animation"
    );
    formData.append("exportFormat", exportFormat);

    try {
      const res = await apiResponse.post(
        "/apps/logo-animation/animate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
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
    <div className='flex min-h-screen w-full flex-col bg-white dark:bg-black'>
      <LandingPageBanner />
      <LandingNavbar />

      <main className='relative mt-12 flex-grow md:mb-20'>
        <div className='animate-fadeInUp mb-10 px-2 text-center md:px-4'>
          <h1 className='text-2xl font-bold tracking-tight lg:text-5xl'>
            Logo{" "}
            <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
              Animator
            </span>
          </h1>
          <p
            className='text-muted-foreground animate-fadeInUp my-5 text-sm md:text-lg'
            style={{ animationDelay: "0.2s" }}
          >
            Breathe life into your brand with professional lifecycle animations.
          </p>
        </div>

        <div className='relative w-full overflow-hidden border-y border-black/5 dark:border-white/10'>
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className='absolute inset-0 z-0 opacity-90 dark:opacity-50'
          />

          <section className='relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 gap-y-6 px-4 sm:px-2 md:grid-cols-[1fr_1.4fr] lg:gap-16 lg:px-8 lg:py-10'>
            {/* Left Column: Controls */}
            <div className='flex flex-col gap-4 lg:gap-5'>
              <div className='flex flex-col gap-6 overflow-hidden rounded-lg border border-black/5 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-[#141415]/80'>
                <div className='space-y-6'>
                  {/* Upload Section */}
                  <div className='space-y-2'>
                    <label
                      htmlFor='logo-upload'
                      className='group border-muted-foreground/25 hover:border-primary/50 relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all hover:bg-indigo-600 hover:bg-indigo-700/5'
                    >
                      {previewUrl ? (
                        <div className='relative size-full p-2'>
                          <img
                            src={previewUrl}
                            alt='Logo preview'
                            className='size-full rounded-lg object-contain'
                          />
                          <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
                            <Upload className='size-6 text-white' />
                          </div>
                        </div>
                      ) : (
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                          <div className='mb-2 rounded-full bg-indigo-600 p-2 transition-transform group-hover:scale-110 hover:bg-indigo-700/10'>
                            <Upload className='text-primary size-5' />
                          </div>
                          <p className='text-sm font-medium'>Click to upload</p>
                          <p className='text-muted-foreground mt-1 text-[10px]'>
                            SVG, PNG, JPG (Max 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        id='logo-upload'
                        type='file'
                        className='hidden'
                        accept='image/*'
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {/* Prompt Section */}
                  <div className='space-y-2'>
                    <PremiumInput
                      value={prompt}
                      onChange={setPrompt}
                      onSubmit={handleGenerate}
                      isGenerating={isGenerating}
                      placeholder='Describe how your logo should move...'
                      minHeight='50px'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Select
                      value={exportFormat}
                      onValueChange={(val: any) => setExportFormat(val)}
                    >
                      <SelectTrigger className='bg-secondary/50 h-10 w-full border-black/10 dark:border-white/10'>
                        <SelectValue placeholder='Select format' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Video'>
                          <div className='flex items-center gap-2'>
                            <Play className='size-3.5' />
                            <span>Video (MP4)</span>
                          </div>
                        </SelectItem>
                        {/* <SelectItem value="GIF">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="size-3.5" />
                            <span>GIF Animation</span>
                          </div>
                        </SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <p className='animate-pulse text-xs font-medium text-red-500'>
                    {error}
                  </p>
                )}

                <Button
                  className='focus:ring-primary/30 dark:focus:ring-primary/40 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 focus:ring-4 focus:outline-none'
                  disabled={!file || isGenerating}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className='size-5 animate-spin' />
                      Animating...
                    </>
                  ) : (
                    <>
                      <Sparkles className='size-5' />
                      Generate Animation
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column: Preview/Result */}
            <div className='relative flex min-h-[50vh] flex-col items-stretch overflow-hidden rounded-lg border border-black/5 bg-black dark:border-white/5'>
              <div className='z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-[#0A0A0A]/50 px-8 backdrop-blur'>
                <div className='flex items-center gap-3'>
                  <span className='text-base font-bold text-white'>Result</span>
                  {generatedVideoUrl && (
                    <span className='flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400'>
                      <CheckCircle2 className='size-2.5' /> Ready
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white'
                >
                  <HistoryIcon className='size-3.5' />
                  History
                </button>
              </div>

              <div className='relative flex flex-1 items-center justify-center p-6'>
                {!generatedVideoUrl && !isGenerating && !previewUrl && (
                  <div className='flex flex-col items-center gap-4 text-center'>
                    <div className='relative isolate'>
                      <img
                        src='https://i.pinimg.com/originals/46/5b/c4/465bc4bc137942ccd0a2a8ecb96387e8.gif'
                        alt='Demo'
                        className='max-h-[55vh] w-fit rounded-lg object-cover'
                      />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm font-bold tracking-widest text-white/50 uppercase'>
                        Breathe Life Into Your Logo
                      </p>
                      <p className='text-xs text-white/30 italic'>
                        Upload your logo and let AI do the rest
                      </p>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className='flex flex-col items-center gap-6'>
                    <div className='relative size-20'>
                      <div className='absolute inset-0 animate-ping rounded-full border-2 border-cyan-500/30' />
                      <div className='absolute inset-0 animate-spin rounded-full border-2 border-t-cyan-500' />
                    </div>
                    <div className='text-center'>
                      <p className='text-sm font-bold text-white'>
                        Animating Lifecycle
                      </p>
                      <p className='mt-1 text-xs text-white/40 italic'>
                        This usually takes about 30-40 seconds...
                      </p>
                    </div>
                  </div>
                )}

                {!isGenerating && generatedVideoUrl && (
                  <div className='relative aspect-square w-full max-w-lg overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-2xl'>
                    <video
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className='size-full object-contain'
                    />
                    <div className='absolute right-4 bottom-4 flex gap-2'>
                      <a
                        href={generatedVideoUrl}
                        download='logo-animation.mp4'
                        target='_blank'
                        rel='noreferrer'
                        className='rounded-full bg-black/60 p-2 text-white shadow-xl backdrop-blur transition-all hover:bg-blue-600'
                      >
                        <Download className='size-4' />
                      </a>
                    </div>
                  </div>
                )}

                {!isGenerating && !generatedVideoUrl && previewUrl && (
                  <div className='flex flex-col items-center gap-4'>
                    <div className='relative h-64 w-64 overflow-hidden rounded-xl border border-white/10 bg-white/5'>
                      <img
                        src={previewUrl}
                        alt='Preview'
                        className='size-full object-contain p-4'
                      />
                    </div>
                    <p className='text-[10px] font-bold tracking-widest text-white/50 uppercase'>
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
        <SheetContent className='w-full overflow-y-auto sm:max-w-md'>
          <SheetHeader className='mb-6'>
            <SheetTitle className='flex items-center gap-2'>
              <HistoryIcon className='size-5' /> Animation History
            </SheetTitle>
          </SheetHeader>

          <div className='space-y-4'>
            {isLoadingHistory ? (
              <div className='flex justify-center p-12'>
                <RefreshCw className='text-muted-foreground size-6 animate-spin' />
              </div>
            ) : history.length === 0 ? (
              <div className='text-muted-foreground p-12 text-center text-sm'>
                No past animations found.
              </div>
            ) : (
              history.map((job) => (
                <div
                  key={job._id}
                  className='border-border bg-card group hover:border-primary/50 relative cursor-pointer space-y-3 rounded-xl border p-3 transition-colors'
                  onClick={() => handleSelectJob(job)}
                >
                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex min-w-0 items-center gap-3'>
                      <img
                        src={job.sourceImageUrl}
                        className='bg-muted size-10 rounded border object-contain p-1'
                      />
                      <div className='min-w-0'>
                        <p className='truncate pr-8 text-xs font-bold'>
                          {job.prompt}
                        </p>
                        <p className='text-muted-foreground text-[10px]'>
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job._id);
                      }}
                      className='absolute top-3 right-3 rounded-lg bg-red-500/10 p-1.5 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/20'
                    >
                      <Trash2 className='size-3.5' />
                    </button>
                  </div>

                  {job.generatedVideoUrl && (
                    <div className='relative aspect-video overflow-hidden rounded-lg border'>
                      <video
                        src={job.generatedVideoUrl}
                        className='size-full object-cover'
                        controls
                        muted
                      />
                      <div className='absolute top-2 right-2 flex gap-1.5'>
                        <div className='rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white'>
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
