"use client";

import { AgentCard } from "./agent-card";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { useProjectDesign } from "@/context/DesignProject";
import { AUTOMATION_PREVIEW_ID } from "@/lib/chat-preview";
import {
  ArrowRight,
  Bell,
  Bot,
  Calendar,
  Clock,
  Cloud,
  Code,
  Filter,
  GitBranch,
  Globe,
  Image,
  LayoutGrid,
  Link2,
  Mail,
  MessageSquare,
  Mic,
  PlusCircle,
  Send,
  Share2,
  Upload,
  Video,
  Webhook,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

// ─── Helpers ───

const NODE_TYPE_CONFIG: Record<
  string,
  { icon: ReactNode; label: string; color: string }
> = {
  trigger: {
    icon: <Zap className='h-3.5 w-3.5' />,
    label: "Trigger",
    color: "text-amber-600 dark:text-amber-400",
  },
  action: {
    icon: <Send className='h-3.5 w-3.5' />,
    label: "Action",
    color: "text-blue-600 dark:text-blue-400",
  },
  prompt: {
    icon: <MessageSquare className='h-3.5 w-3.5' />,
    label: "Prompt",
    color: "text-violet-600 dark:text-violet-400",
  },
  condition: {
    icon: <GitBranch className='h-3.5 w-3.5' />,
    label: "Condition",
    color: "text-orange-600 dark:text-orange-400",
  },
  delay: {
    icon: <Clock className='h-3.5 w-3.5' />,
    label: "Delay",
    color: "text-cyan-600 dark:text-cyan-400",
  },
  ai_generate: {
    icon: <Bot className='h-3.5 w-3.5' />,
    label: "AI Generate",
    color: "text-purple-600 dark:text-purple-400",
  },
  transform: {
    icon: <Code className='h-3.5 w-3.5' />,
    label: "Transform",
    color: "text-teal-600 dark:text-teal-400",
  },
  http_request: {
    icon: <Globe className='h-3.5 w-3.5' />,
    label: "HTTP Request",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  upload: {
    icon: <Upload className='h-3.5 w-3.5' />,
    label: "Upload",
    color: "text-pink-600 dark:text-pink-400",
  },
};

const TRIGGER_TYPE_LABELS: Record<string, { icon: ReactNode; label: string }> =
  {
    schedule: { icon: <Calendar className='h-3 w-3' />, label: "Schedule" },
    webhook: { icon: <Webhook className='h-3 w-3' />, label: "Webhook" },
    manual: { icon: <Zap className='h-3 w-3' />, label: "Manual" },
    whatsapp_message: {
      icon: <MessageSquare className='h-3 w-3' />,
      label: "WhatsApp Message",
    },
    email_received: {
      icon: <Mail className='h-3 w-3' />,
      label: "Email Received",
    },
    brevo_contact_added: {
      icon: <PlusCircle className='h-3 w-3' />,
      label: "Brevo Contact Added",
    },
    facebook_comment: {
      icon: <MessageSquare className='h-3 w-3' />,
      label: "Facebook Comment",
    },
    facebook_message: {
      icon: <MessageSquare className='h-3 w-3' />,
      label: "Facebook Message",
    },
    instagram_comment: {
      icon: <MessageSquare className='h-3 w-3' />,
      label: "Instagram Comment",
    },
    instagram_dm: {
      icon: <MessageSquare className='h-3 w-3' />,
      label: "Instagram DM",
    },
    calendar_event: {
      icon: <Calendar className='h-3 w-3' />,
      label: "Calendar Event",
    },
    form_submission: {
      icon: <Cloud className='h-3 w-3' />,
      label: "Form Submission",
    },
    x_mention: { icon: <Bell className='h-3 w-3' />, label: "X Mention" },
  };

const ACTION_TYPE_LABELS: Record<string, { icon: ReactNode; label: string }> = {
  send_email: { icon: <Mail className='h-3 w-3' />, label: "Send Email" },
  whatsapp_reply: {
    icon: <MessageSquare className='h-3 w-3' />,
    label: "WhatsApp Reply",
  },
  whatsapp_template: {
    icon: <MessageSquare className='h-3 w-3' />,
    label: "WhatsApp Template",
  },
  post_facebook: {
    icon: <Share2 className='h-3 w-3' />,
    label: "Post to Facebook",
  },
  post_instagram: {
    icon: <Image className='h-3 w-3' />,
    label: "Post to Instagram",
  },
  post_linkedin: {
    icon: <Share2 className='h-3 w-3' />,
    label: "Post to LinkedIn",
  },
  post_x: { icon: <Share2 className='h-3 w-3' />, label: "Post to X" },
  post_tiktok: {
    icon: <Video className='h-3 w-3' />,
    label: "Post to TikTok",
  },
  generate_image: {
    icon: <Image className='h-3 w-3' />,
    label: "Generate Image",
  },
  generate_video: {
    icon: <Video className='h-3 w-3' />,
    label: "Generate Video",
  },
  generate_text: { icon: <Bot className='h-3 w-3' />, label: "Generate Text" },
  generate_audio: {
    icon: <Mic className='h-3 w-3' />,
    label: "Generate Audio",
  },
  add_calendar_event: {
    icon: <Calendar className='h-3 w-3' />,
    label: "Add Calendar Event",
  },
  google_drive_upload: {
    icon: <Upload className='h-3 w-3' />,
    label: "Upload to Google Drive",
  },
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  text: "Text",
  image: "Image",
  video: "Video",
  audio: "Audio",
};

// ─── Node Created Card ───

export function AutomationNodeCreatedCard({ data }: { data: any }) {
  const { setFocusedGenerationId } = useProjectDesign();
  const nodeType = data?.type || "action";
  const config = NODE_TYPE_CONFIG[nodeType] || NODE_TYPE_CONFIG.action;

  // Determine the subtype label and icon
  let subtypeInfo: { icon: ReactNode; label: string } | null = null;
  if (nodeType === "trigger" && data?.triggerType) {
    subtypeInfo = TRIGGER_TYPE_LABELS[data.triggerType] || {
      icon: <Zap className='h-3 w-3' />,
      label: data.triggerType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase()),
    };
  } else if (nodeType === "action" && data?.actionType) {
    subtypeInfo = ACTION_TYPE_LABELS[data.actionType] || {
      icon: <Send className='h-3 w-3' />,
      label: data.actionType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase()),
    };
  } else if (nodeType === "ai_generate" && data?.contentType) {
    subtypeInfo = {
      icon: <Bot className='h-3 w-3' />,
      label: `Generate ${CONTENT_TYPE_LABELS[data.contentType] || data.contentType}`,
    };
  } else if (nodeType === "delay" && data?.duration) {
    subtypeInfo = {
      icon: <Clock className='h-3 w-3' />,
      label: `Wait ${data.duration} ${data.unit || "seconds"}`,
    };
  } else if (nodeType === "condition" && data?.operator) {
    subtypeInfo = {
      icon: <Filter className='h-3 w-3' />,
      label: data.operator
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase()),
    };
  } else if (nodeType === "http_request" && data?.method) {
    subtypeInfo = {
      icon: <Globe className='h-3 w-3' />,
      label:
        `${data.method} ${data.url ? new URL(data.url).hostname : ""}`.trim(),
    };
  }

  return (
    <AgentCard
      icon={<span className='text-foreground'>{config.icon}</span>}
      title={
        <span className='flex items-center gap-1.5'>
          <span>
            <LocalizedText text={"Node added"} />
          </span>
          <span className='text-muted-foreground font-normal'>·</span>
          <span className={"text-foreground"}>{config.label}</span>
        </span>
      }
      meta={
        <span className='text-muted-foreground/70 font-mono text-[10px]'>
          {data?.nodeId?.slice(0, 16)}
        </span>
      }
      tone='success'
    >
      <div className='space-y-2'>
        {/* Node title */}
        <div className='text-foreground text-[13.5px] leading-snug font-medium'>
          {data?.title || "Untitled node"}
        </div>

        {/* Subtype badge */}
        {subtypeInfo && (
          <div className='flex items-center gap-1.5'>
            <span className='bg-foreground/[0.06] text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium dark:bg-white/[0.06]'>
              {subtypeInfo.icon}
              {subtypeInfo.label}
            </span>
          </div>
        )}
        <Button
          variant='outline'
          size='sm'
          className='h-7 gap-1.5 px-2 text-xs'
          onClick={() => setFocusedGenerationId(AUTOMATION_PREVIEW_ID)}
        >
          <LayoutGrid className='h-3 w-3' />
          <LocalizedText text={"View canvas"} />
        </Button>
      </div>
    </AgentCard>
  );
}

