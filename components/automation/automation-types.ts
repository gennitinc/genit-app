// ── Automation Node Type Registry ──────────────────────────────────────────
// Central source-of-truth. Icons stored as Lucide icon names — components
// are imported in each consumer file.

export type AutomationNodeType =
  | "trigger"
  | "action"
  | "condition"
  | "delay"
  | "ai_generate"
  | "transform"
  | "http_request"
  | "prompt"
  | "upload";

// ── Trigger Subtypes ────────────────────────────────────────────────────────

export type TriggerSubtype =
  | "schedule"
  | "webhook"
  | "manual"
  | "whatsapp_message"
  | "gmail_received"
  | "outlook_email_received"
  | "brevo_contact_added"
  | "facebook_comment"
  | "facebook_message"
  | "instagram_comment"
  | "instagram_dm"
  | "messenger_message"
  | "calendar_event"
  | "form_submission"
  | "x_mention";

export interface TriggerSubtypeConfig {
  id: TriggerSubtype;
  label: string;
  integration: string;
  iconName: string; // Lucide icon name
}

export const TRIGGER_SUBTYPES: TriggerSubtypeConfig[] = [
  { id: "schedule",            label: "Schedule",             integration: "Built-in",        iconName: "Clock" },
  { id: "webhook",             label: "Webhook",              integration: "Built-in",        iconName: "Webhook" },
  { id: "manual",              label: "Manual Trigger",       integration: "Built-in",        iconName: "Play" },
  { id: "whatsapp_message",    label: "WhatsApp Message",     integration: "WhatsApp",        iconName: "WhatsApp" },
  { id: "gmail_received",      label: "New Email (Gmail)",    integration: "Gmail",           iconName: "Mail" },
  { id: "outlook_email_received",label:"New Email (Outlook)", integration: "Outlook",         iconName: "Mail" },
  { id: "brevo_contact_added", label: "New Contact (Brevo)",  integration: "Brevo",           iconName: "Brevo" },
  { id: "facebook_comment",    label: "Facebook Comment",     integration: "Facebook",        iconName: "Facebook" },
  { id: "facebook_message",    label: "Facebook Message",     integration: "Facebook",        iconName: "Facebook" },
  { id: "instagram_comment",   label: "Instagram Comment",    integration: "Instagram",       iconName: "Instagram" },
  { id: "instagram_dm",        label: "Instagram DM",         integration: "Instagram",       iconName: "Instagram" },
  { id: "messenger_message",   label: "Messenger Message",    integration: "Messenger",       iconName: "MessageCircle" },
  { id: "calendar_event",      label: "Calendar Event",       integration: "Google Calendar", iconName: "GoogleCalendar" },
  { id: "form_submission",     label: "Form Submitted",       integration: "Built-in",        iconName: "ClipboardList" },
  { id: "x_mention",           label: "X Mention",            integration: "X",               iconName: "X" },
];

// ── Action Subtypes ─────────────────────────────────────────────────────────

export type ActionSubtype =
  | "send_gmail"
  | "send_brevo_email"
  | "send_outlook_email"
  | "whatsapp_reply"
  | "whatsapp_template"
  | "messenger_reply"
  | "post_facebook"
  | "post_instagram"
  | "post_linkedin"
  | "post_x"
  | "post_tiktok"
  | "generate_image"
  | "generate_video"
  | "generate_text"
  | "generate_audio"
  | "add_calendar_event"
  | "google_drive_upload"
  | "update_facebook_post"
  | "delete_linkedin_post"
  | "reply_linkedin_comment"
  | "update_pinterest_pin"
  | "update_youtube_video"
  | "reply_youtube_comment"
  | "delete_facebook_post"
  | "delete_pinterest_pin"
  | "delete_youtube_video"
  | "delete_tweet"
  | "delete_threads_post"
  | "reply_instagram_comment";

export interface ActionSubtypeConfig {
  id: ActionSubtype;
  label: string;
  integration: string;
  iconName: string;
  category: "messaging" | "social" | "ai" | "productivity";
}

