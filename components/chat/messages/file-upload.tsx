"use client";

import { FilePreviewTooltip } from "@/components/chat/messages";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  File,
  FileText,
  ImageIcon,
  Music,
  Paperclip,
  Video,
  X,
} from "lucide-react";
import type React from "react";
import { useCallback, useRef } from "react";

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
      return <ImageIcon className='h-4 w-4 text-blue-500' />;
    if (file.type.startsWith("video/"))
      return <Video className='h-4 w-4 text-purple-500' />;
    if (file.type.startsWith("audio/"))
      return <Music className='h-4 w-4 text-green-500' />;
    if (
      file.type.startsWith("text/") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".txt")
    )
      return <FileText className='h-4 w-4 text-gray-500' />;
    if (file.type === "application/pdf")
      return <FileText className='h-4 w-4 text-red-500' />;
    return <File className='h-4 w-4 text-gray-400' />;
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
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= maxFiles}
          className='flex items-center gap-2'
        >
          <Paperclip className='h-4 w-4' />
          <LocalizedText text={"Attach Files"} />
        </Button>
        <span className='text-xs text-gray-500'>
          {files.length}/{maxFiles} <LocalizedText text={"files • Max"} />
          {maxSizeInMB}
          <LocalizedText text={"MB each"} />
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type='file'
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className='hidden'
      />

      {/* Drag & Drop Zone */}
      {files.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className='cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 transition-colors hover:border-gray-400'
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className='mx-auto mb-2 h-8 w-8 text-gray-400' />
          <p className='font-medium'>
            <LocalizedText text={"Drop files here or click to browse"} />
          </p>
          <p className='mt-1 text-xs'>
            <LocalizedText
              text={"Supports images, documents, videos, and audio files"}
            />
          </p>
        </div>
      )}

      {/* File List with Previews */}
      {files.length > 0 && (
        <div className='space-y-2'>
          <h4 className='text-sm font-medium text-gray-700'>
            <LocalizedText text={"Attached Files ("} />
            {files.length})
          </h4>
          <div className='scrollbar-hover grid max-h-48 gap-2 overflow-y-auto'>
            {files.map((file, index) => (
              <FilePreviewTooltip key={`${file.name}-${index}`} file={file}>
                <div className='bg-muted-foreground group flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-100'>
                  <div className='flex-shrink-0'>{getFileIcon(file)}</div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <p className='truncate text-sm font-medium text-gray-900'>
                        {file.name}
                      </p>
                      <span className='bg-background text-muted-foreground rounded-full border px-2 py-0.5 text-xs'>
                        {getFileTypeLabel(file)}
                      </span>
                    </div>
                    <p className='mt-0.5 text-xs text-gray-500'>
                      {formatFileSize(file.size)}{" "}
                      <LocalizedText text={"• Last modified"} />{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove(index);
                    }}
                    className='h-auto flex-shrink-0 p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500'
                  >
                    <X className='h-4 w-4' />
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
