"use client";

import React from "react";
import { useProjectDesign } from "@/context/DesignProject";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "../ai-elements/web-preview";
import { Loader2, Globe, Layout, Image as ImageIcon } from "lucide-react";
import { GraphicsCanvas } from "./graphics-canvas";

export const PreviewPanel = () => {
  const { project, isLoadingProject } = useProjectDesign();

  React.useEffect(() => {
    if (project) {
      console.log("[PreviewPanel] Project Category used for branch choice:", project.category);
    }
  }, [project]);

  if (isLoadingProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-muted/10">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading preview...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-muted/5 opacity-50">
        <Layout className="w-12 h-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground font-medium">
          Select a project to see preview
        </p>
      </div>
    );
  }

  // Determine which preview to show
  // We'll treat 'ai-image-gen', 'fliers', 'posters', 'logos' as graphics
const isGraphics =
  project.category === "flier" ||
  project.category === "image" ||
  project.category === "instagram_post" ||
  project.category === "poster" ||
  project.category === "youtube_thumbnail" ||
  project.category === "facebook_post" ||
  project.category === "facebook_cover" ||
  project.category === "banner" ||
  project.category === "logo" ||
  project.category === "presentation" ||
  project.category === "generic_design";

  const isWebsite =
    project.category?.includes("website") ||
    project.category?.includes("landing");

  if (isWebsite) {
    // We expect website data to be in messages or a specific field
    // For now, let's just show the default WebPreview
    return (
      <div className="h-full flex flex-col p-4 bg-muted/20 py-4 shadow-2xl border border-zinc-200 dark:border-zinc-800/50 rounded-3xl">
        <div className="flex items-center gap-2 mb-4 px-2 py-1">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Website Preview</span>
        </div>
        <WebPreview className="flex-1 shadow-2xl border-none overflow-hidden rounded-xl bg-white">
          <WebPreviewNavigation />
          <WebPreviewBody />
        </WebPreview>
      </div>
    );
  }

  if (isGraphics) {
    return <GraphicsCanvas />;
  }

  // Default fallback
  return (
    <div className="h-full flex flex-col items-center justify-center bg-muted/5 py-4 shadow-2xl border border-zinc-200 dark:border-zinc-800/50 rounded-3xl">
      <div className="max-w-md text-center space-y-4">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <ImageIcon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Interactive Preview Coming Soon</h3>
        <p className="text-muted-foreground text-sm">
          We are building the perfect workspace for "{project.category}"
          projects. Expect a world-class canvas experience very soon!
        </p>
      </div>
    </div>
  );
};
