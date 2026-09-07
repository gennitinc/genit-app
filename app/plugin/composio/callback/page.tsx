"use client";

import { LocalizedText } from "@/components/localized-text";
import { syncComposioConnection } from "@/lib/integrations-api";
import { useEffect } from "react";

export default function ComposioCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toolkit = params.get("toolkit") || params.get("appName") || "";
    const platform = (params.get("platform") || "composio") as any;
    const origins = new Set([
      window.location.origin,
      "http://localhost:3000",
      "https://genit.vercel.app",
      "https://genitai.vercel.app",
      "https://www.trygenit.com",
      "https://trygenit.com",
    ]);

    void (async () => {
      let message: Record<string, unknown>;
      try {
        if (!toolkit || params.get("error"))
          throw new Error("Connection failed");
        const integration = await syncComposioConnection(toolkit, platform);
        message = {
          type: "genit:integration:connected",
          platform,
          integrationId: integration._id,
          accountName: integration.accountName,
        };
      } catch (error: any) {
        message = {
          type: "genit:integration:error",
          platform,
          message:
            error?.response?.data?.message ||
            error?.message ||
            "The Composio connection did not complete.",
        };
      }
      if (window.opener) {
        for (const origin of origins)
          window.opener.postMessage(message, origin);
      }
      window.close();
    })();
  }, []);

  return (
    <main className='flex min-h-screen items-center justify-center bg-white text-sm text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300'>
      <LocalizedText text={"Finishing connection…"} />
    </main>
  );
}
