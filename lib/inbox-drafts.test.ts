import { type InboxDrafts, updateInboxDraft } from "./inbox-drafts";
import assert from "node:assert/strict";

let drafts: InboxDrafts = {};
const attachment = {
  url: "https://example.com/file.pdf",
  name: "file.pdf",
  mimeType: "application/pdf",
  size: 10,
  kind: "file" as const,
};

drafts = updateInboxDraft(drafts, "alice", {
  reply: "Reply to Alice",
  attachments: [attachment],
});
drafts = updateInboxDraft(drafts, "bob", { reply: "Reply to Bob" });

assert.deepEqual(drafts.alice, {
  reply: "Reply to Alice",
  attachments: [attachment],
});
assert.deepEqual(drafts.bob, {
  reply: "Reply to Bob",
  attachments: [],
});
