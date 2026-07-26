"use client";

import { DELAY_UNITS, type DelayUnit } from "./automation-types";
import { cn } from "@/lib/utils";
import { Clock, Trash2 } from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import React from "react";

interface DelayNodeData {
  title: string;
  duration: number;
  unit: DelayUnit;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

const inputCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-neutral-500/50 transition-colors";

const selectCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-neutral-500/50 transition-colors cursor-pointer";

const labelCls =
  "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function DelayNode({ id, data }: NodeProps<DelayNodeData>) {
  const isEdit = data.isEditMode;
  const unitLabel =
    DELAY_UNITS.find((u) => u.id === data.unit)?.label || data.unit;

  return (
    <div
      className={cn(
        "relative w-[240px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        isEdit
          ? "border-zinc-300 ring-2 ring-zinc-500/40 dark:border-neutral-700"
          : ""
      )}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!h-2 !w-2 !border-2 !border-white !bg-neutral-500 dark:!border-neutral-900'
      />

      {/* Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-neutral-800/70 dark:bg-neutral-950/40'>
        <div className='flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400'>
          <Clock className='h-4 w-4' />
          <span className='font-sans text-[10px] font-semibold tracking-wider uppercase'>
            Delay
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
                placeholder='Wait Step'
              />
            </div>

            <div className='flex gap-2'>
              <div className='flex-1'>
                <label className={labelCls}>Duration</label>
                <input
                  type='number'
                  min={1}
                  value={data.duration || 1}
                  onChange={(e) =>
                    data.onNodeDataChange(id, {
                      duration: parseInt(e.target.value) || 1,
                    })
                  }
                  className={inputCls}
                />
              </div>
              <div className='flex-1'>
                <label className={labelCls}>Unit</label>
                <select
                  value={data.unit || "minutes"}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { unit: e.target.value })
                  }
                  className={selectCls}
                >
                  {DELAY_UNITS.map((u) => (
                    <option
                      key={u.id}
                      value={u.id}
                      className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                    >
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className='space-y-1.5'>
            <h4 className='truncate text-xs font-medium text-zinc-900 dark:text-neutral-100'>
              {data.title}
            </h4>
            <div className='text-zinc-655 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-center text-[10px] dark:border-neutral-800/50 dark:bg-neutral-950 dark:text-neutral-400'>
              Wait for{" "}
              <span className='text-sm font-semibold text-zinc-800 dark:text-neutral-200'>
                {data.duration || 1}
              </span>{" "}
              {unitLabel}
            </div>
          </div>
        )}
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!h-2 !w-2 !border-2 !border-white !bg-neutral-500 dark:!border-neutral-900'
      />
    </div>
  );
}
