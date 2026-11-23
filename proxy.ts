import {
  APP_URL,
  SESSION_COOKIE,
  SIGNED_IN_HINT_COOKIE,
  SITE_HOST,
  hostKind,
  routeRequest,
} from "@/lib/domains";
import { NextResponse, type NextRequest } from "next/server";

const API_BASE_URL =
  (process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIVE_URL
    : process.env.NEXT_PUBLIC_LOCAL_URL) || "http://localhost:8000/api/v1/";

const HINT_MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Before the split, sessions lived in a host-only cookie on www.trygenit.com.
 * When such a visitor heads into the app, swap that session for a one-minute
 * handoff code so they arrive on app.trygenit.com still signed in.
 */
async function legacyHandoffUrl(token: string, next: string) {
  try {
    const res = await fetch(new URL("auth/handoff-code", API_BASE_URL), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const { code } = (await res.json()) as { code?: string };
    if (!code) return null;
    const url = new URL("/handoff", APP_URL);
    url.searchParams.set("code", code);
    url.searchParams.set("redirect", next);
    return url.toString();
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host");
  const kind = hostKind(host);
  if (kind === "other") return NextResponse.next();

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const hint = request.cookies.has(SIGNED_IN_HINT_COOKIE);
  // On the site a session cookie can only be a leftover from before the split.
  const signedIn = Boolean(session) || (kind === "site" && hint);

  const decision = routeRequest({ host, pathname, search, signedIn });

  let response: NextResponse;
  if (decision.action === "redirect") {
    const toApp = decision.url.startsWith(APP_URL);
    const handoff =
      kind === "site" && session && toApp
        ? await legacyHandoffUrl(session, `${pathname}${search}`)
        : null;
    response = NextResponse.redirect(handoff || decision.url, 307);
    if (kind === "site" && session && toApp) {
      response.cookies.delete(SESSION_COOKIE);
    }
  } else {
    response = NextResponse.next();
  }

  if (kind === "app") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    // Keep the site's "signed in" flag in step with the real session.
    if (session && !hint) {
      response.cookies.set(SIGNED_IN_HINT_COOKIE, "1", {
        domain: `.${SITE_HOST}`,
        path: "/",
        maxAge: HINT_MAX_AGE,
        sameSite: "lax",
        secure: true,
        httpOnly: true,
      });
    } else if (!session && hint) {
      response.cookies.set(SIGNED_IN_HINT_COOKIE, "", {
        domain: `.${SITE_HOST}`,
        path: "/",
        maxAge: 0,
      });
    }
  }

  return response;
}

export const config = {
  // Pages only: skip Next internals, API routes and files with an extension.
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};
