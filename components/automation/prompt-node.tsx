"use client";

import React from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import { Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptNodeData {
  title: string;
  instruction: string;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

const inputCls =
  "w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-violet-500/50 transition-colors";

const labelCls = "block mb-1 text-[9px] font-medium text-neutral-400 uppercase tracking-wider";

export function PromptNode({ id, data }: NodeProps<PromptNodeData>) {
  const isEdit = data.isEditMode;

  return (
    <div
      className={cn(
        "w-[240px] overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl relative shadow-xl text-neutral-200 transition-all duration-200",
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
            AI Prompt
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
                onChange={(e) => data.onNodeDataChange(id, { title: e.target.value })}
                className={inputCls}
                placeholder="AI Step Name"
              />
            </div>

            <div>
              <label className={labelCls}>Prompt / Instructions</label>
              <textarea
                value={data.instruction}
                onChange={(e) => data.onNodeDataChange(id, { instruction: e.target.value })}
                className={cn(inputCls, "min-h-[60px] resize-none")}
                placeholder="Describe what the AI should generate..."
              />
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-neutral-100 truncate">
              {data.title}
            </h4>
            <div className="text-[10px] text-neutral-400 bg-neutral-950 border border-neutral-800/50 px-3 py-2 rounded-xl max-h-[70px] overflow-y-auto">
              <p className="whitespace-pre-line leading-relaxed text-neutral-300">
                {data.instruction || "No instructions defined yet."}
              </p>
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
