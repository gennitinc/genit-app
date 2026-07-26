"use client";

import { HTTP_METHODS, type HttpMethod } from "./automation-types";
import { cn } from "@/lib/utils";
import { Globe, Plus, Trash2, X } from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import React from "react";

interface HttpHeader {
  key: string;
  value: string;
}

interface HttpRequestNodeData {
  title: string;
  method: HttpMethod;
  url: string;
  headers: HttpHeader[];
  body: string;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

const inputCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-indigo-500/50 transition-colors";

const selectCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-indigo-500/50 transition-colors cursor-pointer";

const labelCls =
  "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function HttpRequestNode({ id, data }: NodeProps<HttpRequestNodeData>) {
  const isEdit = data.isEditMode;
  const headers: HttpHeader[] = data.headers || [];

  const updateHeader = (index: number, field: "key" | "value", val: string) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: val };
    data.onNodeDataChange(id, { headers: updated });
  };

  const addHeader = () => {
    data.onNodeDataChange(id, {
      headers: [...headers, { key: "", value: "" }],
    });
  };

  const removeHeader = (index: number) => {
    data.onNodeDataChange(id, {
      headers: headers.filter((_, i) => i !== index),
    });
  };

  const methodColor: Record<HttpMethod, string> = {
    GET: "text-emerald-600 dark:text-emerald-400",
    POST: "text-blue-600 dark:text-blue-400",
    PUT: "text-amber-600 dark:text-amber-400",
    PATCH: "text-orange-600 dark:text-orange-400",
    DELETE: "text-red-600 dark:text-red-400",
  };

  return (
    <div
      className={cn(
        "relative w-[280px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        isEdit
          ? "border-zinc-300 ring-2 ring-indigo-500/40 dark:border-neutral-700"
          : ""
      )}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!h-2 !w-2 !border-2 !border-white !bg-indigo-500 dark:!border-neutral-900'
      />

      {/* Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-neutral-800/70 dark:bg-neutral-950/40'>
        <div className='flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400'>
          <Globe className='h-4 w-4' />
          <span className='font-sans text-[10px] font-semibold tracking-wider uppercase'>
            HTTP Request
          </span>
        </div>
        {isEdit && (
          <button
            onClick={() => data.onRemoveNode(id)}
            className='hover:text-red-550 rounded p-1 text-zinc-500 transition-colors dark:text-neutral-400 dark:hover:text-red-400'
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
                placeholder='HTTP Request'
              />
            </div>

            <div className='flex gap-2'>
              <div className='w-[80px]'>
                <label className={labelCls}>Method</label>
                <select
                  value={data.method || "GET"}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { method: e.target.value })
                  }
                  className={selectCls}
                >
                  {HTTP_METHODS.map((m) => (
                    <option
                      key={m}
                      value={m}
                      className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                    >
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex-1'>
                <label className={labelCls}>URL</label>
                <input
                  type='text'
                  value={data.url || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { url: e.target.value })
                  }
                  className={cn(inputCls, "font-mono text-[11px]")}
                  placeholder='https://api.example.com'
                />
              </div>
            </div>

            {/* Headers */}
            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <label className={labelCls}>Headers</label>
                <button
                  onClick={addHeader}
                  className='text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
                >
                  <Plus className='h-3.5 w-3.5' />
                </button>
              </div>
              {headers.length > 0 && (
                <div className='max-h-[80px] space-y-1.5 overflow-y-auto'>
                  {headers.map((h, i) => (
                    <div key={i} className='flex items-center gap-1.5'>
                      <input
                        type='text'
                        value={h.key}
                        onChange={(e) => updateHeader(i, "key", e.target.value)}
                        className='dark:border-neutral-850 flex-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-[10px] text-zinc-800 transition-colors outline-none focus:border-indigo-500/50 dark:bg-neutral-950 dark:text-neutral-200'
                        placeholder='Header'
                      />
                      <span className='text-[10px] font-bold text-zinc-400 dark:text-neutral-500'>
                        :
                      </span>
                      <input
                        type='text'
                        value={h.value}
                        onChange={(e) =>
                          updateHeader(i, "value", e.target.value)
                        }
                        className='dark:border-neutral-850 flex-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-[10px] text-zinc-800 transition-colors outline-none focus:border-indigo-500/50 dark:bg-neutral-950 dark:text-neutral-200'
                        placeholder='Value'
                      />
                      <button
                        onClick={() => removeHeader(i)}
                        className='text-zinc-550 dark:text-neutral-450 transition-colors hover:text-red-500 dark:hover:text-red-400'
                      >
                        <X className='h-3.5 w-3.5' />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Body (only for POST/PUT/PATCH) */}
            {data.method !== "GET" && data.method !== "DELETE" && (
              <div>
                <label className={labelCls}>Body</label>
                <textarea
                  value={data.body || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { body: e.target.value })
                  }
                  className={cn(
                    inputCls,
                    "min-h-[40px] resize-none font-mono text-[10px]"
                  )}
                  placeholder='{ "key": "value" }'
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
              <div className='flex items-center gap-1.5'>
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    methodColor[data.method as HttpMethod] ||
                      "text-zinc-800 dark:text-neutral-200"
                  )}
                >
                  {data.method || "GET"}
                </span>
                <span className='flex-1 truncate font-mono text-[9px] text-zinc-700 dark:text-neutral-300'>
                  {data.url || "No URL set"}
                </span>
              </div>
              {headers.length > 0 && (
                <span className='mt-0.5 block pl-8 text-zinc-500 dark:text-neutral-400'>
                  {headers.length} header{headers.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!h-2 !w-2 !border-2 !border-white !bg-indigo-500 dark:!border-neutral-900'
      />
    </div>
  );
}