export const ACTION_SUBTYPES: ActionSubtypeConfig[] = [
  { id: "send_gmail",          label: "Send Gmail",            integration: "Gmail",           iconName: "Mail",         category: "messaging" },
  { id: "send_brevo_email",    label: "Send Brevo Email",      integration: "Brevo",           iconName: "Mail",         category: "messaging" },
  { id: "send_outlook_email",  label: "Send Outlook Email",    integration: "Outlook",         iconName: "Mail",         category: "messaging" },
  { id: "whatsapp_reply",      label: "WhatsApp Reply",        integration: "WhatsApp",        iconName: "WhatsApp",     category: "messaging" },
  { id: "whatsapp_template",   label: "WhatsApp Template",     integration: "WhatsApp",        iconName: "WhatsApp",     category: "messaging" },
  { id: "messenger_reply",     label: "Messenger Reply",       integration: "Messenger",       iconName: "MessageCircle",category: "messaging" },
  { id: "post_facebook",       label: "Post to Facebook",      integration: "Facebook",        iconName: "Facebook",       category: "social" },
  { id: "post_instagram",      label: "Post to Instagram",     integration: "Instagram",       iconName: "Instagram",    category: "social" },
  { id: "post_linkedin",       label: "Post to LinkedIn",      integration: "LinkedIn",        iconName: "Linkedin",     category: "social" },
  { id: "post_x",              label: "Post to X",             integration: "X",               iconName: "X",            category: "social" },
  { id: "post_tiktok",         label: "Post to TikTok",        integration: "TikTok",          iconName: "TikTok",       category: "social" },
  { id: "generate_image",      label: "Generate Image",        integration: "Genit AI",       iconName: "ImagePlus",    category: "ai" },
  { id: "generate_video",      label: "Generate Video",        integration: "Genit AI",       iconName: "Video",        category: "ai" },
  { id: "generate_text",       label: "Generate Text",         integration: "Genit AI",       iconName: "FileText",     category: "ai" },
  { id: "generate_audio",      label: "Generate Audio",        integration: "Genit AI",       iconName: "Mic",          category: "ai" },
  { id: "add_calendar_event",  label: "Create Calendar Event", integration: "Google Calendar", iconName: "GoogleCalendar", category: "productivity" },
  { id: "google_drive_upload", label: "Upload to Drive",       integration: "Google Drive",    iconName: "GoogleDrive",  category: "productivity" },
  { id: "update_facebook_post",  label: "Update FB Post",      integration: "Facebook",        iconName: "Facebook",     category: "social" },
  { id: "delete_linkedin_post",  label: "Delete LI Post",      integration: "LinkedIn",        iconName: "Linkedin",     category: "social" },
  { id: "reply_linkedin_comment",label: "Reply to LI Comment", integration: "LinkedIn",        iconName: "Linkedin",     category: "social" },
  { id: "update_pinterest_pin",  label: "Update Pin",          integration: "Pinterest",       iconName: "Image",        category: "social" },
  { id: "update_youtube_video",  label: "Update YT Video",     integration: "YouTube",         iconName: "Video",        category: "social" },
  { id: "reply_youtube_comment", label: "Reply YT Comment",    integration: "YouTube",         iconName: "MessageCircle",category: "social" },
  { id: "delete_facebook_post",  label: "Delete FB Post",      integration: "Facebook",        iconName: "Facebook",     category: "social" },
  { id: "delete_pinterest_pin",  label: "Delete Pin",          integration: "Pinterest",       iconName: "Image",        category: "social" },
  { id: "delete_youtube_video",  label: "Delete YT Video",     integration: "YouTube",         iconName: "Video",        category: "social" },
  { id: "delete_tweet",          label: "Delete Tweet",        integration: "X",               iconName: "X",            category: "social" },
  { id: "delete_threads_post",   label: "Delete Threads Post", integration: "Threads",         iconName: "AtSign",       category: "social" },
  { id: "reply_instagram_comment",label: "Reply IG Comment",   integration: "Instagram",       iconName: "Instagram",    category: "social" },
];

// ── Condition Operators ─────────────────────────────────────────────────────

export type ConditionOperator =
  | "equals" | "not_equals" | "contains" | "not_contains"
  | "greater_than" | "less_than" | "is_empty" | "is_not_empty"
  | "starts_with" | "ends_with";

