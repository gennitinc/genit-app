"use client";

import { LoadingFileLoader } from "@/utils/Loading";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface WebContainerViewerProps {
  url: string;
  className?: string;
}

export function BrowserViewer({
  url,
  className = "",
}: WebContainerViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [finalUrl, setFinalUrl] = useState("");
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const retryCount = useRef(0);
  const maxRetries = 5;

  useEffect(() => {
    if (!url) return;

    // Reset state when URL changes
    setIsLoading(true);
    setLoadError(false);
    retryCount.current = 0;

    // Process the URL to ensure it's properly formatted
    const processUrl = (inputUrl: string) => {
      // Make sure URL is properly formatted
      let processedUrl = inputUrl.trim();

      // Check if URL is a local WebContainer URL
      if (processedUrl.includes("local-corp.webcontainer-api.io")) {
        // Ensure URL is using https
        if (!processedUrl.startsWith("https://")) {
          processedUrl = "https://" + processedUrl.replace(/^https?:\/\//, "");
        }

        // Remove any trailing slashes
        processedUrl = processedUrl.replace(/\/+$/, "");

        // Add a timestamp parameter to bypass caching
        processedUrl = `${processedUrl}?t=${Date.now()}`;
      }

      return processedUrl;
    };

    const processedUrl = processUrl(url);
    setFinalUrl(processedUrl);

    // Create a direct link to open in new tab as fallback
    const directLinkElement = document.createElement("a");
    directLinkElement.href = processedUrl;
    directLinkElement.target = "_blank";
    directLinkElement.rel = "noopener noreferrer";
    directLinkElement.textContent = "Open in new tab";

    const checkIframeLoaded = () => {
      try {
        // Try to access the iframe content to see if it's loaded
        const iframeWindow = iframeRef.current?.contentWindow;
        const iframeDoc = iframeRef.current?.contentDocument;

        if (
          iframeWindow &&
          (iframeWindow.document.readyState === "complete" ||
            iframeDoc?.readyState === "complete")
        ) {
          setIsLoading(false);
          return true;
        }
      } catch (error) {
        console.warn("⚠️ CORS error or iframe not loaded yet:", error);
      }

      retryCount.current++;

      if (retryCount.current <= maxRetries) {
        setTimeout(checkIframeLoaded, 2000); // Retry after 2 seconds
        return false;
      } else {
        console.error("❌ Failed to load iframe after multiple attempts");
        setIsLoading(false); // Stop showing loading state
        setLoadError(true); // Show error state
        return false;
      }
    };

    // Initial check after a delay to allow the server to start
    setTimeout(checkIframeLoaded, 3000);

    // Set up message listener for communication from iframe
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from our iframe
      if (event.data === "iframe-loaded") {
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [url]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && (
        <div className='bg-opacity-50 absolute inset-0 z-10 flex items-center justify-center bg-gray-100'>
          <div className='flex flex-col items-center gap-2'>
            <LoadingFileLoader size={16} />
            <p className='text-sm text-gray-600'>Loading preview...</p>
          </div>
        </div>
      )}

      {loadError && (
        <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-100'>
          <div className='max-w-md p-4 text-center'>
            <p className='mb-2 font-medium text-red-500'>
              Failed to load preview in iframe
            </p>
            <p className='mb-4 text-sm text-gray-600'>
              This may be due to CORS restrictions or the WebContainer not being
              fully initialized.
            </p>
            <a
              href={finalUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:bg-indigo-700-600 rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-600 hover:bg-indigo-700'
            >
              Open in new tab
            </a>
          </div>
        </div>
      )}

      {finalUrl && (
        <iframe
          ref={iframeRef}
          src={finalUrl}
          className='h-full w-full rounded-md border'
          allow='accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking'
          sandbox='allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
          onLoad={handleIframeLoad}
        />
      )}
    </div>
  );
}
