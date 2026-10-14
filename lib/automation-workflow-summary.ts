/** Render hints summarized by the workflow card instead of per-call cards. */
export const AUTOMATION_RENDERS = new Set([
  "automation_node_created",
  "automation_nodes_connected",
  "automation_node_updated",
  "automation_node_removed",
  "automation_nodes_disconnected",
]);

/** Read-only canvas tools whose finished calls need no card of their own. */
export const QUIET_AUTOMATION_TOOLS = new Set(["get_automation_graph"]);

const connectionKey = (
  source: string,
  handle: string | undefined,
  target: string
) => `${source}:${handle || ""}:${target}`;

export function getAutomationWorkflowSummary(toolCalls: any[] = []) {
  const nodes = new Map<string, any>();
  const connections = new Set<string>();
  const removedNodes = new Map<string, any>();
  const updatedNodeIds = new Set<string>();
  let disconnected = 0;

  const dropConnections = (matches: (key: string) => boolean) => {
    for (const key of [...connections])
      if (matches(key)) connections.delete(key);
  };

  for (const call of toolCalls) {
    if (!call.result?.ok) continue;
    const data = call.result.data || {};
    if (call.render === "automation_node_created" && data.nodeId) {
      nodes.set(data.nodeId, { ...nodes.get(data.nodeId), ...data });
      removedNodes.delete(data.nodeId);
      if (data.reused) updatedNodeIds.add(data.nodeId);
      if (data.connectedFrom)
        connections.add(
          connectionKey(data.connectedFrom, data.sourceHandle, data.nodeId)
        );
    }
    if (call.render === "automation_node_updated" && data.nodeId) {
      nodes.set(data.nodeId, { ...nodes.get(data.nodeId), ...data });
      updatedNodeIds.add(data.nodeId);
    }
    if (
      call.render === "automation_nodes_connected" &&
      data.sourceId &&
      data.targetId
    ) {
      connections.add(
        connectionKey(data.sourceId, data.sourceHandle, data.targetId)
      );
    }
    if (call.render === "automation_nodes_disconnected") {
      disconnected += Number(data.removedConnections) || 0;
      dropConnections((key) => {
        const [source, handle, target] = key.split(":");
        return (
          source === data.sourceId &&
          target === data.targetId &&
          (!data.sourceHandle || handle === data.sourceHandle)
        );
      });
    }
    if (call.render === "automation_node_removed") {
      for (const removed of data.nodes || []) {
        if (!removed?.nodeId) continue;
        nodes.delete(removed.nodeId);
        updatedNodeIds.delete(removed.nodeId);
        removedNodes.set(removed.nodeId, removed);
        dropConnections((key) => {
          const [source, , target] = key.split(":");
          return source === removed.nodeId || target === removed.nodeId;
        });
      }
      for (const edge of data.reconnected || [])
        connections.add(
          connectionKey(edge.sourceId, edge.sourceHandle, edge.targetId)
        );
    }
  }

  const summarizedNodes = [...nodes.values()];
  return {
    nodes: summarizedNodes,
    connectionCount: connections.size,
    removedNodes: [...removedNodes.values()],
    updatedCount: updatedNodeIds.size,
    // An existing workflow was edited rather than built from scratch.
    isUpdate:
      removedNodes.size > 0 ||
      updatedNodeIds.size > 0 ||
      disconnected > 0 ||
      summarizedNodes.some((node) => node.verifiedOnly),
  };
}
