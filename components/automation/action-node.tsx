"use client";

import { ACTION_SUBTYPES, type ActionSubtype } from "./automation-types";
import { ComposioCatalogFields } from "./composio-catalog-fields";
import { ElevenLabsVoiceSelect } from "./elevenlabs-voice-select";
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
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { LocalizedText } from "@/components/localized-text";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowRightLeft,
  AtSign,
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
import React from "react";

export const ACTION_ICONS: Record<ActionSubtype, React.ComponentType<any>> = {
  composio_action: Activity,
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
  post_youtube: YoutubeBrand,
  generate_image: ImagePlus,
  generate_video: Video,
  generate_text: FileText,
  generate_audio: Mic,
  generate_story_video: Video,
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
  playlistId?: string;
  madeForKids?: boolean;
  brief?: string;
  targetDuration?: number;
  characterDescription?: string;
  narrationScript?: string;
  scenes?: Array<{ prompt: string; narration?: string }>;
  imageModelId?: string;
  videoModelId?: string;
  audioModelId?: string;
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

  return (
    <div
      className={cn(
        "relative w-[240px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-xl transition-[border-color,box-shadow] duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
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
          {data.actionType === "composio_action" && data.composioLogo ? (
            <img src={data.composioLogo} alt='' className='h-4 w-4 rounded object-contain' />
          ) : (
            <ArrowRightLeft className='h-4 w-4' />
          )}
          <span className='font-sans text-[10px] font-semibold tracking-wider uppercase'>
            <LocalizedText text={"Action"} />
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
                placeholder='Action Name'
              />
            </div>

            <div>
              <label className={labelCls}>
                <LocalizedText text={"Type"} />
              </label>
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

            {data.actionType === "composio_action" && (
              <ComposioCatalogFields
                mode='action'
                data={data}
                onChange={(fields) => data.onNodeDataChange(id, fields)}
              />
            )}

            {data.validationErrors?.length > 0 && (
              <p className='rounded bg-red-500/10 px-2 py-1.5 text-[10px] text-red-600 dark:text-red-400'>
                {data.validationErrors.join(" · ")}
              </p>
            )}

            {/* ── Send Email config ─────────────────────────── */}
            {(data.actionType === "send_gmail" ||
              data.actionType === "send_brevo_email" ||
              data.actionType === "send_outlook_email") && (
              <>
                <div>
                  <label className={labelCls}>
                    <LocalizedText text={"To"} />
                  </label>
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
                  <label className={labelCls}>
                    <LocalizedText text={"Subject"} />
                  </label>
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
                  <label className={labelCls}>
                    <LocalizedText text={"Body"} />
                  </label>
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
                  <label className={labelCls}>
                    <LocalizedText text={"Recipient ID / To"} />
                  </label>
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
                  <label className={labelCls}>
                    <LocalizedText text={"Reply Message"} />
                  </label>
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
                  <label className={labelCls}>
                    <LocalizedText text={"Recipient ID / To"} />
                  </label>
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
                  <label className={labelCls}>
                    <LocalizedText text={"Template Name/ID"} />
                  </label>
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
              data.actionType === "post_tiktok" ||
              data.actionType === "post_youtube") && (
              <>
                {(data.actionType === "post_tiktok" ||
                  data.actionType === "post_youtube") && (
                  <div>
                    <label className={labelCls}>
                      <LocalizedText text={"Title"} />
                    </label>
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
                  <label className={labelCls}>
                    <LocalizedText text={"Content / Caption"} />
                  </label>
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
                  <label className={labelCls}>
                    <LocalizedText text={"Media URL (optional)"} />
                  </label>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Privacy"} />
                    </label>
                    <select
                      value={data.privacy || "SELF_ONLY"}
                      onChange={(e) =>
                        data.onNodeDataChange(id, { privacy: e.target.value })
                      }
                      className={selectCls}
                    >
                      <option value='PUBLIC'>
                        <LocalizedText text={"Public"} />
                      </option>
                      <option value='MUTUAL'>
                        <LocalizedText text={"Mutual"} />
                      </option>
                      <option value='SELF_ONLY'>
                        <LocalizedText text={"Private (Self Only)"} />
                      </option>
                    </select>
                  </div>
                )}
                {data.actionType === "post_youtube" && (
                  <>
                    <div>
                      <label className={labelCls}>
                        <LocalizedText text={"Privacy"} />
                      </label>
                      <select
                        value={data.privacyStatus || "public"}
                        onChange={(e) =>
                          data.onNodeDataChange(id, {
                            privacyStatus: e.target.value,
                          })
                        }
                        className={selectCls}
                      >
                        <option value='public'>Public</option>
                        <option value='unlisted'>Unlisted</option>
                        <option value='private'>Private</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Category ID</label>
                      <input
                        type='text'
                        value={data.categoryId || "22"}
                        onChange={(e) =>
                          data.onNodeDataChange(id, {
                            categoryId: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder='22'
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
                        placeholder='business, tips, daily'
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Playlist ID (optional)</label>
                      <input
                        type='text'
                        value={data.playlistId || ""}
                        onChange={(e) =>
                          data.onNodeDataChange(id, {
                            playlistId: e.target.value,
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                    <label className='flex items-center gap-2 text-xs text-zinc-600 dark:text-neutral-300'>
                      <input
                        type='checkbox'
                        checked={data.madeForKids || false}
                        onChange={(e) =>
                          data.onNodeDataChange(id, {
                            madeForKids: e.target.checked,
                          })
                        }
                      />
                      Made for kids
                    </label>
                  </>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Post ID"} />
                    </label>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Comment ID"} />
                    </label>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Share ID"} />
                    </label>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Comment URN"} />
                    </label>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Pin ID"} />
                    </label>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Video ID"} />
                    </label>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Tweet ID"} />
                    </label>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Media ID"} />
                    </label>
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
                    <label className={labelCls}>
                      <LocalizedText text={"Message/Content"} />
                    </label>
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
                      <label className={labelCls}>
                        <LocalizedText text={"Title"} />
                      </label>
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
                      <label className={labelCls}>
                        <LocalizedText text={"Board ID"} />
                      </label>
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
                      <label className={labelCls}>
                        <LocalizedText text={"Title"} />
                      </label>
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
                      <label className={labelCls}>
                        <LocalizedText text={"Category ID"} />
                      </label>
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
                      <label className={labelCls}>
                        <LocalizedText text={"Tags"} />
                      </label>
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
                      <label className={labelCls}>
                        <LocalizedText text={"Privacy Status"} />
                      </label>
                      <select
                        value={data.privacyStatus || "private"}
                        onChange={(e) =>
                          data.onNodeDataChange(id, {
                            privacyStatus: e.target.value,
                          })
                        }
                        className={selectCls}
                      >
                        <option value='public'>
                          <LocalizedText text={"Public"} />
                        </option>
                        <option value='private'>
                          <LocalizedText text={"Private"} />
                        </option>
                        <option value='unlisted'>
                          <LocalizedText text={"Unlisted"} />
                        </option>
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
                <label className={labelCls}>
                  <LocalizedText text={"Prompt"} />
                </label>
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

            {data.actionType === "generate_story_video" && (
              <>
                <div>
                  <label className={labelCls}>Story / ad brief</label>
                  <textarea
                    value={data.brief || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, { brief: e.target.value })
                    }
                    className={cn(inputCls, "min-h-[72px] resize-y")}
                    placeholder='Describe the story, audience, characters, and outcome'
                  />
                </div>
                <div>
                  <label className={labelCls}>Exact duration (seconds)</label>
                  <input
                    type='number'
                    min={5}
                    max={300}
                    value={data.targetDuration || 30}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        targetDuration: Number(e.target.value),
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Locked characters</label>
                  <textarea
                    value={data.characterDescription || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        characterDescription: e.target.value,
                      })
                    }
                    className={cn(inputCls, "min-h-[56px] resize-y")}
                    placeholder='Appearance, clothing, colors, personality, and identity'
                  />
                </div>
                <div>
                  <label className={labelCls}>Narration / dialogue</label>
                  <textarea
                    value={data.narrationScript || ""}
                    onChange={(e) =>
                      data.onNodeDataChange(id, {
                        narrationScript: e.target.value,
                      })
                    }
                    className={cn(inputCls, "min-h-[56px] resize-y")}
                  />
                </div>
                {[
                  ["Image model ID", "imageModelId"],
                  ["Video model ID", "videoModelId"],
                  ["Audio model ID", "audioModelId"],
                ].map(([label, field]) => (
                  <div key={field}>
                    <label className={labelCls}>{label}</label>
                    <input
                      type='text'
                      value={String(data[field] || "")}
                      onChange={(e) =>
                        data.onNodeDataChange(id, {
                          [field]: e.target.value,
                        })
                      }
                      className={inputCls}
                      placeholder='Selected in chat before workflow creation'
                    />
                  </div>
                ))}
              </>
            )}

            {data.actionType === "generate_audio" && (
              <ElevenLabsVoiceSelect
                value={data.voiceId}
                onChange={(voiceId, voiceName) =>
                  data.onNodeDataChange(id, { voiceId, voiceName })
                }
              />
            )}

            {/* ── Calendar event action ──────────────────────── */}
            {data.actionType === "add_calendar_event" && (
              <>
                <div>
                  <label className={labelCls}>
                    <LocalizedText text={"Event Title"} />
                  </label>
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
                  <label className={labelCls}>
                    <LocalizedText text={"Date/Time"} />
                  </label>
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
                <label className={labelCls}>
                  <LocalizedText text={"Folder Path"} />
                </label>
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
                {data.actionType === "composio_action" && data.composioLogo ? (
                  <img src={data.composioLogo} alt='' className='h-3.5 w-3.5 rounded object-contain' />
                ) : Icon ? (
                  <Icon className='h-3.5 w-3.5 shrink-0 text-zinc-500 dark:text-neutral-400' />
                ) : null}
                <span>{subtypeConfig?.label || data.actionType}</span>
              </span>
              <span className='mt-0.5 block text-[9px] text-zinc-500 dark:text-neutral-400'>
                {data.actionType === "composio_action"
                  ? data.composioToolkit || "Choose an app"
                  : subtypeConfig?.integration}
              </span>
              {data.actionType === "composio_action" &&
                data.composioToolSlug && (
                  <span className='mt-0.5 block truncate text-[9px] text-zinc-500'>
                    {data.composioToolSlug}
                  </span>
                )}
              {data.recipientEmail && (
                <span className='mt-0.5 block truncate text-[10px]'>
                  <LocalizedText text={"To:"} />
                  {data.recipientEmail}
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
