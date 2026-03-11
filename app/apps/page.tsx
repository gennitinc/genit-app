"use client";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TryNowButton = () => (
  <button
    type="button"
    className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group w-full"
  >
    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
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
}: AppCardProps) => (
  <div className="max-w-[248px] lg:max-w-none shrink-0 md:min-w-0">
    <div className="h-full">
      <a
        className="react-aria-Link"
        href={href}
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
          <div className="flex flex-col gap-6 py-3 sm:py-4 min-w-0 justify-between flex-1 p-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-base sm:text-md-semi font-semibold text-font-primary leading-6 tracking-[-0.16px]">
                {title}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-2 overflow-hidden text-ellipsis">
                {description}
              </p>
            </div>
            <TryNowButton />
          </div>
        </div>
      </a>
    </div>
  </div>
);

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
    description: "Premium visual styles and sophisticated artistic effects",
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
        // badge: {
        //   text: "Pro",
        //   bgColor: "rgb(157, 78, 221)",
        //   textColor: "rgb(255, 255, 255)",
        // },
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
        id: "logo-animation",
        href: "/apps/logo-animation",
        title: "Logo Animator",
        description: "Bring your logo to life with stunning animations",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/originals/46/5b/c4/465bc4bc137942ccd0a2a8ecb96387e8.gif",
        // badge: {
        //   text: "Coming soon",
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
        id: "video-generation",
        href: "/apps/video-generation",
        title: "Video Generation",
        description: "Kinetic AI storytelling and animation",
        type: "video",
        imageSrc:
          "https://cdn.leonardo.ai/users/220eee85-2367-43fd-91c1-715ac51afece/generations/ccd8c64a-ae89-49e3-89ef-afab21e2432a/segments/1:1:1/motion2Fast____________________________________________________0.jpg?w=512",
      },
      {
        id: "presenter",
        href: "/apps/presenter",
        title: "Presenter Manager",
        description: "Manage and generate your own custom digital presenters",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/eb/76/a4/eb76a46ab920d056b02d203ca95e9a22.jpg",
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

      // {
      //   id: "in-painting",
      //   href: "/apps/in-painting",
      //   title: "In Painting",
      //   description: "Remove objects and fill backgrounds seamlessly",
      //   type: "image",
      //   imageSrc:
      //     "https://imgv3.fotor.com/images/homepage-feature-card/use-fotor-ai-inpainting-tool-to-generate-a-spooted-white-trousers-for-female.jpg",
      //   badge: {
      //     text: "Pro",
      //     bgColor: "rgb(157, 78, 221)",
      //     textColor: "rgb(255, 255, 255)",
      //   },
      // },
    ],
  },
];

const Apps = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All Types");
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <LandingPageBanner />
      <LandingNavbar />

      <main id="main" className="h-full min-w-0 area-[main]">
        <div className="h-full container mx-auto grid gap-8 max-w-[1280px] grid-rows-[auto_1fr_auto] overflow-x-hidden pt-12 md:pt-14 px-4 sm:px-6 lg:px-8">
          <main className="flex-grow relative bg-background">
            <div className="absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
            <div className="w-full mx-auto px-4 sm:px-6 py-8 lg:mt-10">
              <div className="space-y-4 flex flex-col ml-2 md:mx-4 lg:mx-8 items-center justify-center">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl max-w-xl text-center">
                  Explore Apps{" "}
                </h1>
                <p className="text-normal text-sm text-muted-foreground leading-relaxed max-w-2xl text-center">
                  Discover amazing AI-generated videos and images created by our
                  community.
                </p>

                <div className="flex items-center justify-center w-full lg:w-[450px]">
                  <div
                    className="relative flex items-center gap-2 w-full px-3 py-3 h-11 rounded-xl border border-transparent bg-[rgba(255,255,255,0.04)] focus-within:border-white-24 focus-within:bg-white-12 transition-colors max-w-full"
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.12) 0px 4px 12px 0px",
                    }}
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      className="size-5 text-text-secondary shrink-0"
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
                      className="flex-1 bg-transparent text-sm text-font-primary placeholder:text-text-secondary outline-none min-w-0"
                      type="text"
                      defaultValue=""
                    />

                    <div className="shrink-0 flex items-center border-l border-white-8 pl-3 ml-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                            <Filter className="size-4" />
                            <span className="whitespace-nowrap">
                              {activeType}
                            </span>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-[#1A1D1F] border-white-8 text-text-primary mt-2"
                        >
                          {mediaTypes.map((mType) => (
                            <DropdownMenuItem
                              key={mType}
                              onClick={() => setActiveType(mType)}
                              className={cn(
                                "cursor-pointer focus:bg-white-8 focus:text-text-primary",
                                activeType === mType &&
                                  "bg-white-8 text-text-primary",
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
              </div>
            </div>
          </main>
          <div className="min-w-0 w-full overflow-x-hidden space-y-12 md:space-y-14">
            <div className="flex flex-col items-center justify-center overflow-x-scroll hide-scrollbar bg-white-8 p-1 rounded-xl border border-white-4">
              <div className="w-full relative">
                <div
                  className="absolute top-0 left-0 h-full w-12 z-10 pointer-events-none transition-opacity rounded-l-lg opacity-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(15, 17, 19) 0%, transparent 100%)",
                  }}
                />
                <div
                  className="absolute top-0 right-0 h-full w-12 z-10 pointer-events-none transition-opacity rounded-r-lg opacity-100"
                  style={{
                    background:
                      "linear-gradient(270deg, rgb(15, 17, 19) 0%, transparent 100%)",
                  }}
                />
                <div className="overflow-x-auto overflow-y-hidden hide-scrollbar">
                  <nav className="flex items-center gap-1">
                    {categories.map((category) => {
                      const isActive = activeCategory === category.name;
                      return (
                        <button
                          key={category.name}
                          onClick={() => setActiveCategory(category.name)}
                          className={cn(
                            "text-text-secondary text-body-s font-medium px-4 py-2 whitespace-nowrap flex items-center justify-center rounded-[0.625rem] h-9 transition-all duration-200 border border-transparent !text-sm hover:text-text-primary hover:bg-white-12",
                            isActive &&
                              "text-text-primary bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm",
                          )}
                        >
                          <span>{category.name}</span>
                        </button>
                      );
                    })}
                  </nav>
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
                        <section
                          key={section.title}
                          className="space-y-4 last:border-b-0"
                        >
                          <div className="flex items-end justify-between gap-4">
                            <div className="flex-1 space-y-1">
                              <h2 className="text-h-sm-bold uppercase font-grotesk text-font-primary">
                                {section.title}
                              </h2>
                              <p className="text-sm text-text-secondary">
                                {section.description}
                              </p>
                            </div>
                            <button
                              className="flex items-center gap-1 text-sm-semi transition-colors shrink-0 text-white p-[10px]"
                              onClick={() => setActiveCategory(section.title)}
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
                          <div className="flex gap-4 overflow-x-auto hide-scrollbar lg:grid md:grid-cols-3 lg:grid-cols-5">
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
      <LandingFooter />
    </div>
  );
};

export default Apps;
