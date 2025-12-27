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
import { Download } from "lucide-react";

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
    // If dismissed, keep the dialog open - installation is mandatory
  };

  // Don't show if already installed
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <Dialog
      open={showInstallPrompt}
      onOpenChange={() => {
        // Prevent closing - installation is mandatory
        // Do nothing, keep dialog open
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        hideDialogClose={true}
        onEscapeKeyDown={(e) => {
          // Prevent ESC key from closing
          e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          // Prevent clicking outside from closing
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          // Prevent any outside interaction from closing
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Install Gennit AI</DialogTitle>
          <DialogDescription>
            Install our app for a better experience. Get quick access, offline
            support, and faster loading times.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4 mx-2">
          {/* <Button onClick={handleInstallClick} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button> */}
          <div className="relative flex items-center justify-center text-sm mx-2">
            <div className="absolute bottom-2 flex items-center justify-around backdrop-blur-sm w-full max-w-72 rounded-md bg-white/10 border border-white/20 py-2">
              <p className="text-center">Gennit AI.</p>
              <Button
                onClick={handleInstallClick}
                type="button"
                className="bg-black/50 rounded-full px-6 py-1.5"
              >
                Install App
              </Button>
            </div>
            <img
              className="rounded-md"
              src="https://i.pinimg.com/736x/a1/e7/d2/a1e7d260643366ed3a3bf26b97109eca.jpg"
              alt=""
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
