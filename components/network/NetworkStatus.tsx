"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, Check } from "lucide-react";
import { useState, useEffect } from "react";

export function NetworkStatus({
  isError,
  retryFunction,
}: {
  isError: boolean;
  retryFunction: () => void;
}) {
  const [isOnline, setIsOnline] = useState(true); // Default to true for SSR
  const [wasOffline, setWasOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showError, setShowError] = useState(isError);

  // Initialize online status on client-side only
  useEffect(() => {
    setIsOnline(navigator.onLine);
    setWasOffline(!navigator.onLine);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);

      // Reset wasOffline state after showing the "back online" message
      setTimeout(() => {
        setWasOffline(false);
        retryFunction();
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [retryFunction]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setTimeout(() => {
      retryFunction();
      setIsRetrying(false);
    }, 2000);
  };

  useEffect(() => {
    setShowError(isError);
  }, [isError]);

  // Determine which state to show
  const showOnlineMessage = isOnline && wasOffline;
  const showErrorMessage = !showOnlineMessage && (showError || !isOnline);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {showOnlineMessage && (
          <motion.div
            key="online"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 rounded-lg bg-green-50 dark:bg-green-900/20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
              className="inline-block mb-8 bg-green-500 rounded-full p-2"
            >
              <Check className="size-16 text-white" />
            </motion.div>
            <h1 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
              You&apos;re Back Online!
            </h1>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-8">
              Your connection has been restored successfully.
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-1 bg-green-500 rounded-full mb-8"
            />
          </motion.div>
        )}

        {showErrorMessage && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 rounded-lg bg-red-50 dark:bg-red-900/20"
          >
            <motion.div
              animate={{ rotate: isRetrying ? 360 : 0 }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: isRetrying ? Number.POSITIVE_INFINITY : 0,
              }}
              className="inline-block mb-8"
            >
              {isRetrying ? (
                <Wifi className="size-16 text-red-500 dark:text-red-400" />
              ) : (
                <WifiOff className="size-16 text-red-500 dark:text-red-400" />
              )}
            </motion.div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {isOnline ? "Data Fetch Error" : "Network Error"}
            </h1>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-8">
              {isOnline
                ? "We couldn't fetch your information."
                : "Your network connection is currently offline."}
            </p>
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-bold py-2 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 text-gray-500 dark:text-gray-400 text-sm"
            >
              {isOnline
                ? "If the issue persists, please try again later."
                : "Please check your internet connection."}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
