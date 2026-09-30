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

    // Keep the app installable without intercepting documents or Next.js assets.
    // Clear caches created by older workers before installing the no-fetch worker.
    void caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("genit-"))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => navigator.serviceWorker.register("/sw.js", { scope: "/" }))
      .catch((error) => {
        console.error("[Service Worker] Registration failed:", error);
      });

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
