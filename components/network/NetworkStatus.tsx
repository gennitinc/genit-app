"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

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
    <div className='flex min-h-screen flex-col items-center justify-center bg-white p-4 dark:bg-gray-950'>
      <AnimatePresence mode='wait'>
        {showOnlineMessage && (
          <motion.div
            key='online'
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className='rounded-lg bg-green-50 p-8 text-center dark:bg-green-900/20'
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
              className='mb-8 inline-block rounded-full bg-green-500 p-2'
            >
              <Check className='size-16 text-white' />
            </motion.div>
            <h1 className='mb-4 text-xl font-bold text-green-600 dark:text-green-400'>
              <LocalizedText text={"You&apos;re Back Online!"} />
            </h1>
            <p className='mb-8 text-base text-gray-700 dark:text-gray-300'>
              <LocalizedText
                text={"Your connection has been restored successfully."}
              />
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className='mb-8 h-1 rounded-full bg-green-500'
            />
          </motion.div>
        )}

        {showErrorMessage && (
          <motion.div
            key='error'
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className='rounded-lg bg-red-50 p-8 text-center dark:bg-red-900/20'
          >
            <motion.div
              animate={{ rotate: isRetrying ? 360 : 0 }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: isRetrying ? Number.POSITIVE_INFINITY : 0,
              }}
              className='mb-8 inline-block'
            >
              {isRetrying ? (
                <Wifi className='size-16 text-red-500 dark:text-red-400' />
              ) : (
                <WifiOff className='size-16 text-red-500 dark:text-red-400' />
              )}
            </motion.div>
            <h1 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>
              {isOnline ? "Data Fetch Error" : "Network Error"}
            </h1>
            <p className='mb-8 text-base text-gray-700 dark:text-gray-300'>
              {isOnline
                ? "We couldn't fetch your information."
                : "Your network connection is currently offline."}
            </p>
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className='transform rounded-full bg-white px-6 py-2 font-bold text-black transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
            >
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className='mt-8 text-sm text-gray-500 dark:text-gray-400'
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
