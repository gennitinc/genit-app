import { apiResponse } from "@/utils/apiResponse";

export interface InboxConversation {
  _id: string;
  organization: string;
  integration?: string;
  platform:
    | "instagram"
    | "facebook"
    | "x"
    | "twitter"
    | "linkedin"
    | "gmail"
    | "email"
    | "outlook"
    | "whatsapp"
    | "messenger"
    | "telegram"
    | "slack";
  platformConversationId: string;
  customerName: string;
  customerId?: string;
  customerAvatar?: string;
  customerHandle?: string;
  subject?: string;
  labels: string[];
  notes?: string;
  metadata?: Record<string, unknown>;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: "open" | "resolved" | "snoozed";
  isPinned: boolean;
  isMuted: boolean;
  isBlocked: boolean;
  clearedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InboxMessage {
  _id: string;
  conversationId: string;
  organization: string;
  platformMessageId?: string;
  senderType: "customer" | "agent" | "bot";
  content: string;
  attachments: InboxAttachment[];
  status: "queued" | "sending" | "sent" | "delivered" | "read" | "failed";
  error?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface InboxSyncResult {
  integrationId: string;
  accountName: string;
  platform: string;
  threadsProcessed: number;
  messagesImported: number;
  nextPageToken?: string;
  resultSizeEstimate?: number;
  liveOnly?: boolean;
  error?: string;
  warning?: string;
}

export interface InboxAttachment {
  url: string;
  name: string;
  mimeType: string;
  size: number;
  kind: "image" | "video" | "audio" | "file";
  providerMessageId?: string;
  providerAttachmentId?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  status?: string;
  language?: string;
  category?: string;
  components?: Array<{ type?: string; text?: string }>;
}

export interface InboxFilters {
  platform?: string;
  integrationId?: string;
  status?: "all" | "open" | "resolved" | "snoozed";
  search?: string;
  sort?: "newest" | "oldest" | "unread";
  folder?: string;
  limit?: number;
  offset?: number;
}

export interface CreateConversationInput {
  integrationId: string;
  platform: InboxConversation["platform"];
  customerName: string;
  customerId?: string;
  customerHandle?: string;
  subject?: string;
}

export type UpdateConversationInput = Partial<
  Pick<
    InboxConversation,
    | "status"
    | "customerName"
    | "customerId"
    | "customerAvatar"
    | "customerHandle"
    | "subject"
    | "labels"
    | "notes"
    | "isPinned"
    | "isMuted"
    | "isBlocked"
  >
>;

export async function fetchConversations(
  filters: InboxFilters = {}
): Promise<InboxConversation[]> {
  const page = await fetchConversationPage(filters);
  return page.conversations;
}

export async function fetchConversationPage(
  filters: InboxFilters = {}
): Promise<{ conversations: InboxConversation[]; nextOffset: number | null }> {
  const res = await apiResponse.get(`/inbox/conversations`, {
    params: filters,
  });
  return {
    conversations: res.data.conversations,
    nextOffset: res.data.nextOffset ?? null,
  };
}

export async function fetchMessages(
  conversationId: string
): Promise<InboxMessage[]> {
  const res = await apiResponse.get(
    `/inbox/conversations/${conversationId}/messages`
  );
  return res.data.messages;
}

export async function createConversation(
  input: CreateConversationInput
): Promise<InboxConversation> {
  const res = await apiResponse.post(`/inbox/conversations`, input);
  return res.data.conversation;
}

export async function syncInbox(
  input: {
    integrationId?: string;
    platform?: string;
    continueHistory?: boolean;
  } = {}
): Promise<InboxSyncResult[]> {
  const res = await apiResponse.post(`/inbox/sync`, input);
  return res.data.results;
}

export async function sendMessage(
  conversationId: string,
  content: string,
  attachments: InboxAttachment[] = []
): Promise<InboxMessage> {
  const res = await apiResponse.post(
    `/inbox/conversations/${conversationId}/messages`,
    { content, attachments }
  );
  return res.data.message;
}

export async function fetchConversationWhatsAppTemplates(
  conversationId: string
): Promise<WhatsAppTemplate[]> {
  const res = await apiResponse.get(
    `/inbox/conversations/${conversationId}/whatsapp-templates`
  );
  return res.data.templates;
}

export async function sendConversationWhatsAppTemplate(
  conversationId: string,
  input: { name: string; language: string; components?: unknown[] }
): Promise<InboxMessage> {
  const res = await apiResponse.post(
    `/inbox/conversations/${conversationId}/whatsapp-templates`,
    input
  );
  return res.data.message;
}

export async function uploadInboxAttachment(
  file: File
): Promise<InboxAttachment> {
  const body = new FormData();
  body.append("file", file);
  const res = await apiResponse.post(`/inbox/attachments`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.attachment;
}

export async function downloadInboxAttachment(
  attachment: InboxAttachment
): Promise<void> {
  if (!attachment.providerMessageId || !attachment.providerAttachmentId) {
    window.open(attachment.url, "_blank", "noopener,noreferrer");
    return;
  }
  const response = await apiResponse.get(
    `/inbox/gmail-attachments/${encodeURIComponent(attachment.providerMessageId)}/${encodeURIComponent(attachment.providerAttachmentId)}`,
    { responseType: "blob" }
  );
  const objectUrl = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = attachment.name;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

export async function generateInboxDraft(
  conversationId: string,
  instruction?: string
): Promise<string> {
  const res = await apiResponse.post(
    `/inbox/conversations/${conversationId}/ai-draft`,
    { instruction }
  );
  return res.data.draft;
}

export async function retryInboxMessage(
  messageId: string
): Promise<InboxMessage> {
  const res = await apiResponse.post(`/inbox/messages/${messageId}/retry`);
  return res.data.message;
}

export async function markConversationAsRead(
  conversationId: string
): Promise<void> {
  await apiResponse.patch(`/inbox/conversations/${conversationId}/read`);
}

export async function markAllConversationsAsRead(): Promise<void> {
  await apiResponse.patch(`/inbox/conversations/read-all`);
}

export async function updateConversationStatus(
  conversationId: string,
  status: InboxConversation["status"]
): Promise<InboxConversation> {
  const res = await apiResponse.patch(
    `/inbox/conversations/${conversationId}`,
    { status }
  );
  return res.data.conversation;
}

export async function updateConversation(
  conversationId: string,
  input: UpdateConversationInput
): Promise<InboxConversation> {
  const res = await apiResponse.patch(
    `/inbox/conversations/${conversationId}`,
    input
  );
  return res.data.conversation;
}

export async function updateInboxMessage(
  messageId: string,
  content: string
): Promise<InboxMessage> {
  const res = await apiResponse.patch(`/inbox/messages/${messageId}`, {
    content,
  });
  return res.data.message;
}

export async function deleteInboxMessage(messageId: string): Promise<void> {
  await apiResponse.delete(`/inbox/messages/${messageId}`);
}

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  await apiResponse.delete(`/inbox/conversations/${conversationId}`);
}

export async function clearConversation(conversationId: string): Promise<void> {
  await apiResponse.delete(`/inbox/conversations/${conversationId}/messages`);
}

export async function exportConversation(
  conversationId: string
): Promise<Blob> {
  const res = await apiResponse.get(
    `/inbox/conversations/${conversationId}/export`,
    { responseType: "blob" }
  );
  return res.data;
}
