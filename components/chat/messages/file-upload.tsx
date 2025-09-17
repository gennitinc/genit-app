"use client";

import type React from "react";

import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  X,
  FileText,
  ImageIcon,
  File,
  Video,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FilePreviewTooltip } from "@/components/chat/messages";

interface FileUploadProps {
  files: File[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export function FileUpload({
  files,
  onFilesAdd,
  onFileRemove,
  maxFiles = 5,
  maxSizeInMB = 10,
  acceptedTypes = [
    "image/*",
    "text/*",
    ".pdf",
    ".doc",
    ".docx",
    "video/*",
    "audio/*",
  ],
  className,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    if (file.type.startsWith("video/"))
      return <Video className="w-4 h-4 text-purple-500" />;
    if (file.type.startsWith("audio/"))
      return <Music className="w-4 h-4 text-green-500" />;
    if (
      file.type.startsWith("text/") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".txt")
    )
      return <FileText className="w-4 h-4 text-gray-500" />;
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4 text-red-500" />;
    return <File className="w-4 h-4 text-gray-400" />;
  };

  const getFileTypeLabel = (file: File) => {
    if (file.type.startsWith("image/")) return "Image";
    if (file.type.startsWith("video/")) return "Video";
    if (file.type.startsWith("audio/")) return "Audio";
    if (file.type.startsWith("text/")) return "Text";
    if (file.type === "application/pdf") return "PDF";
    return "File";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);

      // Validate file count
      if (files.length + selectedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate file sizes
      const oversizedFiles = selectedFiles.filter(
        (file) => file.size > maxSizeInMB * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        alert(`Files must be smaller than ${maxSizeInMB}MB`);
        return;
      }

      onFilesAdd(selectedFiles);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [files.length, maxFiles, maxSizeInMB, onFilesAdd]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files);

      if (files.length + droppedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const oversizedFiles = droppedFiles.filter(
        (file) => file.size > maxSizeInMB * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        alert(`Files must be smaller than ${maxSizeInMB}MB`);
        return;
      }

      onFilesAdd(droppedFiles);
    },
    [files.length, maxFiles, maxSizeInMB, onFilesAdd]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      {/* File Upload Button */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= maxFiles}
          className="flex items-center gap-2"
        >
          <Paperclip className="w-4 h-4" />
          Attach Files
        </Button>
        <span className="text-xs text-gray-500">
          {files.length}/{maxFiles} files • Max {maxSizeInMB}MB each
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drag & Drop Zone */}
      {files.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="font-medium">Drop files here or click to browse</p>
          <p className="text-xs mt-1">
            Supports images, documents, videos, and audio files
          </p>
        </div>
      )}

      {/* File List with Previews */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Attached Files ({files.length})
          </h4>
          <div className="grid gap-2 max-h-48 overflow-y-auto scrollbar-hover">
            {files.map((file, index) => (
              <FilePreviewTooltip key={`${file.name}-${index}`} file={file}>
                <div className="flex items-center gap-3 p-3 bg-muted-foreground rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="flex-shrink-0">{getFileIcon(file)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <span className="text-xs px-2 py-0.5 bg-background rounded-full text-muted-foreground border">
                        {getFileTypeLabel(file)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatFileSize(file.size)} • Last modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove(index);
                    }}
                    className="flex-shrink-0 p-1 h-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </FilePreviewTooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
