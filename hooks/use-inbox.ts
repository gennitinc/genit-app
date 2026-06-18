"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage, 
  markConversationAsRead, 
  seedMockInboxData 
} from "@/lib/inbox-api";

export function inboxConversationsQueryKey(platform?: string) {
  return ["inbox_conversations", platform || "all"] as const;
}

export function inboxMessagesQueryKey(conversationId: string) {
  return ["inbox_messages", conversationId] as const;
}

export function useInboxConversations(platform?: string) {
  return useQuery({
    queryKey: inboxConversationsQueryKey(platform),
    queryFn: () => fetchConversations(platform),
    staleTime: 10_000,
  });
}

export function useInboxMessages(conversationId?: string) {
  return useQuery({
    queryKey: inboxMessagesQueryKey(conversationId!),
    queryFn: () => fetchMessages(conversationId!),
    enabled: Boolean(conversationId),
    staleTime: 5_000,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string, content: string }) => 
      sendMessage(conversationId, content),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: inboxMessagesQueryKey(variables.conversationId) });
      qc.invalidateQueries({ queryKey: inboxConversationsQueryKey() });
    }
  });
}

export function useMarkConversationAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markConversationAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      qc.invalidateQueries({ queryKey: inboxConversationsQueryKey() });
      qc.invalidateQueries({ queryKey: inboxMessagesQueryKey(conversationId) });
    }
  });
}

export function useSeedMockInbox() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => seedMockInboxData(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inboxConversationsQueryKey() });
    }
  });
}
