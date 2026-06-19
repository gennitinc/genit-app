import { apiResponse } from "@/utils/apiResponse";

export interface InboxConversation {
  _id: string;
  organization: string;
  integration?: string;
  platform: "instagram" | "facebook" | "x" | "twitter" | "linkedin" | "gmail" | "email" | "outlook" | "whatsapp" | "messenger" | "telegram";
  platformConversationId: string;
  customerName: string;
  customerAvatar?: string;
  customerHandle?: string;
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
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InboxFilters {
  platform?: string;
  integrationId?: string;
  status?: "all" | "open" | "resolved" | "snoozed";
  search?: string;
  sort?: "newest" | "oldest" | "unread";
}

export async function fetchConversations(filters: InboxFilters = {}): Promise<InboxConversation[]> {
  const res = await apiResponse.get(`/api/v1/inbox/conversations`, { params: filters });
  return res.data.conversations;
}

export async function fetchMessages(conversationId: string): Promise<InboxMessage[]> {
  const res = await apiResponse.get(`/api/v1/inbox/conversations/${conversationId}/messages`);
  return res.data.messages;
}

export async function sendMessage(conversationId: string, content: string): Promise<InboxMessage> {
  const res = await apiResponse.post(`/api/v1/inbox/conversations/${conversationId}/messages`, { content });
  return res.data.message;
}

export async function markConversationAsRead(conversationId: string): Promise<void> {
  await apiResponse.patch(`/api/v1/inbox/conversations/${conversationId}/read`);
}

export async function markAllConversationsAsRead(): Promise<void> {
  await apiResponse.patch(`/api/v1/inbox/conversations/read-all`);
}

export async function updateConversationStatus(
  conversationId: string,
  status: InboxConversation["status"]
): Promise<InboxConversation> {
  const res = await apiResponse.patch(`/api/v1/inbox/conversations/${conversationId}`, { status });
  return res.data.conversation;
}

export async function deleteConversation(conversationId: string): Promise<void> {
  await apiResponse.delete(`/api/v1/inbox/conversations/${conversationId}`);
}
