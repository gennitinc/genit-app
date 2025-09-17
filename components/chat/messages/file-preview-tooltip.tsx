"use client";

import type React from "react";

import { useState } from "react";
import { Loader2, FileText, AlertCircle, Play, Volume2 } from "lucide-react";
import { useFilePreview } from "@/hooks/message/use-file-preview";

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
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading preview...
          </span>
        </div>
      );
    }

    if (!previewData) return null;

    switch (previewData.type) {
      case "image":
        return (
          <div className="p-2">
            <img
              src={previewData.url || "/placeholder.svg"}
              alt="File preview"
              className="max-w-[300px] max-h-[200px] object-contain rounded border"
              onError={() => console.error("Failed to load image preview")}
            />
            <div className="mt-2 text-xs text-gray-500 text-center">
              {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        );

      case "text":
        return (
          <div className="p-3 max-w-[400px]">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {file.name}
              </span>
            </div>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted-foreground/10 p-2 rounded border max-h-[150px] overflow-y-auto">
              {previewData.content}
            </pre>
            <div className="mt-2 text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB •{" "}
              {previewData.content?.split("\n").length} lines
            </div>
          </div>
        );

      case "pdf":
        return (
          <div className="p-3 max-w-[300px]">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {file.name}
              </span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
              <FileText className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-700">PDF Document</p>
              <p className="text-xs text-red-600 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Click to view full document
            </p>
          </div>
        );

      case "video":
        return (
          <div className="p-2">
            <div className="relative">
              <video
                src={previewData.url}
                className="max-w-[300px] max-h-[200px] rounded border"
                controls={false}
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="p-3 max-w-[300px]">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {file.name}
              </span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
              <Volume2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-blue-700">Audio File</p>
              <p className="text-xs text-blue-600 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <audio
              src={previewData.url}
              controls
              className="w-full mt-2"
              preload="metadata"
            />
          </div>
        );

      case "unknown":
        return (
          <div className="p-3 max-w-[300px]">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {file.name}
              </span>
            </div>
            <div className="bg-muted-foreground/10 border border-border rounded p-4 text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {previewData.error ||
                  "Preview not available for this file type"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
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
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-[450px] overflow-hidden">
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px">
                <div className="border-l-7 border-r-7 border-t-7 border-l-transparent border-r-transparent border-t-background"></div>
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
