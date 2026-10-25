import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const historyPage = await readFile(
  new URL("../app/(workspace)/chat/history/page.tsx", import.meta.url),
  "utf8"
);

assert.match(
  historyPage,
  /setIsRestored\(true\);[\s\S]*?fetchAllProjects\(1, false, cachedSearchQuery/
);
assert.match(historyPage, /aria-label='Select all loaded chats'/);
assert.match(historyPage, /Promise\.allSettled/);
assert.match(historyPage, /results\[index\]\.status === "fulfilled"/);
assert.match(historyPage, /Delete selected/);

console.log("chat history refresh and bulk delete tests passed");
