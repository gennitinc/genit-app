import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("browser sessions render in the live website preview", () => {
  const cards = read("../components/chat/agent/result-cards.tsx");
  const panel = read("../components/chat/preview-panel.tsx");

  assert.match(cards, /case "browser_session":/);
  assert.match(cards, /type: "website"/);
  assert.match(panel, /artifactPreview\.type === "website"/);
  assert.match(panel, /clipboard-read; clipboard-write; fullscreen/);
});

test("document previews can use the browser's native renderer", () => {
  const body = read("../components/ai-elements/web-preview.tsx");
  const panel = read("../components/chat/preview-panel.tsx");

  assert.match(body, /sandbox\?: string \| false/);
  assert.match(body, /sandbox === false \? undefined : sandbox/);
  assert.match(panel, /artifactPreview\.type === "document"\s*\? false/);
});
