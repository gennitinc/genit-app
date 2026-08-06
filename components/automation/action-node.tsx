"use client";

import { ACTION_SUBTYPES, type ActionSubtype } from "./automation-types";
import {
  FacebookBrand,
  GoogleCalendarBrand,
  GoogleDriveBrand,
  InstagramBrand,
  LinkedinBrand,
  MessengerBrand,
  TikTokBrand,
  WhatsAppBrand,
  XBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { cn } from "@/lib/utils";
import { useIntegrations } from "@/hooks/use-integrations";
import { apiResponse } from "@/utils/apiResponse";
import {
  Activity,
  AtSign,
  Blocks,
  FileText,
  Image,
  ImagePlus,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Mic,
  Music2,
  Share2,
  Trash2,
  Twitter,
  Upload,
  Video,
} from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import React, { useEffect, useState } from "react";

const ACTION_ICONS: Record<ActionSubtype, React.ComponentType<any>> = {
  pipedream_action: Blocks,
  send_gmail: Mail,
  send_brevo_email: Mail,
  send_outlook_email: Mail,
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
  messenger_reply: MessengerBrand,
  update_facebook_post: FacebookBrand,
  delete_facebook_post: FacebookBrand,
  reply_facebook_comment: FacebookBrand,
  delete_linkedin_post: LinkedinBrand,
  reply_linkedin_comment: LinkedinBrand,
  update_pinterest_pin: Image,
  delete_pinterest_pin: Image,
  update_youtube_video: Video,
  delete_youtube_video: Video,
  reply_youtube_comment: MessageCircle,
  delete_tweet: XBrand,
  delete_threads_post: AtSign,
  reply_instagram_comment: InstagramBrand,
};

interface ActionNodeData {
  title: string;
  actionType: ActionSubtype;
  recipientList?: string;
  recipientEmail?: string;
  recipientId?: string;
  to?: string;
  subject?: string;
  messageBody?: string;
  templateId?: string;
  templateName?: string;
  contentText?: string;
  imageUrl?: string;
  videoUrl?: string;
  calendarSummary?: string;
  calendarDate?: string;
  driveFolderPath?: string;
  channels?: string[];
  instruction?: string;
  postId?: string;
  commentId?: string;
  shareId?: string;
  pinId?: string;
  videoId?: string;
  tweetId?: string;
  mediaId?: string;
  boardId?: string;
  postTitle?: string;
  description?: string;
  privacy?: string;
  disableComment?: boolean;
  disableDuet?: boolean;
  disableStitch?: boolean;
  mode?: string;
  categoryId?: string;
  tags?: string;
  privacyStatus?: string;
  appSlug?: string;
  actionId?: string;
  integrationId?: string;
  configuredProps?: Record<string, unknown>;
  proxyUrl?: string;
  proxyMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  proxyHeaders?: Record<string, string>;
  proxyBody?: unknown;
  confirmed?: boolean;
  isEditMode: boolean;
  nodeId: string;
  onRemoveNode: (id: string) => void;
  onNodeDataChange: (id: string, updatedData: any) => void;
  [key: string]: any;
}

const inputCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-blue-500/50 transition-colors";

const selectCls =
  "w-full bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-neutral-800 rounded px-2.5 py-1.5 text-xs text-zinc-800 dark:text-neutral-200 outline-none focus:border-blue-500/50 transition-colors cursor-pointer";

const labelCls =
  "block mb-1 text-[9px] font-medium text-zinc-500 dark:text-neutral-400 uppercase tracking-wider";

export function ActionNode({ id, data }: NodeProps<ActionNodeData>) {
  const isEdit = data.isEditMode;
  const subtypeConfig = ACTION_SUBTYPES.find((a) => a.id === data.actionType);
  const Icon = ACTION_ICONS[data.actionType];
  const { integrations } = useIntegrations();
  const pluginConnections = integrations.filter(
    (item) => item.platform === "pipedream" && item.status === "active"
  );
  const [pluginActions, setPluginActions] = useState<
    Array<{ key: string; name: string; annotations?: { destructiveHint?: boolean } }>
  >([]);
  const [pluginPropsText, setPluginPropsText] = useState(() =>
    JSON.stringify(data.configuredProps || {}, null, 2)
  );
  const [pluginPropsError, setPluginPropsError] = useState("");
  const [proxyBodyText, setProxyBodyText] = useState(() =>
    JSON.stringify(data.proxyBody || {}, null, 2)
  );
  const [proxyHeadersText, setProxyHeadersText] = useState(() =>
    JSON.stringify(data.proxyHeaders || {}, null, 2)
  );

  useEffect(() => {
    if (data.actionType !== "pipedream_action" || !data.integrationId || !data.appSlug) {
      setPluginActions([]);
      return;
    }
    let active = true;
    apiResponse
      .get(`/integrations/pipedream/${data.integrationId}/actions`, {
        params: { app: data.appSlug, limit: 100 },
      })
      .then(({ data: response }) => {
        if (active) setPluginActions(response.actions || []);
      })
      .catch(() => active && setPluginActions([]));
    return () => {
      active = false;
    };
  }, [data.actionType, data.appSlug, data.integrationId]);

  return (
    <div
      className={cn(
        "relative w-[240px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        isEdit
          ? "border-zinc-300 ring-2 ring-blue-500/40 dark:border-neutral-700"
          : ""
      )}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!h-2 !w-2 !border-2 !border-white !bg-blue-500 dark:!border-neutral-900'
      />

      {/* Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-neutral-800/70 dark:bg-neutral-950/40'>
        <div className='flex items-center gap-1.5 text-zinc-500 dark:text-neutral-400'>
          <Activity className='h-4 w-4' />
          <span className='font-sans text-[10px] font-semibold tracking-wider uppercase'>
            Action
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
                placeholder='Action Name'
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
                <optgroup
                  label='Messaging'
                  className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                >
                  {ACTION_SUBTYPES.filter(
                    (a) => a.category === "messaging"
                  ).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup
                  label='Social'
                  className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                >
                  {ACTION_SUBTYPES.filter((a) => a.category === "social").map(
                    (a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    )
                  )}
                </optgroup>
                <optgroup
                  label='AI Generation'
                  className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                >
                  {ACTION_SUBTYPES.filter((a) => a.category === "ai").map(
                    (a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    )
                  )}
                </optgroup>
                <optgroup
                  label='Productivity'
                  className='bg-white text-zinc-800 dark:bg-neutral-900 dark:text-neutral-200'
                >
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

            {data.actionType === "pipedream_action" && (
              <>
                <div>
                  <label className={labelCls}>Connected plugin</label>
                  <select
                    value={data.integrationId || ""}
                    onChange={(event) => {
                      const connection = pluginConnections.find(
                        (item) => item._id === event.target.value
                      );
                      setPluginPropsText("{}");
                      setPluginPropsError("");
                      data.onNodeDataChange(id, {
                        integrationId: connection?._id || "",
                        appSlug: connection?.metadata?.appSlug || "",
                        actionId: "",
                        configuredProps: {},
                        proxyUrl: undefined,
                        proxyMethod: "GET",
                        proxyHeaders: {},
                        proxyBody: {},
                        confirmed: false,
                      });
                    }}
                    className={selectCls}
                  >
                    <option value=''>Select a plugin</option>
                    {pluginConnections.map((connection) => (
                      <option key={connection._id} value={connection._id}>
                        {connection.metadata?.appName || connection.metadata?.appSlug} — {connection.accountName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Execution mode</label>
                  <select
                    value={data.proxyUrl !== undefined && !data.actionId ? "api" : "action"}
                    onChange={(event) => {
                      setPluginPropsText("{}");
                      setProxyBodyText("{}");
                      setPluginPropsError("");
                      data.onNodeDataChange(id, {
                        actionId: "",
                        proxyUrl: event.target.value === "api" ? "" : undefined,
                        proxyMethod: "GET",
                        proxyHeaders: {},
                        proxyBody: {},
                        configuredProps: {},
                        confirmed: false,
                      });
                    }}
                    className={selectCls}
                    disabled={!data.integrationId}
                  >
                    <option value='action'>Prebuilt action</option>
                    <option value='api'>Custom API request</option>
                  </select>
                </div>
                {data.proxyUrl === undefined || data.actionId ? (
                  <>
                    <div>
                      <label className={labelCls}>Action</label>
                      <select
                        value={data.actionId || ""}
                        onChange={(event) => {
                          setPluginPropsText("{}");
                          setPluginPropsError("");
                          data.onNodeDataChange(id, {
                            actionId: event.target.value,
                            configuredProps: {},
                            confirmed: false,
                          });
                        }}
                        className={selectCls}
                        disabled={!data.integrationId}
                      >
                        <option value=''>Select an action</option>
                        {pluginActions.map((action) => (
                          <option key={action.key} value={action.key}>
                            {action.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Configured inputs (JSON)</label>
                      <textarea
                        value={pluginPropsText}
                        onChange={(event) => {
                          const value = event.target.value;
                          setPluginPropsText(value);
                          try {
                            const configuredProps = JSON.parse(value || "{}");
                            if (!configuredProps || Array.isArray(configuredProps) || typeof configuredProps !== "object")
                              throw new Error("Inputs must be a JSON object");
                            setPluginPropsError("");
                            data.onNodeDataChange(id, { configuredProps });
                          } catch (error: any) {
                            setPluginPropsError(error?.message || "Invalid JSON");
                          }
                        }}
                        className={cn(inputCls, "min-h-[72px] resize-y font-mono")}
                        placeholder='{"channel":"C123","text":"Hello"}'
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className='grid grid-cols-[72px_1fr] gap-2'>
                      <div>
                        <label className={labelCls}>Method</label>
                        <select
                          value={data.proxyMethod || "GET"}
                          onChange={(event) => data.onNodeDataChange(id, { proxyMethod: event.target.value, confirmed: false })}
                          className={selectCls}
                        >
                          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => <option key={method}>{method}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Provider API URL</label>
                        <input
                          type='url'
                          value={data.proxyUrl || ""}
                          onChange={(event) => data.onNodeDataChange(id, { proxyUrl: event.target.value })}
                          className={inputCls}
                          placeholder='https://api.provider.com/v1/...'
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Headers (JSON, optional)</label>
                      <textarea
                        value={proxyHeadersText}
                        onChange={(event) => {
                          const value = event.target.value;
                          setProxyHeadersText(value);
                          try {
                            const proxyHeaders = JSON.parse(value || "{}");
                            if (!proxyHeaders || Array.isArray(proxyHeaders) || typeof proxyHeaders !== "object")
                              throw new Error("Headers must be a JSON object");
                            setPluginPropsError("");
                            data.onNodeDataChange(id, { proxyHeaders });
                          } catch (error: any) {
                            setPluginPropsError(error?.message || "Invalid JSON");
                          }
                        }}
                        className={cn(inputCls, "min-h-[52px] resize-y font-mono")}
                        placeholder='{"content-type":"application/json"}'
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Request body (JSON)</label>
                      <textarea
                        value={proxyBodyText}
                        onChange={(event) => {
                          const value = event.target.value;
                          setProxyBodyText(value);
                          try {
                            const proxyBody = JSON.parse(value || "{}");
                            setPluginPropsError("");
                            data.onNodeDataChange(id, { proxyBody });
                          } catch (error: any) {
                            setPluginPropsError(error?.message || "Invalid JSON");
                          }
                        }}
                        className={cn(inputCls, "min-h-[72px] resize-y font-mono")}
                        placeholder='{"message":"{{event.text}}"}'
                      />
                    </div>
                  </>
                )}
                <div>
                  {pluginPropsError && (
                    <p className='mt-1 text-[9px] text-red-500'>
                      {pluginPropsError}
                    </p>
                  )}
                  {!pluginPropsError && (
                    <p className='text-muted-foreground mt-1 text-[9px]'>
                      Event values can use {"{{event.field}}"}.
                    </p>
                  )}
                </div>
                {(pluginActions.find((action) => action.key === data.actionId)
                  ?.annotations?.destructiveHint || data.proxyMethod === "DELETE") && (
                  <label className='flex items-start gap-2 text-[10px] text-zinc-600 dark:text-neutral-300'>
                    <input
                      type='checkbox'
                      checked={data.confirmed === true}
                      onChange={(event) =>
                        data.onNodeDataChange(id, {
                          confirmed: event.target.checked,
                        })
                      }
                      className='mt-0.5'
                    />
                    I confirm this destructive action may modify or delete external data.
                  </label>
                )}
              </>
            )}

            {/* ── Send Email config ─────────────────────────── */}
            {(data.actionType === "send_gmail" ||
              data.actionType === "send_brevo_email" ||
              data.actionType === "send_outlook_email") && (
              <>
                <div>
                  <label className={labelCls}>To</label>
                  <input
                    type='text'
                    value={data.recipientEmail || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        recipientEmail: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder='recipient@email.com or {{ trigger.email }}'
                  />
                </div>
                <div>
                  <label className={labelCls}>Subject</label>
                  <input
                    type='text'
                    value={data.subject || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { subject: e.target.value })
                    }
                    className={inputCls}
                    placeholder='Email subject'
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
                    placeholder='Email body content'
                  />
                </div>
              </>
            )}

            {/* ── WhatsApp/Messenger reply ─────────────────────────────── */}
            {(data.actionType === "whatsapp_reply" ||
              data.actionType === "messenger_reply") && (
              <>
                <div>
                  <label className={labelCls}>Recipient ID / To</label>
                  <input
                    type='text'
                    value={data.recipientId || data.to || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        recipientId: e.target.value,
                        to: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder='Recipient phone or ID'
                  />
                </div>
                <div>
                  <label className={labelCls}>Reply Message</label>
                  <textarea
                    value={data.messageBody || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { messageBody: e.target.value })
                    }
                    className={cn(inputCls, "min-h-[40px] resize-none")}
                    placeholder='Reply text or {{ ai_generate.output }}'
                  />
                </div>
              </>
            )}

            {/* ── WhatsApp template ──────────────────────────── */}
            {data.actionType === "whatsapp_template" && (
              <>
                <div>
                  <label className={labelCls}>Recipient ID / To</label>
                  <input
                    type='text'
                    value={data.to || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { to: e.target.value })
                    }
                    className={inputCls}
                    placeholder='Recipient phone number'
                  />
                </div>
                <div>
                  <label className={labelCls}>Template Name/ID</label>
                  <input
                    type='text'
                    value={data.templateId || data.templateName || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        templateId: e.target.value,
                        templateName: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder='Template name or ID'
                  />
                </div>
              </>
            )}

            {/* ── Social post actions ────────────────────────── */}
            {(data.actionType === "post_facebook" ||
              data.actionType === "post_instagram" ||
              data.actionType === "post_linkedin" ||
              data.actionType === "post_x" ||
              data.actionType === "post_tiktok") && (
              <>
                {data.actionType === "post_tiktok" && (
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      type='text'
                      value={data.postTitle || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { postTitle: e.target.value })
                      }
                      className={inputCls}
                      placeholder='Video Title'
                    />
                  </div>
                )}
                <div>
                  <label className={labelCls}>Content / Caption</label>
                  <textarea
                    value={data.contentText || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { contentText: e.target.value })
                    }
                    className={cn(inputCls, "min-h-[40px] resize-none")}
                    placeholder='Post content or {{ previous_step.output }}'
                  />
                </div>
                <div>
                  <label className={labelCls}>Media URL (optional)</label>
                  <input
                    type='text'
                    value={data.imageUrl || data.videoUrl || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        imageUrl: e.target.value,
                        videoUrl: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder='https:// or {{ ai_generate.url }}'
                  />
                </div>
                {data.actionType === "post_tiktok" && (
                  <div>
                    <label className={labelCls}>Privacy</label>
                    <select
                      value={data.privacy || "SELF_ONLY"}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { privacy: e.target.value })
                      }
                      className={selectCls}
                    >
                      <option value='PUBLIC'>Public</option>
                      <option value='MUTUAL'>Mutual</option>
                      <option value='SELF_ONLY'>Private (Self Only)</option>
                    </select>
                  </div>
                )}
              </>
            )}

            {/* ── Social Media Updates/Deletions ────────────────────────── */}
            {(data.actionType === "update_facebook_post" ||
              data.actionType === "delete_facebook_post" ||
              data.actionType === "reply_facebook_comment" ||
              data.actionType === "delete_linkedin_post" ||
              data.actionType === "reply_linkedin_comment" ||
              data.actionType === "update_pinterest_pin" ||
              data.actionType === "delete_pinterest_pin" ||
              data.actionType === "update_youtube_video" ||
              data.actionType === "delete_youtube_video" ||
              data.actionType === "reply_youtube_comment" ||
              data.actionType === "delete_tweet" ||
              data.actionType === "delete_threads_post" ||
              data.actionType === "reply_instagram_comment") && (
              <>
                {(data.actionType === "update_facebook_post" ||
                  data.actionType === "delete_facebook_post") && (
                  <div>
                    <label className={labelCls}>Post ID</label>
                    <input
                      type='text'
                      value={data.postId || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { postId: e.target.value })
                      }
                      className={inputCls}
                      placeholder='Post ID'
                    />
                  </div>
                )}
                {(data.actionType === "reply_facebook_comment" ||
                  data.actionType === "reply_youtube_comment" ||
                  data.actionType === "reply_instagram_comment") && (
                  <div>
                    <label className={labelCls}>Comment ID</label>
                    <input
                      type='text'
                      value={data.commentId || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { commentId: e.target.value })
                      }
                      className={inputCls}
                      placeholder='Comment ID'
                    />
                  </div>
                )}
                {data.actionType === "delete_linkedin_post" && (
                  <div>
                    <label className={labelCls}>Share ID</label>
                    <input
                      type='text'
                      value={data.shareId || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { shareId: e.target.value })
                      }
                      className={inputCls}
                      placeholder='Share ID'
                    />
                  </div>
                )}
                {data.actionType === "reply_linkedin_comment" && (
                  <div>
                    <label className={labelCls}>Comment URN</label>
                    <input
                      type='text'
                      value={data.commentUrn || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, {
                          commentUrn: e.target.value,
                        })
                      }
                      className={inputCls}
                      placeholder='Comment URN'
                    />
                  </div>
                )}
                {(data.actionType === "update_pinterest_pin" ||
                  data.actionType === "delete_pinterest_pin") && (
                  <div>
                    <label className={labelCls}>Pin ID</label>
                    <input
                      type='text'
                      value={data.pinId || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { pinId: e.target.value })
                      }
                      className={inputCls}
                      placeholder='Pin ID'
                    />
                  </div>
                )}
                {(data.actionType === "update_youtube_video" ||
                  data.actionType === "delete_youtube_video") && (
                  <div>
                    <label className={labelCls}>Video ID</label>
                    <input
                      type='text'
                      value={data.videoId || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { videoId: e.target.value })
                      }
                      className={inputCls}
                      placeholder='Video ID'
                    />
                  </div>
                )}
                {data.actionType === "delete_tweet" && (
                  <div>
                    <label className={labelCls}>Tweet ID</label>
                    <input
                      type='text'
                      value={data.tweetId || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { tweetId: e.target.value })
                      }
                      className={inputCls}
                      placeholder='Tweet ID'
                    />
                  </div>
                )}
                {data.actionType === "delete_threads_post" && (
                  <div>
                    <label className={labelCls}>Media ID</label>
                    <input
                      type='text'
                      value={data.mediaId || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { mediaId: e.target.value })
                      }
                      className={inputCls}
                      placeholder='Media ID'
                    />
                  </div>
                )}

                {/* Content text for updates/replies */}
                {(data.actionType === "update_facebook_post" ||
                  data.actionType === "reply_facebook_comment" ||
                  data.actionType === "reply_linkedin_comment" ||
                  data.actionType === "reply_youtube_comment" ||
                  data.actionType === "reply_instagram_comment" ||
                  data.actionType === "update_pinterest_pin" ||
                  data.actionType === "update_youtube_video") && (
                  <div>
                    <label className={labelCls}>Message/Content</label>
                    <textarea
                      value={data.contentText || ""}
                      onChange={(e) =>
                        data.onNodeDataChange(id, {
                          contentText: e.target.value,
                        })
                      }
                      className={cn(inputCls, "min-h-[40px] resize-none")}
                      placeholder='Message text'
                    />
                  </div>
                )}

                {/* Additional fields for Pinterest Update */}
                {data.actionType === "update_pinterest_pin" && (
                  <>
                    <div>
                      <label className={labelCls}>Title</label>
                      <input
                        type='text'
                        value={data.postTitle || ""}
                        onChange={(e) =>
                          data.onNodeDataChange(id, {
                            postTitle: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder='New Title'
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Board ID</label>
                      <input
                        type='text'
                        value={data.boardId || ""}
                        onChange={(e) =>
                          data.onNodeDataChange(id, { boardId: e.target.value })
                        }
                        className={inputCls}
                        placeholder='Board ID'
                      />
                    </div>
                  </>
                )}

                {/* Additional fields for YouTube Update */}
                {data.actionType === "update_youtube_video" && (
                  <>
                    <div>
                      <label className={labelCls}>Title</label>
                      <input
                        type='text'
                        value={data.postTitle || ""}
                        onChange={(e) =>
                          data.onNodeDataChange(id, {
                            postTitle: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder='New Title'
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Category ID</label>
                      <input
                        type='text'
                        value={data.categoryId || ""}
                        onChange={(e) =>
                          data.onNodeDataChange(id, {
                            categoryId: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder='Category ID'
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Tags</label>
                      <input
                        type='text'
                        value={data.tags || ""}
                        onChange={(e) =>
                          data.onNodeDataChange(id, { tags: e.target.value })
                        }
                        className={inputCls}
                        placeholder='tag1, tag2'
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Privacy Status</label>
                      <select
                        value={data.privacyStatus || "private"}
                        onChange={(e) =>
                          data.onNodeDataChange(id, {
                            privacyStatus: e.target.value,
                          })
                        }
                        className={selectCls}
                      >
                        <option value='public'>Public</option>
                        <option value='private'>Private</option>
                        <option value='unlisted'>Unlisted</option>
                      </select>
                    </div>
                  </>
                )}
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
                  placeholder='Describe what to generate...'
                />
              </div>
            )}

            {/* ── Calendar event action ──────────────────────── */}
            {data.actionType === "add_calendar_event" && (
              <>
                <div>
                  <label className={labelCls}>Event Title</label>
                  <input
                    type='text'
                    value={data.calendarSummary || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        calendarSummary: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder='Meeting title'
                  />
                </div>
                <div>
                  <label className={labelCls}>Date/Time</label>
                  <input
                    type='text'
                    value={data.calendarDate || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        calendarDate: e.target.value,
                      })
                    }
                    className={inputCls}
                    placeholder='2024-01-15T10:00 or {{ trigger.date }}'
                  />
                </div>
              </>
            )}

            {/* ── Google Drive upload ────────────────────────── */}
            {data.actionType === "google_drive_upload" && (
              <div>
                <label className={labelCls}>Folder Path</label>
                <input
                  type='text'
                  value={data.driveFolderPath || ""}
                  onChange={(e) =>
                    data.onNodeDataChange(id, {
                      driveFolderPath: e.target.value,
                    })
                  }
                  className={inputCls}
                  placeholder='/Automations/Output'
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
              <span className='flex items-center gap-1.5 font-medium text-zinc-800 dark:text-neutral-200'>
                {Icon && (
                  <Icon className='h-3.5 w-3.5 shrink-0 text-zinc-500 dark:text-neutral-400' />
                )}
                <span>{subtypeConfig?.label || data.actionType}</span>
              </span>
              <span className='mt-0.5 block text-[9px] text-zinc-500 dark:text-neutral-400'>
                {subtypeConfig?.integration}
              </span>
              {data.recipientEmail && (
                <span className='mt-0.5 block truncate text-[10px]'>
                  To: {data.recipientEmail}
                </span>
              )}
              {data.contentText && (
                <span className='mt-0.5 block truncate text-[10px] text-zinc-700 dark:text-neutral-300'>
                  {data.contentText}
                </span>
              )}
              {data.instruction && (
                <span className='mt-0.5 block truncate text-[10px] text-zinc-700 dark:text-neutral-300'>
                  {data.instruction}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!h-2 !w-2 !border-2 !border-white !bg-blue-500 dark:!border-neutral-900'
      />
    </div>
  );
}
