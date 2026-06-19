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
    | "telegram";
  platformConversationId: string;
  customerName: string;
  customerId?: string;
  customerAvatar?: string;
  customerHandle?: string;
  subject?: string;
  metadata?: Record<string, unknown>;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: "open" | "resolved" | "snoozed";
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
}

export interface InboxAttachment {
  url: string;
  name: string;
  mimeType: string;
  size: number;
  kind: "image" | "video" | "audio" | "file";
}

export interface InboxFilters {
  platform?: string;
  integrationId?: string;
  status?: "all" | "open" | "resolved" | "snoozed";
  search?: string;
  sort?: "newest" | "oldest" | "unread";
}

export async function fetchConversations(
  filters: InboxFilters = {}
): Promise<InboxConversation[]> {
  const res = await apiResponse.get(`/api/v1/inbox/conversations`, {
    params: filters,
  });
  return res.data.conversations;
}

export async function fetchMessages(
  conversationId: string
): Promise<InboxMessage[]> {
  const res = await apiResponse.get(
    `/api/v1/inbox/conversations/${conversationId}/messages`
  );
  return res.data.messages;
}

export async function sendMessage(
  conversationId: string,
  content: string,
  attachments: InboxAttachment[] = []
): Promise<InboxMessage> {
  const res = await apiResponse.post(
    `/api/v1/inbox/conversations/${conversationId}/messages`,
    { content, attachments }
  );
  return res.data.message;
}

export async function uploadInboxAttachment(
  file: File
): Promise<InboxAttachment> {
  const body = new FormData();
  body.append("file", file);
  const res = await apiResponse.post(`/api/v1/inbox/attachments`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.attachment;
}

export async function generateInboxDraft(
  conversationId: string,
  instruction?: string
): Promise<string> {
  const res = await apiResponse.post(
    `/api/v1/inbox/conversations/${conversationId}/ai-draft`,
    { instruction }
  );
  return res.data.draft;
}

export async function retryInboxMessage(
  messageId: string
): Promise<InboxMessage> {
  const res = await apiResponse.post(
    `/api/v1/inbox/messages/${messageId}/retry`
  );
  return res.data.message;
}

export async function markConversationAsRead(
  conversationId: string
): Promise<void> {
  await apiResponse.patch(`/api/v1/inbox/conversations/${conversationId}/read`);
}

export async function markAllConversationsAsRead(): Promise<void> {
  await apiResponse.patch(`/api/v1/inbox/conversations/read-all`);
}

export async function updateConversationStatus(
  conversationId: string,
  status: InboxConversation["status"]
): Promise<InboxConversation> {
  const res = await apiResponse.patch(
    `/api/v1/inbox/conversations/${conversationId}`,
    { status }
  );
  return res.data.conversation;
}

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  await apiResponse.delete(`/api/v1/inbox/conversations/${conversationId}`);
}
