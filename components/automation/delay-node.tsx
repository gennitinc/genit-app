"use client";

import React from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import { Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DELAY_UNITS, type DelayUnit } from "./automation-types";

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

const labelCls = "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function DelayNode({ id, data }: NodeProps<DelayNodeData>) {
  const isEdit = data.isEditMode;
  const unitLabel =
    DELAY_UNITS.find((u) => u.id === data.unit)?.label || data.unit;

  return (
    <div
      className={cn(
        "w-[240px] overflow-hidden bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-neutral-800 rounded-2xl relative shadow-xl text-zinc-800 dark:text-neutral-200 transition-all duration-200",
        isEdit ? "ring-2 ring-zinc-500/40 border-zinc-300 dark:border-neutral-700" : ""
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-neutral-500 !border-2 !border-white dark:!border-neutral-900"
      />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-neutral-800/70 bg-zinc-50/50 dark:bg-neutral-950/40">
        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400">
          <Clock className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wider font-sans">
            Delay
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
                placeholder="Wait Step"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className={labelCls}>Duration</label>
                <input
                  type="number"
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
              <div className="flex-1">
                <label className={labelCls}>Unit</label>
                <select
                  value={data.unit || "minutes"}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { unit: e.target.value })
                  }
                  className={selectCls}
                >
                  {DELAY_UNITS.map((u) => (
                    <option key={u.id} value={u.id} className="bg-white dark:bg-neutral-900 text-zinc-800 dark:text-neutral-200">
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-zinc-900 dark:text-neutral-100 truncate">
              {data.title}
            </h4>
            <div className="text-[10px] text-zinc-655 dark:text-neutral-400 bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800/50 px-3 py-2 rounded-xl text-center">
              Wait for{" "}
              <span className="font-semibold text-zinc-800 dark:text-neutral-200 text-sm">
                {data.duration || 1}
              </span>{" "}
              {unitLabel}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-neutral-500 !border-2 !border-white dark:!border-neutral-900"
      />
    </div>
  );
}
