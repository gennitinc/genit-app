/**
 * Keeps the automation canvas and the server in step. The canvas records the
 * last graph the server confirmed; anything the user changed since then is a
 * diff that can be replayed on top of a newer server graph (an agent edit, or
 * another tab), so neither side silently overwrites the other.
 */
export type AutomationGraphNode = {
  id: string;
  type?: string;
  position?: { x: number; y: number };
  data?: Record<string, any>;
  [key: string]: any;
};
export type AutomationGraphEdge = {
  id?: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  [key: string]: any;
};
export type AutomationGraph = {
  nodes: AutomationGraphNode[];
  edges: AutomationGraphEdge[];
};

/** Canvas-only values injected into node data; never persisted or diffed. */
const RUNTIME_DATA_KEYS = new Set([
  "onRemoveNode",
  "onNodeDataChange",
  "onTestRun",
  "isEditMode",
  "isTesting",
  "validationErrors",
]);

const same = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right);

export const automationEdgeKey = (edge: AutomationGraphEdge) =>
  `${edge.source}:${edge.sourceHandle || ""}:${edge.target}`;

export function cleanAutomationGraph(
  nodes: AutomationGraphNode[] = [],
  edges: AutomationGraphEdge[] = []
): AutomationGraph {
  return {
    nodes: nodes.map((node) => ({
      id: String(node.id),
      type: node.type,
      position: {
        x: Number(node.position?.x) || 0,
        y: Number(node.position?.y) || 0,
      },
      data: Object.fromEntries(
        Object.entries(node.data || {}).filter(
          ([key, value]) =>
            !RUNTIME_DATA_KEYS.has(key) && typeof value !== "function"
        )
      ),
    })),
    edges: edges.map((edge) => ({
      ...(edge.id ? { id: String(edge.id) } : {}),
      source: String(edge.source),
      target: String(edge.target),
      ...(edge.sourceHandle ? { sourceHandle: String(edge.sourceHandle) } : {}),
      ...(edge.targetHandle ? { targetHandle: String(edge.targetHandle) } : {}),
      animated: edge.animated ?? true,
    })),
  };
}

export type AutomationGraphDiff = {
  addedNodes: AutomationGraphNode[];
  removedNodeIds: string[];
  changedNodes: Array<{
    id: string;
    position?: { x: number; y: number };
    type?: string;
    data: Record<string, unknown>;
    removedDataKeys: string[];
  }>;
  addedEdges: AutomationGraphEdge[];
  removedEdgeKeys: string[];
};

/** Field-level changes that turn `base` into `local`. */
export function diffAutomationGraph(
  base: AutomationGraph,
  local: AutomationGraph
): AutomationGraphDiff {
  const baseNodes = new Map(base.nodes.map((node) => [node.id, node]));
  const localNodes = new Map(local.nodes.map((node) => [node.id, node]));
  const changedNodes: AutomationGraphDiff["changedNodes"] = [];
  for (const node of local.nodes) {
    const previous = baseNodes.get(node.id);
    if (!previous) continue;
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node.data || {}))
      if (!same(value, previous.data?.[key])) data[key] = value;
    const removedDataKeys = Object.keys(previous.data || {}).filter(
      (key) => !(key in (node.data || {}))
    );
    const moved = !same(node.position, previous.position);
    const retyped = node.type !== previous.type;
    if (Object.keys(data).length || removedDataKeys.length || moved || retyped)
      changedNodes.push({
        id: node.id,
        ...(moved ? { position: node.position } : {}),
        ...(retyped ? { type: node.type } : {}),
        data,
        removedDataKeys,
      });
  }
  const baseEdges = new Set(base.edges.map(automationEdgeKey));
  const localEdges = new Set(local.edges.map(automationEdgeKey));
  return {
    addedNodes: local.nodes.filter((node) => !baseNodes.has(node.id)),
    removedNodeIds: base.nodes
      .filter((node) => !localNodes.has(node.id))
      .map((node) => node.id),
    changedNodes,
    addedEdges: local.edges.filter(
      (edge) => !baseEdges.has(automationEdgeKey(edge))
    ),
    removedEdgeKeys: base.edges
      .map(automationEdgeKey)
      .filter((key) => !localEdges.has(key)),
  };
}

export const isEmptyAutomationDiff = (diff: AutomationGraphDiff) =>
  !diff.addedNodes.length &&
  !diff.removedNodeIds.length &&
  !diff.changedNodes.length &&
  !diff.addedEdges.length &&
  !diff.removedEdgeKeys.length;

/**
 * Replays local changes on a newer server graph. A node removed on the server
 * stays removed even if it was edited locally, so an agent deletion wins over
 * an unsaved field edit on the same node.
 */
export function applyAutomationDiff(
  remote: AutomationGraph,
  diff: AutomationGraphDiff
): AutomationGraph {
  const removed = new Set(diff.removedNodeIds);
  const changes = new Map(
    diff.changedNodes.map((change) => [change.id, change])
  );
  const nodes = remote.nodes
    .filter((node) => !removed.has(node.id))
    .map((node) => {
      const change = changes.get(node.id);
      if (!change) return node;
      const data = { ...(node.data || {}), ...change.data };
      for (const key of change.removedDataKeys) delete data[key];
      return {
        ...node,
        ...(change.position ? { position: change.position } : {}),
        ...(change.type ? { type: change.type } : {}),
        data,
      };
    });
  const ids = new Set(nodes.map((node) => node.id));
  for (const node of diff.addedNodes)
    if (!ids.has(node.id)) {
      nodes.push(node);
      ids.add(node.id);
    }

  const dropped = new Set(diff.removedEdgeKeys);
  const edges = remote.edges.filter(
    (edge) =>
      !dropped.has(automationEdgeKey(edge)) &&
      ids.has(edge.source) &&
      ids.has(edge.target)
  );
  const keys = new Set(edges.map(automationEdgeKey));
  for (const edge of diff.addedEdges)
    if (
      ids.has(edge.source) &&
      ids.has(edge.target) &&
      !keys.has(automationEdgeKey(edge))
    ) {
      edges.push(edge);
      keys.add(automationEdgeKey(edge));
    }
  return { nodes, edges };
}

/** Moves the local edits made on top of `base` onto `remote`. */
export function rebaseAutomationGraph(
  base: AutomationGraph,
  local: AutomationGraph,
  remote: AutomationGraph
) {
  return applyAutomationDiff(remote, diffAutomationGraph(base, local));
}

/** True when connecting source -> target would loop back to source. */
export function automationConnectionCreatesCycle(
  edges: AutomationGraphEdge[],
  source: string,
  target: string
) {
  if (source === target) return true;
  const pending = [target];
  const seen = new Set<string>();
  while (pending.length) {
    const current = pending.pop()!;
    if (current === source) return true;
    if (seen.has(current)) continue;
    seen.add(current);
    for (const edge of edges)
      if (edge.source === current) pending.push(edge.target);
  }
  return false;
}
