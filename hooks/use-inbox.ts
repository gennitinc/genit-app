"use client";

import { useUserContext } from "@/context/AuthenticatedContext";
import {
  type CreateConversationInput,
  type InboxAttachment,
  type InboxConversation,
  type InboxFilters,
  type UpdateConversationInput,
  clearConversation,
  createConversation,
  deleteConversation,
  deleteInboxMessage,
  fetchConversationPage,
  fetchConversations,
  fetchMessages,
  markAllConversationsAsRead,
  markConversationAsRead,
  retryInboxMessage,
  sendConversationWhatsAppTemplate,
  sendMessage,
  syncInbox,
  updateConversation,
  updateConversationStatus,
  updateInboxMessage,
} from "@/lib/inbox-api";
import { serverUrlSocket } from "@/utils/apiResponse";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import cookie from "js-cookie";
import { type Socket, io } from "socket.io-client";
import { useEffect, useState } from "react";

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
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchInterval: 60_000,
  });
}

export function useInfiniteInboxConversations(
  filters: InboxFilters = {},
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: inboxConversationsQueryKey(filters),
    queryFn: ({ pageParam = 0 }) =>
      fetchConversationPage({ ...filters, limit: 50, offset: pageParam }),
    enabled,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchInterval: 60_000,
  });
}

export function useInboxMessages(conversationId?: string) {
  return useQuery({
    queryKey: inboxMessagesQueryKey(conversationId!),
    queryFn: () => fetchMessages(conversationId!),
    enabled: Boolean(conversationId),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchInterval: conversationId ? 60_000 : false,
  });
}

type InboxRealtimeEvent = {
  type: string;
  organizationId: string;
  conversationId?: string;
  messageId?: string;
  platform?: string;
  integrationId?: string;
  emittedAt?: string;
};

export function useInboxRealtime(activeConversationId?: string) {
  const qc = useQueryClient();
  const { user } = useUserContext();
  const [connected, setConnected] = useState(false);
  const organizationId =
    user?.currentOrganization?._id || user?.business?._id || "";

  useEffect(() => {
    if (!organizationId) return;

    const socket: Socket = io(serverUrlSocket || "http://localhost:5000", {
      auth: { token: cookie.get("genituToken") || "" },
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const refreshInbox = (event: InboxRealtimeEvent) => {
      if (event.organizationId !== organizationId) return;

      void qc.invalidateQueries(
        { queryKey: ["inbox_conversations"] },
        { cancelRefetch: false }
      );
      if (event.type === "integration.updated")
        qc.invalidateQueries({ queryKey: ["integrations"] });
      if (event.conversationId) {
        void qc.invalidateQueries(
          { queryKey: inboxMessagesQueryKey(event.conversationId) },
          { cancelRefetch: false }
        );
      }
      if (
        activeConversationId &&
        (!event.conversationId || event.conversationId === activeConversationId)
      ) {
        void qc.invalidateQueries(
          { queryKey: inboxMessagesQueryKey(activeConversationId) },
          { cancelRefetch: false }
        );
      }
    };

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-inbox", organizationId);
      if (activeConversationId) {
        socket.emit("join-inbox-conversation", activeConversationId);
      }
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("inbox:update", refreshInbox);

    return () => {
      socket.off("inbox:update", refreshInbox);
      socket.emit("leave-inbox", organizationId);
      if (activeConversationId) {
        socket.emit("leave-inbox-conversation", activeConversationId);
      }
      socket.disconnect();
      setConnected(false);
    };
  }, [activeConversationId, organizationId, qc]);

  return connected;
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

export function useSendWhatsAppTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      name,
      language,
      components,
    }: {
      conversationId: string;
      name: string;
      language: string;
      components?: unknown[];
    }) =>
      sendConversationWhatsAppTemplate(conversationId, {
        name,
        language,
        components,
      }),
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

export function useSyncInbox() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: syncInbox,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
      qc.invalidateQueries({ queryKey: ["integrations"] });
    },
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

export function useClearConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearConversation,
    onSuccess: (_data, conversationId) => {
      qc.setQueryData(inboxMessagesQueryKey(conversationId), []);
      qc.invalidateQueries({ queryKey: ["inbox_conversations"] });
    },
  });
}
