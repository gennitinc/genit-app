const LOCAL_ORIGIN = "https://genit.local";

export function getAuthRedirect(
  searchParams: Pick<URLSearchParams, "get">,
  fallback = "/visuals"
) {
  const value = searchParams.get("redirect");
  if (!value) return fallback;

  try {
    const url = new URL(value, LOCAL_ORIGIN);
    return url.origin === LOCAL_ORIGIN
      ? `${url.pathname}${url.search}${url.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}

export function withAuthRedirect(path: string, redirect: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}redirect=${encodeURIComponent(redirect)}`;
}
