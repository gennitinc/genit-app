import {
  AUTOMATION_PREVIEW_ID,
  getLatestAgentPreview,
  getLatestMessagePreview,
  isGraphicsProjectCategory,
} from "./chat-preview.ts";
import assert from "node:assert/strict";
import test from "node:test";

test("auto projects keep the previous graphics canvas", () => {
  assert.equal(isGraphicsProjectCategory("auto"), true);
  assert.equal(isGraphicsProjectCategory("unknown"), false);
});

test("a design result wins over a same-prompt automation snapshot", () => {
  const result = getLatestMessagePreview([
    {
      id: "message",
      generationGroups: [
        {
          id: "group",
          timestamp: 1,
          items: [
            { id: "design", type: "image/png" },
            { id: "snapshot", type: "application/json+automation" },
          ],
        },
      ],
    },
  ]);

  assert.equal(result?.type, "graphics");
  assert.equal(result?.itemId, "design");
});

test("the latest successful agent result controls the preview", () => {
  const result = getLatestAgentPreview([
    {
      runId: "run",
      createdAt: 1,
      toolCalls: [
        {
          id: "automation",
          render: "automation_node_created",
          result: { ok: true },
        },
        {
          id: "design",
          render: "generated_design",
          result: { ok: true, data: { id: "image" } },
        },
      ],
    },
  ]);

  assert.equal(result?.type, "graphics");
  assert.equal(result?.itemId, "image");
});

test("an automation-only agent result opens the automation canvas", () => {
  const result = getLatestAgentPreview([
    {
      runId: "run",
      createdAt: "2026-07-18T10:00:00Z",
      toolCalls: [
        { id: "node", render: "automation_node_created", result: { ok: true } },
      ],
    },
  ]);

  assert.equal(result?.type, "automation");
  assert.equal(result?.itemId, AUTOMATION_PREVIEW_ID);
});

test("the last AI response is the default even when timestamps disagree", () => {
  const result = getLatestMessagePreview([
    {
      id: "first",
      generationGroups: [
        {
          id: "newer-time",
          timestamp: 20,
          items: [{ id: "design", type: "image/png" }],
        },
      ],
    },
    {
      id: "last",
      generationGroups: [
        {
          id: "older-time",
          timestamp: 10,
          items: [{ id: "automation", type: "application/json+automation" }],
        },
      ],
    },
  ]);

  assert.equal(result?.type, "automation");
  assert.equal(result?.itemId, "automation");
});
