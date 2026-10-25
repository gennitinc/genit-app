"use client";

import { VisualsSidebar } from "@/components/visuals/visuals-sidebar";

function VisualsLayout({
  children,
}: {
  children: React.ReactNode;
  //new
}) {
  return (
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
  );
}

export default VisualsLayout;
