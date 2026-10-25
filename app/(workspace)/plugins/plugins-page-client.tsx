"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { PluginsCatalog } from "@/components/plugins/plugins-catalog";
import { useUserContext } from "@/context/AuthenticatedContext";

export function PluginsPageClient() {
  const { user, loading } = useUserContext();
  const authenticated = !loading && Boolean(user);

  if (!authenticated) {
    return (
      <div className='min-h-screen w-full bg-white dark:bg-black'>
        <LandingNavbar />
        <main className='w-full overflow-x-clip px-2 md:px-4'>
          <PluginsCatalog publicView />
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div
      id='main-content'
      className='ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
    >
      <PluginsCatalog />
    </div>
  );
}
