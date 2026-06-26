import { type AIContentType, AI_CONTENT_TYPES } from "./automation-types";
import { cn } from "@/lib/utils";
import { modelApi } from "@/utils/inspire-api";
import { CircleFadingArrowUp, Loader2, Sparkles, Trash2 } from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import React, { useEffect, useState } from "react";

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
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-violet-500/50 transition-colors";

const selectCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-violet-500/50 transition-colors cursor-pointer";

const labelCls =
  "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function AIGenerateNode({ id, data }: NodeProps<AIGenerateNodeData>) {
  const isEdit = data.isEditMode;
  const contentLabel =
    AI_CONTENT_TYPES.find((c) => c.id === data.contentType)?.label ||
    data.contentType;

  const [serverModels, setServerModels] = useState<any[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchModels = async () => {
      setIsLoadingModels(true);
      try {
        const response = await modelApi.getAll({ type: data.contentType });
        if (response.data) {
          setServerModels(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setIsLoadingModels(false);
      }
    };
    fetchModels();
  }, [data.contentType, isEdit]);

  return (
    <div
      className={cn(
        "relative w-[280px] overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-800 shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
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
            AI Generate
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

      {/* Body */}
      <div className='space-y-4 p-4'>
        {isEdit ? (
          <>
            <div>
              <label className={labelCls}>Title</label>
              <input
                type='text'
                value={data.title}
                onChange={(e) =>
                  data.onNodeDataChange(id, { title: e.target.value })
                }
                className={inputCls}
                placeholder='AI Generation Step'
              />
            </div>

            {/* Content Type Tabs */}
            <div>
              <label className={labelCls}>Output Type</label>
              <div className='dark:border-neutral-850 flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:bg-neutral-950'>
                {AI_CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() =>
                      data.onNodeDataChange(id, {
                        contentType: ct.id,
                        model: "",
                      })
                    }
                    className={cn(
                      "flex-1 rounded-md border border-transparent px-1.5 py-1 text-[10px] font-medium transition-colors",
                      data.contentType === ct.id
                        ? "border-violet-500/20 bg-violet-500/15 text-violet-600 dark:text-violet-400"
                        : "text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                    )}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            <div className='relative'>
              <label className={labelCls}>Model</label>
              <div className='relative'>
                <select
                  value={data.model || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { model: e.target.value })
                  }
                  className={cn(selectCls, isLoadingModels && "opacity-50")}
                  disabled={isLoadingModels}
                >
                  <option
                    value=''
                    className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                  >
                    Auto (default)
                  </option>
                  {serverModels.map((m) => (
                    <option
                      key={m.modelId}
                      value={m.modelId}
                      className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                    >
                      {m.name}
                    </option>
                  ))}
                </select>
                {isLoadingModels && (
                  <Loader2 className='pointer-events-none absolute top-1/2 right-6 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-zinc-500 dark:text-neutral-400' />
                )}
              </div>
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
                  <option
                    value='auto'
                    className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                  >
                    Auto
                  </option>
                  <option
                    value='16:9'
                    className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                  >
                    Landscape 16:9
                  </option>
                  <option
                    value='9:16'
                    className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                  >
                    Portrait 9:16
                  </option>
                  <option
                    value='1:1'
                    className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                  >
                    Square 1:1
                  </option>
                  <option
                    value='4:3'
                    className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                  >
                    Standard 4:3
                  </option>
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
                placeholder='Describe what to generate...'
              />
            </div>
          </>
        ) : (
          <div className='space-y-1.5'>
            <h4 className='truncate text-xs font-medium text-zinc-900 dark:text-neutral-100'>
              {data.title}
            </h4>
            <div className='space-y-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] text-zinc-600 dark:border-neutral-800/50 dark:bg-neutral-950 dark:text-neutral-400'>
              <div className='flex items-center justify-between'>
                <span className='font-medium text-zinc-800 dark:text-neutral-200'>
                  {contentLabel}
                </span>
                {data.model && (
                  <span className='rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[9px] text-zinc-500 dark:border-neutral-800/40 dark:bg-neutral-900 dark:text-neutral-400'>
                    {data.model}
                  </span>
                )}
              </div>
              {data.prompt && (
                <p className='truncate text-[10px] text-zinc-500 dark:text-neutral-400'>
                  {data.prompt}
                </p>
              )}
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
