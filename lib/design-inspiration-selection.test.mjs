import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const results = await readFile(
  new URL(
    "../components/chat/messages/design-inspiration-results.tsx",
    import.meta.url
  ),
  "utf8"
);
const chatInput = await readFile(
  new URL("../components/chat/chat-input.tsx", import.meta.url),
  "utf8"
);

assert.doesNotMatch(results, /if \(isLocked\) return/);
assert.match(results, /metadata\?\.selectedInspirationUrl/);
assert.match(results, /\/project\/\$\{project\?\._id\}\/inspiration/);
assert.match(chatInput, /name: "selected-design-inspiration"/);

console.log("design inspiration selection tests passed");