// ─── Nodes Connected Card ───

export function AutomationNodesConnectedCard({ data }: { data: any }) {
  const { setFocusedGenerationId } = useProjectDesign();
  const sourceLabel = data?.sourceId
    ? data.sourceId.replace(/-\d+$/, "").replace(/_/g, " ")
    : "Source";
  const targetLabel = data?.targetId
    ? data.targetId.replace(/-\d+$/, "").replace(/_/g, " ")
    : "Target";

  return (
    <AgentCard
      icon={
        <Link2 className='h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400' />
      }
      title='Nodes connected'
      tone='success'
    >
      <div className='flex flex-wrap items-center gap-2 text-[12.5px]'>
        <span className='bg-foreground/[0.05] text-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium dark:bg-white/[0.06]'>
          {sourceLabel}
        </span>
        <ArrowRight className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
        <span className='bg-foreground/[0.05] text-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium dark:bg-white/[0.06]'>
          {targetLabel}
        </span>
        {data?.sourceHandle && (
          <span className='ml-1 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400'>
            {data.sourceHandle}
          </span>
        )}
        <Button
          variant='outline'
          size='sm'
          className='ml-auto h-7 gap-1.5 px-2 text-xs'
          onClick={() => setFocusedGenerationId(AUTOMATION_PREVIEW_ID)}
        >
          <LayoutGrid className='h-3 w-3' />
          <LocalizedText text={"View canvas"} />
        </Button>
      </div>
    </AgentCard>
  );
}

