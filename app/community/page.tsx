"use client";

import CategoryAndSearch from "@/components/common/category-and-search";
import CommunityComp from "@/components/landing/CommunityComp";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function CommunityPage() {
  const { t } = useLanguage();
  return (
    <div className='flex min-h-screen w-full flex-col bg-white dark:bg-black'>
      <LandingPageBanner />
      <LandingNavbar />
      <main className='relative flex-grow'>
        {/* <div className='absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_40%,transparent_100%)] bg-[size:48px_48px]'></div> */}
        <div className='mx-auto w-full px-4 py-8 sm:px-6 lg:mt-10'>
          <div className='ml-2 flex flex-col items-center justify-center space-y-4 md:mx-4 lg:mx-8'>
            <h1 className='max-w-xl text-center text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl'>
              {t("Explore community creations,")}{" "}
            </h1>
            <p className='text-normal text-muted-foreground max-w-2xl text-center text-sm leading-relaxed'>
              {t(
                "Discover amazing AI-generated videos and images created by our community."
              )}
            </p>
            <CategoryAndSearch
              destination='/community'
              placeholder='Search community creations...'
            />
          </div>
        </div>
      </main>
      <CommunityComp />
      <LandingFooter />
    </div>
  );
}
