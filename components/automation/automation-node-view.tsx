"use client";

import { ACTION_ICONS } from "./action-node";
import { TRIGGER_ICONS } from "./trigger-node";
import {
  ArrowRightLeft,
  CircleFadingArrowUp,
  Clock,
  GitBranch,
  Globe,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { Handle, Position } from "reactflow";

const NODE_META = {
  trigger: { label: "Trigger", icon: Zap, color: "text-amber-400" },
  action: { label: "Action", icon: ArrowRightLeft, color: "text-sky-400" },
  prompt: { label: "AI prompt", icon: Sparkles, color: "text-violet-400" },
  condition: { label: "Condition", icon: GitBranch, color: "text-emerald-400" },
  delay: { label: "Delay", icon: Clock, color: "text-orange-400" },
  ai_generate: {
    label: "AI generate",
    icon: CircleFadingArrowUp,
    color: "text-fuchsia-400",
  },
  transform: {
    label: "Transform",
    icon: ArrowRightLeft,
    color: "text-cyan-400",
  },
  http_request: {
    label: "HTTP request",
    icon: Globe,
    color: "text-indigo-400",
  },
  upload: { label: "Upload", icon: Upload, color: "text-teal-400" },
} as const;

function nodeSubtitle(kind: keyof typeof NODE_META, data: any) {
  if (data.composioToolkitName) return data.composioToolkitName;
  if (kind === "trigger")
    return String(data.triggerType || "event").replaceAll("_", " ");
  if (kind === "action")
    return String(data.actionType || "action").replaceAll("_", " ");
  if (kind === "condition")
    return (
      [data.field, data.operator, data.value].filter(Boolean).join(" ") ||
      "branch"
    );
  if (kind === "delay")
    return `${data.duration || 0} ${data.unit || "minutes"}`;
  if (kind === "ai_generate")
    return `${data.contentType || "content"} generation`;
  if (kind === "http_request")
    return `${data.method || "GET"} ${data.url || "request"}`;
  if (kind === "upload") return data.fileName || "asset input";
  return data.instruction || data.expression || NODE_META[kind].label;
}

const handleClass =
  "!h-3 !w-3 !border-2 !border-[#161719] !bg-zinc-300 transition-colors hover:!bg-white";

export function AutomationNodeView({
  data,
  kind,
}: {
  data: any;
  kind: keyof typeof NODE_META;
}) {
  const meta = NODE_META[kind];
  const Icon =
    kind === "trigger"
      ? (TRIGGER_ICONS as Record<string, React.ComponentType<any>>)[
          data.triggerType
        ] || meta.icon
      : kind === "action"
        ? (ACTION_ICONS as Record<string, React.ComponentType<any>>)[
            data.actionType
          ] || meta.icon
        : meta.icon;
  const subtitle = nodeSubtitle(kind, data);

  return (
    <div className='relative flex h-[92px] w-[228px] items-center gap-3 rounded-xl border border-zinc-600/90 bg-[#202124] px-4 text-zinc-100 shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-[0_16px_36px_rgba(0,0,0,0.36)]'>
      {kind !== "trigger" && (
        <Handle
          type='target'
          position={Position.Left}
          className={handleClass}
        />
      )}

      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-[#17181a]'>
        {data.composioLogo ? (
          <img
            src={data.composioLogo}
            alt=''
            className='h-7 w-7 rounded-md object-contain'
          />
        ) : (
          <Icon className={`h-6 w-6 ${meta.color}`} strokeWidth={1.8} />
        )}
      </div>

      <div className='min-w-0 flex-1'>
        <p className='mb-1 text-[9px] font-semibold tracking-[0.14em] text-zinc-500 uppercase'>
          {meta.label}
        </p>
        <h3 className='truncate text-[13px] font-semibold text-zinc-100'>
          {data.title || meta.label}
        </h3>
        <p className='mt-1 truncate text-[10px] text-zinc-500 capitalize'>
          {subtitle}
        </p>
      </div>

      {kind === "condition" ? (
        <>
          <Handle
            id='true'
            type='source'
            position={Position.Right}
            className={`${handleClass} !bg-emerald-400`}
            style={{ top: "34%" }}
          />
          <Handle
            id='false'
            type='source'
            position={Position.Right}
            className={`${handleClass} !bg-rose-400`}
            style={{ top: "68%" }}
          />
        </>
      ) : (
        <Handle
          type='source'
          position={Position.Right}
          className={handleClass}
        />
      )}
    </div>
  );
}
