"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import ReferralDashboard from "@/components/referral/referral-dashboard";
import { Toaster } from "@/components/ui/sonner";
import withAuth from "@/helper/hoc/withAuth";
import { useEffect, useRef } from "react";

function ReferralPage() {
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
          className='flex-1 rounded-t-4xl border-2'
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
