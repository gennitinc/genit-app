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

  useEffect(() => {
    // Check if app is already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Don't show if already installed or recently dismissed
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  const dismissedTime = localStorage.getItem("pwa-install-dismissed");
  if (dismissedTime) {
    const daysSinceDismissed =
      (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) {
      return null; // Don't show again for 7 days
    }
  }

  return (
    <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
      <DialogContent className="max-w-sm rounded-2xl p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Image */}
          <img
            src="https://i.pinimg.com/originals/ea/f6/81/eaf68175b624f9f2d9f681ffabc8d437.gif"
            alt="Install Gennit App"
            className="w-40 h-40 object-contain rounded-xl"
          />

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

          {/* Actions */}
          <div className="flex w-full gap-3 pt-2">
            <Button onClick={handleInstallClick} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Install App
            </Button>

            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Not Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
