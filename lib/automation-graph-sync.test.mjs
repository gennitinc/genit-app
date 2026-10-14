import {
  automationConnectionCreatesCycle,
  cleanAutomationGraph,
  diffAutomationGraph,
  isEmptyAutomationDiff,
  rebaseAutomationGraph,
} from "./automation-graph-sync.ts";
import assert from "node:assert/strict";
import test from "node:test";

const node = (id, data = {}, position = { x: 0, y: 0 }) => ({
  id,
  type: "action",
  position,
  data: { title: id, ...data },
});
const base = {
  nodes: [node("trigger"), node("email", { subject: "Hi" })],
  edges: [{ source: "trigger", target: "email", animated: true }],
};

test("canvas callbacks and validation state are never persisted", () => {
  const graph = cleanAutomationGraph(
    [
      {
        ...node("a"),
        selected: true,
        data: {
          title: "A",
          onRemoveNode() {},
          isEditMode: true,
          validationErrors: ["x"],
        },
      },
    ],
    [{ source: "a", target: "b", selected: true, style: {} }]
  );
  assert.deepEqual(graph.nodes[0].data, { title: "A" });
  assert.equal("selected" in graph.nodes[0], false);
  assert.deepEqual(graph.edges[0], {
    source: "a",
    target: "b",
    animated: true,
  });
});

test("an unchanged canvas has nothing to save", () => {
  assert.equal(isEmptyAutomationDiff(diffAutomationGraph(base, base)), true);
});

test("an agent update keeps the user's unsaved edits", () => {
  // The user moved the trigger and changed the subject...
  const local = {
    nodes: [
      node("trigger", {}, { x: 50, y: 60 }),
      node("email", { subject: "Hello there" }),
    ],
    edges: base.edges,
  };
  // ...while the agent added a node and renamed the email step.
  const remote = {
    nodes: [
      node("trigger"),
      node("email", { subject: "Hi", title: "Send welcome" }),
      node("delay"),
    ],
    edges: [...base.edges, { source: "email", target: "delay" }],
  };
  const merged = rebaseAutomationGraph(base, local, remote);
  assert.deepEqual(
    merged.nodes.map((item) => item.id),
    ["trigger", "email", "delay"]
  );
  assert.deepEqual(merged.nodes[0].position, { x: 50, y: 60 });
  assert.equal(merged.nodes[1].data.subject, "Hello there");
  assert.equal(merged.nodes[1].data.title, "Send welcome");
  assert.equal(merged.edges.length, 2);
});

test("removals on either side survive the merge", () => {
  const local = { nodes: base.nodes, edges: [] };
  const remote = {
    nodes: [node("trigger")],
    edges: [],
  };
  const merged = rebaseAutomationGraph(base, local, remote);
  assert.deepEqual(
    merged.nodes.map((item) => item.id),
    ["trigger"]
  );
  assert.deepEqual(merged.edges, []);

  // A user-added node and edge survive an agent edit elsewhere.
  const withNew = {
    nodes: [...base.nodes, node("post")],
    edges: [...base.edges, { source: "email", target: "post" }],
  };
  const agentRenamed = {
    nodes: [node("trigger", { title: "Daily" }), base.nodes[1]],
    edges: base.edges,
  };
  const rebased = rebaseAutomationGraph(base, withNew, agentRenamed);
  assert.deepEqual(
    rebased.nodes.map((item) => item.id),
    ["trigger", "email", "post"]
  );
  assert.equal(rebased.nodes[0].data.title, "Daily");
  assert.equal(rebased.edges.length, 2);
});

test("a local edge to a node the agent deleted is dropped", () => {
  const local = {
    nodes: [...base.nodes, node("extra")],
    edges: [...base.edges, { source: "email", target: "extra" }],
  };
  const remote = { nodes: [node("trigger")], edges: [] };
  const merged = rebaseAutomationGraph(base, local, remote);
  assert.deepEqual(
    merged.edges.map((edge) => `${edge.source}->${edge.target}`),
    []
  );
});

test("connections that would loop are rejected", () => {
  const edges = [
    { source: "a", target: "b" },
    { source: "b", target: "c" },
  ];
  assert.equal(automationConnectionCreatesCycle(edges, "c", "a"), true);
  assert.equal(automationConnectionCreatesCycle(edges, "a", "a"), true);
  assert.equal(automationConnectionCreatesCycle(edges, "a", "c"), false);
});
