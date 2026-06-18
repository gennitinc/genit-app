import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Toaster } from "@/components/ui/toaster";
import { VisualsSidebar } from "@/components/visuals/visuals-sidebar";

export default function VisualsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div className='scroll-container flex flex-1 flex-col overflow-x-hidden overflow-y-auto will-change-scroll'>
        <TopNavWithAurora />

        <div
          id='main-content'
          className="flex-1 rounded-t-2xl lg:border-2 lg:border-b-0 ml-0 mr-2 md:mr-4"
        >
          <div className='mx-auto w-full max-w-[100rem] space-y-8 px-2 sm:px-6 pb-16'>
            <div className="w-full h-full flex flex-col md:flex-row gap-8 pt-4 sm:pt-6">
              <VisualsSidebar />
              <div className="flex-grow w-full max-w-full overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
