import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const dialog = read("app/integrations/_components/connect-dialog.tsx");
const callback = read("app/plugin/composio/callback/page.tsx");
const loading = read("app/plugin/composio/connect/page.tsx");

const openIndex = dialog.indexOf(
  'window.open(\n      "/plugin/composio/connect"'
);
const requestIndex = dialog.indexOf("await requestComposioConnectUrl");
assert.ok(openIndex >= 0, "connection window must open synchronously");
assert.ok(requestIndex > openIndex, "popup must open before the API request");
assert.match(dialog, /type: "genit:composio:authorized"/);
assert.match(dialog, /popup\.location\.replace\(authorizeUrl\.toString\(\)\)/);
assert.match(callback, /if \(window\.opener\)/);
assert.match(
  callback,
  /window\.location\.replace\("\/integrations\?connection=success"\)/
);
assert.match(callback, /Back to integrations/);
assert.match(loading, /Opening secure connection/);

console.log("Composio connection lifecycle checks passed");
