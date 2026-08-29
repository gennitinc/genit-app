"use client";

import { LocalizedText } from "@/components/localized-text";
import { cn } from "@/lib/utils";
import { CircleFadingArrowUp, Sparkles, Trash2 } from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import React from "react";

interface PromptNodeData {
  title: string;
  instruction: string;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

const inputCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-violet-500/50 transition-colors";

const labelCls =
  "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function PromptNode({ id, data }: NodeProps<PromptNodeData>) {
  const isEdit = data.isEditMode;

  return (
    <div
      className={cn(
        "relative w-[240px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        isEdit
          ? "border-zinc-300 ring-2 ring-violet-500/40 dark:border-neutral-700"
          : ""
      )}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!h-2 !w-2 !border-2 !border-white !bg-violet-500 dark:!border-neutral-900'
      />

      {/* Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-neutral-800/70 dark:bg-neutral-950/40'>
        <div className='flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400'>
          <Sparkles className='h-4 w-4' />
          <span className='font-sans text-[10px] font-semibold tracking-wider uppercase'>
            <LocalizedText text={"AI Prompt"} />
          </span>
        </div>
        {isEdit && (
          <button
            type='button'
            onClick={() => data.onRemoveNode(id)}
            className='nodrag nopan rounded p-1 text-zinc-500 transition-colors hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400'
          >
            <Trash2 className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      {/* Body */}
      <div className='space-y-4 p-4'>
        {isEdit ? (
          <>
            <div>
              <label className={labelCls}>
                <LocalizedText text={"Title"} />
              </label>
              <input
                type='text'
                value={data.title}
                onChange={(e) =>
                  data.onNodeDataChange(id, { title: e.target.value })
                }
                className={inputCls}
                placeholder='AI Step Name'
              />
            </div>

            <div>
              <label className={labelCls}>
                <LocalizedText text={"Prompt / Instructions"} />
              </label>
              <textarea
                value={data.instruction}
                onChange={(e) =>
                  data.onNodeDataChange(id, { instruction: e.target.value })
                }
                className={cn(inputCls, "min-h-[60px] resize-none")}
                placeholder='Describe what the AI should generate...'
              />
            </div>
          </>
        ) : (
          <div className='space-y-1.5'>
            <h4 className='truncate text-xs font-medium text-zinc-900 dark:text-neutral-100'>
              {data.title}
            </h4>
            <div className='max-h-[70px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] text-zinc-600 dark:border-neutral-800/50 dark:bg-neutral-950 dark:text-neutral-400'>
              <p className='leading-relaxed whitespace-pre-line text-zinc-700 dark:text-neutral-300'>
                {data.instruction || "No instructions defined yet."}
              </p>
            </div>
          </div>
        )}
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!h-2 !w-2 !border-2 !border-white !bg-violet-500 dark:!border-neutral-900'
      />
    </div>
  );
}
