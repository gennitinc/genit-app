"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoCommunityTab, ImageCommunityTab } from "@/components/inspire";
import { Video, Image as ImageIcon } from "lucide-react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { useRouter } from "next/navigation";

export default function CommunityPage() {
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
    // This is a placeholder - in the community page, we don't need to switch tabs
    // The tab change is handled by the Tabs component
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <LandingPageBanner />
      <LandingNavbar />

      <div className="md:px-12 lg:px-20 xl:px-24">
        <main className="flex-grow relative bg-background">
          <div className="absolute inset-0 -z-10 size-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
          <div className="w-full mx-auto px-4 sm:px-6 py-8 lg:mt-20">
            <div className="space-y-4 flex flex-col ml-2 md:mx-4 lg:mx-8">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl max-w-xl">
                Explore community creations,{" "}
              </h1>
              <p className="text-normal text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Discover amazing AI-generated videos and images created by our
                community.
              </p>
            </div>
          </div>
        </main>

        <div className="b-8">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              // Use requestAnimationFrame to prevent hanging
              requestAnimationFrame(() => {
                setActiveTab(v as "video" | "image");
              });
            }}
            className="w-full"
          >
            <div className="sticky top-0 z-50 bg-white dark:bg-black pb-2 pt-2 mb-6">
              <TabsList className="grid w-fit max-w-md grid-cols-2 mt-2 ml-4">
                <TabsTrigger value="video" className="flex items-center gap-2">
                  Videos
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

            <TabsContent value="image" className="mt-0">
              <ImageCommunityTab
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
