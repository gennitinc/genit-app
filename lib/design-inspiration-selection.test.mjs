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
assert.match(results, /Internet search results/);
assert.doesNotMatch(results, />Pinterest</);
assert.match(results, /CheckSquare2/);
assert.match(results, /Square/);
assert.doesNotMatch(results, /\bPlus\b/);
assert.match(results, /isCountdownPaused/);
assert.match(results, /selectionInFlight/);
assert.match(results, /safeResults\[0\]\.image/);
assert.match(results, /AUTO_SELECT_SECONDS = 10/);
assert.match(results, /setTimeout/);
assert.doesNotMatch(results, /Math\.random/);
assert.doesNotMatch(results, /Auto-picking a random inspiration/);
assert.match(chatInput, /name: "selected-design-inspiration"/);

console.log("design inspiration selection tests passed");
