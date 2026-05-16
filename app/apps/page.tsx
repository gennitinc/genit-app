"use client";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/context/AuthenticatedContext";
import { APP_SECTIONS, type AppCardProps } from "@/lib/apps-config";
import {
  trackAppOpened,
  trackEvent,
  trackFeatureUsed,
} from "@/lib/mixpanelClient";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import React, { useState } from "react";

const TryNowButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    type='button'
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }
    }}
    className='group relative inline-flex w-full items-center justify-center overflow-hidden rounded-md bg-gray-800 px-4 py-2.5 tracking-tighter text-white'
  >
    <span className='absolute h-0 w-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-full'></span>
    <span className='absolute bottom-0 left-0 -ml-2 h-full'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='object-stretch h-full w-auto opacity-100'
        viewBox='0 0 487 487'
      >
        <path
          fillOpacity='.1'
          fillRule='nonzero'
          fill='#FFF'
          d='M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z'
        ></path>
      </svg>
    </span>
    <span className='absolute top-0 right-0 -mr-3 h-full w-12'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-full w-full object-cover'
        viewBox='0 0 487 487'
      >
        <path
          fillOpacity='.1'
          fillRule='nonzero'
          fill='#FFF'
          d='M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z'
        ></path>
      </svg>
    </span>
    <span className='absolute inset-0 -mt-1 h-full w-full rounded-lg bg-gradient-to-b from-transparent via-transparent to-gray-200 opacity-30'></span>
    <span className='relative text-base font-semibold'>Try now</span>
  </button>
);

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
    <div className='h-full w-full'>
      <div className='h-full'>
        <div
          onClick={() => handleAction()}
          className='react-aria-Link h-full cursor-pointer'
          style={{ touchAction: "pan-x pan-y pinch-zoom" }}
        >
          <div className='group !bg-page-primary border-separator-card hover:border-separator-card hover:!bg-surface-primary flex h-full w-full !min-w-0 flex-1 cursor-pointer flex-col overflow-hidden rounded-2xl border border-transparent shadow-[inset_2px_2px_2px_rgba(255,255,255,0.02)] transition-all duration-200'>
            <div
              className='relative overflow-hidden rounded-xl rounded-t-xl'
              style={{ aspectRatio: "1.03333 / 1" }}
            >
              {badge && (
                <div className='absolute top-2 left-2 z-10 flex flex-wrap gap-2'>
                  <span
                    className='relative inline-flex skew-x-[-10deg] items-center justify-center overflow-hidden rounded px-1.5 text-sm leading-[18px] font-bold text-white uppercase'
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
              <figure
                className='group relative h-full rounded-2xl'
                style={{ aspectRatio: "1.03333 / 1" }}
              >
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
                    className='absolute inset-0 size-full h-full w-full object-cover'
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
              </figure>
            </div>
            <div className='flex min-w-0 flex-1 flex-col justify-between gap-4 py-3'>
              <div className='flex flex-col gap-1'>
                <h3 className='text-font-primary text-sm leading-tight font-semibold tracking-tight sm:text-base'>
                  {title}
                </h3>
                <p className='line-clamp-2 text-xs text-neutral-600 sm:text-sm dark:text-neutral-400'>
                  {description}
                </p>
              </div>
              <TryNowButton onClick={() => handleAction()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const categories = [
  { name: "All", href: "/apps" },
  { name: "Mockups", href: "/apps/mockups" },
  { name: "Viral Trends", href: "/apps/trending-templates" },
  // { name: "Director's Motion", href: "/apps/camera-motion" },
  // { name: "Persona Shift", href: "/apps/face-identity" },
  // { name: "Aesthetic FX", href: "/apps/enhance-style" },
  // { name: "Production Suite", href: "/apps/video-editing" },
  // { name: "Commercial Studio", href: "/apps/ads-products" },
  // { name: "Digital Realms", href: "/apps/games-characters" },
  // { name: "Creator Kit", href: "/apps/extras" },
];

const mediaTypes = ["All Types", "Video", "Image", "Audio"];

// Handled by apps-config.ts

const Apps = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All Types");
  const pathname = usePathname();

  React.useEffect(() => {
    trackEvent("agents_directory_viewed", {
      total_sections: APP_SECTIONS.length,
      total_apps: APP_SECTIONS.reduce(
        (acc, section) => acc + section.apps.length,
        0
      ),
    });
  }, []);

  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div
        // ref={scrollContainerRef}
        className='scroll-container flex flex-1 flex-col overflow-auto will-change-scroll'
      >
        <TopNavWithAurora
        // scrollContainerRef={
        //   scrollContainerRef as React.RefObject<HTMLDivElement>
        // }
        />
        <div
          id='main-content'
          className='flex-1'
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <main id='main' className='w-full flex-1'>
            <div className='mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8'>
              <div className='space-y-12'>
                <div className='flex flex-col items-center justify-between gap-y-3 lg:flex-row lg:gap-y-0'>
                  <div className='scrollbar-hide -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0'>
                    <nav className='flex min-w-max items-center gap-2'>
                      {categories.map((category) => {
                        const isActive = activeCategory === category.name;
                        return (
                          <button
                            key={category.name}
                            onClick={() => {
                              setActiveCategory(category.name);
                              trackFeatureUsed(
                                "agents_category_filter_changed",
                                {
                                  category: category.name,
                                }
                              );
                            }}
                            className={cn(
                              "text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                              isActive &&
                                "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md"
                            )}
                          >
                            {category.name}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                  <div className='border-border bg-background/50 focus-within:border-primary focus-within:ring-primary/20 relative flex h-12 w-full items-center gap-2 rounded-xl border px-4 shadow-sm backdrop-blur-sm transition-all focus-within:ring-2 lg:w-fit'>
                    <svg
                      width={20}
                      height={20}
                      viewBox='0 0 20 20'
                      className='text-muted-foreground size-5 shrink-0'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M9.16634 3.83203C6.22082 3.83203 3.83301 6.21985 3.83301 9.16536C3.83301 12.1109 6.22082 14.4987 9.16634 14.4987C12.1119 14.4987 14.4997 12.1109 14.4997 9.16536C14.4997 6.21985 12.1119 3.83203 9.16634 3.83203ZM2.83301 9.16536C2.83301 5.66756 5.66854 2.83203 9.16634 2.83203C12.6641 2.83203 15.4997 5.66756 15.4997 9.16536C15.4997 10.7343 14.9292 12.17 13.9843 13.2763L18.2699 17.5618C18.4652 17.7571 18.4652 18.0737 18.2699 18.2689C18.0746 18.4642 17.758 18.4642 17.5628 18.2689L13.2772 13.9834C12.1709 14.9282 10.7353 15.4987 9.16634 15.4987C5.66854 15.4987 2.83301 12.6632 2.83301 9.16536Z'
                        fill='currentColor'
                      />
                    </svg>
                    <input
                      placeholder='Search'
                      className='text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none'
                      type='text'
                    />

                    <div className='border-border ml-1 flex shrink-0 items-center border-l pl-3'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className='text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors'>
                            <Filter className='size-4' />
                            <span className='xs:inline hidden whitespace-nowrap'>
                              {activeType}
                            </span>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          className='bg-popover border-border text-popover-foreground mt-2 w-48'
                        >
                          {mediaTypes.map((mType) => (
                            <DropdownMenuItem
                              key={mType}
                              onClick={() => {
                                setActiveType(mType);
                                trackFeatureUsed("agents_type_filter_changed", {
                                  media_type: mType,
                                });
                              }}
                              className={cn(
                                "cursor-pointer",
                                activeType === mType &&
                                  "bg-accent text-accent-foreground"
                              )}
                            >
                              {mType}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className='relative'>
                  <div style={{ opacity: 1, transform: "none" }}>
                    <div className='space-y-8'>
                      {APP_SECTIONS.filter(
                        (section) =>
                          activeCategory === "All" ||
                          section.title === activeCategory
                      ).map((section) => {
                        const filteredApps = section.apps.filter(
                          (app) =>
                            activeType === "All Types" ||
                            app.type === activeType.toLowerCase()
                        );

                        if (filteredApps.length === 0) return null;

                        return (
                          <section key={section.title} className='space-y-6'>
                            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
                              <div className='space-y-1'>
                                <h2 className='text-xl font-bold tracking-tight'>
                                  {section.title}
                                </h2>
                                <p className='text-muted-foreground text-sm'>
                                  {section.description}
                                </p>
                              </div>
                              <button
                                className='text-sm-semi flex shrink-0 items-center gap-1 p-[10px] text-white transition-colors'
                                onClick={() => {
                                  setActiveCategory(section.title);
                                  trackFeatureUsed(
                                    "agents_section_see_all_clicked",
                                    {
                                      section_title: section.title,
                                    }
                                  );
                                }}
                              >
                                <span>See all</span>
                                <svg
                                  className='size-2 sm:size-[18px]'
                                  aria-hidden='true'
                                  width='24px'
                                  height='24px'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path
                                    d='M10 16L13.6464 12.3536C13.8417 12.1583 13.8417 11.8417 13.6464 11.6464L10 8'
                                    stroke='currentColor'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5'>
                              {filteredApps.map((app) => (
                                <AppCard
                                  key={app.id}
                                  {...(app as AppCardProps)}
                                />
                              ))}
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <style
              type='text/css'
              dangerouslySetInnerHTML={{
                __html:
                  "\n          body {\n            background: radial-gradient(23.93% 26.98% at 100% 0%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(34.93% 41.39% at 92.71% 106.14%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(31.57% 33.97% at -2.15% 107.04%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(39.39% 24% at -13.58% 35.4%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 99.97%), linear-gradient(0deg, #0F1113 0%, #0F1113 100%), linear-gradient(0deg, #0F1113 0%, #0F1113 100%), #D9D9D9!important;\n            box-shadow: transparent !important;\n            backdrop-filter: transparent !important;\n            overflow-x: hidden;\n          }\n          \n    body {\n      background: radial-gradient(23.93% 26.98% at 100% 0%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(34.93% 41.39% at 92.71% 106.14%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(31.57% 33.97% at -2.15% 107.04%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(39.39% 24% at -13.58% 35.4%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 73.08%, rgba(255, 255, 255, 0.00) 99.97%), linear-gradient(0deg, #0F1113 0%, #0F1113 100%), linear-gradient(0deg, #0F1113 0%, #0F1113 100%), #D9D9D9!important;\n      box-shadow: transparent !important;\n      backdrop-filter: transparent !important;\n    }\n      #header {\n      background: none !important;\n      box-shadow: none !important;\n      backdrop-filter: none !important;\n    }\n    html.apps-header-scrolled #header {\n      background: #0F1113 !important;\n      box-shadow: inset 0 1rem 1rem rgba(0,0,0,1) !important;\n      backdrop-filter: blur(4px) !important;\n    }\n  \n        ",
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Apps;
