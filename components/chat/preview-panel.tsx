"use client";

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "../ai-elements/web-preview";
import AutomationWorkflow from "../automation";
import GenittWorkflow from "../workflow";
import { GraphicsCanvas } from "./graphics-canvas";
import { Button } from "@/components/ui/button";
import { useProjectDesign } from "@/context/DesignProject";
import type { CanvasPreviewType } from "@/lib/chat-preview";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  Download,
  Eye,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Layout,
  Maximize2,
  Minimize2,
} from "lucide-react";
import React from "react";

export const PreviewPanel = ({
  previewType,
  isFullscreen,
  onToggleFullscreen,
}: {
  previewType: CanvasPreviewType | "website" | null;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}) => {
  const { artifactPreview } = useProjectDesign();

  return (
    <>
      <PreviewPanelContent
        previewType={previewType}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />
      {onToggleFullscreen &&
        !artifactPreview &&
        previewType !== "automation" &&
        previewType !== "graphics" && (
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
  previewType,
  isFullscreen,
  onToggleFullscreen,
}: {
  previewType: CanvasPreviewType | "website" | null;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}) => {
  const { artifactPreview, project, isLoadingProject } = useProjectDesign();
  const [artifactReloadKey, setArtifactReloadKey] = React.useState(0);

  if (isLoadingProject) {
    return (
      <div className='bg-muted/90 flex h-full w-full items-center justify-center rounded-3xl border border-zinc-200 shadow-2xl dark:border-zinc-800/50'>
        <LoadingFileLoader />
      </div>
    );
  }

  if (!project) {
    return (
      <div className='bg-muted/90 flex h-full flex-col items-center justify-center gap-4 opacity-50'>
        <Layout className='text-muted-foreground h-12 w-12' />
        <p className='text-muted-foreground text-sm font-medium'>
          Select a project to see preview
        </p>
      </div>
    );
  }

  if (artifactPreview) {
    return (
      <WebPreview
        key={artifactPreview.url}
        defaultUrl={artifactPreview.url}
        className='min-h-0 overflow-hidden rounded-3xl border border-zinc-200 bg-muted/90 shadow-2xl dark:border-zinc-800/50'
      >
        <WebPreviewNavigation className='bg-background/95 grid h-12 shrink-0 grid-cols-[1fr_minmax(12rem,28rem)_1fr] items-center gap-3 px-4 py-1 backdrop-blur-sm'>
          <div className='flex min-w-0 items-center gap-2'>
            <div className='flex items-center space-x-1.5 px-2'>
              <span className='h-2 w-2 rounded-full bg-red-400' />
              <span className='h-2 w-2 rounded-full bg-yellow-400' />
              <span className='h-2 w-2 rounded-full bg-green-400' />
            </div>
            <span className='truncate text-sm font-semibold'>Document</span>
          </div>

          <WebPreviewUrl
            readOnly
            aria-label='Document URL'
            className='bg-muted/900 h-7 w-80 rounded-md border-0 px-3 text-center text-xs shadow-none'
          />

          <div className='bg-background/80 border-border ml-auto flex items-center gap-1 rounded-md border p-1 shadow-sm backdrop-blur-sm'>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-foreground h-7 gap-1.5 rounded-md px-2 text-xs'
              onClick={() => setArtifactReloadKey((value) => value + 1)}
            >
              <Eye className='h-3.5 w-3.5' />
              Preview
            </Button>
            {onToggleFullscreen && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onToggleFullscreen}
                className={cn(
                  "text-muted-foreground hover:text-foreground h-7 w-7 rounded-md p-0",
                  isFullscreen && "bg-muted text-foreground"
                )}
                title={isFullscreen ? "Exit fullscreen" : "Enlarge"}
              >
                {isFullscreen ? (
                  <Minimize2 className='h-3.5 w-3.5' />
                ) : (
                  <Maximize2 className='h-3.5 w-3.5' />
                )}
              </Button>
            )}
            <Button asChild variant='ghost' size='sm' className='h-7 w-7 rounded-md p-0'>
              <a href={artifactPreview.url} target='_blank' rel='noreferrer' title='Open'>
                <ExternalLink className='h-3.5 w-3.5' />
              </a>
            </Button>
            {artifactPreview.downloadUrl && (
              <Button asChild variant='ghost' size='sm' className='h-7 w-7 rounded-md p-0'>
                <a href={artifactPreview.downloadUrl} download={artifactPreview.fileName} title='Download'>
                  <Download className='h-3.5 w-3.5' />
                </a>
              </Button>
            )}
          </div>
        </WebPreviewNavigation>
        <WebPreviewBody key={artifactReloadKey} />
      </WebPreview>
    );
  }

  if (previewType === "automation") {
    return (
      <div className='bg-muted/90 flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 p-0 shadow-2xl dark:border-zinc-800/50'>
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

  if (previewType === "workflow") {
    return (
      <div className='bg-muted/90 flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 p-0 shadow-2xl dark:border-zinc-800/50'>
        <div className='relative min-h-0 flex-1'>
          <GenittWorkflow slug={project._id} embedMode={true} />
        </div>
      </div>
    );
  }

  if (previewType === "website") {
    // We expect website data to be in messages or a specific field
    // For now, let's just show the default WebPreview
    return (
      <div className='flex h-full flex-col rounded-3xl border border-zinc-200 p-4 py-2 bg-muted/90 shadow-2xl dark:border-zinc-800/50'>
        <div className='mb-4 flex items-center gap-2 px-2 py-1'>
          <Globe className='text-primary h-4 w-4' />
          <span className='text-sm font-semibold'>Website Preview</span>
        </div>
        <WebPreview className='flex-1 overflow-hidden rounded-xl border-none bg-muted/90 shadow-2xl'>
          <WebPreviewNavigation />
          <WebPreviewBody />
        </WebPreview>
      </div>
    );
  }

  if (previewType === "graphics") {
    return (
      <div className='flex h-full w-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-muted/90 shadow-2xl dark:border-zinc-800/50'>
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
    <div className='flex h-full flex-col items-center justify-center rounded-3xl border border-zinc-200 p-4 py-4 bg-muted/90 shadow-2xl dark:border-zinc-800/50'>
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
