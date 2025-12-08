"use client";
import { IdeaSection } from "../layout/idea-section";
import { LandingNavbar } from "./landing-navbar";
import { LandingFooter } from "./landing-footer";
import PartnerLogos from "./Partners-Logos";
// import Communityproject from "../layout/community-project";

import TemplateGrid from "../common/templateGrid";
import { Toaster } from "@/components/ui/sonner";
import LandingPageBanner from "./landing-banner";

export function LandingPage() {
  
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <Toaster />
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

      <main className="flex-grow relative">
        <div className="absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-20 py-8 pb-4">
          <IdeaSection />
        </div>
      </main>
      <div className="lg:px-20 xl:px-24">
        <TemplateGrid />
      </div>
      <PartnerLogos />
      <LandingFooter />
    </div>
  );
}
