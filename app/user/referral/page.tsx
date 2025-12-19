"use client";

import { useEffect, useRef } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import withAuth from "@/helper/hoc/withAuth";
import { Toaster } from "@/components/ui/sonner";
import ReferralDashboard from "@/components/referral/referral-dashboard";

function ReferralPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <ReferralDashboard />
        </div>
      </div>
    </div>
  );
}

export default withAuth(ReferralPage);

