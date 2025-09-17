"use client";

import { useState, useEffect, useCallback } from "react";

interface FilePreviewData {
  type: "image" | "text" | "pdf" | "video" | "audio" | "unknown";
  url?: string;
  content?: string;
  error?: string;
}

interface UseFilePreviewReturn {
  previewData: FilePreviewData | null;
  isLoading: boolean;
  generatePreview: (file: File) => Promise<void>;
  clearPreview: () => void;
}

export function useFilePreview(): UseFilePreviewReturn {
  const [previewData, setPreviewData] = useState<FilePreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFileType = (file: File): FilePreviewData["type"] => {
    if (file.type.startsWith("image/")) return "image";
    if (
      file.type.startsWith("text/") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".txt")
    )
      return "text";
    if (file.type === "application/pdf") return "pdf";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "unknown";
  };

  const generatePreview = useCallback(async (file: File) => {
    setIsLoading(true);
    setPreviewData(null);

    try {
      const fileType = getFileType(file);

      switch (fileType) {
        case "image": {
          const url = URL.createObjectURL(file);
          setPreviewData({ type: "image", url });
          break;
        }

        case "text": {
          // Limit text preview to first 1000 characters
          const text = await file.text();
          const truncatedText =
            text.length > 1000 ? `${text.substring(0, 1000)}...` : text;
          setPreviewData({ type: "text", content: truncatedText });
          break;
        }

        case "pdf": {
          const url = URL.createObjectURL(file);
          setPreviewData({ type: "pdf", url });
          break;
        }

        case "video": {
          const url = URL.createObjectURL(file);
          setPreviewData({ type: "video", url });
          break;
        }

        case "audio": {
          const url = URL.createObjectURL(file);
          setPreviewData({ type: "audio", url });
          break;
        }

        default: {
          setPreviewData({
            type: "unknown",
            error: "Preview not available for this file type",
          });
          break;
        }
      }
    } catch (error) {
      setPreviewData({
        type: "unknown",
        error:
          error instanceof Error ? error.message : "Failed to generate preview",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPreview = useCallback(() => {
    if (previewData?.url) {
      URL.revokeObjectURL(previewData.url);
    }
    setPreviewData(null);
    setIsLoading(false);
  }, [previewData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewData?.url) {
        URL.revokeObjectURL(previewData.url);
      }
    };
  }, [previewData]);

  return {
    previewData,
    isLoading,
    generatePreview,
    clearPreview,
  };
}
