"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  ArrowLeft,
  Sparkles,
  Video,
  Mic,
  Play,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import withAuth from "@/helper/hoc/withAuth";
import { PresenterSelector } from "@/components/video/presenter-selector";
import { ResolutionSelector } from "@/components/video/resolution-selector";
import { VoiceSelector } from "@/components/video/voice-selector";
import { ScriptEditor } from "@/components/video/script-editor";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export type Resolution = "1080p" | "720p" | "480p" | "4K";
export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3";

export interface Presenter {
  id: string;
  name: string;
  image: string;
  category: "popular" | "new";
  gender?: "male" | "female";
}

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: "male" | "female";
  accent?: string;
}

function VideoCreatePage() {
  const router = useRouter();
  const { user } = useUserContext();
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [selectedPresenter, setSelectedPresenter] = useState<Presenter | null>(
    null
  );
  const [selectedResolution, setSelectedResolution] =
    useState<Resolution>("1080p");
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatio>("16:9");
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCloningVoice, setIsCloningVoice] = useState(false);
  const [clonedVoiceId, setClonedVoiceId] = useState<string | null>(null);

  // Calculate aspect ratio for preview
  const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case "16:9":
        return "aspect-video"; // 16:9
      case "9:16":
        return "aspect-[9/16]"; // 9:16 (vertical)
      case "1:1":
        return "aspect-square"; // 1:1
      case "4:3":
        return "aspect-[4/3]"; // 4:3
      default:
        return "aspect-video";
    }
  };

  useEffect(() => {
    // Set default presenter if none selected
    if (!selectedPresenter) {
      setSelectedPresenter({
        id: "presenter-1",
        name: "Sarah",
        image: "/api/placeholder/400/600",
        category: "popular",
        gender: "female",
      });
    }
  }, [selectedPresenter]);

  const handleGenerateVideo = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }

    if (!selectedPresenter) {
      toast({
        title: "Presenter Required",
        description: "Please select a presenter to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!script.trim()) {
      toast({
        title: "Script Required",
        description: "Please write a script for your video.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVoice && !clonedVoiceId) {
      toast({
        title: "Voice Required",
        description: "Please select a voice or clone your own voice.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const videoData = {
        presenterId: selectedPresenter.id,
        resolution: selectedResolution,
        aspectRatio: selectedAspectRatio,
        voiceId: selectedVoice?.id || clonedVoiceId,
        script: script.trim(),
        userId: user._id,
      };

      // TODO: Call API to generate video
      // const response = await fetch("/api/video/generate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(videoData),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Video Generation Started",
        description:
          "Your video is being generated. This may take a few minutes.",
      });

      // Navigate to video editor/preview page
      // router.push(`/video/${response.data.videoId}`);
    } catch (error: any) {
      console.error("Failed to generate video:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex relative w-full h-[100dvh] overflow-hidden bg-white dark:bg-black">
      <Toaster />
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container"
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <div
          id="main-content"
          className="flex-1"
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Create AI Video</h1>
                  <p className="text-sm text-muted-foreground">
                    Generate professional videos with AI-powered presenters
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel - Configuration */}
              <div className="lg:col-span-1 space-y-6">
                {/* Presenter Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pick a Presenter</CardTitle>
                    <CardDescription>
                      Choose an AI avatar to present your video
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PresenterSelector
                      selectedPresenter={selectedPresenter}
                      onSelectPresenter={setSelectedPresenter}
                    />
                  </CardContent>
                </Card>

                {/* Resolution & Aspect Ratio */}
                <Card>
                  <CardHeader>
                    <CardTitle>Video Settings</CardTitle>
                    <CardDescription>
                      Choose resolution and aspect ratio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResolutionSelector
                      selectedResolution={selectedResolution}
                      selectedAspectRatio={selectedAspectRatio}
                      onResolutionChange={setSelectedResolution}
                      onAspectRatioChange={setSelectedAspectRatio}
                    />
                  </CardContent>
                </Card>

                {/* Voice Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Settings</CardTitle>
                    <CardDescription>
                      Select a voice or clone your own
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VoiceSelector
                      selectedVoice={selectedVoice}
                      clonedVoiceId={clonedVoiceId}
                      onSelectVoice={setSelectedVoice}
                      onCloneVoice={(voiceId) => {
                        setClonedVoiceId(voiceId);
                        setSelectedVoice(null);
                      }}
                      isCloning={isCloningVoice}
                      onCloningChange={setIsCloningVoice}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Preview & Script */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                      Preview your video ({selectedAspectRatio} -{" "}
                      {selectedResolution})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={cn(
                        "relative w-full bg-black rounded-lg overflow-hidden flex items-center justify-center border-2 border-border",
                        getAspectRatioClass(selectedAspectRatio)
                      )}
                    >
                      {selectedPresenter ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background">
                          <div className="text-center space-y-4">
                            <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                              <Video className="w-12 h-12 text-primary" />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-foreground">
                                {selectedPresenter.name}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedAspectRatio} • {selectedResolution}
                              </p>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-background/50 backdrop-blur-sm"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <Video className="w-16 h-16 text-muted-foreground mx-auto" />
                          <p className="text-sm text-muted-foreground">
                            Select a presenter to see preview
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Script Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle>Script</CardTitle>
                    <CardDescription>
                      Write or generate your video script
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScriptEditor
                      script={script}
                      onScriptChange={setScript}
                      onGenerateScript={(prompt) => {
                        // TODO: Call AI to generate script
                        toast({
                          title: "Generating Script",
                          description: "AI is writing your script...",
                        });
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Generate Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleGenerateVideo}
                    disabled={
                      isGenerating || !selectedPresenter || !script.trim()
                    }
                    size="lg"
                    className="min-w-[200px]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(VideoCreatePage);
