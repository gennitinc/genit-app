"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MainContent } from "@/components/layout/main-content";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { useRef } from "react";
import withAuth from "@/helper/hoc/withAuth";
import { Toaster } from "@/components/ui/sonner";

function ChatPageForAuthenticatedUsers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    // <div className="flex relative w-full h-screen overflow-hidden bg-white dark:bg-black">
    //   <Toaster />
    //   <AppSidebar />
    //   <div
    //     ref={scrollContainerRef}
    //     className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container"
    //   >
    //     <TopNavWithAurora
    //       scrollContainerRef={
    //         scrollContainerRef as React.RefObject<HTMLDivElement>
    //       }
    //     />
    //     <div
    //       id="main-content"
    //       className="flex-1"
    //       style={{
    //         // Optimize rendering performance
    //         transform: "translateZ(0)",
    //         willChange: "transform",
    //       }}
    //     >
    //       <MainContent />
    //     </div>
    //   </div>
    // </div>
    <div className="flex relative w-full h-screen overflow-hidden">
      <Toaster />
      <AppSidebar />

      <div className="flex flex-col w-full h-screen overflow-hidden">
        <TopNavWithAurora />

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-auto will-change-scroll"
        >
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default withAuth(ChatPageForAuthenticatedUsers);
