"use client";

import { useEffect, useRef } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import withAuth from "@/helper/hoc/withAuth";
import { Toaster } from "@/components/ui/sonner";
import SettingsHome from "@/components/user-settings/settingsHome";

function SettingsPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add the font link to the document head
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add the font styles
    const style = document.createElement("style");
    style.textContent = `
      * {
        font-family: 'Source Sans Pro';
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the added elements when component unmounts
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="flex relative w-full h-[100dvh] overflow-hidden bg-white dark:bg-black">
      <Toaster />
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
          <SettingsHome />
        </div>
      </div>
    </div>
  );
}
// Export the component wrapped with authentication
export default withAuth(SettingsPage);
