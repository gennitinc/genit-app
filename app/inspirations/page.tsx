// "use client";
import type { Metadata } from "next";
import Banner from "@/components/common/banner";
import TemplateGridAll from "@/components/common/templateGridAll";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { IdeaSection } from "@/components/layout/idea-section";
// import Communityproject from "../layout/community-project";
import { motion } from "framer-motion";

export const metadata: Metadata = {
  title: "Inspirations – Gennit AI | Browse Design Templates & Ideas",
  description:
    "Explore thousands of design inspirations, templates, flyers, and creative ideas. Get inspired by professional designs and start creating with Gennit AI.",
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
    title: "Inspirations – Gennit AI",
    description:
      "Browse professional design templates and creative inspirations",
    url: "https://www.gennit.online/inspirations",
    images: [
      {
        url: "https://www.gennit.online/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Gennit AI Inspirations",
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
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <LandingPageBanner />
      <LandingNavbar />
      <div className=" hidden">
        <div className="flex p-3 items-center bg-primary-surface text-primary banner-launch-week-02-2025-03-10 py-4 relative pr-8 rounded-none z-10">
          <div className="flex space-y-2 flex-col items-center md:flex-row md:justify-center md:space-y-0 md:space-x-1 w-full">
            <div className="flex space-x-2 items-center">
              <p className="text-sm text-center  font-medium hidden md:block">
                We release updates swiftly. Be sure to check out the changelogs
                page!
              </p>
              <p className="text-sm text-center font-medium md:hidden">
                We release updates swiftly.
              </p>
            </div>
            <a
              href="https://railway.com/launch-week-02"
              target="_blank"
              rel="noreferrer"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 underline hover:text-pink-600"
            >
              <p className="text-sm hidden md:block">View Details</p>
              <p className="text-sm md:hidden">View changelogs</p>
            </a>
          </div>
          <div className="absolute right-6 top-0 bottom-0 flex items-center">
            <div
              className="icon-container icon-md text-2xl !w-4 !h-4 text-foreground cursor-pointer"
              aria-hidden="true"
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow relative bg-background">
        <div className="absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <div className="w-full mx-auto px-4 sm:px-6 py-8 mt-20">
          <div className="space-y-4 flex flex-col ml-2 md:mx-4 lg:mx-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl max-w-xl">
              Browse variety of inspirations,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
      <LandingFooter />
    </div>
  );
}
