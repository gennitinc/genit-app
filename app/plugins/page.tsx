"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { PluginsCatalog } from "@/components/plugins/plugins-catalog";
import { Toaster } from "@/components/ui/toaster";
import withAuth from "@/helper/hoc/withAuth";

function PluginsPage() {
  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div className='scroll-container flex flex-1 flex-col overflow-x-hidden overflow-y-auto will-change-scroll'>
        <TopNavWithAurora />
        <main
          id='main-content'
          className='ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
        >
          <PluginsCatalog />
        </main>
      </div>
    </div>
  );
}

export default withAuth(PluginsPage);
