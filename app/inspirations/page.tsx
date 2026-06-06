// "use client";
import Banner from "@/components/common/banner";
import TemplateGridAll from "@/components/common/templateGridAll";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { IdeaSection } from "@/components/layout/idea-section";
// import Communityproject from "../layout/community-project";
import { motion } from "framer-motion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inspirations – Genit AI | Browse Design Templates & Ideas",
  description:
    "Explore thousands of design inspirations, templates, flyers, and creative ideas. Get inspired by professional designs and start creating with Genit AI.",
  keywords: [
    "design inspirations",
    "templates",
    "design ideas",
    "flyer templates",
    "creative designs",
    "design inspiration gallery",
    "professional templates",
  ],
  openGraph: {
    title: "Inspirations – Genit AI",
    description:
      "Browse professional design templates and creative inspirations",
    url: "https://www.trygenit.com/inspirations",
    images: [
      {
        url: "https://www.trygenit.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Genit AI Inspirations",
      },
    ],
  },
};

//images
const images = [
  "https://img.freepik.com/free-photo/smiley-woman-outdoors-city_23-2148774316.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/freedom-concept-with-hiker-mountain_23-2148107064.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-vector/woman-doodle-drawing-sketch-illustration-vector_53876-118.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/young-hispanic-man-with-beard-wearing-red-t-shirt-blue-background-looking-side-relax-profile-pose-with-natural-face-with-confident-smile_839833-2174.jpg?ga=GA1.1.1557987898.1750353078&w=740",
  "https://img.freepik.com/free-photo/smiling-man_1098-15443.jpg?ga=GA1.1.1557987898.1750353078&w=740",
];

export default function TemplatePage() {
  return (
    <div className='flex min-h-screen w-full flex-col bg-white dark:bg-black'>
      <LandingPageBanner />
      <LandingNavbar />
      <div className='hidden'>
        <div className='bg-primary-surface text-primary banner-launch-week-02-2026-03-10 relative z-10 flex items-center rounded-none p-3 py-4 pr-8'>
          <div className='flex w-full flex-col items-center space-y-2 md:flex-row md:justify-center md:space-y-0 md:space-x-1'>
            <div className='flex items-center space-x-2'>
              <p className='hidden text-center text-sm font-medium md:block'>
                We release updates swiftly. Be sure to check out the changelogs
                page!
              </p>
              <p className='text-center text-sm font-medium md:hidden'>
                We release updates swiftly.
              </p>
            </div>
            <a
              href='https://railway.com/launch-week-02'
              target='_blank'
              rel='noreferrer'
              className='underline hover:text-pink-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700'
            >
              <p className='hidden text-sm md:block'>View Details</p>
              <p className='text-sm md:hidden'>View changelogs</p>
            </a>
          </div>
          <div className='absolute top-0 right-6 bottom-0 flex items-center'>
            <div
              className='icon-container icon-md text-foreground !h-4 !w-4 cursor-pointer text-2xl'
              aria-hidden='true'
            >
              <svg
                width={24}
                height={24}
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
                className='feather feather-x'
              >
                <path d='M18 6 6 18M6 6l12 12' />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className='md:px-12 lg:px-20 xl:px-24'>
        <main className='bg-background relative flex-grow'>
          <div className='absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_40%,transparent_100%)] bg-[size:48px_48px]'></div>
          <div className='mx-auto mt-20 w-full px-4 py-8 sm:px-6'>
            <div className='ml-2 flex flex-col space-y-4 md:mx-4 lg:mx-8'>
              <h1 className='max-w-xl text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl'>
                Browse variety of inspirations,{" "}
                <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
                  fliers and ideas
                </span>
              </h1>
              {/* <p className="text-base md:text-lg text-center max-w-xl text-muted-foreground leading-relaxed">
              {description}
            </p> */}
            </div>
          </div>
        </main>
        <TemplateGridAll />
      </div>
      <LandingFooter />
    </div>
  );
}
