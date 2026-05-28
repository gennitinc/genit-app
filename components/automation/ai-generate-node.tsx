"use client";

import React from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import { Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_CONTENT_TYPES, type AIContentType } from "./automation-types";

interface AIGenerateNodeData {
  title: string;
  contentType: AIContentType;
  prompt: string;
  model: string;
  aspectRatio: string;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

const inputCls =
  "w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-violet-500/50 transition-colors";

const selectCls =
  "w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-violet-500/50 transition-colors cursor-pointer";

const labelCls = "block mb-1 text-[9px] font-medium text-neutral-400 uppercase tracking-wider";

export function AIGenerateNode({ id, data }: NodeProps<AIGenerateNodeData>) {
  const isEdit = data.isEditMode;
  const contentLabel =
    AI_CONTENT_TYPES.find((c) => c.id === data.contentType)?.label ||
    data.contentType;

  return (
    <div
      className={cn(
        "w-[280px] overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl relative shadow-xl text-neutral-200 transition-all duration-200",
        isEdit ? "ring-2 ring-violet-500/40 border-neutral-700" : ""
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-violet-500 !border-2 !border-neutral-900"
      />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-neutral-800/70 bg-neutral-950/40">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <Sparkles className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wider font-sans">
            AI Generate
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

      {/* Body */}
      <div className="p-4 space-y-4">
        {isEdit ? (
          <>
            <div>
              <label className={labelCls}>Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) =>
                  data.onNodeDataChange(id, { title: e.target.value })
                }
                className={inputCls}
                placeholder="AI Generation Step"
              />
            </div>

            {/* Content Type Tabs */}
            <div>
              <label className={labelCls}>Output Type</label>
              <div className="flex gap-1 rounded-lg border border-neutral-850 bg-neutral-950 p-1">
                {AI_CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() =>
                      data.onNodeDataChange(id, { contentType: ct.id })
                    }
                    className={cn(
                      "flex-1 rounded-md px-1.5 py-1 text-[10px] font-medium transition-colors border border-transparent",
                      data.contentType === ct.id
                        ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                        : "text-neutral-400 hover:text-neutral-200"
                    )}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Model</label>
              <select
                value={data.model || ""}
                onChange={(e) =>
                  data.onNodeDataChange(id, { model: e.target.value })
                }
                className={selectCls}
              >
                <option value="" className="bg-neutral-900 text-neutral-200">Auto (default)</option>
                {data.contentType === "text" && (
                  <>
                    <option value="gpt-4o" className="bg-neutral-900 text-neutral-200">GPT-4o</option>
                    <option value="claude-3-5-sonnet" className="bg-neutral-900 text-neutral-200">Claude 3.5 Sonnet</option>
                    <option value="gemini-1-5-pro" className="bg-neutral-900 text-neutral-200">Gemini 1.5 Pro</option>
                  </>
                )}
                {data.contentType === "image" && (
                  <>
                    <option value="stable-diffusion-3" className="bg-neutral-900 text-neutral-200">Stable Diffusion 3</option>
                    <option value="dalle-3" className="bg-neutral-900 text-neutral-200">DALL-E 3</option>
                    <option value="midjourney-v6" className="bg-neutral-900 text-neutral-200">Midjourney v6</option>
                  </>
                )}
                {data.contentType === "video" && (
                  <>
                    <option value="sora" className="bg-neutral-900 text-neutral-200">Sora</option>
                    <option value="runway-gen-2" className="bg-neutral-900 text-neutral-200">Runway Gen-2</option>
                  </>
                )}
                {data.contentType === "audio" && (
                  <>
                    <option value="elevenlabs" className="bg-neutral-900 text-neutral-200">ElevenLabs</option>
                    <option value="suno-v3" className="bg-neutral-900 text-neutral-200">Suno v3</option>
                  </>
                )}
              </select>
            </div>

            {(data.contentType === "image" || data.contentType === "video") && (
              <div>
                <label className={labelCls}>Aspect Ratio</label>
                <select
                  value={data.aspectRatio || "16:9"}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { aspectRatio: e.target.value })
                  }
                  className={selectCls}
                >
                  <option value="auto" className="bg-neutral-900 text-neutral-200">Auto</option>
                  <option value="16:9" className="bg-neutral-900 text-neutral-200">Landscape 16:9</option>
                  <option value="9:16" className="bg-neutral-900 text-neutral-200">Portrait 9:16</option>
                  <option value="1:1" className="bg-neutral-900 text-neutral-200">Square 1:1</option>
                  <option value="4:3" className="bg-neutral-900 text-neutral-200">Standard 4:3</option>
                </select>
              </div>
            )}

            <div>
              <label className={labelCls}>Prompt</label>
              <textarea
                value={data.prompt || ""}
                onChange={(e) =>
                  data.onNodeDataChange(id, { prompt: e.target.value })
                }
                className={cn(inputCls, "min-h-[60px] resize-none")}
                placeholder="Describe what to generate..."
              />
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-neutral-100 truncate">
              {data.title}
            </h4>
            <div className="text-[10px] text-neutral-400 bg-neutral-950 border border-neutral-800/50 px-3 py-2 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-200">
                  {contentLabel}
                </span>
                {data.model && (
                  <span className="text-[9px] text-neutral-400 bg-neutral-900 border border-neutral-800/40 rounded px-1.5 py-0.5">
                    {data.model}
                  </span>
                )}
              </div>
              {data.prompt && (
                <p className="truncate text-neutral-400 text-[10px]">{data.prompt}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-violet-500 !border-2 !border-neutral-900"
      />
    </div>
  );
}
