export interface ResultLink {
  url: string;
  label: string;
}

const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;

function linkLabel(path: string[], url: string): string {
  const key = [...path]
    .reverse()
    .find((part) => !/^\d+$/.test(part))
    ?.replace(/[_-]+/g, " ")
    .trim();
  if (key && !/^(url|uri|href|link|file path)$/i.test(key)) {
    return key.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
  try {
    return `Open ${new URL(url).hostname.replace(/^www\./, "")}`;
  } catch {
    return "Open result";
  }
}

export function extractResultLinks(value: unknown): ResultLink[] {
  const links = new Map<string, ResultLink>();
  const visited = new WeakSet<object>();

  const visit = (current: unknown, path: string[], depth: number) => {
    if (depth > 8 || current === null || current === undefined) return;
    if (typeof current === "string") {
      for (const match of current.match(URL_PATTERN) || []) {
        const url = match.replace(/[),.;\]}]+$/, "");
        if (!links.has(url))
          links.set(url, { url, label: linkLabel(path, url) });
      }
      return;
    }
    if (typeof current !== "object" || visited.has(current)) return;
    visited.add(current);
    if (Array.isArray(current)) {
      current.forEach((item, index) =>
        visit(item, [...path, String(index + 1)], depth + 1)
      );
      return;
    }
    Object.entries(current).forEach(([key, item]) =>
      visit(item, [...path, key], depth + 1)
    );
  };

  visit(value, [], 0);
  return [...links.values()];
}
