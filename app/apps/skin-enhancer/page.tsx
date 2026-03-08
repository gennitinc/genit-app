"use client";

import React, { useState } from "react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Compare } from "@/components/ui/compare";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridPattern } from "@/components/ui/grid-pattern";

const SliderControl = ({
  label,
  value,
  min,
  max,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (v: number) => void;
}) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center px-1">
      <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
        {label}
      </label>
      <span className="text-xs font-mono text-foreground">
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-black dark:accent-white transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
    />
  </div>
);

// ── Live preview CSS-filter builder ─────────────────────────────────────────
const buildFilter = (
  smoothness: number,
  brightness: number,
  warmth: number,
  blemish: number,
  sharpness: number,
): string => {
  // smoothness  → blur (0-3px)
  const blur = ((100 - smoothness) / 100) * 3;
  // brightness  → brightness (0.7 – 1.3)
  const bright = 0.7 + (brightness / 100) * 0.6;
  // warmth      → sepia tinted (0-0.35)
  const sepia = (warmth / 100) * 0.35;
  // blemish     → contrast (1.0 – 1.25)
  const contrast = 1 + (blemish / 100) * 0.25;
  // sharpness   → contrast boost (already included above, also saturate)
  const saturate = 1 + (sharpness / 100) * 0.5;

  return `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(2)}) sepia(${sepia.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${saturate.toFixed(2)})`;
};

