export type CanvasPreviewType = "automation" | "workflow" | "graphics";
export const AUTOMATION_PREVIEW_ID = "preview:automation";
export const WORKFLOW_PREVIEW_ID = "preview:workflow";

export interface PreviewSelection {
  type: CanvasPreviewType;
  key: string;
  itemId?: string;
  createdAt: number;
}

const GRAPHICS_PROJECT_CATEGORIES = new Set([
  "flier",
  "image",
  "instagram_post",
  "poster",
  "youtube_thumbnail",
  "facebook_post",
  "facebook_cover",
  "banner",
  "logo",
  "presentation",
  "auto",
  "generic_design",
]);

export const isGraphicsProjectCategory = (category?: string) =>
  GRAPHICS_PROJECT_CATEGORIES.has(category || "");

export const getItemPreviewType = (item: any): CanvasPreviewType | null => {
  const type = item?.type || "";
  if (type === "application/json+automation") return "automation";
  if (type === "application/json+workflow") return "workflow";
  if (
    type === "image" ||
    type === "video" ||
    type.startsWith("image/") ||
    type.startsWith("video/")
  )
    return "graphics";
  return null;
};

export const getLatestMessagePreview = (
  messages: any[] = []
): PreviewSelection | null => {
  for (const message of [...messages].reverse()) {
    for (const group of [...(message.generationGroups || [])].reverse()) {
      const items = (group.items || []).filter(getItemPreviewType);
      // Canvas snapshots are fallbacks; a generated design is the primary
      // result when a mixed prompt also records an automation snapshot.
      const item =
        [...items]
          .reverse()
          .find((entry) => getItemPreviewType(entry) === "graphics") ||
        items.at(-1);
      if (!item) continue;
      return {
        type: getItemPreviewType(item)!,
        key: `message:${message.id || message._id}:${group.id}:${item.id || item.filePath}`,
        itemId: item.id || item.filePath || item.url,
        createdAt: new Date(
          group.timestamp || message.createdAt || 0
        ).getTime(),
      };
    }
  }

  return null;
};

export const getLatestAgentPreview = (
  runs: any[] = []
): PreviewSelection | null => {
  const runTime = (run: any) =>
    typeof run.createdAt === "number"
      ? run.createdAt
      : new Date(run.createdAt || 0).getTime();

  for (const run of [...runs].sort((a, b) => runTime(b) - runTime(a))) {
    for (const call of [...(run.toolCalls || [])].reverse()) {
      const render = call.render || "";
      const type =
        render === "generated_design"
          ? "graphics"
          : render === "automation_node_created" ||
              render === "automation_nodes_connected"
            ? "automation"
            : null;
      if (!type || !call.result?.ok) continue;
      const data = call.result.data || {};
      return {
        type,
        key: `agent:${run.runId}:${call.id}:${render}`,
        itemId:
          type === "graphics" ? data.id || data.url : AUTOMATION_PREVIEW_ID,
        createdAt: runTime(run),
      };
    }
  }
  return null;
};
