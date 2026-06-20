"use client";

import {
  type CreateConversationInput,
  type InboxAttachment,
  type InboxConversation,
  type InboxFilters,
  type UpdateConversationInput,
  createConversation,
  deleteConversation,
  deleteInboxMessage,
  fetchConversations,
  fetchMessages,
  markAllConversationsAsRead,
  markConversationAsRead,
  retryInboxMessage,
  sendMessage,
  updateConversation,
  updateConversationStatus,
  updateInboxMessage,
} from "@/lib/inbox-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    refetchInterval: 15_000,
  });
}

export function useInboxMessages(conversationId?: string) {
  return useQuery({
    queryKey: inboxMessagesQueryKey(conversationId!),
    queryFn: () => fetchMessages(conversationId!),
    enabled: Boolean(conversationId),
    staleTime: 5_000,
    refetchInterval: conversationId ? 8_000 : false,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
      attachments = [],
    }: {
      conversationId: string;
      content: string;
      attachments?: InboxAttachment[];
    }) => sendMessage(conversationId, content, attachments),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({
        queryKey: inboxMessagesQueryKey(variables.conversationId),
      });
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    },
    onSettled: (_data, _error, variables) => {
      qc.invalidateQueries({
        queryKey: inboxMessagesQueryKey(variables.conversationId),
      });
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    },
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateConversationInput) => createConversation(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] }),
  });
}

export function useUpdateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      input,
    }: {
      conversationId: string;
      input: UpdateConversationInput;
    }) => updateConversation(conversationId, input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] }),
  });
}

export function useUpdateInboxMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
      conversationId: string;
    }) => updateInboxMessage(messageId, content),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: inboxMessagesQueryKey(variables.conversationId),
      });
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    },
  });
}

export function useDeleteInboxMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
    }: {
      messageId: string;
      conversationId: string;
    }) => deleteInboxMessage(messageId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: inboxMessagesQueryKey(variables.conversationId),
      });
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    },
  });
}

export function useRetryInboxMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
    }: {
      messageId: string;
      conversationId: string;
    }) => retryInboxMessage(messageId),
    onSettled: (_data, _error, variables) => {
      qc.invalidateQueries({
        queryKey: inboxMessagesQueryKey(variables.conversationId),
      });
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    },
  });
}

export function useMarkConversationAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      markConversationAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
      qc.invalidateQueries({ queryKey: inboxMessagesQueryKey(conversationId) });
    },
  });
}

export function useMarkAllConversationsAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: markAllConversationsAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    },
  });
}

export function useUpdateConversationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      status,
    }: {
      conversationId: string;
      status: InboxConversation["status"];
    }) => updateConversationStatus(conversationId, status),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] }),
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
