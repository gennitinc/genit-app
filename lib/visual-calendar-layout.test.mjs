import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("visual calendar keeps its mobile controls compact and ordered", () => {
  const source = readFileSync(
    new URL("../app/visuals/calendar/page.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /grid-cols-\[minmax\(0,1fr\)_auto\]/);
  assert.match(source, /order-1 flex min-w-0 items-center gap-2/);
  assert.match(source, /order-2 ml-auto flex items-center justify-end gap-1/);
  assert.match(source, /order-3 flex w-full items-center justify-center gap-1/);
  assert.match(source, /h-10 w-full rounded-lg border/);
  assert.doesNotMatch(source, /className='my-2 rounded-xl px-4'/);
});
