import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const historyPage = await readFile(
  new URL("../app/chat/history/page.tsx", import.meta.url),
  "utf8"
);

assert.match(
  historyPage,
  /setIsRestored\(true\);[\s\S]*?fetchAllProjects\(1, false, cachedSearchQuery/
);

console.log("chat history refresh test passed");
