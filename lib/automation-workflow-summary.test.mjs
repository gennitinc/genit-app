import { getAutomationWorkflowSummary } from "./automation-workflow-summary.ts";
import assert from "node:assert/strict";

const summary = getAutomationWorkflowSummary([
  {
    render: "automation_node_created",
    result: { ok: true, data: { nodeId: "one", title: "Trigger" } },
  },
  {
    render: "automation_node_created",
    result: { ok: true, data: { nodeId: "two", title: "Post" } },
  },
  {
    render: "automation_nodes_connected",
    result: { ok: true, data: { sourceId: "one", targetId: "two" } },
  },
]);

assert.deepEqual(
  summary.nodes.map((node) => node.nodeId),
  ["one", "two"]
);
assert.equal(summary.connectionCount, 1);
console.log("automation workflow summary tests passed");
