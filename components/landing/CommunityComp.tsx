"use client";

import {
  DesignsCommunityTab,
  ImageCommunityTab,
  VideoCommunityTab,
} from "@/components/inspire";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommunityComp() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"video" | "image" | "designs">(
    "designs"
  );

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
    // This is a placeholder - in the community page, we don't need to switch tabs
    // The tab change is handled by the Tabs component
  };

  return (
    <div className='container mx-auto flex min-h-screen w-full flex-col bg-white px-2 py-8 dark:bg-black'>
      <div className=''>
        <div className='mb-8 w-full'>
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              // Use requestAnimationFrame to prevent hanging
              requestAnimationFrame(() => {
                setActiveTab(v as "video" | "image" | "designs");
              });
            }}
            className='w-full'
          >
            <div className='sticky top-0 z-10 mb-2 flex w-full items-end justify-between bg-white pt-2 pb-2 dark:bg-black'>
              <div className='flex flex-row items-center gap-1'>
                {" "}
                <Compass />
                <span className='text-sm font-normal sm:text-base md:text-xl lg:text-2xl'>
                  Discover
                </span>{" "}
              </div>

              <TabsList className='grid w-fit grid-cols-3'>
                <TabsTrigger
                  value='designs'
                  className='flex items-center gap-2'
                >
                  Designs
                </TabsTrigger>
                <TabsTrigger value='video' className='flex items-center gap-2'>
                  Videos
                </TabsTrigger>
                <TabsTrigger value='image' className='flex items-center gap-2'>
                  Images
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='video' className='mt-0'>
              <VideoCommunityTab
                onPromptSelect={handlePromptSelect}
                onTabChange={handleTabChange}
              />
            </TabsContent>

            <TabsContent value='designs' className='mt-0'>
              <DesignsCommunityTab
                onPromptSelect={handlePromptSelect}
                onTabChange={handleTabChange}
              />
            </TabsContent>

            <TabsContent value='image' className='mt-0'>
              <ImageCommunityTab
                onPromptSelect={handlePromptSelect}
                onTabChange={handleTabChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
