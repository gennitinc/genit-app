"use client";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";

const TryNowButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="button"
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }
    }}
    className="relative inline-flex items-center justify-center px-4 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group w-full"
  >
    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full group-hover:w-full group-hover:h-56"></span>
    <span className="absolute bottom-0 left-0 h-full -ml-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full opacity-100 object-stretch"
        viewBox="0 0 487 487"
      >
        <path
          fillOpacity=".1"
          fillRule="nonzero"
          fill="#FFF"
          d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
        ></path>
      </svg>
    </span>
    <span className="absolute top-0 right-0 w-12 h-full -mr-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="object-cover w-full h-full"
        viewBox="0 0 487 487"
      >
        <path
          fillOpacity=".1"
          fillRule="nonzero"
          fill="#FFF"
          d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
        ></path>
      </svg>
    </span>
    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
    <span className="relative text-base font-semibold">Try now</span>
  </button>
);

interface AppCardProps {
  id: string;
  href: string;
  title: string;
  description: string;
  type: "video" | "image" | "audio";
  videoSrc?: string;
  posterSrc?: string;
  imageSrc?: string;
  badge?: {
    text: string;
    bgColor: string;
    textColor: string;
  };
}

const AppCard = ({
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

    router.push(href);
  };

  return (
    <div className="w-full h-full">
      <div className="h-full">
        <div
          onClick={() => handleAction()}
          className="react-aria-Link cursor-pointer h-full"
          style={{ touchAction: "pan-x pan-y pinch-zoom" }}
        >
          <div className="flex flex-col group overflow-hidden w-full h-full cursor-pointer rounded-2xl border border-transparent transition-all duration-200 !bg-page-primary border-separator-card flex-1 shadow-[inset_2px_2px_2px_rgba(255,255,255,0.02)] hover:border-separator-card hover:!bg-surface-primary !min-w-0 h-full">
            <div
              className="relative overflow-hidden rounded-t-xl rounded-xl"
              style={{ aspectRatio: "1.03333 / 1" }}
            >
              {badge && (
                <div className="flex flex-wrap gap-2 absolute top-2 left-2 z-10">
                  <span
                    className="inline-flex items-center justify-center px-1.5 text-sm leading-[18px] font-bold uppercase text-white relative overflow-hidden skew-x-[-10deg] rounded"
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
                className="group relative h-full rounded-2xl"
                style={{ aspectRatio: "1.03333 / 1" }}
              >
                {videoSrc ? (
                  <video
                    loop
                    playsInline
                    disablePictureInPicture
                    preload="none"
                    poster={posterSrc}
                    src={videoSrc}
                    autoPlay
                    muted
                    className="object-cover size-full absolute inset-0 w-full h-full"
                    aria-label={description}
                  >
                    Your browser does not support the video.
                  </video>
                ) : (
                  <img
                    alt={description}
                    loading="lazy"
                    decoding="async"
                    className="object-cover absolute inset-0 w-full h-full"
                    src={imageSrc}
                  />
                )}
              </figure>
            </div>
            <div className="flex flex-col gap-4 py-3 min-w-0 justify-between flex-1">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm sm:text-base font-semibold text-font-primary leading-tight tracking-tight">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
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

const appSections = [
  {
    title: "General Apps",
    description: "Premium visual styles and sophisticated effects",
    href: "/apps/enhance-style",
    apps: [
      {
        id: "angles-reshape",
        href: "/apps/angles-reshape",
        title: "Angle Reshape",
        description: "Transform perspective and camera angles with precision",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/1d/e5/29/1de52947cf871b610fb4276053dd137f.jpg",
      },
      {
        id: "workflow",
        href: "/apps/workflow",
        title: "AI Workflow",
        description: "Automate your creative process with AI nodes",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/1200x/2e/29/24/2e29246282d5e2cc89abedaef9dc4fcd.jpg",
        badge: {
          text: "New",
          bgColor: "rgb(16, 185, 129)", // Emerald 500
          textColor: "rgb(255, 255, 255)",
        },
      },
      {
        id: "video-generation",
        href: "/apps/video-generation",
        title: "Video Generation",
        description: "Kinetic AI storytelling and animation",
        type: "video",
        imageSrc:
          "https://i.pinimg.com/originals/6f/40/25/6f4025f83d11fbb560ed453e98d80104.gif",
      },
      {
        id: "skin-enhancer",
        href: "/apps/skin-enhancer",
        title: "Skin Enhancer",
        description: "Achieve professional, true-to-life skin textures",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/1200x/99/1a/d5/991ad574d9178d31a6c6fde8f407be88.jpg",
        // badge: {
        //   text: "Pro",
        //   bgColor: "rgb(157, 78, 221)",
        //   textColor: "rgb(255, 255, 255)",
        // },
      },

      {
        id: "image-generation",
        href: "/apps/image-generation",
        title: "Image Generation",
        description: "Professional AI image creation suite",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/f4/fb/b5/f4fbb53e705d9d641c4f2f4f32cd1527.jpg",
      },

      {
        id: "character",
        href: "/apps/character",
        title: "Character Manager",
        description: "Manage and generate your own custom digital characters",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/eb/76/a4/eb76a46ab920d056b02d203ca95e9a22.jpg",
      },
      {
        id: "image-inpaint",
        href: "/apps/image-inpaint",
        title: "In-Painting",
        description: "Seamlessly remove objects and fill backgrounds with AI",
        type: "image",
        imageSrc:
          "https://imgv3.fotor.com/images/homepage-feature-card/use-fotor-ai-inpainting-tool-to-generate-a-spooted-white-trousers-for-female.jpg",
        badge: {
          text: "Coming soon",
          bgColor: "rgb(157, 78, 221)",
          textColor: "rgb(255, 255, 255)",
        },
      },
      {
        id: "logo-animation",
        href: "/apps/logo-animation",
        title: "Logo Animator",
        description: "Bring your logo to life with stunning animations",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/originals/46/5b/c4/465bc4bc137942ccd0a2a8ecb96387e8.gif",
        badge: {
          text: "Coming soon",
          bgColor: "rgb(157, 78, 221)",
          textColor: "rgb(255, 255, 255)",
        },
      },
      {
        id: "face-swap",
        href: "/apps/face-swap",
        title: "Face Swap",
        description: "Swap faces in images and videos with high precision",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/11/a2/41/11a2417bd10628b011dcb9e8792ecf7e.jpg",
        badge: {
          text: "Coming soon",
          bgColor: "rgb(157, 78, 221)",
          textColor: "rgb(255, 255, 255)",
        },
      },
      {
        id: "relight",
        href: "/apps/relight",
        title: "Glow Control",
        description: "Precision adjustment for lighting, color, and intensity",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/9a/43/11/9a43113d58e58236248dd4ffa7f9559f.jpg",
        badge: {
          text: "Coming soon",
          bgColor: "rgb(157, 78, 221)",
          textColor: "rgb(255, 255, 255)",
        },
      },

      // {
      //   id: "outfit-swap",
      //   href: "/apps/outfit-swap",
      //   title: "Outfit Swap",
      //   description: "Switch any outfit using just one photo upload",
      //   type: "image",
      //   imageSrc: "https://clothesswap.io/imgs/showcases/ChangeShirts.jpg",
      // },

      // {
      //   id: "billboard",
      //   href: "/apps/billboard",
      //   title: "Billboard",
      //   description: "Feature your brand on a massive virtual billboard",
      //   type: "image",
      //   imageSrc:
      //     "https://i.pinimg.com/736x/22/d9/bc/22d9bcd0836266b17bea6a6206d83325.jpg",
      // },
      // {
      //   id: "truck-ad",
      //   href: "/apps/truck-ad",
      //   title: "Mobile Transit",
      //   description: "Display your branding on moving commercial vehicles",
      //   type: "image",
      //   imageSrc:
      //     "https://i.pinimg.com/736x/1a/3d/7e/1a3d7e507dc2bbac284165aeda918e99.jpg",
      // },
    ],
  },
];

const Apps = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All Types");
  const pathname = usePathname();

  return (
    // <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
    //   <LandingPageBanner />
    //   {/* <LandingNavbar /> */}

    //   {/* <LandingFooter /> */}

    //   <Toaster />
    //   <AppSidebar />
    //   <div
    //     // ref={scrollContainerRef}
    //     className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container"
    //   >
    //     <TopNavWithAurora
    //       // scrollContainerRef={
    //       //   scrollContainerRef as React.RefObject<HTMLDivElement>
    //       // }
    //     />
    //     <div
    //       id="main-content"
    //       className="flex-1"
    //       style={{
    //         transform: "translateZ(0)",
    //         willChange: "transform",
    //       }}
    //     >

    //     </div>
    //   </div>
    // </div>

    <div className="flex relative w-full h-[100dvh] overflow-hidden bg-white dark:bg-black">
      <Toaster />
      <AppSidebar />
      <div
        // ref={scrollContainerRef}
        className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container"
      >
        <TopNavWithAurora
        // scrollContainerRef={
        //   scrollContainerRef as React.RefObject<HTMLDivElement>
        // }
        />
        <div
          id="main-content"
          className="flex-1"
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <main id="main" className="flex-1 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
              <div className="space-y-12">
                <div className="flex flex-col gap-y-3 lg:gap-y-0 lg:flex-row justify-between items-center">
                  <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    <nav className="flex items-center gap-2 min-w-max">
                      {categories.map((category) => {
                        const isActive = activeCategory === category.name;
                        return (
                          <button
                            key={category.name}
                            onClick={() => setActiveCategory(category.name)}
                            className={cn(
                              "text-muted-foreground text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 hover:text-foreground hover:bg-muted",
                              isActive &&
                                "text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md",
                            )}
                          >
                            {category.name}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                  <div className="relative flex items-center gap-2 w-full lg:w-fit px-4 h-12 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      className="size-5 text-muted-foreground shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.16634 3.83203C6.22082 3.83203 3.83301 6.21985 3.83301 9.16536C3.83301 12.1109 6.22082 14.4987 9.16634 14.4987C12.1119 14.4987 14.4997 12.1109 14.4997 9.16536C14.4997 6.21985 12.1119 3.83203 9.16634 3.83203ZM2.83301 9.16536C2.83301 5.66756 5.66854 2.83203 9.16634 2.83203C12.6641 2.83203 15.4997 5.66756 15.4997 9.16536C15.4997 10.7343 14.9292 12.17 13.9843 13.2763L18.2699 17.5618C18.4652 17.7571 18.4652 18.0737 18.2699 18.2689C18.0746 18.4642 17.758 18.4642 17.5628 18.2689L13.2772 13.9834C12.1709 14.9282 10.7353 15.4987 9.16634 15.4987C5.66854 15.4987 2.83301 12.6632 2.83301 9.16536Z"
                        fill="currentColor"
                      />
                    </svg>
                    <input
                      placeholder="Search"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                      type="text"
                    />

                    <div className="shrink-0 flex items-center border-l border-border pl-3 ml-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                            <Filter className="size-4" />
                            <span className="hidden xs:inline whitespace-nowrap">
                              {activeType}
                            </span>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-popover border-border text-popover-foreground mt-2"
                        >
                          {mediaTypes.map((mType) => (
                            <DropdownMenuItem
                              key={mType}
                              onClick={() => setActiveType(mType)}
                              className={cn(
                                "cursor-pointer",
                                activeType === mType &&
                                  "bg-accent text-accent-foreground",
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

                <div className="relative">
                  <div style={{ opacity: 1, transform: "none" }}>
                    <div className="space-y-8">
                      {appSections
                        .filter(
                          (section) =>
                            activeCategory === "All" ||
                            section.title === activeCategory,
                        )
                        .map((section) => {
                          const filteredApps = section.apps.filter(
                            (app) =>
                              activeType === "All Types" ||
                              app.type === activeType.toLowerCase(),
                          );

                          if (filteredApps.length === 0) return null;

                          return (
                            <section key={section.title} className="space-y-6">
                              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div className="space-y-1">
                                  <h2 className="text-xl font-bold tracking-tight">
                                    {section.title}
                                  </h2>
                                  <p className="text-sm text-muted-foreground">
                                    {section.description}
                                  </p>
                                </div>
                                <button
                                  className="flex items-center gap-1 text-sm-semi transition-colors shrink-0 text-white p-[10px]"
                                  onClick={() =>
                                    setActiveCategory(section.title)
                                  }
                                >
                                  <span>See all</span>
                                  <svg
                                    className="size-2 sm:size-[18px]"
                                    aria-hidden="true"
                                    width="24px"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10 16L13.6464 12.3536C13.8417 12.1583 13.8417 11.8417 13.6464 11.6464L10 8"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
              type="text/css"
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
