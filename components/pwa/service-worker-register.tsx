"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Check if we're in production (not localhost)
    const isProduction =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1" &&
      !window.location.hostname.startsWith("192.168.") &&
      !window.location.hostname.startsWith("10.");

    // Also allow in production build even on localhost for testing
    const isProductionBuild = process.env.NODE_ENV === "production";

    if (!isProduction && !isProductionBuild) {
      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then((registration) => {
        // Check for updates on page load
        registration.update();

        // Check for updates every hour
        const updateInterval = setInterval(
          () => {
            registration.update();
          },
          60 * 60 * 1000
        );

        // Cleanup interval on unmount
        return () => clearInterval(updateInterval);
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
  }, []);

  return null;
}
