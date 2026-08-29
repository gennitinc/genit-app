"use client";

import {
  CONDITION_OPERATORS,
  type ConditionOperator,
} from "./automation-types";
import { LocalizedText } from "@/components/localized-text";
import { cn } from "@/lib/utils";
import { GitBranch, Trash2 } from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import React from "react";

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

const labelCls =
  "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function ConditionNode({ id, data }: NodeProps<ConditionNodeData>) {
  const isEdit = data.isEditMode;
  const operatorLabel =
    CONDITION_OPERATORS.find((o) => o.id === data.operator)?.label ||
    data.operator;

  return (
    <div
      className={cn(
        "text-zinc-850 relative w-[240px] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        isEdit
          ? "border-zinc-300 ring-2 ring-orange-500/40 dark:border-neutral-700"
          : ""
      )}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!h-2 !w-2 !border-2 !border-white !bg-orange-500 dark:!border-neutral-900'
      />

      {/* Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-neutral-800/70 dark:bg-neutral-950/40'>
        <div className='flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400'>
          <GitBranch className='h-4 w-4' />
          <span className='font-sans text-[10px] font-semibold tracking-wider uppercase'>
            <LocalizedText text={"Condition"} />
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
                placeholder='Condition Name'
              />
            </div>

            <div>
              <label className={labelCls}>
                <LocalizedText text={"Field"} />
              </label>
              <input
                type='text'
                value={data.field || ""}
                onChange={(e) =>
                  data.onNodeDataChange(id, { field: e.target.value })
                }
                className={inputCls}
                placeholder='e.g. message.text, email.subject'
              />
            </div>

            <div>
              <label className={labelCls}>
                <LocalizedText text={"Operator"} />
              </label>
              <select
                value={data.operator || "equals"}
                onChange={(e) =>
                  data.onNodeDataChange(id, { operator: e.target.value })
                }
                className={selectCls}
              >
                {CONDITION_OPERATORS.map((op) => (
                  <option
                    key={op.id}
                    value={op.id}
                    className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                  >
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            {data.operator !== "is_empty" &&
              data.operator !== "is_not_empty" && (
                <div>
                  <label className={labelCls}>
                    <LocalizedText text={"Value"} />
                  </label>
                  <input
                    type='text'
                    value={data.value || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { value: e.target.value })
                    }
                    className={inputCls}
                    placeholder='Compare value'
                  />
                </div>
              )}
          </>
        ) : (
          <div className='space-y-1.5'>
            <h4 className='truncate text-xs font-medium text-zinc-900 dark:text-neutral-100'>
              {data.title}
            </h4>
            <div className='space-y-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] text-zinc-600 dark:border-neutral-800/50 dark:bg-neutral-950 dark:text-neutral-400'>
              <span className='block font-medium text-zinc-800 dark:text-neutral-200'>
                <LocalizedText text={"If"} />
                {data.field || "…"}
              </span>
              <span className='mt-0.5 block truncate text-zinc-500 dark:text-neutral-400'>
                {operatorLabel} {data.value || ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Two output handles: True (left) and False (right) */}
      <div className='flex items-center justify-between border-t border-zinc-200 bg-zinc-50/30 px-6 pt-1 pb-3 dark:border-neutral-800/20 dark:bg-neutral-950/10'>
        <span className='font-sans text-[9px] font-semibold tracking-wider text-emerald-500 dark:text-emerald-400'>
          <LocalizedText text={"TRUE"} />
        </span>
        <span className='dark:text-red-450 font-sans text-[9px] font-semibold tracking-wider text-red-500'>
          <LocalizedText text={"FALSE"} />
        </span>
      </div>
      <Handle
        type='source'
        position={Position.Bottom}
        id='true'
        className='!h-2 !w-2 !border-2 !border-white !bg-emerald-500 dark:!border-neutral-900'
        style={{ left: "30%" }}
      />
      <Handle
        type='source'
        position={Position.Bottom}
        id='false'
        className='!h-2 !w-2 !border-2 !border-white !bg-red-500 dark:!border-neutral-900'
        style={{ left: "70%" }}
      />
    </div>
  );
}
