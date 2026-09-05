import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const layout = read("app/layout.tsx");
const home = read("components/landing/landing-page.tsx");
const hero = read("components/landing/landing-hero.tsx");
const navbar = read("components/landing/landing-navbar.tsx");
const footer = read("components/landing/landing-footer.tsx");
const pricingPage = read("app/pricing/page.tsx");
const pricing = read("components/pricing/page.tsx");
const appsLayout = read("app/apps/layout.tsx");
const apps2Layout = read("app/apps2/layout.tsx");
const robots = read("app/robots.ts");
const sitemap = read("app/sitemap.ts");

assert.doesNotMatch(layout, /^"use client"/);
assert.match(layout, /export const metadata/);
assert.match(layout, /Autonomous Marketing Agents/);
assert.doesNotMatch(layout, /Image & Video Generator|aggregateRating/);
assert.doesNotMatch(home + pricingPage, /next\/headers|getUsdRates/);
assert.match(hero, /href=\{user \? "\/visuals" : "\/signup"\}/);
assert.doesNotMatch(hero, /}, 30\)/);
assert.match(pricing, /`\/signup\?redirect=/);
assert.match(pricing, /encodeURIComponent\("\/visuals"\)/);
assert.doesNotMatch(pricing, /`\/signin\?redirect=/);
assert.doesNotMatch(pricing, /disabled=\{userLoading/);
assert.doesNotMatch(navbar + footer, /href=['"]\/(?:signup|pricing|contact)['"][\s\S]{0,80}target=/);
assert.match(appsLayout + apps2Layout, /index: false/g);
assert.doesNotMatch(robots, /"\/apps2?"/);
assert.doesNotMatch(sitemap, /"\/apps(?:2|\/|\")/);

console.log("Acquisition flow checks passed");
