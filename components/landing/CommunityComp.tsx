"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  VideoCommunityTab,
  ImageCommunityTab,
  DesignsCommunityTab,
} from "@/components/inspire";

import { useRouter } from "next/navigation";

export default function CommunityComp() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"video" | "image" | "designs">(
    "video"
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
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <div className="md:px-12 lg:px-20 xl:px-24">
        <div className="mb-8 w-full">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              // Use requestAnimationFrame to prevent hanging
              requestAnimationFrame(() => {
                setActiveTab(v as "video" | "image" | "designs");
              });
            }}
            className="w-full"
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-black pb-2 pt-2 mb-6 w-full flex justify-center">
              <TabsList className="grid w-fit grid-cols-3 mt-2 ml-4">
                <TabsTrigger value="video" className="flex items-center gap-2">
                  Videos
                </TabsTrigger>
                <TabsTrigger
                  value="designs"
                  className="flex items-center gap-2"
                >
                  Designs
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  Images
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="video" className="mt-0">
              <VideoCommunityTab
                onPromptSelect={handlePromptSelect}
                onTabChange={handleTabChange}
              />
            </TabsContent>

            <TabsContent value="designs" className="mt-0">
              <DesignsCommunityTab
                onPromptSelect={handlePromptSelect}
                onTabChange={handleTabChange}
              />
            </TabsContent>

            <TabsContent value="image" className="mt-0">
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
