"use client";

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "../ai-elements/web-preview";
import AutomationWorkflow from "../automation";
import genittWorkflow from "../workflow";
import { GraphicsCanvas } from "./graphics-canvas";
import { useProjectDesign } from "@/context/DesignProject";
import {
  Globe,
  Image as ImageIcon,
  Layout,
  Loader2,
  Maximize2,
  Minimize2,
  Settings,
  Workflow,
} from "lucide-react";
import React from "react";

export const PreviewPanel = ({
  isFullscreen,
  onToggleFullscreen,
}: {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}) => {
  const { project } = useProjectDesign();
  const isAutomation = project?.category === "automation";
  const isGraphics =
    project?.category === "flier" ||
    project?.category === "image" ||
    project?.category === "instagram_post" ||
    project?.category === "poster" ||
    project?.category === "youtube_thumbnail" ||
    project?.category === "facebook_post" ||
    project?.category === "facebook_cover" ||
    project?.category === "banner" ||
    project?.category === "logo" ||
    project?.category === "presentation" ||
    project?.category === "auto" ||
    project?.category === "generic_design";

  return (
    <>
      <PreviewPanelContent
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />
      {onToggleFullscreen && !isAutomation && !isGraphics && (
        <button
          onClick={onToggleFullscreen}
          className='border-border/50 bg-background/80 text-foreground hover:bg-accent absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-md border shadow-sm backdrop-blur'
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className='h-4 w-4' />
          ) : (
            <Maximize2 className='h-4 w-4' />
          )}
        </button>
      )}
    </>
  );
};

const PreviewPanelContent = ({
  isFullscreen,
  onToggleFullscreen,
}: {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}) => {
  const { project, isLoadingProject } = useProjectDesign();

  React.useEffect(() => {
    if (project) {
    }
  }, [project]);

  if (isLoadingProject) {
    return (
      <div className='bg-muted/10 flex h-full flex-col items-center justify-center gap-4'>
        <Loader2 className='text-primary h-8 w-8 animate-spin' />
        <p className='text-muted-foreground animate-pulse text-sm'>
          Loading preview...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className='bg-muted/5 flex h-full flex-col items-center justify-center gap-4 opacity-50'>
        <Layout className='text-muted-foreground h-12 w-12' />
        <p className='text-muted-foreground text-sm font-medium'>
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
    project.category === "auto" ||
    project.category === "generic_design";

  const isWebsite =
    project.category?.includes("website") ||
    project.category?.includes("landing");

  const isAutomation = project.category === "automation";

  if (isAutomation) {
    return (
      <div className='bg-muted/5 flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 p-0 dark:border-zinc-800/50'>
        <div className='relative min-h-0 flex-1'>
          <AutomationWorkflow
            slug={project._id}
            embedMode={true}
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        </div>
      </div>
    );
  }

  if (isWebsite) {
    // We expect website data to be in messages or a specific field
    // For now, let's just show the default WebPreview
    return (
      <div className='bg-muted/20 flex h-full flex-col rounded-3xl border border-zinc-200 p-4 py-4 shadow-2xl dark:border-zinc-800/50'>
        <div className='mb-4 flex items-center gap-2 px-2 py-1'>
          <Globe className='text-primary h-4 w-4' />
          <span className='text-sm font-semibold'>Website Preview</span>
        </div>
        <WebPreview className='flex-1 overflow-hidden rounded-xl border-none bg-white shadow-2xl'>
          <WebPreviewNavigation />
          <WebPreviewBody />
        </WebPreview>
      </div>
    );
  }

  if (isGraphics) {
    return (
      <div className='bg-muted/5 flex h-full w-full flex-col overflow-hidden rounded-3xl border border-zinc-200 p-0 dark:border-zinc-800/50'>
        <div className='relative h-full min-h-0 w-full flex-1'>
          <GraphicsCanvas
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className='bg-muted/5 flex h-full flex-col items-center justify-center rounded-3xl border border-zinc-200 py-4 shadow-2xl dark:border-zinc-800/50'>
      <div className='max-w-md space-y-4 text-center'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700/10'>
          <ImageIcon className='text-primary h-8 w-8' />
        </div>
        <h3 className='text-xl font-bold'>Interactive Preview Coming Soon</h3>
        <p className='text-muted-foreground text-sm'>
          We are building the perfect workspace for "{project.category}"
          projects. Expect a world-class canvas experience very soon!
        </p>
      </div>
    </div>
  );
};
