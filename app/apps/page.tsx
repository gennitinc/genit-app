"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { useUserContext } from "@/context/AuthenticatedContext";
import { APP_SECTIONS, type AppCardProps } from "@/lib/apps-config";
import { trackAppOpened, trackEvent } from "@/lib/mixpanelClient";
import { GradientFrame } from "@/utils/gradient-frame";
import { ArrowRight, Grid2X2Plus, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import React, { useMemo, useState } from "react";

// Handled by apps-config.ts

const AppCard = ({
  id,
  href,
  title,
  description,
  type,
  videoSrc,
  posterSrc,
  imageSrc,
  badge,
}: AppCardProps) => {
  const router = useRouter();
  const { user } = useUserContext();

  const handleAction = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    trackAppOpened(id, title, "agents_directory", {
      app_type: type,
      href,
    });
    router.push(href);
  };

  return (
    <div
      onClick={() => handleAction()}
      className='integration-card relative z-10 cursor-pointer rounded-md p-px [background:radial-gradient(circle_230px_at_0%_0%,rgba(0,0,0,0.08),#ffffff)] dark:[background:radial-gradient(circle_230px_at_0%_0%,rgba(113,113,122,0.4),#0c0d0d)]'
    >
      <div
        className='animated-dot absolute z-2 h-[5px] w-[5px] rounded-full bg-zinc-500 dark:bg-zinc-400'
        style={{
          boxShadow: "rgba(113, 113, 122, 0.8) 0px 0px 10px",
          right: "10%",
          top: "10%",
          animation: "6s linear 0s infinite normal none paused moveDot",
        }}
      />
      <div className='group border-border relative z-1 flex h-[340px] flex-col overflow-hidden rounded-md border bg-white p-3 backdrop-blur transition-all duration-300 [background:radial-gradient(circle_280px_at_0%_0%,rgba(0,0,0,0.04),#ffffff)] hover:[background:radial-gradient(circle_280px_at_0%_0%,rgba(0,0,0,0.06),#ffffff)] dark:border-[#202222] dark:bg-white/5 dark:[background:radial-gradient(circle_280px_at_0%_0%,rgba(68,68,68,0.3),#0c0d0d)] dark:hover:bg-white/10'>
        <div className='relative h-[50%] shrink-0 overflow-hidden rounded-md'>
          {badge && (
            <div className='absolute top-2 left-2 z-10 flex flex-wrap gap-2'>
              <span
                className='relative inline-flex skew-x-[-10deg] items-center justify-center overflow-hidden rounded px-1.5 text-sm leading-[18px] font-bold uppercase'
                style={{
                  fontFamily: '"Space Grotesk"',
                  backgroundColor: badge.bgColor,
                  color: badge.textColor,
                }}
              >
                <span>{badge.text}</span>
              </span>
            </div>
          )}
          {videoSrc ? (
            <video
              loop
              playsInline
              disablePictureInPicture
              preload='none'
              poster={posterSrc}
              src={videoSrc}
              autoPlay
              muted
              className='absolute inset-0 h-full w-full object-cover'
              aria-label={description}
            >
              Your browser does not support the video.
            </video>
          ) : (
            <img
              alt={description}
              loading='lazy'
              decoding='async'
              className='absolute inset-0 h-full w-full object-cover'
              src={imageSrc}
            />
          )}
        </div>
        <div className='relative z-10 mt-3 flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-foreground text-sm leading-tight font-semibold tracking-tight sm:text-base'>
              {title}
            </h3>
            <p className='text-muted-foreground line-clamp-2 text-xs sm:text-sm'>
              {description}
            </p>
          </div>
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAction();
            }}
            className='inline-flex items-center justify-center gap-1 rounded-md bg-linear-to-r from-cyan-500 to-blue-500 px-2.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-linear-to-bl focus:ring-4 focus:ring-cyan-300 focus:outline-none dark:focus:ring-cyan-800'
          >
            Try now
            <ArrowRight className='h-3 w-3' />
          </button>
        </div>
      </div>
      <GradientFrame />
    </div>
  );
};

