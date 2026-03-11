"use client";

import React from "react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import {
  Sparkles,
  Terminal,
  Move,
  RotateCw,
  MousePointer2,
  Box,
  Image,
  Layers,
  Plus,
  ArrowRight,
} from "lucide-react";

const ThreeDDesignPage = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col text-foreground">
      <LandingPageBanner />
      <LandingNavbar />

      <main className="flex-grow pt-5 md:pt-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 z-10 w-full max-w-[90rem] mr-auto ml-auto relative items-center m-8 mb-24">
            <div className="lg:col-span-6 flex flex-col gap-x-8 gap-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 w-fit animate-on-scroll visible">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-[10px] uppercase text-orange-200 tracking-widest font-mono">
                  Flux 2.0 is live
                </span>
              </div>

              <h1
                className="md:text-7xl lg:text-8xl leading-[0.95] animate-on-scroll text-5xl font-medium text-foreground tracking-tighter font-display visible"
                style={{ animationDelay: "100ms" }}
              >
                Design in
                <span className="bg-clip-text text-transparent bg-gradient-to-l from-[#fd953f] to-orange-600 pr-2 pl-2">
                  3D
                </span>
                .
                <br />
                Ship to web.
              </h1>

              <p
                className="text-lg text-muted-foreground font-light max-w-md leading-relaxed animate-on-scroll visible"
                style={{ animationDelay: "200ms" }}
              >
                A collaborative design tool for the browser. Create organic
                shapes, interactive scenes, and export production-ready React
                components in seconds.
              </p>

              <div
                className="flex flex-wrap animate-on-scroll gap-x-4 gap-y-4 items-center visible"
                style={{ animationDelay: "300ms" }}
              >
                <button className="group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)] focus:outline-none text-sm font-medium text-white tracking-widest font-geist rounded-full pt-5 pr-12 pb-5 pl-12 relative items-center justify-center">
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                    @keyframes beam-spin { to { transform: rotate(360deg); } }
                    @keyframes dots-move {
                        0% { background-position: 0 0; }
                        100% { background-position: 24px 24px; }
                    }
                  `,
                    }}
                  />

                  {/* Full Border Beam (Single Beam) */}
                  <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                    <div
                      className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#ea580c_360deg)]"
                      style={{ animation: "beam-spin 3s linear infinite" }}
                    ></div>
                    <div className="absolute inset-[1px] rounded-full bg-background"></div>
                  </div>

                  {/* Inner Background & Effects */}
                  <div className="-z-10 overflow-hidden bg-zinc-950 rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/60 to-transparent"></div>
                    <div
                      className="opacity-30 mix-blend-overlay absolute top-0 right-0 bottom-0 left-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                        backgroundSize: "12px 12px",
                        animation: "dots-move 8s linear infinite",
                      }}
                    ></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-orange-500/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-orange-500/30"></div>
                  </div>

                  <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
                    Start Building
                  </span>
                  <ArrowRight className="size-4 relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <div
                  className="flex bg-muted/50 rounded-full pt-3 pr-4 pb-3 pl-4 backdrop-blur-xl gap-x-4 gap-y-4 items-center"
                  style={{ position: "relative" }}
                >
                  <div className="flex -space-x-2">
                    <div className="bg-neutral-700 size-6 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/90ec73f0-6fd3-4d0c-922c-fcc592c983df_320w.webp)] bg-cover bg-center border-[#050505] border rounded-full"></div>
                    <div className="bg-neutral-600 size-6 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/3e3e1091-f8e8-4022-a02a-fa37a35c59a5_320w.jpg)] bg-cover bg-center border-[#050505] border rounded-full"></div>
                    <div
                      className="bg-neutral-500 size-6 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c4ee565a-2084-483b-8358-9fc06da5ee99_320w.jpg)] bg-cover bg-center border-[#050505] border rounded-full"
                      style={{ transition: "outline 0.1s ease-in-out" }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Used by 10k+ designers
                  </span>
                </div>
              </div>

              <div
                className="mt-8 font-mono text-xs text-muted-foreground flex items-center gap-2 animate-on-scroll visible"
                style={{ animationDelay: "400ms" }}
              >
                <Terminal className="size-3" />
                <span>npm install @flux/react-three-fiber</span>
              </div>
            </div>

            <div
              className="lg:col-span-6 animate-on-scroll h-[420px] md:h-[520px] lg:h-[620px] relative perspective-[1000px] visible"
              style={{ animationDelay: "500ms" }}
            >
              <div className="glass-panel overflow-hidden flex flex-col transform transition-transform hover:rotate-0 duration-700 ease-out rounded-xl absolute inset-0 rotate-x-[5deg] rotate-y-[-5deg] border border-border bg-card/50 backdrop-blur-lg">
                <div className="flex bg-muted/50 h-10 border-border border-b pr-4 pl-4 backdrop-blur-md gap-x-2 gap-y-2 items-center">
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-red-500/20"></div>
                    <div className="size-2.5 rounded-full bg-yellow-500/20"></div>
                    <div className="size-2.5 rounded-full bg-green-500/20"></div>
                  </div>
                  <div className="mx-auto font-mono text-[10px] text-muted-foreground">
                    scene.flux — Edited
                  </div>
                </div>
                <div className="flex-1 overflow-hidden dark:bg-neutral-950 bg-white relative perspective-midrange">
                  <iframe
                    src="https://my.spline.design/genkubgreetingrobot-ojzcjWInavuKpZSt2luvgvjl/"
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 size-full border-none"
                  ></iframe>
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                      backgroundSize: "50px 50px",
                      transform:
                        "perspective(500px) rotateX(60deg) translateY(100px) scale(2)",
                      opacity: 0.5,
                    }}
                  ></div>
                  <div
                    className="transform-style-preserve-3d animate-[spin-slow_10s_linear_infinite] size-32 absolute top-3/4 left-1/2"
                    style={{ marginLeft: "-4rem", marginTop: "-4rem" }}
                  >
                    <div
                      className="backdrop-blur-[2px] bg-purple-500/10 border-purple-500/40 border absolute inset-0"
                      style={{ transform: "translateZ(4rem)" }}
                    ></div>
                    <div
                      className="absolute inset-0 border border-purple-500/40 bg-purple-500/10 backdrop-blur-[2px]"
                      style={{ transform: "rotateY(180deg) translateZ(4rem)" }}
                    ></div>
                    <div
                      className="absolute inset-0 border border-purple-500/40 bg-purple-500/10 backdrop-blur-[2px]"
                      style={{ transform: "rotateY(90deg) translateZ(4rem)" }}
                    ></div>
                    <div
                      className="absolute inset-0 border border-purple-500/40 bg-purple-500/10 backdrop-blur-[2px]"
                      style={{ transform: "rotateY(-90deg) translateZ(4rem)" }}
                    ></div>
                    <div
                      className="absolute inset-0 border border-purple-500/40 bg-purple-500/10 backdrop-blur-[2px]"
                      style={{ transform: "rotateX(90deg) translateZ(4rem)" }}
                    ></div>
                    <div
                      className="absolute inset-0 border border-purple-500/40 bg-purple-500/10 backdrop-blur-[2px]"
                      style={{ transform: "rotateX(-90deg) translateZ(4rem)" }}
                    ></div>
                    <div className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 bg-blue-500/20 rounded-full blur-md animate-pulse transform-style-preserve-3d"></div>
                  </div>
                  <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 size-0 absolute top-3/4 left-1/2">
                    <div className="absolute bottom-0 left-0 w-px h-20 bg-green-500 origin-bottom"></div>
                    <div className="absolute bottom-0 left-0 h-px w-20 bg-red-500 origin-left"></div>
                    <div className="absolute bottom-0 left-0 w-px h-16 bg-blue-500 origin-bottom transform rotate-45 translate-y-2 -translate-x-2"></div>
                  </div>
                  <div className="-translate-x-1/2 flex gap-1 z-30 bg-background/90 border border-border rounded-full p-1.5 absolute bottom-6 left-1/2 shadow-2xl backdrop-blur-md items-center">
                    <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 text-[10px] font-medium text-foreground hover:bg-muted transition-all border border-border">
                      <RotateCw className="size-3" />
                      Rotate
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-transparent">
                      <Move className="size-3" />
                      Move
                    </button>
                  </div>
                </div>
              </div>

              {/* Tools Panel */}
              <div className="-left-6 flex flex-col glass-panel transform translate-z-10 animate-float bg-muted/40 w-12 rounded-lg p-2 absolute top-12 gap-y-2 border border-border">
                <button className="p-1.5 hover:bg-muted rounded text-purple-400">
                  <MousePointer2 className="size-4" />
                </button>
                <button className="p-1.5 hover:bg-muted rounded text-foreground">
                  <Box className="size-4" />
                </button>
                <div className="h-px w-full bg-border my-1"></div>
                <button className="p-1.5 hover:bg-muted rounded text-foreground">
                  <Image className="size-4" />
                </button>
              </div>

              {/* Material Panel */}
              <div
                className="-right-4 glass-panel transform translate-z-20 animate-float -bottom-4 w-48 rounded-lg p-4 absolute border border-border bg-card/50 backdrop-blur-lg"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Material
                  </span>
                  <Layers className="size-3 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Roughness</span>
                      <span>0.4</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[40%] bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Metalness</span>
                      <span>0.8</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="bg-orange-500 w-[80%] h-full rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="size-6 rounded bg-purple-500/50 border border-border"></div>
                    <div className="bg-orange-500/50 size-6 border-border border rounded"></div>
                    <div className="size-6 rounded bg-muted border border-border flex items-center justify-center">
                      <Plus className="size-3 text-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default ThreeDDesignPage;
