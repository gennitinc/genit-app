"use client";

import React from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import { ArrowRightLeft, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransformMapping {
  key: string;
  value: string;
}

interface TransformNodeData {
  title: string;
  mappings: TransformMapping[];
  expression: string;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

const inputCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-teal-500/50 transition-colors";

const labelCls = "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function TransformNode({ id, data }: NodeProps<TransformNodeData>) {
  const isEdit = data.isEditMode;
  const mappings: TransformMapping[] = data.mappings || [
    { key: "", value: "" },
  ];

  const updateMapping = (
    index: number,
    field: "key" | "value",
    val: string
  ) => {
    const updated = [...mappings];
    updated[index] = { ...updated[index], [field]: val };
    data.onNodeDataChange(id, { mappings: updated });
  };

  const addMapping = () => {
    data.onNodeDataChange(id, {
      mappings: [...mappings, { key: "", value: "" }],
    });
  };

  const removeMapping = (index: number) => {
    const updated = mappings.filter((_, i) => i !== index);
    data.onNodeDataChange(id, {
      mappings: updated.length ? updated : [{ key: "", value: "" }],
    });
  };

  return (
    <div
      className={cn(
        "w-[260px] overflow-hidden bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-neutral-800 rounded-2xl relative shadow-xl text-zinc-800 dark:text-neutral-200 transition-all duration-200",
        isEdit ? "ring-2 ring-teal-500/40 border-zinc-300 dark:border-neutral-700" : ""
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-teal-500 !border-2 !border-white dark:!border-neutral-900"
      />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-neutral-800/70 bg-zinc-50/50 dark:bg-neutral-950/40">
        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400">
          <ArrowRightLeft className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wider font-sans">
            Transform
          </span>
        </div>
        {isEdit && (
          <button
            onClick={() => data.onRemoveNode(id)}
            className="text-zinc-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded"
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
                placeholder="Transform Step"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={labelCls}>Mappings</label>
                <button
                  onClick={addMapping}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-550 dark:hover:text-teal-300 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {mappings.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={m.key}
                      onChange={(e) => updateMapping(i, "key", e.target.value)}
                      className="flex-1 bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-850 rounded px-2 py-1 text-[10px] text-zinc-800 dark:text-neutral-200 outline-none focus:border-teal-500/50 transition-colors"
                      placeholder="key"
                    />
                    <span className="text-[10px] text-zinc-400 dark:text-neutral-500 font-bold">→</span>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => updateMapping(i, "value", e.target.value)}
                      className="flex-1 bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-850 rounded px-2 py-1 text-[10px] text-zinc-800 dark:text-neutral-200 outline-none focus:border-teal-500/50 transition-colors"
                      placeholder="value"
                    />
                    {mappings.length > 1 && (
                      <button
                        onClick={() => removeMapping(i)}
                        className="text-zinc-550 dark:text-neutral-450 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Expression (optional)</label>
              <textarea
                value={data.expression || ""}
                onChange={(e) =>
                  data.onNodeDataChange(id, { expression: e.target.value })
                }
                className={cn(inputCls, "min-h-[36px] resize-none font-mono text-[10px]")}
                placeholder="e.g. {{ input.name.toUpperCase() }}"
              />
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-zinc-900 dark:text-neutral-100 truncate">
              {data.title}
            </h4>
            <div className="text-[10px] text-zinc-650 dark:text-neutral-400 bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800/50 px-3 py-2 rounded-xl space-y-1">
              <span className="font-medium text-zinc-805 dark:text-neutral-200 block">
                {mappings.filter((m) => m.key).length} field mapping
                {mappings.filter((m) => m.key).length !== 1 ? "s" : ""}
              </span>
              {data.expression && (
                <span className="block mt-0.5 truncate font-mono text-[9px] text-zinc-500 dark:text-neutral-400">
                  {data.expression}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-teal-500 !border-2 !border-white dark:!border-neutral-900"
      />
    </div>
  );
}
