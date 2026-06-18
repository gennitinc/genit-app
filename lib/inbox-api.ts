import { apiResponse } from "@/utils/apiResponse";

export interface InboxConversation {
  _id: string;
  organization: string;
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "email";
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

export async function fetchConversations(platform?: string): Promise<InboxConversation[]> {
  const url = platform 
    ? `/api/v1/inbox/conversations?platform=${platform}`
    : `/api/v1/inbox/conversations`;
    
  const res = await apiResponse.get(url);
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

export async function seedMockInboxData(): Promise<void> {
  await apiResponse.post(`/api/v1/inbox/seed`);
}
