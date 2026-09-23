"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MainContent } from "@/components/layout/main-content";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Toaster } from "@/components/ui/sonner";
import withAuth from "@/helper/hoc/withAuth";
import { DESIGN_TYPES } from "@/lib/design-types";
import { apiResponse } from "@/utils/apiResponse";
import { useEffect, useRef } from "react";

function ChatPageForAuthenticatedUsers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrapeStartedRef = useRef(false);

  const ScrapePinterest = async () => {
    if (scrapeStartedRef.current) return;
    scrapeStartedRef.current = true;

    const designType =
      DESIGN_TYPES[Math.floor(Math.random() * DESIGN_TYPES.length)];

    void apiResponse
      .get(
        `/designinspirations/scrape/pins/search?q=${encodeURIComponent(designType)}&limit=30&category=${designType}`
      )
      .catch((error) => console.error("Failed to scrape Pinterest:", error));
  };

  useEffect(() => {
    ScrapePinterest();
  }, []);

  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className='scroll-container flex flex-1 flex-col overflow-auto will-change-scroll'
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <div
          id='main-content'
          className='mr-2 ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default withAuth(ChatPageForAuthenticatedUsers);