// ── Page component ───────────────────────────────────────────────────────────
const SkinEnhancerPage = () => {
  const [smoothness, setSmoothness] = useState(100);
  const [brightness, setBrightness] = useState(55);
  const [warmth, setWarmth] = useState(30);
  const [blemish, setBlemish] = useState(50);
  const [sharpness, setSharpness] = useState(40);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "controls">("upload");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(e.target.files[0]);
    setPreviewUrl(url);
    setActiveTab("controls");
  };

  const liveFilter = buildFilter(
    smoothness,
    brightness,
    warmth,
    blemish,
    sharpness,
  );

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <LandingPageBanner />
      <LandingNavbar />

      <main className="flex-grow pt-12 md:mb-20">
        {/* ── Hero ── */}
        <div className="text-center animate-fadeInUp mb-10">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-5xl">
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

        {/* ── Main layout ── */}
        <div className="relative w-full border-y border-black/5 dark:border-white/10">
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className="absolute inset-0 z-0 opacity-90 dark:opacity-50"
          />
          <section className="sm:px-2 lg:px-8 lg:py-10 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 lg:gap-16 max-w-6xl mx-auto px-4 gap-y-6 items-center relative">
            {/* ── Left: controls panel ── */}
            <div className="flex flex-col gap-4 lg:gap-5">
              <div className="z-1 w-full max-h-fit md:static md:w-auto md:h-full md:max-w-[360px]">
                <div className="rounded-md bg-white/80 dark:bg-[#141415]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 flex flex-col h-full shadow-2xl overflow-hidden">
                  {/* ── Skin-tone palette preview ── */}
                  <div
                    className={cn(
                      "relative flex items-center justify-center",
                      "h-[240px]",
                      "bg-black/[0.02] dark:bg-white/[0.03]",
                      "border-b border-black/5 dark:border-white/10",
                    )}
                  >
                    <div className="absolute top-4 z-10 text-center space-y-1 pointer-events-none px-4">
                      <p className="text-[10px] font-bold text-foreground uppercase">
                        Retouching preview
                      </p>
                      <p className="text-[10px] text-foreground italic">
                        Adjust sliders to see changes
                      </p>
                    </div>

                    {/* Small face/skin preview orb */}
                    <div className="relative size-36 md:size-40 flex items-center justify-center mt-12">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Skin preview"
                          className="size-full rounded-full object-cover shadow-2xl border border-white/10"
                          style={{
                            filter: liveFilter,
                            transition: "filter 0.15s ease-out",
                          }}
                        />
                      ) : (
                        /* Decorative placeholder gradient orb */
                        <div
                          className="size-full rounded-full shadow-2xl "
                          style={{
                            background: `radial-gradient(circle at 40% 35%,
                            hsl(${20 + warmth}deg 60% ${60 + brightness * 0.15}%) 0%,
                            hsl(${10 + warmth}deg 45% ${45 + brightness * 0.1}%) 55%,
                            hsl(${5 + warmth}deg 30% 30%) 100%)`,
                            filter: liveFilter,
                            transition: "all 0.15s ease-out",
                          }}
                        />
                      )}
                      {/* Shimmer ring */}
                      <div className="absolute inset-0 rounded-full border border-blue-300/20 dark:border-blue-400/10" />
                    </div>
                  </div>

                  {/* ── Tabs ── */}
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

                    {/* Upload tab */}
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
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Upload photo
                          </span>
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

                    {/* Controls tab */}
                    <TabsContent value="controls">
                      <div className="px-2 py-2 space-y-4 bg-black/[0.02] dark:bg-black/20">
                        <div className="space-y-3">
                          <SliderControl
                            label="Smoothness"
                            value={smoothness}
                            min={0}
                            max={100}
                            unit="%"
                            onChange={setSmoothness}
                          />
                          <SliderControl
                            label="Brightness"
                            value={brightness}
                            min={0}
                            max={100}
                            unit="%"
                            onChange={setBrightness}
                          />
                          <SliderControl
                            label="Warmth"
                            value={warmth}
                            min={0}
                            max={100}
                            unit="%"
                            onChange={setWarmth}
                          />
                          <SliderControl
                            label="Blemish Reduction"
                            value={blemish}
                            min={0}
                            max={100}
                            unit="%"
                            onChange={setBlemish}
                          />
                          <SliderControl
                            label="Sharpness"
                            value={sharpness}
                            min={0}
                            max={100}
                            unit="%"
                            onChange={setSharpness}
                          />
                        </div>

                        <Button
                          className="w-full text-white bg-gradient-to-r from-blue-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all flex flex-row items-center justify-center gap-2"
                          disabled={!previewUrl || isGenerating}
                          onClick={() => {
                            if (!previewUrl) return;
                            setIsGenerating(true);
                            setTimeout(() => setIsGenerating(false), 3000);
                          }}
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

            {/* ── Right: live preview / output ── */}
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
                /* Empty state */
                <div className="group relative isolate h-fit w-full border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <Compare
                    firstImage="https://d2qrb904tbc8rh.cloudfront.net/images/v2-Input.png"
                    secondImage="https://d2qrb904tbc8rh.cloudfront.net/images/v2-Smooth.jpg"
                    firstImageClassName="object-cover object-left-top"
                    secondImageClassname="object-cover object-left-top"
                    className="h-[500px] w-full md:h-[500px] md:w-[500px] lg:mx-auto mt-4 mx-2"
                    slideMode="hover"
                    //autoplay={true}
                  />
                  <div className="flex flex-col items-center gap-1 py-2">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Upload a photo to get started
                    </p>
                    <p className="text-[10px] text-white/30 italic">
                      Adjust sliders to preview the retouching live
                    </p>
                  </div>
                </div>
              ) : isGenerating ? (
                /* Generating state */
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <div className="relative size-16">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500/20 to-pink-500/20" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">Enhancing...</p>
                    <p className="mt-1 text-xs text-white/40">
                      Applying skin retouching
                    </p>
                  </div>
                </div>
              ) : (
                /* Preview state */
                <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 border-2 border-gray-200 dark:border-white/10 border-dashed">
                  <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img
                      src={previewUrl}
                      alt="Live skin preview"
                      className="w-full object-contain max-h-[55vh] rounded-2xl"
                      style={{
                        filter: liveFilter,
                        transition: "filter 0.15s ease-out",
                      }}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Live Preview
                    </p>
                    <p className="text-[10px] text-white/30 italic">
                      Use sliders to fine-tune your retouching
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

export default SkinEnhancerPage;
