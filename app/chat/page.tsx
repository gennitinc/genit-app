"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MainContent } from "@/components/layout/main-content";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Toaster } from "@/components/ui/sonner";
import withAuth from "@/helper/hoc/withAuth";
import { useRef } from "react";

function ChatPageForAuthenticatedUsers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
