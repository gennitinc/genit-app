"use client";

import React, { useRef } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import { Upload, Trash2, FileText, FileAudio, FileVideo, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
      case "image": return ImageIcon;
      case "video": return FileVideo;
      case "audio": return FileAudio;
      default: return FileText;
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
        "w-[280px] overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl relative shadow-xl text-neutral-200 transition-all duration-200",
        isEdit ? "ring-2 ring-emerald-500/40 border-neutral-700" : ""
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-neutral-900"
      />

      {/* Card Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-neutral-800/70 bg-neutral-950/40">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <Upload className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wider font-sans">
            Upload Asset
          </span>
        </div>
        {isEdit && (
          <button
            onClick={() => data.onRemoveNode(id)}
            className="text-neutral-400 hover:text-red-400 transition-colors p-1 rounded"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
      />

      {/* Card Body */}
      <div className="p-4 space-y-4">
        {isEdit ? (
          <>
            <div className="space-y-1">
              <label className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) =>
                  data.onNodeDataChange(id, { title: e.target.value })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="Asset Step Name"
              />
            </div>

            {!data.fileName ? (
              <div
                onClick={triggerFileSelect}
                className="cursor-pointer rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition p-4 flex flex-col items-center justify-center gap-2 text-center"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-200">
                    Click to upload prep work
                  </p>
                  <p className="text-[9px] text-neutral-400 mt-0.5">
                    Images, videos, audio, or docs
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-neutral-800/40 flex items-center justify-center text-neutral-400 shrink-0">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-neutral-100 truncate">
                      {data.fileName}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {data.fileSize} · {data.fileType}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={triggerFileSelect}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-[10px] font-medium py-1.5 rounded-lg border border-neutral-750 transition"
                  >
                    Replace
                  </button>
                  <button
                    onClick={clearFile}
                    className="flex-1 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-[10px] font-medium py-1.5 rounded-lg border border-red-900/30 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-neutral-100 truncate">
              {data.title}
            </h4>

            {data.fileName ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-neutral-400 shrink-0" />
                  <p className="text-xs text-neutral-200 truncate flex-1">
                    {data.fileName}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-900">
                  <span>{data.fileSize}</span>
                  {data.fileUrl && (
                    <a
                      href={data.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-neutral-200 flex items-center gap-1 transition-colors"
                    >
                      <LinkIcon className="h-3 w-3" />
                      View File
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-950/20 p-4 text-center">
                <p className="text-xs text-neutral-400">No file uploaded yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-neutral-900"
      />
    </div>
  );
}
