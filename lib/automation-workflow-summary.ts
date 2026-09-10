export function getAutomationWorkflowSummary(toolCalls: any[] = []) {
  const nodes = new Map<string, any>();
  const connections = new Set<string>();

  for (const call of toolCalls) {
    if (!call.result?.ok) continue;
    const data = call.result.data || {};
    if (call.render === "automation_node_created" && data.nodeId) {
      nodes.set(data.nodeId, data);
    }
    if (
      call.render === "automation_nodes_connected" &&
      data.sourceId &&
      data.targetId
    ) {
      connections.add(
        `${data.sourceId}:${data.sourceHandle || ""}:${data.targetId}`
      );
    }
  }

  return { nodes: [...nodes.values()], connectionCount: connections.size };
}
