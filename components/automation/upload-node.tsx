"use client";

import { LocalizedText } from "@/components/localized-text";
import { cn } from "@/lib/utils";
import {
  FileAudio,
  FileText,
  FileVideo,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import React, { useRef } from "react";

interface UploadNodeData {
  title: string;
  fileName?: string;
  fileSize?: string;
  fileType?: "image" | "video" | "audio" | "document";
  fileUrl?: string;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

export function UploadNode({ id, data }: NodeProps<UploadNodeData>) {
  const isEdit = data.isEditMode;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIcon = () => {
    switch (data.fileType) {
      case "image":
        return ImageIcon;
      case "video":
        return FileVideo;
      case "audio":
        return FileAudio;
      default:
        return FileText;
    }
  };

  const IconComponent = getIcon();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let detectedType: "image" | "video" | "audio" | "document" = "document";
    if (file.type.startsWith("image/")) detectedType = "image";
    else if (file.type.startsWith("video/")) detectedType = "video";
    else if (file.type.startsWith("audio/")) detectedType = "audio";

    // Simulate URL for demo purposes
    const simulatedUrl = URL.createObjectURL(file);
    const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    data.onNodeDataChange(id, {
      fileName: file.name,
      fileSize: sizeStr,
      fileType: detectedType,
      fileUrl: simulatedUrl,
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    data.onNodeDataChange(id, {
      fileName: undefined,
      fileSize: undefined,
      fileType: undefined,
      fileUrl: undefined,
    });
  };

  return (
    <div
      className={cn(
        "relative w-[280px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        isEdit
          ? "border-zinc-300 ring-2 ring-emerald-500/40 dark:border-neutral-700"
          : ""
      )}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!h-2 !w-2 !border-2 !border-white !bg-emerald-500 dark:!border-neutral-900'
      />

      {/* Card Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-neutral-800/70 dark:bg-neutral-950/40'>
        <div className='flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400'>
          <Upload className='h-4 w-4' />
          <span className='font-sans text-[10px] font-semibold tracking-wider uppercase'>
            <LocalizedText text={"Upload Asset"} />
          </span>
        </div>
        {isEdit && (
          <button
            onClick={() => data.onRemoveNode(id)}
            className='rounded p-1 text-zinc-500 transition-colors hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400'
          >
            <Trash2 className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
        accept='image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
      />

      {/* Card Body */}
      <div className='space-y-4 p-4'>
        {isEdit ? (
          <>
            <div className='space-y-1'>
              <label className='text-[9px] font-medium tracking-wider text-zinc-500 uppercase dark:text-neutral-400'>
                <LocalizedText text={"Title"} />
              </label>
              <input
                type='text'
                value={data.title}
                onChange={(e) =>
                  data.onNodeDataChange(id, { title: e.target.value })
                }
                className='w-full rounded border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-800 transition-colors outline-none focus:border-emerald-500/50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200'
                placeholder='Asset Step Name'
              />
            </div>

            {!data.fileName ? (
              <div
                onClick={triggerFileSelect}
                className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-4 text-center transition hover:bg-emerald-500/10'
              >
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400'>
                  <Upload className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-xs font-medium text-zinc-800 dark:text-neutral-200'>
                    <LocalizedText text={"Click to upload prep work"} />
                  </p>
                  <p className='mt-0.5 text-[9px] text-zinc-500 dark:text-neutral-400'>
                    <LocalizedText text={"Images, videos, audio, or docs"} />
                  </p>
                </div>
              </div>
            ) : (
              <div className='space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-neutral-800 dark:bg-neutral-950'>
                <div className='flex items-start gap-2.5'>
                  <div className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-500 dark:bg-neutral-800/40 dark:text-neutral-400'>
                    <IconComponent className='h-4 w-4' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-xs font-medium text-zinc-900 dark:text-neutral-100'>
                      {data.fileName}
                    </p>
                    <p className='mt-0.5 text-[10px] text-zinc-500 dark:text-neutral-400'>
                      {data.fileSize} · {data.fileType}
                    </p>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <button
                    onClick={triggerFileSelect}
                    className='dark:hover:bg-neutral-750 dark:border-neutral-750 flex-1 rounded-lg border border-zinc-200 bg-zinc-100 py-1.5 text-[10px] font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-neutral-800 dark:text-neutral-200'
                  >
                    <LocalizedText text={"Replace"} />
                  </button>
                  <button
                    onClick={clearFile}
                    className='flex-1 rounded-lg border border-red-200 bg-red-50 py-1.5 text-[10px] font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40'
                  >
                    <LocalizedText text={"Remove"} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className='space-y-3'>
            <h4 className='truncate text-xs font-medium text-zinc-900 dark:text-neutral-100'>
              {data.title}
            </h4>

            {data.fileName ? (
              <div className='space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-neutral-800 dark:bg-neutral-950/60'>
                <div className='flex items-center gap-2'>
                  <IconComponent className='h-4 w-4 shrink-0 text-zinc-500 dark:text-neutral-400' />
                  <p className='flex-1 truncate text-xs text-zinc-800 dark:text-neutral-200'>
                    {data.fileName}
                  </p>
                </div>
                <div className='flex items-center justify-between border-t border-zinc-200 pt-1 text-[10px] text-zinc-500 dark:border-neutral-900 dark:text-neutral-400'>
                  <span>{data.fileSize}</span>
                  {data.fileUrl && (
                    <a
                      href={data.fileUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                    >
                      <LinkIcon className='h-3 w-3' />
                      <LocalizedText text={"View File"} />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className='rounded-xl border border-dashed border-zinc-200 bg-zinc-50/20 p-4 text-center dark:border-neutral-800 dark:bg-neutral-950/20'>
                <p className='text-xs text-zinc-500 dark:text-neutral-400'>
                  <LocalizedText text={"No file uploaded yet"} />
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!h-2 !w-2 !border-2 !border-white !bg-emerald-500 dark:!border-neutral-900'
      />
    </div>
  );
}
