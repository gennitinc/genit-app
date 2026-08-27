import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("plugins has one canonical public and authenticated route", () => {
  const page = readFileSync(
    new URL("../app/plugins/page.tsx", import.meta.url),
    "utf8"
  );
  const client = readFileSync(
    new URL("../app/plugins/plugins-page-client.tsx", import.meta.url),
    "utf8"
  );
  const nextConfig = readFileSync(
    new URL("../next.config.ts", import.meta.url),
    "utf8"
  );
  const sitemap = readFileSync(
    new URL("../app/sitemap.ts", import.meta.url),
    "utf8"
  );
  const auth = readFileSync(
    new URL("../context/AuthenticatedContext.tsx", import.meta.url),
    "utf8"
  );

  assert.match(page, /canonical: "\/plugins"/);
  assert.doesNotMatch(page, /"use client"|withAuth/);
  assert.match(client, /const authenticated = !loading && Boolean\(user\)/);
  assert.match(client, /<PluginsCatalog publicView \/>/);
  assert.match(client, /<PluginsCatalog \/>/);
  assert.match(client, /overflow-x-clip/);
  assert.doesNotMatch(client, /<main className='[^']*overflow-x-hidden/);
  assert.match(nextConfig, /source: "\/all\/plugins"/);
  assert.match(nextConfig, /destination: "\/plugins"/);
  assert.match(nextConfig, /permanent: true/);
  assert.match(sitemap, /"\/plugins"/);
  assert.doesNotMatch(sitemap, /"\/all\/plugins"/);
  assert.doesNotMatch(auth, /router\.push\("\/signin"\)/);
});
