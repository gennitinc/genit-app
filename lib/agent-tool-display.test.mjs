import assert from "node:assert/strict";
import test from "node:test";
import { shouldDisplayToolCall } from "./agent-tool-display.ts";

test("hides provider plumbing and stale pending calls", () => {
  assert.equal(
    shouldDisplayToolCall(
      { id: "search", name: "COMPOSIO_SEARCH_TOOLS", args: {}, result: { ok: true } },
      "completed"
    ),
    false
  );
  assert.equal(
    shouldDisplayToolCall(
      { id: "send", name: "send_gmail_email", args: {} },
      "completed"
    ),
    false
  );
  assert.equal(
    shouldDisplayToolCall(
      { id: "send", name: "send_gmail_email", args: {} },
      "running"
    ),
    true
  );
});
