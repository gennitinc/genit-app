"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const reloadForStaleChunk = async (error: unknown) => {
      const message = String(
        error instanceof Error ? error.message : (error as any)?.reason || error
      );
      if (
        !/ChunkLoadError|Loading chunk|failed to fetch dynamically imported module/i.test(
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
    const handleError = (event: ErrorEvent) => reloadForStaleChunk(event.error);
    const handleRejection = (event: PromiseRejectionEvent) =>
      reloadForStaleChunk(event.reason);

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    // Check if we're in production (not localhost)
    const isProduction =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1" &&
      !window.location.hostname.startsWith("192.168.") &&
      !window.location.hostname.startsWith("10.");

    // Also allow in production build even on localhost for testing
    const isProductionBuild = process.env.NODE_ENV === "production";

    if (!isProduction && !isProductionBuild) {
      return () => {
        window.removeEventListener("error", handleError);
        window.removeEventListener("unhandledrejection", handleRejection);
      };
    }

    // Register service worker
    let updateInterval: ReturnType<typeof setInterval> | undefined;
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then((registration) => {
        // Check for updates on page load
        registration.update();

        // Check for updates every hour
        updateInterval = setInterval(
          () => {
            registration.update();
          },
          60 * 60 * 1000
        );
      })
      .catch((error) => {
        console.error("[Service Worker] Registration failed:", error);
      });

    // Handle service worker updates
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    // Listen for service worker messages
    navigator.serviceWorker.addEventListener("message", (event) => {});

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      if (updateInterval) clearInterval(updateInterval);
    };
  }, []);

  return null;
}
