import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [loader, history, chat, preview, canvas, automation, workflow] =
  await Promise.all([
    read("../utils/Loading.tsx"),
    read("../app/chat/history/page.tsx"),
    read("../components/chat/text-chat-content.tsx"),
    read("../components/chat/preview-panel.tsx"),
    read("../components/chat/graphics-canvas.tsx"),
    read("../components/automation.tsx"),
    read("../components/workflow.tsx"),
  ]);

assert.match(loader, /inline-flex shrink-0 items-center justify-center/);
assert.match(loader, /role='status'/);
assert.match(history, /flex flex-col items-center justify-center gap-3/);
assert.match(history, /<Loading size=\{20\} \/>/);
assert.match(chat, /<Loading size=\{20\} \/>/);
assert.match(preview, /<Loading size=\{20\} \/>/);
assert.match(canvas, /<LoadingFileLoader size=\{20\} \/>/);
assert.match(automation, /<LoadingFileLoader size=\{20\} \/>/);
assert.match(workflow, /<LoadingFileLoader size=\{20\} \/>/);

console.log("loading consistency tests passed");
