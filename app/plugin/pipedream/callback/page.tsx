"use client";

import { LocalizedText } from "@/components/localized-text";
import { useEffect } from "react";

export default function PipedreamCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const platform = params.get("platform") || "pipedream";
    const message = error
      ? {
          type: "genit:integration:error",
          platform,
          message: "The Pipedream connection did not complete.",
        }
      : {
          type: "genit:integration:connected",
          platform,
          accountName: params.get("app") || undefined,
        };
    const origins = new Set([
      window.location.origin,
      "http://localhost:3000",
      "https://genit.vercel.app",
      "https://genitai.vercel.app",
      "https://www.trygenit.com",
      "https://trygenit.com",
    ]);
    if (window.opener) {
      for (const origin of origins) window.opener.postMessage(message, origin);
    }
    window.close();
  }, []);

  return (
    <main className='flex min-h-screen items-center justify-center bg-white text-sm text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300'>
      <LocalizedText text={"Finishing connection…"} />
    </main>
  );
}
