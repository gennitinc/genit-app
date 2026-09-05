import { getAuthRedirect, withAuthRedirect } from "./auth-redirect.ts";
import assert from "node:assert/strict";
import test from "node:test";

test("keeps a local redirect including its query and hash", () => {
  const params = new URLSearchParams(
    "redirect=%2Fpricing%3Fcycle%3Dyearly%23plans"
  );
  assert.equal(getAuthRedirect(params), "/pricing?cycle=yearly#plans");
});

test("rejects redirects to another origin", () => {
  for (const redirect of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
  ]) {
    assert.equal(getAuthRedirect(new URLSearchParams({ redirect })), "/visuals");
  }
});

test("preserves an existing query when forwarding the redirect", () => {
  assert.equal(
    withAuthRedirect("/account/verify?email=user%40example.com", "/pricing"),
    "/account/verify?email=user%40example.com&redirect=%2Fpricing"
  );
});
