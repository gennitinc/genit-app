import { hostHref, hostKind, routeRequest } from "./domains.ts";
import assert from "node:assert/strict";
import test from "node:test";

const route = (host, pathname, signedIn = false, search = "") =>
  routeRequest({ host, pathname, search, signedIn });

test("recognises the site, app and other hosts", () => {
  assert.equal(hostKind("trygenit.com"), "site");
  assert.equal(hostKind("www.trygenit.com"), "site");
  assert.equal(hostKind("app.trygenit.com"), "app");
  assert.equal(hostKind("localhost:3000"), "other");
  assert.equal(hostKind("gennit.vercel.app"), "other");
});

test("leaves localhost and previews alone", () => {
  assert.deepEqual(route("localhost:3000", "/chat"), { action: "next" });
  assert.deepEqual(route("gennit.vercel.app", "/", true), { action: "next" });
});

test("signed-in visitors open plugins in the app", () => {
  assert.deepEqual(route("trygenit.com", "/plugins", true, "?q=x"), {
    action: "redirect",
    url: "https://app.trygenit.com/plugins?q=x",
  });
  assert.deepEqual(route("app.trygenit.com", "/plugins", true), {
    action: "next",
  });
});

test("signed-out visitors see the public plugins page on the site", () => {
  assert.deepEqual(route("trygenit.com", "/plugins"), { action: "next" });
  assert.deepEqual(route("app.trygenit.com", "/plugins"), {
    action: "redirect",
    url: "https://trygenit.com/plugins",
  });
});

test("app pages move to the app host, keeping the query", () => {
  assert.deepEqual(route("www.trygenit.com", "/signin", false, "?redirect=%2Fchat"), {
    action: "redirect",
    url: "https://app.trygenit.com/signin?redirect=%2Fchat",
  });
  assert.deepEqual(route("trygenit.com", "/plugin/composio/callback", true), {
    action: "redirect",
    url: "https://app.trygenit.com/plugin/composio/callback",
  });
  assert.deepEqual(route("app.trygenit.com", "/chat/123", true), {
    action: "next",
  });
});

test("marketing pages move to the site", () => {
  assert.deepEqual(route("app.trygenit.com", "/pricing", true), {
    action: "redirect",
    url: "https://trygenit.com/pricing",
  });
  assert.deepEqual(route("trygenit.com", "/", true), { action: "next" });
  assert.deepEqual(route("trygenit.com", "/plugin/removal-instructions"), {
    action: "next",
  });
});

test("the app root opens the workspace or sign-in", () => {
  assert.equal(route("app.trygenit.com", "/", true).url, "https://app.trygenit.com/visuals");
  assert.equal(route("app.trygenit.com", "/").url, "https://app.trygenit.com/signin");
});

test("does not mistake look-alike paths for app pages", () => {
  assert.deepEqual(route("trygenit.com", "/chatbots-guide"), { action: "next" });
  assert.deepEqual(route("trygenit.com", "/api/pricing-currency"), { action: "next" });
});

test("links point at the host that serves the page once the split is on", () => {
  assert.equal(hostHref("/signin?redirect=%2Fblog", true), "https://app.trygenit.com/signin?redirect=%2Fblog");
  assert.equal(hostHref("/pricing#plans", true), "https://trygenit.com/pricing#plans");
  assert.equal(hostHref("/", true), "https://trygenit.com/");
  // Pages either host serves stay relative.
  assert.equal(hostHref("/plugins", true), "/plugins");
  assert.equal(hostHref("/teams", true), "/teams");
  // Already absolute, protocol-relative or anchors: untouched.
  assert.equal(hostHref("https://x.com/a", true), "https://x.com/a");
  assert.equal(hostHref("//cdn.x/a", true), "//cdn.x/a");
  assert.equal(hostHref("#top", true), "#top");
});

test("links stay relative in local dev and previews", () => {
  assert.equal(hostHref("/signin", false), "/signin");
  assert.equal(hostHref("/pricing", false), "/pricing");
});
