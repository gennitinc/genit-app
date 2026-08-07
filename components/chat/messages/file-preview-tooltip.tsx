"use client";

import { LocalizedText } from "@/components/localized-text";
import { useFilePreview } from "@/hooks/message/use-file-preview";
import { AlertCircle, FileText, Loader, Play, Volume2 } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface FilePreviewTooltipProps {
  file: File;
  children: React.ReactNode;
  className?: string;
}

export function FilePreviewTooltip({
  file,
  children,
  className = "",
}: FilePreviewTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { previewData, isLoading, generatePreview, clearPreview } =
    useFilePreview();

  const handleMouseEnter = async () => {
    setIsVisible(true);
    if (!hasGenerated) {
      await generatePreview(file);
      setHasGenerated(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    // Don't clear preview immediately to allow for smooth re-hover
    setTimeout(() => {
      if (!isVisible) {
        clearPreview();
        setHasGenerated(false);
      }
    }, 500);
  };

  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className='flex items-center justify-center p-4'>
          <Loader className='text-muted-foreground h-6 w-6 animate-spin' />
          <span className='text-muted-foreground ml-2 text-sm'>
            <LocalizedText text={"Loading preview..."} />
          </span>
        </div>
      );
    }

    if (!previewData) return null;

    switch (previewData.type) {
      case "image":
        return (
          <div className='p-2'>
            <img
              src={previewData.url || "/placeholder.svg"}
              alt='File preview'
              className='max-h-[200px] max-w-[300px] rounded border object-contain'
              onError={() => console.error("Failed to load image preview")}
            />
            <div className='mt-2 text-center text-xs text-gray-500'>
              {file.name} • {(file.size / 1024 / 1024).toFixed(2)}{" "}
              <LocalizedText text={"MB"} />
            </div>
          </div>
        );

      case "text":
        return (
          <div className='max-w-[400px] p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <FileText className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground text-sm font-medium'>
                {file.name}
              </span>
            </div>
            <pre className='text-muted-foreground bg-muted-foreground/10 max-h-[150px] overflow-y-auto rounded border p-2 text-xs whitespace-pre-wrap'>
              {previewData.content}
            </pre>
            <div className='text-muted-foreground mt-2 text-xs'>
              {(file.size / 1024).toFixed(1)} <LocalizedText text={"KB •"} />{" "}
              {previewData.content?.split("\n").length}{" "}
              <LocalizedText text={"lines"} />
            </div>
          </div>
        );

      case "pdf":
        return (
          <div className='max-w-[300px] p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <FileText className='h-4 w-4 text-red-500' />
              <span className='text-muted-foreground text-sm font-medium'>
                {file.name}
              </span>
            </div>
            <div className='rounded border border-red-200 bg-red-50 p-4 text-center'>
              <FileText className='mx-auto mb-2 h-8 w-8 text-red-500' />
              <p className='text-sm text-red-700'>
                <LocalizedText text={"PDF Document"} />
              </p>
              <p className='mt-1 text-xs text-red-600'>
                {(file.size / 1024 / 1024).toFixed(2)}{" "}
                <LocalizedText text={"MB"} />
              </p>
            </div>
            <p className='text-muted-foreground mt-2 text-center text-xs'>
              <LocalizedText text={"Click to view full document"} />
            </p>
          </div>
        );

      case "video":
        return (
          <div className='p-2'>
            <div className='relative'>
              <video
                src={previewData.url}
                className='max-h-[200px] max-w-[300px] rounded border'
                controls={false}
                muted
                preload='metadata'
              />
              <div className='bg-opacity-30 absolute inset-0 flex items-center justify-center rounded bg-black'>
                <Play className='h-8 w-8 text-white' />
              </div>
            </div>
            <div className='text-muted-foreground mt-2 text-center text-xs'>
              {file.name} • {(file.size / 1024 / 1024).toFixed(2)}{" "}
              <LocalizedText text={"MB"} />
            </div>
          </div>
        );

      case "audio":
        return (
          <div className='max-w-[300px] p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <Volume2 className='h-4 w-4 text-blue-500' />
              <span className='text-muted-foreground text-sm font-medium'>
                {file.name}
              </span>
            </div>
            <div className='rounded border border-blue-200 bg-blue-50 p-4 text-center'>
              <Volume2 className='mx-auto mb-2 h-8 w-8 text-blue-500' />
              <p className='text-sm text-blue-700'>
                <LocalizedText text={"Audio File"} />
              </p>
              <p className='mt-1 text-xs text-blue-600'>
                {(file.size / 1024 / 1024).toFixed(2)}{" "}
                <LocalizedText text={"MB"} />
              </p>
            </div>
            <audio
              src={previewData.url}
              controls
              className='mt-2 w-full'
              preload='metadata'
            />
          </div>
        );

      case "unknown":
        return (
          <div className='max-w-[300px] p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <AlertCircle className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground text-sm font-medium'>
                {file.name}
              </span>
            </div>
            <div className='bg-muted-foreground/10 border-border rounded border p-4 text-center'>
              <AlertCircle className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
              <p className='text-muted-foreground text-sm'>
                {previewData.error ||
                  "Preview not available for this file type"}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                {(file.size / 1024 / 1024).toFixed(2)}{" "}
                <LocalizedText text={"MB"} />
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div className='absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform'>
          <div className='bg-background border-border max-w-[450px] overflow-hidden rounded-lg border shadow-lg'>
            {/* Arrow */}
            <div className='absolute top-full left-1/2 -translate-x-1/2 transform'>
              <div className='border-t-border border-t-8 border-r-8 border-l-8 border-r-transparent border-l-transparent'></div>
              <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px transform'>
                <div className='border-t-background border-t-7 border-r-7 border-l-7 border-r-transparent border-l-transparent'></div>
              </div>
            </div>

            {/* Content */}
            {renderPreviewContent()}
          </div>
        </div>
      )}
    </div>
  );
}
