import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("the managed chat scroller does not get a second resize observer", () => {
  const source = read("../components/chat/text-chat-content.tsx");

  assert.match(
    source,
    /useEffect\(\(\) => \{\s*\/\/[\s\S]*?if \(!useDocumentScroll\) return;[\s\S]*?new ResizeObserver/
  );
});

test("the mobile organization control remains visible and its menu scrolls", () => {
  const sidebar = read("../components/layout/app-sidebar.tsx");
  const switcher = read("../components/layout/org-switcher.tsx");

  assert.match(sidebar, /SidebarFooter className='[^']*shrink-0/);
  assert.match(switcher, /max-h-\[calc\(100dvh-1rem\)\]/);
  assert.match(switcher, /overflow-y-auto overscroll-contain/);
});
