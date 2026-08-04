"use client";

import { TRIGGER_SUBTYPES, type TriggerSubtype } from "./automation-types";
import {
  BrevoBrand,
  FacebookBrand,
  GoogleCalendarBrand,
  InstagramBrand,
  MessengerBrand,
  WhatsAppBrand,
  XBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  AtSign,
  Blocks,
  CalendarDays,
  ClipboardList,
  Clock,
  Image,
  Inbox,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  Pause,
  Play,
  Send,
  Trash2,
  UserPlus,
  Webhook,
  Zap,
} from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import React from "react";

const TRIGGER_ICONS: Record<TriggerSubtype, any> = {
  pipedream: Blocks,
  schedule: Clock,
  webhook: Webhook,
  manual: Play,
  whatsapp_message: WhatsAppBrand,
  gmail_received: Mail,
  outlook_email_received: Mail,
  brevo_contact_added: BrevoBrand,
  facebook_comment: FacebookBrand,
  facebook_message: FacebookBrand,
  instagram_comment: InstagramBrand,
  instagram_dm: InstagramBrand,
  calendar_event: GoogleCalendarBrand,
  form_submission: ClipboardList,
  x_mention: XBrand,
  messenger_message: MessengerBrand,
};

interface TriggerNodeData {
  title: string;
  triggerType: TriggerSubtype;
  scheduleFrequency?: string;
  cronExpression?: string;
  scheduleTime?: string;
  filterField?: string;
  filterValue?: string;
  senderFilter?: string;
  webhookUrl?: string;
  isActive?: boolean;
  isTesting?: boolean;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
  onTestRun?: (id: string) => void;
}

const inputCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-amber-500/50 transition-colors";

const selectCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-amber-500/50 transition-colors cursor-pointer";

