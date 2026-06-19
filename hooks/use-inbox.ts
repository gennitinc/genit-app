"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage, 
  markConversationAsRead, 
  markAllConversationsAsRead,
  updateConversationStatus,
  deleteConversation,
  type InboxFilters,
  type InboxConversation,
} from "@/lib/inbox-api";

export function inboxConversationsQueryKey(filters: InboxFilters = {}) {
  return ["inbox_conversations", filters] as const;
}

export function inboxMessagesQueryKey(conversationId: string) {
  return ["inbox_messages", conversationId] as const;
}

export function useInboxConversations(filters: InboxFilters = {}) {
  return useQuery({
    queryKey: inboxConversationsQueryKey(filters),
    queryFn: () => fetchConversations(filters),
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
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    }
  });
}

export function useMarkConversationAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markConversationAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
      qc.invalidateQueries({ queryKey: inboxMessagesQueryKey(conversationId) });
    }
  });
}

export function useMarkAllConversationsAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: markAllConversationsAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    }
  });
}

export function useUpdateConversationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, status }: { conversationId: string; status: InboxConversation["status"] }) =>
      updateConversationStatus(conversationId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inbox_conversations"] }),
  });
}

export function useDeleteConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: (_data, conversationId) => {
      qc.removeQueries({ queryKey: inboxMessagesQueryKey(conversationId) });
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    },
  });
}
