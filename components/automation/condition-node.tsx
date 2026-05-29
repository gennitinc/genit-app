"use client";

import React from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import { GitBranch, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONDITION_OPERATORS, type ConditionOperator } from "./automation-types";

interface ConditionNodeData {
  title: string;
  field: string;
  operator: ConditionOperator;
  value: string;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

const inputCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-orange-500/50 transition-colors";

const selectCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-orange-500/50 transition-colors cursor-pointer";

const labelCls = "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function ConditionNode({ id, data }: NodeProps<ConditionNodeData>) {
  const isEdit = data.isEditMode;
  const operatorLabel =
    CONDITION_OPERATORS.find((o) => o.id === data.operator)?.label || data.operator;

  return (
    <div
      className={cn(
        "w-[240px] overflow-hidden bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-neutral-800 rounded-2xl relative shadow-xl text-zinc-850 dark:text-neutral-200 transition-all duration-200",
        isEdit ? "ring-2 ring-orange-500/40 border-zinc-300 dark:border-neutral-700" : ""
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-orange-500 !border-2 !border-white dark:!border-neutral-900"
      />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-neutral-800/70 bg-zinc-50/50 dark:bg-neutral-950/40">
        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400">
          <GitBranch className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wider font-sans">
            Condition
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
                placeholder="Condition Name"
              />
            </div>

            <div>
              <label className={labelCls}>Field</label>
              <input
                type="text"
                value={data.field || ""}
                onChange={(e) =>
                  data.onNodeDataChange(id, { field: e.target.value })
                }
                className={inputCls}
                placeholder="e.g. message.text, email.subject"
              />
            </div>

            <div>
              <label className={labelCls}>Operator</label>
              <select
                value={data.operator || "equals"}
                onChange={(e) =>
                  data.onNodeDataChange(id, { operator: e.target.value })
                }
                className={selectCls}
              >
                {CONDITION_OPERATORS.map((op) => (
                  <option key={op.id} value={op.id} className="bg-white dark:bg-neutral-900 text-zinc-800 dark:text-neutral-200">
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            {data.operator !== "is_empty" &&
              data.operator !== "is_not_empty" && (
                <div>
                  <label className={labelCls}>Value</label>
                  <input
                    type="text"
                    value={data.value || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { value: e.target.value })
                    }
                    className={inputCls}
                    placeholder="Compare value"
                  />
                </div>
              )}
          </>
        ) : (
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-zinc-900 dark:text-neutral-100 truncate">
              {data.title}
            </h4>
            <div className="text-[10px] text-zinc-600 dark:text-neutral-400 bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800/50 px-3 py-2 rounded-xl space-y-1">
              <span className="font-medium text-zinc-800 dark:text-neutral-200 block">
                If {data.field || "…"}
              </span>
              <span className="block mt-0.5 text-zinc-500 dark:text-neutral-400 truncate">
                {operatorLabel} {data.value || ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Two output handles: True (left) and False (right) */}
      <div className="flex items-center justify-between px-6 pb-3 pt-1 border-t border-zinc-200 dark:border-neutral-800/20 bg-zinc-50/30 dark:bg-neutral-950/10">
        <span className="text-[9px] text-emerald-500 dark:text-emerald-400 font-semibold tracking-wider font-sans">TRUE</span>
        <span className="text-[9px] text-red-500 dark:text-red-450 font-semibold tracking-wider font-sans">FALSE</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-white dark:!border-neutral-900"
        style={{ left: "30%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="!w-2 !h-2 !bg-red-500 !border-2 !border-white dark:!border-neutral-900"
        style={{ left: "70%" }}
      />
    </div>
  );
}