export function AutomationWorkflowSummaryCard({
  nodes,
  connectionCount,
}: {
  nodes: any[];
  connectionCount: number;
}) {
  const { setFocusedGenerationId } = useProjectDesign();
  const nodeCount = nodes.length;

  return (
    <AgentCard
      icon={<LayoutGrid className='h-3.5 w-3.5' />}
      title='Workflow created'
      meta={`${nodeCount} ${nodeCount === 1 ? "node" : "nodes"} · ${connectionCount} ${connectionCount === 1 ? "connection" : "connections"}`}
      tone='success'
    >
      <div className='space-y-2'>
        {nodeCount > 0 && (
          <details className='group rounded-lg border border-white/10 bg-white/[0.02]'>
            <summary className='text-foreground flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium'>
              View nodes
              <span className='text-muted-foreground transition-transform group-open:rotate-180'>
                ⌄
              </span>
            </summary>
            <ul className='divide-border/70 max-h-64 divide-y overflow-y-auto border-t border-white/10 dark:divide-white/10'>
              {nodes.map((node) => (
                <li key={node.nodeId} className='px-3 py-2'>
                  <div className='text-foreground truncate text-xs font-medium'>
                    {node.title || "Untitled node"}
                  </div>
                  <div className='text-muted-foreground mt-0.5 text-[10.5px] capitalize'>
                    {(node.type || "action").replace(/_/g, " ")}
                  </div>
                </li>
              ))}
            </ul>
          </details>
        )}
        <Button
          variant='outline'
          size='sm'
          className='h-7 gap-1.5 px-2 text-xs'
          onClick={() => setFocusedGenerationId(AUTOMATION_PREVIEW_ID)}
        >
          <LayoutGrid className='h-3 w-3' />
          <LocalizedText text={"View workflow in canvas"} />
        </Button>
      </div>
    </AgentCard>
  );
}