const labelCls =
  "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function TriggerNode({ id, data }: NodeProps<TriggerNodeData>) {
  const isEdit = data.isEditMode;
  const subtype = TRIGGER_SUBTYPES.find((t) => t.id === data.triggerType);
  const Icon = TRIGGER_ICONS[data.triggerType] ?? Zap;

  return (
    <div
      className={cn(
        "relative w-[240px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        isEdit
          ? "border-zinc-300 ring-2 ring-amber-500/40 dark:border-neutral-700"
          : ""
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-neutral-800/70 dark:bg-neutral-950/40'>
        <div className='flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400'>
          <Zap className='h-4 w-4' />
          <span className='font-sans text-[10px] font-semibold tracking-wider uppercase'>
            Trigger
          </span>
        </div>
        <div className='flex items-center gap-1'>
          {isEdit && (
            <button
              onClick={() => data.onRemoveNode(id)}
              className='rounded p-1 text-zinc-500 transition-colors hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400'
            >
              <Trash2 className='h-3.5 w-3.5' />
            </button>
          )}
          {!isEdit && data.isActive === false && (
            <span className='rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-amber-500 uppercase'>
              Paused
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className='space-y-4 p-4'>
        {isEdit ? (
          <>
            <div>
              <label className={labelCls}>Name</label>
              <input
                type='text'
                value={data.title}
                onChange={(e) =>
                  data.onNodeDataChange(id, { title: e.target.value })
                }
                className={inputCls}
                placeholder='Node name'
              />
            </div>

            <div>
              <label className={labelCls}>Trigger</label>
              <select
                value={data.triggerType}
                onChange={(e) =>
                  data.onNodeDataChange(id, { triggerType: e.target.value })
                }
                className={selectCls}
              >
                {TRIGGER_SUBTYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {data.triggerType === "schedule" && (
              <div>
                <label className={labelCls}>Frequency</label>
                <select
                  value={data.scheduleFrequency || "Once"}
                  onChange={(e) =>
                    data.onNodeDataChange(id, {
                      scheduleFrequency: e.target.value,
                    })
                  }
                  className={selectCls}
                >
                  {[
                    "Once",
                    "Every 5 minutes",
                    "Hourly",
                    "Daily",
                    "Every Monday",
                    "Weekly",
                    "Monthly",
                    "Custom",
                  ].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                {data.scheduleFrequency === "Custom" && (
                  <input
                    type='text'
                    value={data.cronExpression || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        cronExpression: e.target.value,
                      })
                    }
                    className={cn(inputCls, "mt-1.5 font-mono")}
                    placeholder='*/5 * * * *'
                  />
                )}
                {(!data.scheduleFrequency ||
                  data.scheduleFrequency === "Once") && (
                  <input
                    type='datetime-local'
                    value={data.scheduleTime || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        scheduleTime: e.target.value,
                      })
                    }
                    className={cn(inputCls, "mt-1.5")}
                  />
                )}
              </div>
            )}

            {data.triggerType === "webhook" && (
              <div>
                <label className={labelCls}>Webhook URL</label>
                <div className='dark:border-neutral-850 rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 font-mono text-[10px] break-all text-zinc-500 dark:bg-neutral-950 dark:text-neutral-400'>
                  {data.webhookUrl || "Generated on save"}
                </div>
              </div>
            )}

            {data.triggerType === "pipedream" && (
              <p className='rounded border border-blue-500/20 bg-blue-500/5 px-2.5 py-2 text-[10px] leading-4 text-zinc-600 dark:text-neutral-300'>
                Ask Genit in chat to connect a plugin event to this trigger node.
              </p>
            )}

            {(data.triggerType === "whatsapp_message" ||
              data.triggerType === "facebook_message" ||
              data.triggerType === "instagram_dm" ||
              data.triggerType === "messenger_message" ||
              data.triggerType === "facebook_comment" ||
              data.triggerType === "instagram_comment" ||
              data.triggerType === "x_mention") && (
              <div>
                <label className={labelCls}>Keyword filter</label>
                <input
                  type='text'
                  value={data.filterValue || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { filterValue: e.target.value })
                  }
                  className={inputCls}
                  placeholder='Leave empty to match all'
                />
              </div>
            )}

            {(data.triggerType === "gmail_received" ||
              data.triggerType === "outlook_email_received") && (
              <>
                <div>
                  <label className={labelCls}>From</label>
                  <input
                    type='text'
                    value={data.senderFilter || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        senderFilter: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder='sender@example.com'
                  />
                </div>
                <div>
                  <label className={labelCls}>Subject contains</label>
                  <input
                    type='text'
                    value={data.filterValue || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { filterValue: e.target.value })
                    }
                    className={inputCls}
                    placeholder='e.g. invoice'
                  />
                </div>
              </>
            )}

            {data.triggerType === "brevo_contact_added" && (
              <div>
                <label className={labelCls}>List</label>
                <input
                  type='text'
                  value={data.filterValue || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { filterValue: e.target.value })
                  }
                  className={inputCls}
                  placeholder='List name'
                />
              </div>
            )}

            {data.triggerType === "calendar_event" && (
              <div>
                <label className={labelCls}>Event type</label>
                <select
                  value={data.filterValue || "created"}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { filterValue: e.target.value })
                  }
                  className={selectCls}
                >
                  <option value='created'>Created</option>
                  <option value='starting'>Starting</option>
                  <option value='updated'>Updated</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>
            )}
            {isEdit && data.onTestRun && (
              <div className='flex items-center gap-2 pt-2'>
                <button
                  onClick={() =>
                    data.onNodeDataChange(id, {
                      isActive: data.isActive === false ? true : false,
                    })
                  }
                  disabled={data.isTesting}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    data.isActive === false
                      ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800/50 dark:bg-zinc-900/20 dark:text-zinc-400 dark:hover:bg-zinc-900/40",
                    data.isTesting && "cursor-not-allowed opacity-50"
                  )}
                  title={
                    data.isActive === false
                      ? "Resume Automation"
                      : "Pause Automation"
                  }
                >
                  {data.isActive === false ? (
                    <Play className='h-3.5 w-3.5' />
                  ) : (
                    <Pause className='h-3.5 w-3.5' />
                  )}
                  {data.isActive === false ? "Paused" : "Active"}
                </button>
                <button
                  onClick={() => data.onTestRun!(id)}
                  disabled={data.isActive === false || data.isTesting}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    data.isActive === false
                      ? "cursor-not-allowed border-transparent bg-zinc-100 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
                      : "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40",
                    data.isTesting && "cursor-not-allowed opacity-50"
                  )}
                >
                  {data.isTesting ? (
                    <LoadingFileLoader size={16} />
                  ) : (
                    <Play className='h-3.5 w-3.5' />
                  )}
                  {data.isTesting ? "Testing..." : "Test Run"}
                </button>
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
                <Icon className='h-3.5 w-3.5 shrink-0 text-zinc-500 dark:text-neutral-400' />
                <span className='text-zinc-850 font-medium dark:text-neutral-200'>
                  {subtype?.label || data.triggerType}
                </span>
              </div>
              {(data.scheduleFrequency || data.filterValue) && (
                <p className='truncate pl-5 text-zinc-500 dark:text-neutral-400'>
                  {data.scheduleFrequency || data.filterValue}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!h-2 !w-2 !border-2 !border-white !bg-amber-500 dark:!border-neutral-900'
      />
    </div>
  );
}
