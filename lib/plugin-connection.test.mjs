import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("plugin connection refreshes integrations without restarting the authenticated page", () => {
  const source = readFileSync(
    new URL(
      "../app/integrations/_components/connect-dialog.tsx",
      import.meta.url
    ),
    "utf8"
  );

  // Boundary regression: refreshing the auth context sets global loading and
  // withAuth unmounts the page, discarding scroll position and unsaved state.
  assert.doesNotMatch(
    source,
    /\bfetchCurrentUser\b|\bsetReload\b|\bsetIsReload\b|\blocation\.(?:reload|assign|replace)\s*\(|\brouter\.refresh\s*\(/
  );
  assert.match(
    source,
    /qc\.invalidateQueries\(\{ queryKey: integrationsQueryKey\(orgId\) \}\)/
  );
  assert.match(source, /onConnected\?\.\(\)/);
  assert.match(source, /syncComposioConnection\(appSlug, platform\)/);
  assert.match(source, /attempt < 3/);
  assert.match(source, /\^4\\d\\d\\b/);
  assert.match(source, /lastError\?\.response\?\.data\?\.message/);
});

test("Composio callback preserves the server failure reason", () => {
  const source = readFileSync(
    new URL("../app/plugin/composio/callback/page.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /error\?\.response\?\.data\?\.message/);
});

test("assistant Composio links render as state-aware connection buttons", () => {
  const component = readFileSync(
    new URL("../components/chat/plugin-connection-link.tsx", import.meta.url),
    "utf8"
  );
  const agentMessage = readFileSync(
    new URL("../components/chat/agent/agent-message.tsx", import.meta.url),
    "utf8"
  );

  assert.match(component, /variant=\{connected \? "secondary" : "default"\}/);
  assert.match(component, /disabled=\{connected\}/);
  assert.match(component, /connected \? "Connected"/);
  assert.match(component, /appSlug=\{toolkit\.slug\}/);
  assert.match(component, /iconUrl=\{toolkit\.logo\}/);
  assert.match(component, /setOpen\(false\)/);
  assert.match(agentMessage, /components=\{\{ a: PluginConnectionLink \}\}/);
});

test("agent plugin choices preserve toolkit identity and resume after connection", () => {
  const agentMessage = readFileSync(
    new URL("../components/chat/agent/agent-message.tsx", import.meta.url),
    "utf8"
  );
  const runHook = readFileSync(
    new URL("../hooks/use-agent-runs.ts", import.meta.url),
    "utf8"
  );
  const elicitation = readFileSync(
    new URL("../components/chat/agent/elicitation-card.tsx", import.meta.url),
    "utf8"
  );
  const tools = readFileSync(
    new URL(
      "../../gennit-v1-server/src/services/agent/tools.ts",
      import.meta.url
    ),
    "utf8"
  );
  const agent = readFileSync(
    new URL(
      "../../gennit-v1-server/src/services/agent/agent-runtime.ts",
      import.meta.url
    ),
    "utf8"
  );

  assert.match(tools, /search_plugin_catalog: tool\(/);
  assert.match(tools, /connected: connectedSlugs\.has\(item\.slug\)/);
  assert.match(tools, /kind: USER_INPUT_REQUIRED/);
  assert.match(tools, /presentation: "plugin_choice"/);
  assert.match(tools, /allowOther: true/);
  assert.match(agent, /call \\`search_plugin_catalog\\`/);
  assert.match(agent, /call \\`get_connected_plugin_context\\`/);
  assert.match(runHook, /toolkitSlug: p\.toolkitSlug/);
  assert.match(runHook, /allowOther: p\.allowOther/);
  assert.match(agentMessage, /resumeAgentRunIntegration\(/);
  assert.match(agentMessage, /onConnected=/);
  assert.match(elicitation, /opt\.icon/);
  assert.match(elicitation, /alt=\{`\$\{opt\.label\} logo`\}/);
  assert.match(elicitation, />\{opt\.label\}<\/span>/);
  assert.match(elicitation, /setShowOther\(true\)/);
  assert.match(elicitation, /Name another plugin or describe what you need/);
});

test("connection links use the shared plugin modal regardless of provider URL host", () => {
  const resolver = readFileSync(
    new URL("./plugin-connection-link.ts", import.meta.url),
    "utf8"
  );
  const dialog = readFileSync(
    new URL(
      "../app/integrations/_components/connect-dialog.tsx",
      import.meta.url
    ),
    "utf8"
  );

  assert.doesNotMatch(resolver, /hostname|endsWith\("\.composio\.dev"\)/);
  assert.match(resolver, /\["http:", "https:"\]/);
  assert.match(dialog, /iconUrl \? \(/);
});

test("plugin catalog and automation use buttons with explicit connected states", () => {
  const explorer = readFileSync(
    new URL("../app/integrations/integrations-explorer.tsx", import.meta.url),
    "utf8"
  );
  const fields = readFileSync(
    new URL(
      "../components/automation/composio-catalog-fields.tsx",
      import.meta.url
    ),
    "utf8"
  );

  assert.match(explorer, /bg-indigo-600/);
  assert.match(explorer, />\s*Connected\s*</);
  assert.match(fields, /<Button[\s\S]*Connect app/);
  assert.match(fields, /disabled[\s\S]*Connected/);
  assert.doesNotMatch(fields, /href=['"]\/integrations['"]/);
});