const Apps = () => {
  const [query, setQuery] = useState("");

  React.useEffect(() => {
    trackEvent("agents_directory_viewed", {
      total_sections: APP_SECTIONS.length,
      total_apps: APP_SECTIONS.reduce(
        (acc, section) => acc + section.apps.length,
        0
      ),
    });
  }, []);

  // Filter sections by the search query — matches against app title,
  // description, type and the section title. Sections with zero hits are
  // dropped entirely, matching the integrations explorer behavior.
  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return APP_SECTIONS.map((section) => {
      const apps = q
        ? section.apps.filter(
            (app) =>
              app.title.toLowerCase().includes(q) ||
              (app.description ?? "").toLowerCase().includes(q) ||
              (app.type ?? "").toLowerCase().includes(q) ||
              section.title.toLowerCase().includes(q)
          )
        : section.apps;
      return { ...section, apps };
    }).filter((s) => s.apps.length > 0);
  }, [query]);

  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div className='scroll-container flex flex-1 flex-col overflow-auto will-change-scroll'>
        <TopNavWithAurora />
        <div
          id='main-content'
          className="flex-1 rounded-t-2xl lg:border-2 lg:border-b-0 mx-2 md:mx-4"
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <main id='main' className='w-full flex-1'>
            <div className='mx-auto w-full max-w-6xl space-y-8 px-6 pb-16'>
              <section className='relative z-10'>
                <div className='mr-auto ml-auto max-w-6xl pt-20 pr-4 pb-20 pl-4 sm:px-6 lg:px-8'>
                  <div className='mb-16 text-center'>
                    <div className='border-border bg-card/60 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-medium backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-200'>
                      <Grid2X2Plus className='h-3.5 w-3.5 text-violet-500 dark:text-violet-300' />
                      Apps
                    </div>
                    <h2 className='text-foreground text-3xl font-semibold tracking-tight sm:text-4xl'>
                      genit Productivity Apps
                    </h2>
                    <p className='text-muted-foreground mt-3 text-base'>
                      Pick a starting point. your ai game just got smarter
                    </p>
                  </div>

                  <div className='mx-auto mb-12 max-w-md'>
                    <div className='relative'>
                      <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                      <input
                        type='search'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Search apps...'
                        className='border-border bg-card/60 text-foreground placeholder:text-muted-foreground w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm backdrop-blur transition focus:ring-1 focus:ring-violet-500/40 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/20'
                      />
                    </div>
                  </div>

                  {grouped.length === 0 ? (
                    <div className='py-16 text-center'>
                      <p className='text-muted-foreground text-sm'>
                        No apps match &ldquo;{query}&rdquo;.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-16'>
                      {grouped.map((section) => (
                        <section key={section.title}>
                          {/* <div className='mb-6 flex items-baseline gap-3'>
                            <h3 className='text-foreground text-xl font-semibold tracking-tight'>
                              {section.title}
                            </h3>
                            <span className='text-muted-foreground text-xs'>
                              {section.apps.length}{" "}
                              {section.apps.length === 1 ? "app" : "apps"}
                            </span>
                          </div> */}
                          <div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
                            {section.apps.map((app) => (
                              <AppCard
                                key={app.id}
                                {...(app as AppCardProps)}
                              />
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
            <style
              type='text/css'
              dangerouslySetInnerHTML={{
                __html:
                  "\n          body {\n            background: radial-gradient(23.93% 26.98% at 100% 0%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(34.93% 41.39% at 92.71% 106.14%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(31.57% 33.97% at -2.15% 107.04%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(39.39% 24% at -13.58% 35.4%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 99.97%), linear-gradient(0deg, #0F1113 0%, #0F1113 100%), linear-gradient(0deg, #0F1113 0%, #0F1113 100%), #D9D9D9!important;\n            box-shadow: transparent !important;\n            backdrop-filter: transparent !important;\n            overflow-x: hidden;\n          }\n          \n    body {\n      background: radial-gradient(23.93% 26.98% at 100% 0%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(34.93% 41.39% at 92.71% 106.14%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(31.57% 33.97% at -2.15% 107.04%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(39.39% 24% at -13.58% 35.4%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 99.97%), linear-gradient(0deg, #0F1113 0%, #0F1113 100%), linear-gradient(0deg, #0F1113 0%, #0F1113 100%), #D9D9D9!important;\n      box-shadow: transparent !important;\n      backdrop-filter: transparent !important;\n    }\n      #header {\n      background: none !important;\n      box-shadow: none !important;\n      backdrop-filter: none !important;\n    }\n    html.apps-header-scrolled #header {\n      background: #0F1113 !important;\n      box-shadow: inset 0 1rem 1rem rgba(0,0,0,1) !important;\n      backdrop-filter: blur(4px) !important;\n    }\n    @keyframes moveDot {\n      0%, 100% { top: 10%; right: 10%; }\n      25% { top: 10%; right: calc(100% - 35px); }\n      50% { top: calc(100% - 30px); right: calc(100% - 35px); }\n      75% { top: calc(100% - 30px); right: 10%; }\n    }\n    .integration-card:hover .animated-dot {\n      animation-play-state: running !important;\n    }\n  \n        ",
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Apps;
