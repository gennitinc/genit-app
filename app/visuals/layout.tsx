"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Toaster } from "@/components/ui/toaster";
import { VisualsSidebar } from "@/components/visuals/visuals-sidebar";
import withAuth from "@/helper/hoc/withAuth";

function VisualsLayout({
  children,
}: {
  children: React.ReactNode;
  //new
}) {
  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div className='scroll-container flex flex-1 flex-col overflow-x-hidden overflow-y-auto will-change-scroll'>
        <TopNavWithAurora />

        <div
          id='main-content'
          className='mr-2 ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
        >
          <div className='mx-auto w-full max-w-[100rem] space-y-8 px-2 pb-16 md:px-4 lg:px-6'>
            <div className='flex h-full w-full flex-col items-start gap-8 pt-4 sm:pt-6 lg:flex-row'>
              <VisualsSidebar />

              <div className='w-full max-w-full flex-grow overflow-hidden'>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(VisualsLayout);
