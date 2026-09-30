"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const recoverNavigation = async (error: unknown) => {
      const message = String(
        error instanceof Error ? error.message : (error as any)?.reason || error
      );
      if (
        !/ChunkLoadError|Loading chunk|failed to fetch dynamically imported module|failed to fetch RSC payload|Connection closed|Minified React error #412/i.test(
          message
        )
      ) {
        return;
      }

      const lastReload = Number(
        sessionStorage.getItem("genit-stale-chunk-reloaded-at") || 0
      );
      if (Date.now() - lastReload < 10_000) return;
      sessionStorage.setItem(
        "genit-stale-chunk-reloaded-at",
        String(Date.now())
      );

      await Promise.allSettled([
        caches
          .keys()
          .then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) =>
            Promise.all(
              registrations.map((registration) => registration.unregister())
            )
          ),
      ]);
      window.location.reload();
    };
    const handleError = (event: ErrorEvent) =>
      recoverNavigation(event.error || event.message);
    const handleRejection = (event: PromiseRejectionEvent) =>
      recoverNavigation(event.reason);

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    // The worker no longer provides offline behavior. Remove old registrations
    // and Genit caches so stale Next.js assets cannot control future loads.
    void Promise.allSettled([
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(
            registrations.map((registration) => registration.unregister())
          )
        ),
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith("genit-"))
              .map((key) => caches.delete(key))
          )
        ),
    ]);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
