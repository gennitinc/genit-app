import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const layout = read("app/layout.tsx");
const homepage = read("app/page.tsx");
const robots = read("app/robots.ts");
const sitemap = read("app/sitemap.ts");
const providers = read("components/layout/client-providers.tsx");
const company = read("app/company/page.tsx");
const terms = read("app/legal/terms-of-service/page.tsx");
const privacy = read("app/legal/privacy-policy/page.tsx");
const landing = read("components/landing/landing-page.tsx");

assert(
  !layout.includes('alternates: { canonical: "/" }'),
  "root layout must not canonicalize every route to home"
);
assert(
  homepage.includes('alternates: { canonical: "/" }'),
  "homepage needs its own canonical"
);
assert(
  !robots.includes('"/_next"'),
  "crawler access to Next.js assets must remain open"
);
assert(
  sitemap.includes("marketingCapabilities.map"),
  "capability pages must stay in the sitemap"
);
assert(
  !providers.includes("<MixpanelProvider>{children}</MixpanelProvider>"),
  "analytics must not force the page body into a client-render bailout"
);
assert(
  !company.match(/Sarah Chen|Alex Rodriguez|Maria Santos/),
  "company page must not publish unverified testimonials"
);
assert(
  !terms.includes("Plus Five Five, Inc."),
  "terms must use one verified company identity"
);
assert(
  !terms.match(/font-semibold text-white'/) &&
    !privacy.match(/font-semibold text-white'/),
  "legal headings must be readable in light mode"
);
assert(
  !landing.includes("LandingTestimonials"),
  "homepage must not publish unverified customer proof"
);

console.log("SEO foundation checks passed");
