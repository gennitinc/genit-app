"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoCommunityTab, ImageCommunityTab, DesignsCommunityTab } from "@/components/inspire";
import { Video, Image as ImageIcon } from "lucide-react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { useRouter } from "next/navigation";
import CommunityComp from "@/components/landing/CommunityComp";

export default function CommunityPage() {
  

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <LandingPageBanner />
      <LandingNavbar />
      <main className="flex-grow relative bg-background">
        <div className="absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <div className="w-full mx-auto px-4 sm:px-6 py-8 lg:mt-10">
          <div className="space-y-4 flex flex-col ml-2 md:mx-4 lg:mx-8 items-center justify-center">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl max-w-xl text-center">
              Explore community creations,{" "}
            </h1>
            <p className="text-normal text-sm text-muted-foreground leading-relaxed max-w-2xl text-center">
              Discover amazing AI-generated videos and images created by our
              community.
            </p>
          </div>
        </div>
      </main>
      <CommunityComp />
      <LandingFooter />
    </div>
  );
}
