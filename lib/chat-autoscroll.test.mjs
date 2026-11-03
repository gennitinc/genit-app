import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../components/chat/text-chat-content.tsx", import.meta.url),
  "utf8"
);

test("active response streams continue following the bottom of the chat", () => {
  assert.match(source, /agentRuns\.some/);
  assert.match(source, /run\.status === "running"/);
  assert.match(source, /isAtBottomRef\.current/);
  assert.match(
    source,
    /agentRuns,\s*streamingAnalysis,\s*streamingContent,\s*isTyping/
  );
});
