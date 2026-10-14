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
// Editing a workflow: a node is created and wired in one call, another is
// removed with its parents reconnected, and one is renamed.
const edited = getAutomationWorkflowSummary([
  {
    render: "automation_node_created",
    result: { ok: true, data: { nodeId: "trigger", verifiedOnly: true } },
  },
  {
    render: "automation_node_created",
    result: { ok: true, data: { nodeId: "delay", verifiedOnly: true } },
  },
  {
    render: "automation_node_created",
    result: { ok: true, data: { nodeId: "post", connectedFrom: "delay" } },
  },
  {
    render: "automation_nodes_connected",
    result: { ok: true, data: { sourceId: "trigger", targetId: "delay" } },
  },
  {
    render: "automation_node_removed",
    result: {
      ok: true,
      data: {
        nodes: [{ nodeId: "delay", title: "Wait" }],
        reconnected: [{ sourceId: "trigger", targetId: "post" }],
      },
    },
  },
  {
    render: "automation_node_updated",
    result: { ok: true, data: { nodeId: "post", title: "Publish" } },
  },
  {
    render: "automation_nodes_disconnected",
    result: {
      ok: true,
      data: { sourceId: "trigger", targetId: "post", removedConnections: 1 },
    },
  },
]);
assert.deepEqual(
  edited.nodes.map((node) => node.nodeId),
  ["trigger", "post"]
);
assert.equal(edited.nodes[1].title, "Publish");
assert.deepEqual(
  edited.removedNodes.map((node) => node.title),
  ["Wait"]
);
assert.equal(edited.connectionCount, 0);
assert.equal(edited.isUpdate, true);
assert.equal(summary.isUpdate, false);
console.log("automation workflow summary tests passed");
