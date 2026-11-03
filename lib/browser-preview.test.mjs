import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("browser sessions render in the live website preview", () => {
  const cards = read("../components/chat/agent/result-cards.tsx");
  const panel = read("../components/chat/preview-panel.tsx");

  assert.match(cards, /case "browser_session":/);
  assert.match(cards, /type: "website"/);
  assert.match(cards, /displayUrl: data\?\.url/);
  assert.match(panel, /artifactPreview\.type === "website"/);
  assert.match(panel, /artifactPreview\.displayUrl \|\| artifactPreview\.url/);
  // The live page sizes the browser to its own visible area.
  assert.doesNotMatch(panel, /resizeAgentBrowser/);
  assert.match(panel, /setArtifactReloadKey\(\(value\) => value \+ 1\)/);
  assert.doesNotMatch(panel, /\.then\(\(\) => setArtifactReloadKey/);
  assert.match(panel, /clipboard-read; clipboard-write; fullscreen/);
});

test("live browser uses one header that drives the embedded view", () => {
  const panel = read("../components/chat/preview-panel.tsx");
  const live = read("../components/chat/live-browser-preview.tsx");

  assert.match(panel, /isLiveBrowserUrl\(artifactPreview\.url\)/);
  assert.match(live, /searchParams\.set\("chrome", "0"\)/);
  assert.match(live, /bg-red-400[\s\S]*bg-yellow-400[\s\S]*bg-green-400/);
  assert.match(live, /event\.source !== iframeRef\.current\?\.contentWindow/);
  assert.match(live, /source: "genit-host"/);
  assert.match(live, /DropdownMenuRadioGroup[\s\S]*type: "device"/);
  assert.doesNotMatch(live, /animate-pulse/);
  assert.doesNotMatch(live, /Maximize2|onToggleFullscreen/);
  assert.match(live, /grid-cols-\[minmax\(max-content,1fr\)/);
});

test("agent work opens a populated thinking preview", () => {
  const layout = read("../components/layout/chat-layout.tsx");
  const overlay = read("../components/chat/agent-thinking-overlay.tsx");

  assert.match(layout, /run\.status === "running"/);
  assert.match(layout, /isWorkActive = isGenerationActive/);
  assert.match(layout, /thinking=\{activeAgentRun\?\.thinking\}/);
  assert.match(overlay, /thinking\?\.trim\(\)/);
});

test("provider links are not rendered as user-facing tool links", () => {
  const message = read("../components/chat/agent/agent-message.tsx");

  assert.match(message, /tc\.render !== "browser_session"/);
});

test("document previews can use the browser's native renderer", () => {
  const body = read("../components/ai-elements/web-preview.tsx");
  const panel = read("../components/chat/preview-panel.tsx");

  assert.match(body, /sandbox\?: string \| false/);
  assert.match(body, /sandbox === false \? undefined : sandbox/);
  assert.match(panel, /artifactPreview\.type === "document"\s*\? false/);
});
