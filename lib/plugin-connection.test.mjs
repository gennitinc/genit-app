import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("plugin connection refreshes integrations without restarting the authenticated page", () => {
  const source = readFileSync(
    new URL("../app/integrations/_components/connect-dialog.tsx", import.meta.url),
    "utf8"
  );

  // Boundary regression: refreshing the auth context sets global loading and
  // withAuth unmounts the page, discarding scroll position and unsaved state.
  assert.doesNotMatch(source, /\bfetchCurrentUser\b|\bsetReload\b|\bsetIsReload\b|\blocation\.(?:reload|assign|replace)\s*\(|\brouter\.refresh\s*\(/);
  assert.match(source, /qc\.invalidateQueries\(\{ queryKey: integrationsQueryKey\(orgId\) \}\)/);
  assert.match(source, /onConnected\?\.\(\)/);
});
