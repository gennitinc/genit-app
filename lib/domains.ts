/**
 * The marketing site lives on trygenit.com and the product on
 * app.trygenit.com. Both are served by this one Next.js app; proxy.ts uses
 * `routeRequest` to send each path to the host it belongs on.
 *
 * Other hosts (localhost, *.vercel.app previews) are left alone, so local
 * development and preview deploys behave exactly as before.
 */
export const SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST || "trygenit.com";
export const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST || `app.${SITE_HOST}`;
export const SITE_URL = `https://${SITE_HOST}`;
export const APP_URL = `https://${APP_HOST}`;

/** The session token cookie. Host-only, so it lives on the app host only. */
export const SESSION_COOKIE = "genituToken";
/**
 * A "signed in" flag shared with the marketing site (Domain=.trygenit.com).
 * It carries no credentials: it only tells the site to send signed-in
 * visitors to the app. The app host keeps it in step with the real session.
 */
export const SIGNED_IN_HINT_COOKIE = "genit_signed_in";

const APP_PATHS = [
  "/signin",
  "/signup",
  "/account",
  "/handoff",
  "/onboarding",
  "/recover",
  "/reset-password",
  "/update-password",
  "/chat",
  "/visuals",
  "/user",
  "/apps",
  "/apps2",
  "/admin",
  "/invitations",
  "/presentation",
  "/inspire",
  "/plugin/composio",
  "/plugin/pipedream",
];

const SITE_PATHS = [
  "/pricing",
  "/platform",
  "/company",
  "/use-cases",
  "/contact",
  "/feedback",
  "/blog",
  "/docs",
  "/legal",
  "/templates",
  "/community",
  "/inspirations",
  "/creators-program",
  "/creator",
  "/plugin/removal-instructions",
];

/** Shown on the site when signed out, in the app when signed in. */
const SHARED_PATHS = ["/plugins"];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/** Which host serves `pathname`, or null when either host can (or it depends on sign-in). */
export function ownerOf(pathname: string): "site" | "app" | null {
  if (matches(pathname, SHARED_PATHS)) return null;
  if (matches(pathname, APP_PATHS)) return "app";
  if (pathname === "/" || matches(pathname, SITE_PATHS)) return "site";
  return null;
}

/**
 * Production builds on Vercel link across the split with absolute URLs.
 * Local dev and preview deploys keep relative links, so they stay on their
 * own host. NEXT_PUBLIC_SPLIT_DOMAINS ("true"/"false") overrides this.
 */
const SPLIT_LINKS =
  process.env.NEXT_PUBLIC_SPLIT_DOMAINS != null
    ? process.env.NEXT_PUBLIC_SPLIT_DOMAINS === "true"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

/**
 * A link to a page on the host that serves it. Use it for any link that can
 * cross between the site and the app: Next's router can't follow a redirect to
 * another origin, so a relative cross-host link costs a failed fetch and a
 * second hop. An absolute URL on the current host still navigates client-side.
 */
export function hostHref(href: string, split = SPLIT_LINKS): string {
  if (!split || !href.startsWith("/") || href.startsWith("//")) return href;
  const owner = ownerOf(href.split(/[?#]/)[0]);
  if (!owner) return href;
  return `${owner === "app" ? APP_URL : SITE_URL}${href}`;
}

export type HostKind = "site" | "app" | "other";

export function hostKind(host: string | null | undefined): HostKind {
  const name = (host || "").toLowerCase().split(":")[0];
  if (name === APP_HOST) return "app";
  if (name === SITE_HOST || name === `www.${SITE_HOST}`) return "site";
  return "other";
}

export type RouteDecision =
  | { action: "next" }
  | { action: "redirect"; url: string };

/**
 * Where a request belongs. `signedIn` is the real session on the app host,
 * and the signed-in hint cookie on the site.
 */
export function routeRequest({
  host,
  pathname,
  search = "",
  signedIn,
}: {
  host: string | null | undefined;
  pathname: string;
  search?: string;
  signedIn: boolean;
}): RouteDecision {
  const kind = hostKind(host);
  if (kind === "other") return { action: "next" };

  if (kind === "app" && pathname === "/") {
    return {
      action: "redirect",
      url: `${APP_URL}${signedIn ? "/visuals" : "/signin"}${search}`,
    };
  }

  let belongsOn: HostKind | null = null;
  if (matches(pathname, SHARED_PATHS)) belongsOn = signedIn ? "app" : "site";
  else if (matches(pathname, APP_PATHS)) belongsOn = "app";
  else if (pathname === "/" || matches(pathname, SITE_PATHS)) belongsOn = "site";

  // Anything unlisted (API routes, assets, odd pages) works on either host.
  if (!belongsOn || belongsOn === kind) return { action: "next" };

  const origin = belongsOn === "app" ? APP_URL : SITE_URL;
  return { action: "redirect", url: `${origin}${pathname}${search}` };
}