export const CONDITION_OPERATORS: { id: ConditionOperator; label: string }[] = [
  { id: "equals",       label: "equals" },
  { id: "not_equals",   label: "does not equal" },
  { id: "contains",     label: "contains" },
  { id: "not_contains", label: "does not contain" },
  { id: "greater_than", label: "is greater than" },
  { id: "less_than",    label: "is less than" },
  { id: "is_empty",     label: "is empty" },
  { id: "is_not_empty", label: "is not empty" },
  { id: "starts_with",  label: "starts with" },
  { id: "ends_with",    label: "ends with" },
];

// ── HTTP Methods ────────────────────────────────────────────────────────────

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

// ── Delay Units ─────────────────────────────────────────────────────────────

export type DelayUnit = "seconds" | "minutes" | "hours" | "days";
export const DELAY_UNITS: { id: DelayUnit; label: string }[] = [
  { id: "seconds", label: "sec" },
  { id: "minutes", label: "min" },
  { id: "hours",   label: "hr" },
  { id: "days",    label: "day" },
];

// ── AI Content Types ────────────────────────────────────────────────────────

export type AIContentType = "text" | "image" | "video" | "audio";
export const AI_CONTENT_TYPES: { id: AIContentType; label: string; iconName: string }[] = [
  { id: "text",  label: "Text",  iconName: "FileText" },
  { id: "image", label: "Image", iconName: "ImageIcon" },
  { id: "video", label: "Video", iconName: "Video" },
  { id: "audio", label: "Audio", iconName: "Mic" },
];

// ── Add-Node Menu ───────────────────────────────────────────────────────────

export interface AddNodeCategory {
  label: string;
  items: AddNodeItem[];
}

export interface AddNodeItem {
  type: AutomationNodeType;
  subtype?: string;
  label: string;
  iconName: string;
}

export const ADD_NODE_MENU: AddNodeCategory[] = [
  {
    label: "Triggers",
    items: TRIGGER_SUBTYPES.map((t) => ({
      type: "trigger" as AutomationNodeType,
      subtype: t.id,
      label: t.label,
      iconName: t.iconName,
    })),
  },
  {
    label: "Messaging",
    items: ACTION_SUBTYPES.filter((a) => a.category === "messaging").map((a) => ({
      type: "action" as AutomationNodeType,
      subtype: a.id,
      label: a.label,
      iconName: a.iconName,
    })),
  },
  {
    label: "Social",
    items: ACTION_SUBTYPES.filter((a) => a.category === "social").map((a) => ({
      type: "action" as AutomationNodeType,
      subtype: a.id,
      label: a.label,
      iconName: a.iconName,
    })),
  },
  {
    label: "AI Generation",
    items: ACTION_SUBTYPES.filter((a) => a.category === "ai").map((a) => ({
      type: "action" as AutomationNodeType,
      subtype: a.id,
      label: a.label,
      iconName: a.iconName,
    })),
  },
  {
    label: "Productivity",
    items: ACTION_SUBTYPES.filter((a) => a.category === "productivity").map((a) => ({
      type: "action" as AutomationNodeType,
      subtype: a.id,
      label: a.label,
      iconName: a.iconName,
    })),
  },
  {
    label: "Logic",
    items: [
      { type: "condition" as AutomationNodeType,   label: "If / Else",      iconName: "GitBranch" },
      { type: "delay" as AutomationNodeType,        label: "Delay",          iconName: "Clock" },
    ],
  },
  {
    label: "AI",
    items: [
      { type: "ai_generate" as AutomationNodeType, label: "AI Generate",    iconName: "Sparkles" },
    ],
  },
  {
    label: "Data",
    items: [
      { type: "transform" as AutomationNodeType,   label: "Transform",      iconName: "ArrowLeftRight" },
      { type: "http_request" as AutomationNodeType, label: "HTTP Request",  iconName: "Globe" },
    ],
  },
  {
    label: "Assets",
    items: [
      { type: "upload" as AutomationNodeType,      label: "Upload Asset",   iconName: "Upload" },
    ],
  },
];
