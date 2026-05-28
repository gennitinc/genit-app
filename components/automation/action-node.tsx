"use client";

import React from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import {
  Activity,
  Trash2,
  Mail,
  MessageCircle,
  FileText,
  Share2,
  Instagram,
  Linkedin,
  Twitter,
  Music2,
  ImagePlus,
  Video,
  Mic,
  Upload,
} from "lucide-react";
import {
  WhatsAppBrand,
  FacebookBrand,
  InstagramBrand,
  LinkedinBrand,
  XBrand,
  TikTokBrand,
  GoogleCalendarBrand,
  GoogleDriveBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { cn } from "@/lib/utils";
import { ACTION_SUBTYPES, type ActionSubtype } from "./automation-types";

const ACTION_ICONS: Record<ActionSubtype, React.ComponentType<any>> = {
  send_email: Mail,
  whatsapp_reply: WhatsAppBrand,
  whatsapp_template: WhatsAppBrand,
  post_facebook: FacebookBrand,
  post_instagram: InstagramBrand,
  post_linkedin: LinkedinBrand,
  post_x: XBrand,
  post_tiktok: TikTokBrand,
  generate_image: ImagePlus,
  generate_video: Video,
  generate_text: FileText,
  generate_audio: Mic,
  add_calendar_event: GoogleCalendarBrand,
  google_drive_upload: GoogleDriveBrand,
};

interface ActionNodeData {
  title: string;
  actionType: ActionSubtype;
  recipientList?: string;
  recipientEmail?: string;
  subject?: string;
  messageBody?: string;
  templateId?: string;
  contentText?: string;
  imageUrl?: string;
  calendarSummary?: string;
  calendarDate?: string;
  driveFolderPath?: string;
  channels?: string[];
  instruction?: string;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
}

const inputCls =
  "w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-blue-500/50 transition-colors";

const selectCls =
  "w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-blue-500/50 transition-colors cursor-pointer";

const labelCls = "block mb-1 text-[9px] font-medium text-neutral-400 uppercase tracking-wider";

export function ActionNode({ id, data }: NodeProps<ActionNodeData>) {
  const isEdit = data.isEditMode;
  const subtypeConfig = ACTION_SUBTYPES.find((a) => a.id === data.actionType);
  const Icon = ACTION_ICONS[data.actionType];

  return (
    <div
      className={cn(
        "w-[240px] overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl relative shadow-xl text-neutral-200 transition-all duration-200",
        isEdit ? "ring-2 ring-blue-500/40 border-neutral-700" : ""
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-blue-500 !border-2 !border-neutral-900"
      />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-neutral-800/70 bg-neutral-950/40">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <Activity className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wider font-sans">
            Action
          </span>
        </div>
        {isEdit && (
          <button
            onClick={() => data.onRemoveNode(id)}
            className="text-neutral-400 hover:text-red-400 transition-colors p-1 rounded"
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
                placeholder="Action Name"
              />
            </div>

            <div>
              <label className={labelCls}>Type</label>
              <select
                value={data.actionType}
                onChange={(e) =>
                  data.onNodeDataChange(id, { actionType: e.target.value })
                }
                className={selectCls}
              >
                <optgroup label="Messaging" className="bg-neutral-900 text-neutral-200">
                  {ACTION_SUBTYPES.filter((a) => a.category === "messaging").map(
                    (a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    )
                  )}
                </optgroup>
                <optgroup label="Social" className="bg-neutral-900 text-neutral-200">
                  {ACTION_SUBTYPES.filter((a) => a.category === "social").map(
                    (a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    )
                  )}
                </optgroup>
                <optgroup label="AI Generation" className="bg-neutral-900 text-neutral-200">
                  {ACTION_SUBTYPES.filter((a) => a.category === "ai").map(
                    (a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    )
                  )}
                </optgroup>
                <optgroup label="Productivity" className="bg-neutral-900 text-neutral-200">
                  {ACTION_SUBTYPES.filter(
                    (a) => a.category === "productivity"
                  ).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* ── Send Email config ─────────────────────────── */}
            {data.actionType === "send_email" && (
              <>
                <div>
                  <label className={labelCls}>To</label>
                  <input
                    type="text"
                    value={data.recipientEmail || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        recipientEmail: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder="recipient@email.com or {{ trigger.email }}"
                  />
                </div>
                <div>
                  <label className={labelCls}>Subject</label>
                  <input
                    type="text"
                    value={data.subject || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { subject: e.target.value })
                    }
                    className={inputCls}
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <label className={labelCls}>Body</label>
                  <textarea
                    value={data.messageBody || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { messageBody: e.target.value })
                    }
                    className={cn(inputCls, "min-h-[40px] resize-none")}
                    placeholder="Email body content"
                  />
                </div>
              </>
            )}

            {/* ── WhatsApp reply ─────────────────────────────── */}
            {data.actionType === "whatsapp_reply" && (
              <div>
                <label className={labelCls}>Reply Message</label>
                <textarea
                  value={data.messageBody || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { messageBody: e.target.value })
                  }
                  className={cn(inputCls, "min-h-[40px] resize-none")}
                  placeholder="Reply text or {{ ai_generate.output }}"
                />
              </div>
            )}

            {/* ── WhatsApp template ──────────────────────────── */}
            {data.actionType === "whatsapp_template" && (
              <div>
                <label className={labelCls}>Template ID</label>
                <input
                  type="text"
                  value={data.templateId || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { templateId: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Template name or ID"
                />
              </div>
            )}

            {/* ── Social post actions ────────────────────────── */}
            {(data.actionType === "post_facebook" ||
              data.actionType === "post_instagram" ||
              data.actionType === "post_linkedin" ||
              data.actionType === "post_x" ||
              data.actionType === "post_tiktok") && (
              <>
                <div>
                  <label className={labelCls}>Content</label>
                  <textarea
                    value={data.contentText || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { contentText: e.target.value })
                    }
                    className={cn(inputCls, "min-h-[40px] resize-none")}
                    placeholder="Post content or {{ previous_step.output }}"
                  />
                </div>
                <div>
                  <label className={labelCls}>Image URL (optional)</label>
                  <input
                    type="text"
                    value={data.imageUrl || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { imageUrl: e.target.value })
                    }
                    className={inputCls}
                    placeholder="https:// or {{ ai_generate.url }}"
                  />
                </div>
              </>
            )}

            {/* ── AI generation actions ──────────────────────── */}
            {(data.actionType === "generate_image" ||
              data.actionType === "generate_video" ||
              data.actionType === "generate_text" ||
              data.actionType === "generate_audio") && (
              <div>
                <label className={labelCls}>Prompt</label>
                <textarea
                  value={data.instruction || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, { instruction: e.target.value })
                  }
                  className={cn(inputCls, "min-h-[50px] resize-none")}
                  placeholder="Describe what to generate..."
                />
              </div>
            )}

            {/* ── Calendar event action ──────────────────────── */}
            {data.actionType === "add_calendar_event" && (
              <>
                <div>
                  <label className={labelCls}>Event Title</label>
                  <input
                    type="text"
                    value={data.calendarSummary || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        calendarSummary: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder="Meeting title"
                  />
                </div>
                <div>
                  <label className={labelCls}>Date/Time</label>
                  <input
                    type="text"
                    value={data.calendarDate || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        calendarDate: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder="2024-01-15T10:00 or {{ trigger.date }}"
                  />
                </div>
              </>
            )}

            {/* ── Google Drive upload ────────────────────────── */}
            {data.actionType === "google_drive_upload" && (
              <div>
                <label className={labelCls}>Folder Path</label>
                <input
                  type="text"
                  value={data.driveFolderPath || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, {
                      driveFolderPath: e.target.value,
                    })
                  }
                  className={inputCls}
                  placeholder="/Automations/Output"
                />
              </div>
            )}
          </>
        ) : (
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-neutral-100 truncate">
              {data.title}
            </h4>
            <div className="text-[10px] text-neutral-400 bg-neutral-950 border border-neutral-800/50 px-3 py-2 rounded-xl space-y-1">
              <span className="font-medium text-neutral-200 flex items-center gap-1.5">
                {Icon && <Icon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />}
                <span>{subtypeConfig?.label || data.actionType}</span>
              </span>
              <span className="block mt-0.5 text-[9px] text-neutral-400">
                {subtypeConfig?.integration}
              </span>
              {data.recipientEmail && (
                <span className="block mt-0.5 truncate text-[10px]">
                  To: {data.recipientEmail}
                </span>
              )}
              {data.contentText && (
                <span className="block mt-0.5 truncate text-[10px] text-neutral-300">
                  {data.contentText}
                </span>
              )}
              {data.instruction && (
                <span className="block mt-0.5 truncate text-[10px] text-neutral-300">
                  {data.instruction}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-blue-500 !border-2 !border-neutral-900"
      />
    </div>
  );
}
