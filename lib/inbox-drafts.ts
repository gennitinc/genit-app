import type { InboxAttachment } from "./inbox-api";

export interface InboxDraft {
  reply: string;
  attachments: InboxAttachment[];
}

export type InboxDrafts = Record<string, InboxDraft>;

export const EMPTY_INBOX_DRAFT: InboxDraft = { reply: "", attachments: [] };

export function updateInboxDraft(
  drafts: InboxDrafts,
  conversationId: string,
  patch: Partial<InboxDraft>
): InboxDrafts {
  return {
    ...drafts,
    [conversationId]: {
      ...(drafts[conversationId] ?? EMPTY_INBOX_DRAFT),
      ...patch,
    },
  };
}
