import type { ComposioToolkit } from "./integrations-api";

const CONNECTION_LABEL = /^(?:re)?connect\b|^authorize\b/i;

export function isComposioConnectionLink(
  label: string,
  href?: string
): boolean {
  if (!href || !CONNECTION_LABEL.test(label.trim())) return false;
  try {
    const host = new URL(href).hostname.toLowerCase();
    return host === "composio.dev" || host.endsWith(".composio.dev");
  } catch {
    return false;
  }
}

export function normalizePluginLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/^(?:re)?connect\s+(?:to\s+)?(?:your\s+)?/, "")
    .replace(/^authorize\s+(?:your\s+)?/, "")
    .replace(/\b(?:account|integration|plugin)\b/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/crm$/, "");
}

export function resolveComposioToolkit(
  label: string,
  toolkits: Pick<ComposioToolkit, "slug" | "name">[]
): Pick<ComposioToolkit, "slug" | "name"> | undefined {
  const target = normalizePluginLabel(label);
  if (!target) return undefined;

  return toolkits.find((toolkit) => {
    const slug = normalizePluginLabel(toolkit.slug);
    const name = normalizePluginLabel(toolkit.name);
    return target === slug || target === name;
  });
}

export function containsMarkdownConnectionLink(markdown: string): boolean {
  return /\[(?:re)?connect\b[^\]]*\]\(https?:\/\/[^)]*composio\.dev[^)]*\)/i.test(
    markdown
  );
}
