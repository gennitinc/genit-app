import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("app fonts are locally managed from the root layout", () => {
  const layout = readFileSync(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8"
  );
  const globals = readFileSync(
    new URL("../app/globals.css", import.meta.url),
    "utf8"
  );
  const settings = readFileSync(
    new URL("../app/(workspace)/user/settings/page.tsx", import.meta.url),
    "utf8"
  );

  assert.match(layout, /Instrument_Serif, Inter/);
  assert.match(layout, /--font-inter/);
  assert.match(layout, /--font-instrument-serif-family/);
  assert.match(globals, /--font-sans: var\(--font-inter\)/);
  assert.match(
    globals,
    /--font-instrument-serif: var\(--font-instrument-serif-family\)/
  );
  assert.doesNotMatch(settings, /fonts\.googleapis\.com|font-family/);
});
