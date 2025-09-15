"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MainContent } from "@/components/layout/main-content";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { useRef } from "react";
import withAuth from "@/helper/hoc/withAuth";

function ChatPageForAuthenticatedUsers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex relative w-full h-screen overflow-hidden bg-white dark:bg-black">
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container"
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <div
          id="main-content"
          className="flex-1"
          style={{
            // Optimize rendering performance
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
