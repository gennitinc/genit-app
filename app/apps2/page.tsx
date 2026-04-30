"use client";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const TryNowButton = () => (
  <button
    type='button'
    className='group relative inline-flex w-full items-center justify-center overflow-hidden rounded-md bg-gray-800 px-8 py-2.5 tracking-tighter text-white'
  >
    <span className='absolute h-0 w-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56'></span>
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
  <div className='max-w-[248px] shrink-0 md:min-w-0 lg:max-w-none'>
    <div className='h-full'>
      <a
        className='react-aria-Link'
        href={href}
        style={{ touchAction: "pan-x pan-y pinch-zoom" }}
      >
        <div className='group !bg-page-primary border-separator-card hover:border-separator-card hover:!bg-surface-primary flex h-full w-full !min-w-0 flex-1 cursor-pointer flex-col overflow-hidden rounded-2xl border border-transparent shadow-[inset_2px_2px_2px_rgba(255,255,255,0.02)] transition-all duration-200'>
          <div
            className='relative overflow-hidden rounded-xl rounded-t-xl'
            style={{ aspectRatio: "1.03333 / 1" }}
          >
            {badge && (
              <div className='absolute bottom-2 left-2 z-10 flex flex-wrap gap-2'>
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
          <div className='flex min-w-0 flex-1 flex-col justify-between gap-6 p-4 py-3 sm:py-4'>
            <div className='flex flex-col gap-1'>
              <h3 className='sm:text-md-semi text-font-primary text-base leading-6 font-semibold tracking-[-0.16px]'>
                {title}
              </h3>
              <p className='text-text-secondary line-clamp-2 overflow-hidden text-sm text-ellipsis'>
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
  { name: "Director's Motion", href: "/apps/camera-motion" },
  { name: "Persona Shift", href: "/apps/face-identity" },
  { name: "Aesthetic FX", href: "/apps/enhance-style" },
  { name: "Production Suite", href: "/apps/video-editing" },
  { name: "Commercial Studio", href: "/apps/ads-products" },
  { name: "Digital Realms", href: "/apps/games-characters" },
  { name: "Creator Kit", href: "/apps/extras" },
];

const mediaTypes = ["All Types", "Video", "Image", "Audio"];

const appSections = [
  {
    title: "Mockups",
    description:
      "Professional high-fidelity mockups for digital and physical products",
    href: "/apps/mockups",
    apps: [
      {
        id: "website-mockup",
        href: "/apps/website-mockup",
        title: "Website Mockup",
        description: "See your website in high-end gallery and indoor settings",
        type: "video",
        videoSrc: "https://flarefile.com/preview/43794040.mp4",
        posterSrc:
          "https://hunterae.com/wp-content/uploads/images/laptop-mockup-website-presentation-43794040-download-videohive-free-hunterae-com-7.jpg",
        badge: {
          text: "Trending",
          bgColor: "rgb(209, 254, 23)",
          textColor: "rgb(0, 0, 0)",
        },
      },
      {
        id: "iphone-mockup",
        href: "/apps/iphone-mockup",
        title: "App Mockups",
        description:
          "Showcase your app on the latest iPhone and MacBook screens",
        type: "image",
        imageSrc:
          "https://cdn.higgsfield.ai/application_main/ea06ae2c-f931-49f6-bc17-0e5c95660cff.webp",
        badge: {
          text: "New",
          bgColor: "rgb(209, 254, 23)",
          textColor: "rgb(0, 0, 0)",
        },
      },
      {
        id: "3ddesign",
        href: "/apps/3d-design",
        title: "3D Design",
        description: "Create stunning 3D models for your products and projects",
        type: "image",
        imageSrc:
          "https://cdn.higgsfield.ai/application_main/ea06ae2c-f931-49f6-bc17-0e5c95660cff.webp",
        badge: {
          text: "New",
          bgColor: "rgb(209, 254, 23)",
          textColor: "rgb(0, 0, 0)",
        },
      },
      {
        id: "branding-mockup",
        href: "/apps/branding-mockup",
        title: "Identity Pro",
        description: "Generate clean business card and stationary mockups",
        type: "image",
        imageSrc:
          "https://cdn.higgsfield.ai/application_main/6867071b-8505-4c06-b23f-aa4c686d7cfb.webp",
      },
      {
        id: "apparel-mockup",
        href: "/apps/apparel-mockup",
        title: "Streetwear AI",
        description: "Visualize your designs on premium T-shirts and hoodies",
        type: "image",
        imageSrc:
          "https://cdn.higgsfield.ai/application_main/7a71628b-3cb3-443b-bd96-5f0a75425575.webp",
        badge: {
          text: "Pro",
          bgColor: "rgb(157, 78, 221)",
          textColor: "rgb(255, 255, 255)",
        },
      },

      {
        id: "outdoor-mockup",
        href: "/apps/outdoor-mockup",
        title: "Urban Display",
        description:
          "Place your brand on realistic billboards and city posters",
        type: "image",
        imageSrc:
          "https://cdn.higgsfield.ai/application_main/adb6ff61-c833-4cbf-bc5b-bae5319cdefc.webp",
      },
      {
        id: "print-mockup",
        href: "/apps/print-mockup",
        title: "Gallery Wall",
        description: "See your artwork in high-end gallery and indoor settings",
        type: "image",
        imageSrc:
          "https://cdn.higgsfield.ai/application_main/dcafc3f9-a87a-41ec-8ef8-f5443a0a7315.webp",
      },
    ],
  },
  // {
  //   title: "Director's Motion",
  //   description: "Seamless cinematic camera-work and professional-grade shots",
  //   href: "/apps/camera-motion",
  //   apps: [
  //     {
  //       id: "transitions",
  //       href: "/apps/transitions",
  //       title: "Seamless Flow",
  //       description: "Craft smooth visual transitions between shots with ease",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/e4c366d4-f237-4f07-bd86-5b77808fafe6.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/e69b0e22-a7ea-4f3b-ab81-f90be470a376.webp",
  //       badge: {
  //         text: "Trending",
  //         bgColor: "rgb(209, 254, 23)",
  //         textColor: "rgb(0, 0, 0)",
  //       },
  //     },
  //     {
  //       id: "angles",
  //       href: "/apps/angles",
  //       title: "Perspective AI",
  //       description: "Generate diverse camera angles from any image instantly",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/29dc499c-84a0-43c3-8c6b-1e278a6cc474.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/87357c00-b9ff-41e2-8016-d37db2b31dda.webp",
  //       badge: {
  //         text: "Pro",
  //         bgColor: "rgb(157, 78, 221)",
  //         textColor: "rgb(255, 255, 255)",
  //       },
  //     },
  //     {
  //       id: "whats-next",
  //       href: "/apps/whats-next",
  //       title: "Narrative Path",
  //       description: "Discover 8 unique story directions from one scene",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/5600ef95-0305-4b8a-b407-dfa6f5d1f73d.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/8d0d5b70-1e19-45d8-a08a-607df8143b4e.webp",
  //       badge: {
  //         text: "New",
  //         bgColor: "rgb(209, 254, 23)",
  //         textColor: "rgb(0, 0, 0)",
  //       },
  //     },
  //     {
  //       id: "shots",
  //       href: "/apps/shots",
  //       title: "Frame Forge",
  //       description: "Produce 9 distinct viewpoints from a single source",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/3ca44a57-7d68-4956-9ae9-d05dd6d233b7.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/8345d971-f97f-48c1-9ce6-2e600303d4c6.webp",
  //     },
  //     {
  //       id: "behind-the-scenes",
  //       href: "/apps/behind-the-scenes",
  //       title: "Backstage Pass",
  //       description:
  //         "Convert still photos into dynamic production-style videos",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/7655f6d8-6f18-493f-9990-488c447b42de.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/ea06ae2c-f931-49f6-bc17-0e5c95660cff.webp",
  //     },
  //   ],
  // },
  // {
  //   title: "Aesthetic FX",
  //   description: "Premium visual styles and sophisticated artistic effects",
  //   href: "/apps/enhance-style",
  //   apps: [
  //     {
  //       id: "skin-enhancer",
  //       href: "/apps/skin-enhancer",
  //       title: "Flawless Retouch",
  //       description: "Achieve professional, true-to-life skin textures",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/fb84f803-64b0-4259-b9a3-b2fc57073da4.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/8223c0ec-6b92-42d0-832b-9b4ed00fb046.webp",
  //       badge: {
  //         text: "Pro",
  //         bgColor: "rgb(157, 78, 221)",
  //         textColor: "rgb(255, 255, 255)",
  //       },
  //     },
  //     {
  //       id: "relight",
  //       href: "/apps/relight",
  //       title: "Glow Control",
  //       description: "Precision adjustment for lighting, color, and intensity",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/ff6c6ba0-3c47-416a-a473-e2b2bd425160.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/a838d9d6-5840-4d8c-a66b-b6deb090be56.webp",
  //       badge: {
  //         text: "Pro",
  //         bgColor: "rgb(157, 78, 221)",
  //         textColor: "rgb(255, 255, 255)",
  //       },
  //     },
  //     {
  //       id: "ai-stylist",
  //       href: "/apps/ai-stylist",
  //       title: "Virtual Fitting",
  //       description: "Instant AI-powered wardrobe and style preview",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/bb9d59e1-0493-4031-a97d-27fc7f660c89.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/94bc1825-8bcc-4355-be98-1efd1b11773a.webp",
  //       badge: {
  //         text: "New",
  //         bgColor: "rgb(209, 254, 23)",
  //         textColor: "rgb(0, 0, 0)",
  //       },
  //     },
  //     {
  //       id: "outfit-swap",
  //       href: "/apps/outfit-swap",
  //       title: "Wardrobe Morph",
  //       description: "Switch any outfit using just one photo upload",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/da91da29-9fc7-41fd-a99d-b07e4bb010b6.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/dcafc3f9-a87a-41ec-8ef8-f5443a0a7315.webp",
  //     },
  //     {
  //       id: "style-snap",
  //       href: "/apps/style-snap",
  //       title: "Look Variant",
  //       description:
  //         "Apply instant artistic styles to transform your appearance",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/979a9eda-8eb0-4d0f-9a45-b44d2fca9088.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/9dfbd5d1-95a2-4308-bedf-795d1bcdac3c.webp",
  //     },
  //   ],
  // },
  // {
  //   title: "Persona Shift",
  //   description: "Advanced face modification and persona shifting tools",
  //   href: "/apps/face-identity",
  //   apps: [
  //     {
  //       id: "recast",
  //       href: "/apps/recast",
  //       title: "Pro Swap",
  //       description:
  //         "Professional-grade character replacement for video content",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/16af5e9e-270f-4b0f-b1c2-0c448c5d31ef.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/e184f451-2a79-443f-8e17-d7b24e0d2e21.webp",
  //       badge: {
  //         text: "Pro",
  //         bgColor: "rgb(157, 78, 221)",
  //         textColor: "rgb(255, 255, 255)",
  //       },
  //     },
  //     {
  //       id: "character-swap",
  //       href: "/apps/character-swap",
  //       title: "Hero Morph",
  //       description: "Instantly replace characters in any image",
  //       type: "image",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/5a17fdb6-88b3-4588-809c-0b7af087ca1c.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/7a71628b-3cb3-443b-bd96-5f0a75425575.webp",
  //     },
  //     {
  //       id: "face-swap",
  //       href: "/apps/face-swap",
  //       title: "Portrait Swap",
  //       description: "Top-tier AI face replacement for high-quality photos",
  //       type: "image",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/2e53be4f-3594-47ce-a5f6-89c627d14be6.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/6867071b-8505-4c06-b23f-aa4c686d7cfb.webp",
  //     },
  //     {
  //       id: "video-face-swap",
  //       href: "/apps/video-face-swap",
  //       title: "Motion Face Swap",
  //       description: "Advanced face-swapping technology for video editing",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/74bacb16-640c-4917-a795-6d23dee78c7b.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/93061c78-4d36-4346-a244-14129833fe28.webp",
  //     },
  //     {
  //       id: "commercial-faces",
  //       href: "/apps/commercial-faces",
  //       title: "Brand Identities",
  //       description:
  //         "Elevate your professional digital presence with persona tools",
  //       type: "image",
  //       imageSrc:
  //         "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1920,quality=85/https://cdn.higgsfield.ai/card/80ab567c-104c-4724-99aa-3cea5114e64c.webp",
  //     },
  //   ],
  // },
  // {
  //   title: "Production Suite",
  //   description:
  //     "Professional tools for splitting, timing, and refining footage",
  //   href: "/apps/video-editing",
  //   apps: [
  //     {
  //       id: "urban-cuts",
  //       href: "/apps/urban-cuts",
  //       title: "Beat Sync",
  //       description: "AI-driven outfit transitions synced to the rhythm",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/57b32b6b-93e0-4d47-976a-e698b3e99933.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/95457a9a-e2e7-4c7f-a9b9-f0ef0e8ea38e.webp",
  //     },
  //     {
  //       id: "clipcut",
  //       href: "/apps/clipcut",
  //       title: "Insta-Reel",
  //       description: "Turn a single selfie into a high-energy outfit reel",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/6cb9d72c-1661-4d51-8968-9d6420ef4a54.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/d2f82a7a-e475-4e7d-9ab3-2880f5187e11.webp",
  //     },
  //     {
  //       id: "sticker-matchcut",
  //       href: "/apps/sticker-matchcut",
  //       title: "Pop Animation",
  //       description: "Convert video clips into vibrant, animated stickers",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/d147f5e2-0c9f-465c-9f5e-9edd142d1408.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/3e73bdb5-04058-9f66-f77161bf363b.webp",
  //     },
  //     {
  //       id: "breakdown",
  //       href: "/apps/breakdown",
  //       title: "Component Map",
  //       description: "Deconstruct any image into its core individual elements",
  //       type: "image",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/776a0c62-9450-48d6-84e5-cffa5ae71944.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/4e59cfff-ccde-4435-80bf-47c3dc6fa4b5.webp",
  //     },
  //     {
  //       id: "japanese-show",
  //       href: "/apps/japanese-show",
  //       title: "TV Retro",
  //       description:
  //         "Style your photos like classic vintage television segments",
  //       type: "image",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/ed80a540-7797-48e1-9b51-1e6f2b065f03.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/c60898bf-4df1-45be-971f-a18cfbac06dc.webp",
  //     },
  //   ],
  // },
  // {
  //   title: "Commercial Studio",
  //   description:
  //     "Immediately generate studio-quality advertisements and promos",
  //   href: "/apps/ads-products",
  //   apps: [
  //     {
  //       id: "click-to-ad",
  //       href: "/apps/link-to-video-ad",
  //       title: "Web to Promo",
  //       description:
  //         "Transform product URLs into social-ready video advertisements",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/c75be66a-b6a9-4cfb-add1-d2a98fa78080.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/f2fca274-d36e-42cf-aff7-dcf787031553.webp",
  //       badge: {
  //         text: "PRO",
  //         bgColor: "rgb(157, 78, 221)",
  //         textColor: "rgb(255, 255, 255)",
  //       },
  //     },
  //     {
  //       id: "bullet-time-scene",
  //       href: "/apps/bullet-time-scene",
  //       title: "Spin Showcase",
  //       description: "360° product views with adaptive AI backgrounds",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/5182d536-02e5-44bb-9444-d947fa4df234.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/0adbc3f9-335c-4c64-8d9e-14b5fa8de146.webp",
  //     },
  //     {
  //       id: "billboard",
  //       href: "/apps/billboard",
  //       title: "City Takeover",
  //       description: "Feature your brand on a massive virtual billboard",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/a5928bf1-8cca-4f11-80c1-d48602facf5a.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/552a98ef-7b13-4cbb-8263-6de84addff79.webp",
  //     },
  //     {
  //       id: "truck-ad",
  //       href: "/apps/truck-ad",
  //       title: "Mobile Transit",
  //       description: "Display your branding on moving commercial vehicles",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/030c784c-6618-430b-a4d6-e024e9f7973e.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/8e7cb94c-df6b-4bb4-b5c7-18c0a390b7be.webp",
  //     },
  //     {
  //       id: "bullet-time-white",
  //       href: "/apps/bullet-time-white",
  //       title: "Studio Spin",
  //       description: "Clean, minimalist 360° product rotations",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/ecb5c476-ea40-4c4e-acf6-ac582456c665.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/0d73cdbc-4922-42b7-af70-1f43476594f5.webp",
  //     },
  //   ],
  // },
  // {
  //   title: "Digital Realms",
  //   description:
  //     "Tools for creating gaming-style characters and immersive worlds",
  //   href: "/apps/games-characters",
  //   apps: [
  //     {
  //       id: "nano-theft",
  //       href: "/apps/nano-theft",
  //       title: "Open World",
  //       description:
  //         "Experience yourself in a high-fidelity sandbox game style",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/00529da2-6509-4ad8-a51d-f4000e819fc5.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/5482ff45-5db7-458d-825a-5098b0ae3c75.webp",
  //     },
  //     {
  //       id: "game-dump",
  //       href: "/apps/game-dump",
  //       title: "Pixel Persona",
  //       description: "Morph into 12 distinct video game art styles",
  //       type: "image",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/0ad89b45-e725-4bba-8a78-f81d22be4a65.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/adb6ff61-c833-4cbf-bc5b-bae5319cdefc.webp",
  //     },
  //     {
  //       id: "nano-strike",
  //       href: "/apps/nano-strike",
  //       title: "Tactical Ops",
  //       description:
  //         "Place yourself or your team in a tactical shooter setting",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/d22585d2-2f1b-4819-af1b-778e734596d8.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/f8f91834-382e-4ed7-8792-f2f723e84b1a.webp",
  //     },
  //     {
  //       id: "simlife",
  //       href: "/apps/simlife",
  //       title: "Life Sim",
  //       description: "Adopt the look of a stylized simulation game character",
  //       type: "image",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/eeb5eb4f-f5a1-4462-8b10-a65e95c1332c.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/edf8e6b6-0ed3-46dc-bf49-075f2799ac3f.webp",
  //     },
  //     {
  //       id: "plushies",
  //       href: "/apps/plushies",
  //       title: "Soft Toy AI",
  //       description: "Turn any photo into a charming, animated plushie",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/206ff054-fbe2-4edd-b5d2-60d60cfe4698.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/3e84cb70-1e38-4780-ba30-b1ffb05cea9b.webp",
  //     },
  //   ],
  // },
  // {
  //   title: "Creator Kit",
  //   description: "A collection of versatile utilities for digital artists",
  //   href: "/apps/extras",
  //   apps: [
  //     {
  //       id: "signboard",
  //       href: "/apps/signboard",
  //       title: "Mural Art",
  //       description: "See your portrait as a stylish urban mural",
  //       type: "image",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/1d3aaf49-8cfd-4f17-b562-80b2fd460ee2.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/dc08c526-a36c-45de-93c7-2a2595e4551c.webp",
  //     },
  //     {
  //       id: "surrounded-by-animals",
  //       href: "/apps/surrounded-by-animals",
  //       title: "Animal Circle",
  //       description: "Digital critters to accompany your scenes",
  //       type: "image",
  //       imageSrc:
  //         "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1920,quality=85/https://cdn.higgsfield.ai/card/c0649640-6780-4c73-bd3c-89174cb43f1a.webp",
  //     },
  //     {
  //       id: "paint-app",
  //       href: "/apps/paint-app",
  //       title: "Canvas Retro",
  //       description: "Reimagine photos as vintage digital paint masterpieces",
  //       type: "image",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/8d075a6e-8ff9-4286-8aad-40560a11c033.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/b7db644e-9e07-4a05-9887-501ddc9e8291.webp",
  //     },
  //   ],
  // },
  // {
  //   title: "Viral Trends",
  //   description: "Quickly build high-engagement content using popular presets",
  //   href: "/apps/trending-templates",
  //   apps: [
  //     {
  //       id: "idol",
  //       href: "/apps/idol",
  //       title: "Star Moment",
  //       description: "Capture the essence of a K-pop performance in your photo",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/09f4b2b8-52c1-4faa-87b4-9d92671b4838.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/b42bbe3a-a646-41d0-b481-3dc97c221c8a.webp",
  //     },
  //     {
  //       id: "this-is-fine",
  //       href: "/apps/this-is-fine",
  //       title: "Heat Meme",
  //       description:
  //         'Recreate the legendary "This is Fine" moment with your photo',
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/bb46db2f-2fd7-4095-8bd8-743e29822ae2.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/57d3f049-a913-49e0-b672-a13852db4666.webp",
  //     },
  //     {
  //       id: "cloud-surf",
  //       href: "/apps/cloud-surf",
  //       title: "Sky Glide",
  //       description:
  //         "Drift through dreamlike pink clouds in this surfing scene",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/b6534cb6-7828-4797-bd31-987486aa1699.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/21a972a7-0c4b-4e70-9a8c-941ac6c756d1.webp",
  //     },
  //     {
  //       id: "skibidi",
  //       href: "/apps/skibidi",
  //       title: "Toilet Trend",
  //       description: "Apply the viral Skibidi meme style to any portrait",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/203e9f9c-2fb9-4e08-bc29-e7a749018f31.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/9b8ac314-f6dc-4eaf-848d-404b632fdb22.webp",
  //     },
  //     {
  //       id: "mukbang",
  //       href: "/apps/mukbang",
  //       title: "Foodie Show",
  //       description: "Visualize your photo in a viral eating broadcast style",
  //       type: "video",
  //       videoSrc:
  //         "https://cdn.higgsfield.ai/application_main/489c8e06-2943-4cfe-a235-d50e75d6a753.mp4",
  //       posterSrc:
  //         "https://cdn.higgsfield.ai/application_main/4914bcb2-1c53-487a-967b-f47fcc424ce7.webp",
  //     },
  //   ],
  // },
];

const Apps = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All Types");
  const pathname = usePathname();

  return (
    <div className='flex min-h-screen w-full flex-col bg-white dark:bg-black'>
      <LandingPageBanner />
      <LandingNavbar />

      <main id='main' className='area-[main] h-full min-w-0'>
        <div className='container mx-auto grid h-full max-w-[1280px] grid-rows-[auto_1fr_auto] gap-8 overflow-x-hidden px-4 pt-12 sm:px-6 md:pt-14 lg:px-8'>
          <main className='bg-background relative flex-grow'>
            <div className='absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_40%,transparent_100%)] bg-[size:48px_48px]'></div>
            <div className='mx-auto w-full px-4 py-8 sm:px-6 lg:mt-10'>
              <div className='ml-2 flex flex-col items-center justify-center space-y-4 md:mx-4 lg:mx-8'>
                <h1 className='max-w-xl text-center text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl'>
                  Explore Apps{" "}
                </h1>
                <p className='text-normal text-muted-foreground max-w-2xl text-center text-sm leading-relaxed'>
                  Discover amazing AI-generated videos and images created by our
                  community.
                </p>

                <div className='flex w-full items-center justify-center lg:w-[450px]'>
                  <div
                    className='focus-within:border-white-24 focus-within:bg-white-12 relative flex h-11 w-full max-w-full items-center gap-2 rounded-xl border border-transparent bg-[rgba(255,255,255,0.04)] px-3 py-3 transition-colors'
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.12) 0px 4px 12px 0px",
                    }}
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox='0 0 20 20'
                      className='text-text-secondary size-5 shrink-0'
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
                      className='text-font-primary placeholder:text-text-secondary min-w-0 flex-1 bg-transparent text-sm outline-none'
                      type='text'
                      defaultValue=''
                    />

                    <div className='border-white-8 ml-1 flex shrink-0 items-center border-l pl-3'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className='text-text-secondary hover:text-text-primary flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors'>
                            <Filter className='size-4' />
                            <span className='whitespace-nowrap'>
                              {activeType}
                            </span>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          className='border-white-8 text-text-primary mt-2 w-48 bg-[#1A1D1F]'
                        >
                          {mediaTypes.map((mType) => (
                            <DropdownMenuItem
                              key={mType}
                              onClick={() => setActiveType(mType)}
                              className={cn(
                                "focus:bg-white-8 focus:text-text-primary cursor-pointer",
                                activeType === mType &&
                                  "bg-white-8 text-text-primary"
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
          <div className='w-full min-w-0 space-y-12 overflow-x-hidden md:space-y-14'>
            <div className='hide-scrollbar bg-white-8 border-white-4 flex flex-col items-center justify-center overflow-x-scroll rounded-xl border p-1'>
              <div className='relative w-full'>
                <div
                  className='pointer-events-none absolute top-0 left-0 z-10 h-full w-12 rounded-l-lg opacity-0 transition-opacity'
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(15, 17, 19) 0%, transparent 100%)",
                  }}
                />
                <div
                  className='pointer-events-none absolute top-0 right-0 z-10 h-full w-12 rounded-r-lg opacity-100 transition-opacity'
                  style={{
                    background:
                      "linear-gradient(270deg, rgb(15, 17, 19) 0%, transparent 100%)",
                  }}
                />
                <div className='hide-scrollbar overflow-x-auto overflow-y-hidden'>
                  <nav className='flex items-center gap-1'>
                    {categories.map((category) => {
                      const isActive = activeCategory === category.name;
                      return (
                        <button
                          key={category.name}
                          onClick={() => setActiveCategory(category.name)}
                          className={cn(
                            "text-text-secondary text-body-s hover:text-text-primary hover:bg-white-12 flex h-9 items-center justify-center rounded-[0.625rem] border border-transparent px-4 py-2 !text-sm font-medium whitespace-nowrap transition-all duration-200",
                            isActive &&
                              "text-text-primary bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm"
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

            <div className='relative'>
              <div style={{ opacity: 1, transform: "none" }}>
                <div className='space-y-8'>
                  {appSections
                    .filter(
                      (section) =>
                        activeCategory === "All" ||
                        section.title === activeCategory
                    )
                    .map((section) => {
                      const filteredApps = section.apps.filter(
                        (app) =>
                          activeType === "All Types" ||
                          app.type === activeType.toLowerCase()
                      );

                      if (filteredApps.length === 0) return null;

                      return (
                        <section
                          key={section.title}
                          className='space-y-4 last:border-b-0'
                        >
                          <div className='flex items-end justify-between gap-4'>
                            <div className='flex-1 space-y-1'>
                              <h2 className='text-h-sm-bold font-grotesk text-font-primary uppercase'>
                                {section.title}
                              </h2>
                              <p className='text-text-secondary text-sm'>
                                {section.description}
                              </p>
                            </div>
                            <button
                              className='text-sm-semi flex shrink-0 items-center gap-1 p-[10px] text-white transition-colors'
                              onClick={() => setActiveCategory(section.title)}
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
                          <div className='hide-scrollbar flex gap-4 overflow-x-auto md:grid-cols-3 lg:grid lg:grid-cols-5'>
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
      <LandingFooter />
    </div>
  );
};

export default Apps;
