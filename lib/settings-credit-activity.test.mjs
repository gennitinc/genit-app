import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("credit activity is closed by default and uses the shared date range", () => {
  const source = readFileSync(
    new URL("../components/user-settings/settingsHome.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /<Collapsible[\s\S]*Credit activity/);
  assert.match(source, /isCreditActivityOpen[\s\S]*useState\(false\)/);
  assert.match(source, /<DateRangePicker/);
  assert.match(source, /creditFrom: creditFrom\.toISOString\(\)/);
  assert.match(source, /creditTo: creditTo\.toISOString\(\)/);
});
