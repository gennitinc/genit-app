"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GradientFrame } from "@/utils/gradient-frame";
import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

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

    // Handler for beforeinstallprompt event
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setIsInstallable(true);

      // Detect if mobile or desktop
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // Only prevent default and show custom dialog on mobile
      // On desktop, let the browser show its native install button in the address bar
      if (isMobile) {
        e.preventDefault();
        // Show prompt if not dismissed
        if (!checkDismissal()) {
          setShowInstallPrompt(true);
        }
      } else {
        // On desktop, don't show custom dialog - let browser handle it
        // The browser will show install button in address bar
        setShowInstallPrompt(false);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Note: On desktop, we don't show a custom dialog
    // The browser will show its native install button in the address bar
    // This fallback is only for cases where beforeinstallprompt doesn't fire
    // but the PWA is still installable (rare edge case)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
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
      <DialogContent className='z-[100] !max-w-sm !rounded-lg !p-6'>
        <div className='relative'>
          <GradientFrame />
          <div className='flex flex-col items-center space-y-4 text-center'>
            {/* Text */}
            <div className='space-y-2'>
              <DialogTitle className='text-xl font-semibold'>
                <LocalizedText text={"Install Genit AI"} />
              </DialogTitle>
              <DialogDescription className='text-muted-foreground text-sm'>
                <LocalizedText
                  text={
                    "Get faster access, offline support, and a smoother experience when you install the app."
                  }
                />
              </DialogDescription>
            </div>

            {/* Image */}
            <img
              src='https://i.pinimg.com/originals/ea/f6/81/eaf68175b624f9f2d9f681ffabc8d437.gif'
              alt='Install genit App'
              className='h-40 w-40 rounded-xl object-contain'
              loading='lazy'
            />

            {/* Actions */}
            <div className='flex w-full gap-3 pt-2'>
              <Button onClick={handleInstallClick} className='flex-1 gap-2'>
                <Download className='h-4 w-4' />
                <LocalizedText text={"Install App"} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
