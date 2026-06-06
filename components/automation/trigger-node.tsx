"use client";

import React from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import {
  AtSign,
  CalendarDays,
  ClipboardList,
  Clock,
  Image,
  Inbox,
  Mail,
  MessageCircle,
  MessageSquare,
  Play,
  Send,
  Trash2,
  UserPlus,
  Webhook,
  Zap,
} from "lucide-react";
import {
  WhatsAppBrand,
  BrevoBrand,
  FacebookBrand,
  InstagramBrand,
  GoogleCalendarBrand,
  XBrand,
  MessengerBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { cn } from "@/lib/utils";
import { TRIGGER_SUBTYPES, type TriggerSubtype } from "./automation-types";

const TRIGGER_ICONS: Record<TriggerSubtype, any> = {
  schedule:            Clock,
  webhook:             Webhook,
  manual:              Play,
  whatsapp_message:    WhatsAppBrand,
  email_received:      Mail,
  brevo_contact_added: BrevoBrand,
  facebook_comment:    FacebookBrand,
  facebook_message:    FacebookBrand,
  instagram_comment:   InstagramBrand,
  instagram_dm:        InstagramBrand,
  calendar_event:      GoogleCalendarBrand,
  form_submission:     ClipboardList,
  x_mention:           XBrand,
  messenger_message:   MessengerBrand,
};

interface TriggerNodeData {
  title: string;
  triggerType: TriggerSubtype;
  scheduleFrequency?: string;
  cronExpression?: string;
  filterField?: string;
  filterValue?: string;
  webhookUrl?: string;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

const inputCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-amber-500/50 transition-colors";

const selectCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-amber-500/50 transition-colors cursor-pointer";

const labelCls = "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function TriggerNode({ id, data }: NodeProps<TriggerNodeData>) {
  const isEdit = data.isEditMode;
  const subtype = TRIGGER_SUBTYPES.find((t) => t.id === data.triggerType);
  const Icon = TRIGGER_ICONS[data.triggerType] ?? Zap;

  return (
    <div
      className={cn(
        "w-[240px] overflow-hidden bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-neutral-800 rounded-2xl relative shadow-xl text-zinc-800 dark:text-neutral-200 transition-all duration-200",
        isEdit ? "ring-2 ring-amber-500/40 border-zinc-300 dark:border-neutral-700" : ""
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-neutral-800/70 bg-zinc-50/50 dark:bg-neutral-950/40">
        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400">
          <Zap className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wider font-sans">
            Trigger
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
              <label className={labelCls}>Name</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => data.onNodeDataChange(id, { title: e.target.value })}
                className={inputCls}
                placeholder="Node name"
              />
            </div>

            <div>
              <label className={labelCls}>Trigger</label>
              <select
                value={data.triggerType}
                onChange={(e) => data.onNodeDataChange(id, { triggerType: e.target.value })}
                className={selectCls}
              >
                {TRIGGER_SUBTYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {data.triggerType === "schedule" && (
              <div>
                <label className={labelCls}>Frequency</label>
                <select
                  value={data.scheduleFrequency || "Every Monday"}
                  onChange={(e) => data.onNodeDataChange(id, { scheduleFrequency: e.target.value })}
                  className={selectCls}
                >
                  {["Every 5 minutes","Hourly","Daily","Every Monday","Weekly","Monthly","Custom"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                {data.scheduleFrequency === "Custom" && (
                  <input
                    type="text"
                    value={data.cronExpression || ""}
                    onChange={(e) => data.onNodeDataChange(id, { cronExpression: e.target.value })}
                    className={cn(inputCls, "mt-1.5 font-mono")}
                    placeholder="*/5 * * * *"
                  />
                )}
              </div>
            )}

            {data.triggerType === "webhook" && (
              <div>
                <label className={labelCls}>Webhook URL</label>
                <div className="rounded-xl border border-zinc-200 dark:border-neutral-850 bg-zinc-50 dark:bg-neutral-950 px-2.5 py-1.5 text-[10px] font-mono text-zinc-500 dark:text-neutral-400 break-all">
                  {data.webhookUrl || "Generated on save"}
                </div>
              </div>
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
                  type="text"
                  value={data.filterValue || ""}
                  onChange={(e) => data.onNodeDataChange(id, { filterValue: e.target.value })}
                  className={inputCls}
                  placeholder="Leave empty to match all"
                />
              </div>
            )}

            {data.triggerType === "email_received" && (
              <>
                <div>
                  <label className={labelCls}>From</label>
                  <input type="text" value={data.filterField || ""} onChange={(e) => data.onNodeDataChange(id, { filterField: e.target.value })} className={inputCls} placeholder="sender@example.com" />
                </div>
                <div>
                  <label className={labelCls}>Subject contains</label>
                  <input type="text" value={data.filterValue || ""} onChange={(e) => data.onNodeDataChange(id, { filterValue: e.target.value })} className={inputCls} placeholder="e.g. invoice" />
                </div>
              </>
            )}

            {data.triggerType === "brevo_contact_added" && (
              <div>
                <label className={labelCls}>List</label>
                <input type="text" value={data.filterValue || ""} onChange={(e) => data.onNodeDataChange(id, { filterValue: e.target.value })} className={inputCls} placeholder="List name" />
              </div>
            )}

            {data.triggerType === "calendar_event" && (
              <div>
                <label className={labelCls}>Event type</label>
                <select value={data.filterValue || "created"} onChange={(e) => data.onNodeDataChange(id, { filterValue: e.target.value })} className={selectCls}>
                  <option value="created">Created</option>
                  <option value="starting">Starting</option>
                  <option value="updated">Updated</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-zinc-900 dark:text-neutral-100 truncate">
              {data.title}
            </h4>
            <div className="text-[10px] text-zinc-600 dark:text-neutral-400 bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800/50 px-3 py-2 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-zinc-500 dark:text-neutral-400 shrink-0" />
                <span className="font-medium text-zinc-850 dark:text-neutral-200">
                  {subtype?.label || data.triggerType}
                </span>
              </div>
              {(data.scheduleFrequency || data.filterValue) && (
                <p className="text-zinc-500 dark:text-neutral-400 pl-5 truncate">
                  {data.scheduleFrequency || data.filterValue}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-amber-500 !border-2 !border-white dark:!border-neutral-900"
      />
    </div>
  );
}
