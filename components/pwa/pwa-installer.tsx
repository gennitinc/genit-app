"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if app is already installed
    const checkInstalled = () => {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true
      ) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    if (checkInstalled()) {
      return;
    }

    // Check dismissal status
    const checkDismissal = () => {
      const dismissedTime = localStorage.getItem("pwa-install-dismissed");
      if (dismissedTime) {
        const daysSinceDismissed =
          (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
        return daysSinceDismissed < 7; // Return true if recently dismissed
      }
      return false;
    };

    // Check if PWA is installable (for desktop/tablet fallback)
    const checkInstallable = () => {
      // Check if service worker is registered (indicates PWA readiness)
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            // Check if manifest exists and is valid
            const link = document.querySelector('link[rel="manifest"]');
            if (link) {
              setIsInstallable(true);
              // Show prompt if not dismissed
              if (!checkDismissal()) {
                setShowInstallPrompt(true);
              }
            }
          }
        });
      }
    };

    // Handler for beforeinstallprompt event (mobile Chrome/Edge)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      // Show prompt if not dismissed
      if (!checkDismissal()) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Fallback for desktop/tablet: Check after a delay if installable
    // This allows the page to fully load and service worker to register
    const checkTimer = setTimeout(() => {
      if (!isInstalled && !deferredPrompt && !checkDismissal()) {
        checkInstallable();
      }
    }, 3000); // 3 second delay to ensure page is loaded

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(checkTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Mobile Chrome/Edge: Use the deferred prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    } else {
      // Desktop/Tablet fallback: Show browser's native install UI
      // For Chrome/Edge desktop, the install button appears in address bar
      // For Safari, users need to use Share > Add to Home Screen
      // For Firefox, users need to use the menu
      // We can't programmatically trigger these, so we show instructions
      const isChrome =
        /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor);
      const isEdge = /Edg/.test(navigator.userAgent);
      const isSafari =
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent) &&
        !/Firefox/.test(navigator.userAgent);
      const isFirefox = /Firefox/.test(navigator.userAgent);

      if (isChrome || isEdge) {
        // Chrome/Edge desktop: Install button should appear in address bar
        // Close dialog and let user use browser's install button
        setShowInstallPrompt(false);
        handleDismiss();
      } else if (isSafari) {
        // Safari: Show instructions
        alert(
          "To install: Click Share button (square with arrow) > Add to Home Screen"
        );
        handleDismiss();
      } else if (isFirefox) {
        // Firefox: Show instructions
        alert("To install: Click menu (three lines) > Install");
        handleDismiss();
      } else {
        // Other browsers
        handleDismiss();
      }
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) {
    return null;
  }

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Only show if installable and prompt should be shown
  // The dismissal check is handled in useEffect, so if showInstallPrompt is true,
  // it means it passed the dismissal check
  if (!isInstallable || !showInstallPrompt) {
    return null;
  }

  return (
    <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
      <DialogContent className="!max-w-sm !rounded-2xl !p-6 z-[100]">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Text */}
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold">
              Install Gennit AI
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Get faster access, offline support, and a smoother experience when
              you install the app.
            </DialogDescription>
          </div>

          {/* Image */}
          <img
            src="https://i.pinimg.com/originals/ea/f6/81/eaf68175b624f9f2d9f681ffabc8d437.gif"
            alt="Install Gennit App"
            className="w-40 h-40 object-contain rounded-xl"
            loading="lazy"
          />

          {/* Actions */}
          <div className="flex w-full gap-3 pt-2">
            <Button onClick={handleInstallClick} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Install App
            </Button>
            {/* 
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Not Now
            </Button> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
