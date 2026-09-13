import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("credit activity is collapsible and can be grouped by month or day", () => {
  const source = readFileSync(
    new URL("../components/user-settings/settingsHome.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /<Collapsible[\s\S]*Credit activity/);
  assert.match(source, /<SelectItem value='month'>By month<\/SelectItem>/);
  assert.match(source, /<SelectItem value='day'>By day<\/SelectItem>/);
  assert.match(source, /\[\.\.\.transactions\]\.sort/);
  assert.match(source, /creditTransactionGroups\.map/);
});
