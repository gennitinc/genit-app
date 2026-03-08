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
  Type,
  ImageIcon,
  Zap,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const LogoAnimationPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [exportFormat, setExportFormat] = useState<"Video" | "GIF">("Video");
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationState, setAnimationState] = useState(0);

  const handleFileUpload = (newFiles: File[]) => {
    const single = newFiles.slice(0, 1);
    setFiles(single);
    if (single.length > 0) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(single[0]);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleGenerate = () => {
    if (!previewUrl) return;
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      // Trigger a simple CSS animation loop for "preview"
      setAnimationState((prev) => prev + 1);
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <LandingPageBanner />
      <LandingNavbar />

      <main className="flex-grow mt-12 md:mb-20 relative">
        <div className="text-center animate-fadeInUp mb-10 relative z-10">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-5xl">
            AI Logo{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Animator
            </span>
          </h1>
          <p
            className="my-5 text-muted-foreground text-sm md:text-lg animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Breathe life into your brand with professional motion graphics.
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
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-2 rounded-full bg-primary/10 mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="size-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Click to upload</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          SVG, PNG, JPG (Max 5MB)
                        </p>
                      </div>
                      <input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files &&
                          handleFileUpload(Array.from(e.target.files))
                        }
                      />
                    </label>
                    {files.length > 0 && (
                      <p className="text-[10px] text-primary font-medium flex items-center gap-1">
                        <ImageIcon className="size-3" /> {files[0].name}
                      </p>
                    )}
                  </div>

                  {/* Prompt Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        2. Animation Prompt
                      </label>
                    </div>
                    <Textarea
                      placeholder="e.g. Smooth liquid transition, glowing edges..."
                      className="resize-none h-24 bg-secondary/50 focus:ring-primary text-sm"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["Cinematic", "Energetic", "Minimal", "Tech"].map(
                        (style) => (
                          <button
                            key={style}
                            onClick={() =>
                              setPrompt(
                                `A ${style.toLowerCase()} animation with professional transitions`,
                              )
                            }
                            className="text-[9px] py-1 px-2.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            {style}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Format Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      3. Export Format
                    </label>
                    <div className="flex gap-2">
                      {["Video", "GIF"].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setExportFormat(fmt as any)}
                          className={cn(
                            "flex-1 py-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-2",
                            exportFormat === fmt
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                              : "bg-transparent border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5",
                          )}
                        >
                          {fmt === "Video" ? (
                            <Play className="size-3" />
                          ) : (
                            <RefreshCw className="size-3" />
                          )}
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-all gap-2 text-base font-semibold mt-2"
                  disabled={!previewUrl || isGenerating}
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

            {/* Right Column: Preview */}
            <div className="relative rounded-2xl overflow-hidden flex flex-col items-stretch min-h-[40vh] border border-black/5 dark:border-white/5 bg-black dark:bg-black">
              <div className="h-16 flex items-center justify-between px-8 shrink-0 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">Result</span>
                  <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[10px] rounded-full font-medium">
                    HD PREVIEW
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="View fullscreen"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-maximize2 lucide-maximize-2"
                      aria-hidden="true"
                    >
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1={21} x2={14} y1={3} y2={10} />
                      <line x1={3} x2={10} y1={21} y2={14} />
                    </svg>
                  </button>
                </div>
              </div>
              {!previewUrl ? (
                /* Empty state: autoplay video demo */
                <div className="group relative isolate max-h-[55vh] w-full border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <img
                    src="https://i.pinimg.com/originals/46/5b/c4/465bc4bc137942ccd0a2a8ecb96387e8.gif"
                    alt="Live preview"
                    className="w-[80%] object-cover h-fit rounded-2xl mx-auto mt-5"
                  />

                  <div className="flex flex-col items-center gap-1 my-2">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Enter your prompt and animate
                    </p>
                    <p className="text-[10px] text-white/30 italic">
                      Your logo will come to life with AI
                    </p>
                  </div>
                </div>
              ) : isGenerating ? (
                /* Generating state */
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <div className="relative size-16">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-cyan-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">
                      Generating...
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      Processing your animation...
                    </p>
                  </div>
                </div>
              ) : (
                /* Preview state: uploaded image */
                <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img
                      src={previewUrl}
                      alt="Live preview"
                      className="w-full object-contain max-h-[55vh] rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Live Preview
                    </p>
                    <p className="text-[10px] text-white/30 italic">
                      Verify your logo before generating
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default LogoAnimationPage;
