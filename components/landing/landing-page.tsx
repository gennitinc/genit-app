"use client";
import { IdeaSection } from "../layout/idea-section";
import { LandingNavbar } from "./landing-navbar";
import { LandingFooter } from "./landing-footer";
import PartnerLogos from "./Partners-Logos";
// import Communityproject from "../layout/community-project";
import { useEffect, useState } from "react";
import TemplateGrid from "../common/templateGrid";
import { Toaster } from "@/components/ui/sonner";

export function LandingPage() {
  const [showBanner, setShowBanner] = useState<boolean>(true);
  

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("lp_banner_dismissed");
      if (dismissed === "true") setShowBanner(false);
    } catch (_) {}
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    try {
      localStorage.setItem("lp_banner_dismissed", "true");
    } catch (_) {}
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <Toaster />
      {showBanner && (
        <div className="relative flex items-center justify-center font-medium py-2 bg-gradient-to-r from-violet-500 via-[#560280] to-[#E0724A] text-sm text-white">
          <p>
            Exclusive Price Drop! Hurry, 🎉{" "}
            <span className="underline underline-offset-2 text-sm">
              Offer Ends Soon!
            </span>
          </p>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss banner"
            className="absolute right-3 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
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
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-20 py-8">
          <IdeaSection />
        </div>
      </main>
      <TemplateGrid />
      <PartnerLogos />
      <LandingFooter />
    </div>
  );
}
