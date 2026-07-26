"use client";

import { cn } from "@/lib/utils";
import { ArrowRightLeft, Plus, Trash2, X } from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import React from "react";

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

const labelCls =
  "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

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
        "relative w-[260px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        isEdit
          ? "border-zinc-300 ring-2 ring-teal-500/40 dark:border-neutral-700"
          : ""
      )}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!h-2 !w-2 !border-2 !border-white !bg-teal-500 dark:!border-neutral-900'
      />

      {/* Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-neutral-800/70 dark:bg-neutral-950/40'>
        <div className='flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400'>
          <ArrowRightLeft className='h-4 w-4' />
          <span className='font-sans text-[10px] font-semibold tracking-wider uppercase'>
            Transform
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
                placeholder='Transform Step'
              />
            </div>

            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <label className={labelCls}>Mappings</label>
                <button
                  onClick={addMapping}
                  className='hover:text-teal-550 text-teal-600 transition-colors dark:text-teal-400 dark:hover:text-teal-300'
                >
                  <Plus className='h-3.5 w-3.5' />
                </button>
              </div>

              <div className='max-h-[140px] space-y-1.5 overflow-y-auto'>
                {mappings.map((m, i) => (
                  <div key={i} className='flex items-center gap-1.5'>
                    <input
                      type='text'
                      value={m.key}
                      onChange={(e) => updateMapping(i, "key", e.target.value)}
                      className='dark:border-neutral-850 flex-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] text-zinc-800 transition-colors outline-none focus:border-teal-500/50 dark:bg-neutral-950 dark:text-neutral-200'
                      placeholder='key'
                    />
                    <span className='text-[10px] font-bold text-zinc-400 dark:text-neutral-500'>
                      →
                    </span>
                    <input
                      type='text'
                      value={m.value}
                      onChange={(e) =>
                        updateMapping(i, "value", e.target.value)
                      }
                      className='dark:border-neutral-850 flex-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] text-zinc-800 transition-colors outline-none focus:border-teal-500/50 dark:bg-neutral-950 dark:text-neutral-200'
                      placeholder='value'
                    />
                    {mappings.length > 1 && (
                      <button
                        onClick={() => removeMapping(i)}
                        className='text-zinc-550 dark:text-neutral-450 transition-colors hover:text-red-500 dark:hover:text-red-400'
                      >
                        <X className='h-3.5 w-3.5' />
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
                className={cn(
                  inputCls,
                  "min-h-[36px] resize-none font-mono text-[10px]"
                )}
                placeholder='e.g. {{ input.name.toUpperCase() }}'
              />
            </div>
          </>
        ) : (
          <div className='space-y-1.5'>
            <h4 className='truncate text-xs font-medium text-zinc-900 dark:text-neutral-100'>
              {data.title}
            </h4>
            <div className='text-zinc-650 space-y-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] dark:border-neutral-800/50 dark:bg-neutral-950 dark:text-neutral-400'>
              <span className='text-zinc-805 block font-medium dark:text-neutral-200'>
                {mappings.filter((m) => m.key).length} field mapping
                {mappings.filter((m) => m.key).length !== 1 ? "s" : ""}
              </span>
              {data.expression && (
                <span className='mt-0.5 block truncate font-mono text-[9px] text-zinc-500 dark:text-neutral-400'>
                  {data.expression}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!h-2 !w-2 !border-2 !border-white !bg-teal-500 dark:!border-neutral-900'
      />
    </div>
  );
}
