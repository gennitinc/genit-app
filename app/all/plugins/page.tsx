import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { PluginsCatalog } from "@/components/plugins/plugins-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plugins - Genit AI",
  description: "Explore the tools and platforms that connect with Genit.",
};

export default function AllPluginsPage() {
  return (
    <div className='min-h-screen w-full bg-white dark:bg-black'>
      <LandingNavbar />
      <main className='w-full overflow-x-hidden px-2 md:px-4'>
        <PluginsCatalog publicView />
      </main>
      <LandingFooter />
    </div>
  );
}
