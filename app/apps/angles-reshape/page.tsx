"use client";

import React, { useState, useRef } from "react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Camera,
  ArrowRight,
  ArrowDown,
  Mail,
  ArrowUpRight,
  Instagram,
  Dribbble,
  Facebook,
  ChevronUp,
  ChevronDown,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridPattern } from "@/components/ui/grid-pattern";

const Thumbnail = ({
  file,
  isActive,
  onClick,
  onRemove,
}: {
  file: File;
  isActive: boolean;
  onClick: () => void;
  onRemove: (e: React.MouseEvent) => void;
}) => {
  const [url, setUrl] = useState<string>("");
  React.useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return (
    <div
      className={cn(
        "relative aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all group/thumb",
        isActive
          ? "border-blue-500 scale-105 shadow-xl z-10"
          : "border-transparent opacity-60 hover:opacity-100",
      )}
      onClick={onClick}
    >
      {url && (
        <img
          src={url}
          alt="Thumbnail"
          className="w-full h-full object-contain"
        />
      )}
      <div
        className="absolute top-1 right-1 size-5 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-red-500"
        onClick={onRemove}
      >
        <span className="text-white text-[10px]">✕</span>
      </div>
    </div>
  );
};

const AnglesReshapePage = () => {
  const [rotation, setRotation] = useState(180);
  const [tilt, setTilt] = useState(-31);
  const [zoom, setZoom] = useState(5);
  const [bestAngles, setBestAngles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startValues = useRef({ rotation: 0, tilt: 0 });

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "controls">("upload");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (newFiles: File[]) => {
    const single = newFiles.slice(0, 1);
    setFiles(single);
    if (single.length > 0) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(single[0]);
      setPreviewUrl(url);
      setActiveTab("controls");
    } else {
      setPreviewUrl(null);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    startValues.current = { rotation, tilt };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    // Map pixel delta to degrees (sensitivity factor: 0.5)
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

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <LandingPageBanner />
      <LandingNavbar />

      <main className="flex-grow mt-12 md:mb-20 relative">
        <div className="bg-grid-black/[0.1] dark:bg-grid-white/[0.2] absolute inset-0" />
        <div className="text-center animate-fadeInUp mb-10">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-5xl">
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
            <div className="flex flex-col gap-4 lg:gap-5">
              <div className="z-1 w-full max-h-fit md:static md:w-auto md:h-full md:max-w-[360px]">
                <div className="rounded-md bg-white/80 dark:bg-[#141415]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 flex flex-col h-full shadow-2xl overflow-hidden">
                  {/* Visualizer Section */}
                  <div
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    className={cn(
                      "relative flex items-center justify-center",
                      "h-[300px]", // Controlled height (smaller)
                      "bg-black/[0.02] dark:bg-white/[0.03]",
                      "border-b border-black/5 dark:border-white/10",
                      "group transition-all duration-200",
                      isDragging ? "cursor-grabbing" : "cursor-grab",
                    )}
                  >
                    {/* Instruction Text */}
                    <div className="absolute top-4 z-10 text-center space-y-1 pointer-events-none px-4">
                      <p className="text-[10px] font-bold text-foreground uppercase">
                        Hold and drag to change
                      </p>
                      <p className="text-[10px] text-foreground italic">
                        camera angle
                      </p>
                    </div>

                    {/* 3D Visualizer Container */}
                    <div className="relative size-40 md:size-48 flex items-center justify-center pointer-events-none [perspective:1000px]">
                      {/* Subject at Center (The Image) */}
                      <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
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
                        className="absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-out [transform-style:preserve-3d]"
                        style={{
                          transform: `rotateY(${rotation}deg) rotateX(${tilt}deg)`,
                        }}
                      >
                        {/* Longitudinal Ribs */}
                        {[0, 30, 60, 90, 120, 150].map((rot) => (
                          <div
                            key={`v-${rot}`}
                            className="absolute inset-0 rounded-full border border-black/30 dark:border-white/30 opacity-40"
                            style={{ transform: `rotateY(${rot}deg)` }}
                          />
                        ))}

                        {/* Latitudinal Belts */}
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

                      {/* Camera Direction Laser & Tip Target */}
                      <div
                        className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-150 ease-out"
                        style={{
                          transform: `rotateY(${rotation}deg) rotateX(${tilt}deg)`,
                        }}
                      >
                        {/* <div className="absolute top-1/2 left-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-black/40 dark:via-white/40 to-black/70 dark:to-white/70 origin-left shadow-sm">
                        {previewUrl && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 rounded-full border border-blue-500 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                            <div className="size-1 bg-blue-500 rounded-full animate-pulse" />
                          </div>
                        )}
                      </div> */}
                      </div>

                      {/* Orbiting Camera Object */}
                      <div
                        className="absolute size-10 md:size-12 bg-white dark:bg-[#1a1a1c] border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-150 ease-out overflow-hidden"
                        style={{
                          transform: `
          perspective(1000px)
          rotateY(${rotation - 180}deg) 
          rotateX(${tilt}deg) 
          translateZ(95px) 
          rotateX(${-tilt}deg) 
          rotateY(${-(rotation - 180)}deg)
        `,
                        }}
                      >
                        {previewUrl ? (
                          <div className="relative w-full h-full">
                            <img
                              src={previewUrl}
                              alt="Viewfinder"
                              className="w-full h-full object-contain opacity-50"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="size-4 md:size-5 text-black dark:text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <ImageIcon className="size-4 md:size-5 text-black dark:text-white" />
                            {/* <div className="absolute -top-1 -right-1 size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" /> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tab Bar */}
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      setActiveTab(value as "upload" | "controls")
                    }
                    className="w-full mt-1"
                  >
                    <TabsList className="w-fit ml-2">
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                      <TabsTrigger value="controls">Controls</TabsTrigger>
                    </TabsList>

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
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Upload file
                          </span>
                          <input
                            type="file"
                            id="uploadFile1"
                            className="hidden"
                            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                            onChange={(e) => {
                              if (e.target.files) {
                                handleFileUpload(Array.from(e.target.files));
                              }
                            }}
                          />
                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">
                            PNG, JPG, SVG, WEBP, and GIF are Allowed.
                          </p>
                        </label>
                      </div>
                    </TabsContent>
                    <TabsContent value="controls">
                      <div className="px-2 py-2 space-y-4 bg-black/[0.02] dark:bg-black/20">
                        <div className="space-y-3">
                          {/* Rotation Control */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                                Rotation
                              </label>
                              <span className="text-xs font-mono text-foreground">
                                {rotation}°
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={rotation}
                              onChange={(e) =>
                                setRotation(Number(e.target.value))
                              }
                              className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-black dark:accent-white transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            />
                          </div>

                          {/* Tilt Control */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                                Tilt
                              </label>
                              <span className="text-xs font-mono text-foreground">
                                {tilt}°
                              </span>
                            </div>
                            <input
                              type="range"
                              min="-90"
                              max="90"
                              value={tilt}
                              onChange={(e) => setTilt(Number(e.target.value))}
                              className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-black dark:accent-white transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            />
                          </div>

                          {/* Zoom Control */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                                Zoom
                              </label>
                              <span className="text-xs font-mono text-foreground">
                                {zoom}
                              </span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={zoom}
                              onChange={(e) => setZoom(Number(e.target.value))}
                              className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-black dark:accent-white transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            />
                          </div>
                        </div>

                        {/* Best Angles Toggle */}
                        {/* <div
                      className="flex items-center gap-2 py-2 px-3 rounded-lg bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/[0.06] transition-colors"
                      onClick={() => setBestAngles(!bestAngles)}
                    >
                      <Checkbox
                        checked={bestAngles}
                        onCheckedChange={(checked) => setBestAngles(!!checked)}
                        className="size-3 border-slate-300 dark:border-slate-700 data-[state=checked]:bg-black dark:data-[state=checked]:bg-white data-[state=checked]:text-white dark:data-[state=checked]:text-black"
                      />
                      <span className="text-sm font-normal text-foreground">
                        Generate multiple best angles
                      </span>
                    </div> */}

                        <Button
                          className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all flex flex-row items-center justify-center gap-2"
                          disabled={!previewUrl || isGenerating}
                          onClick={() => {
                            if (!previewUrl) return;
                            setIsGenerating(true);
                            setTimeout(() => setIsGenerating(false), 3000);
                          }}
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

            {/* Right: Live Preview / Output */}
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
                    src="https://i.pinimg.com/736x/1d/e5/29/1de52947cf871b610fb4276053dd137f.jpg"
                    alt="Live preview"
                    className="w-full object-cover max-h-[55vh] rounded-2xl"
                    style={{
                      transform: `perspective(1200px) rotateY(${(rotation - 180) * 0.06}deg) rotateX(${tilt * 0.06}deg) scale(${0.88 + zoom * 0.02})`,
                      transition: "transform 0.12s ease-out",
                    }}
                  />

                  <div className="flex flex-col items-center gap-1">
                    
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      You have the canvas, No Camera needed
                    </p>
                    <p className="text-[10px] text-white/30 italic">
                      Choose your favorite angle and generate
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
                      Processing your image angles
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
              )}
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AnglesReshapePage;
