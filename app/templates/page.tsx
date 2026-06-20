"use client";

import { ImageTemplatesTab, VideoTemplatesTab } from "@/components/inspire";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TemplatesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"video" | "image">("video");

  const handlePromptSelect = (prompt: string) => {
    // Redirect to create page with the prompt
    if (activeTab === "video") {
      router.push(
        `/inspire/create?mode=ai-video-gen&prompt=${encodeURIComponent(prompt)}`
      );
    } else {
      router.push(
        `/inspire/create?mode=ai-image-gen&prompt=${encodeURIComponent(prompt)}`
      );
    }
  };

  const handleTabChange = () => {
    // This is a placeholder - in the templates page, we don't need to switch tabs
    // The tab change is handled by the Tabs component
  };

  return (
    <div className='flex min-h-screen w-full flex-col bg-white dark:bg-black'>
      <LandingPageBanner />
      <LandingNavbar />

      <div className='md:px-12 lg:px-20 xl:px-24'>
        <main className='bg-background relative flex-grow'>
          <div className='absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_40%,transparent_100%)] bg-[size:48px_48px]'></div>
          <div className='mx-auto mt-20 w-full px-4 py-8 sm:px-6'>
            <div className='ml-2 flex flex-col space-y-4 md:mx-4 lg:mx-8'>
              <h1 className='max-w-xl text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl'>
                Browse templates,{" "}
                <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
                  start creating
                </span>
              </h1>
              <p className='text-normal text-muted-foreground max-w-2xl text-sm leading-relaxed'>
                Choose from professionally crafted templates.
              </p>
            </div>
          </div>
        </main>

        <div className='pb-8'>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "video" | "image")}
            className='w-full'
          >
            <TabsList className='mt-2 mb-6 ml-4 grid w-fit max-w-md grid-cols-2'>
              <TabsTrigger value='video' className='flex items-center gap-2'>
                Videos
              </TabsTrigger>
              <TabsTrigger value='image' className='flex items-center gap-2'>
                Images
              </TabsTrigger>
            </TabsList>

            <TabsContent value='video' className='mt-0'>
              <VideoTemplatesTab
                onPromptSelect={handlePromptSelect}
                onTabChange={handleTabChange}
              />
            </TabsContent>

            <TabsContent value='image' className='mt-0'>
              <ImageTemplatesTab
                onPromptSelect={handlePromptSelect}
                onTabChange={handleTabChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
