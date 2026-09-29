"use client";

import { LocalizedText } from "@/components/localized-text";
import { syncComposioConnection } from "@/lib/integrations-api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ComposioCallbackPage() {
  const [status, setStatus] = useState("Finishing connection…");
  const [failed, setFailed] = useState(false);

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
        const providerError =
          params.get("error_description") || params.get("error");
        if (!toolkit) throw new Error("The connection callback is incomplete.");
        if (providerError) throw new Error(providerError);
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
        setStatus(
          message.type === "genit:integration:connected"
            ? "Connected. Return to Genit to continue."
            : String(
                message.message ||
                  "Connection failed. Return to Genit and try again."
              )
        );
        setFailed(message.type !== "genit:integration:connected");
        window.setTimeout(() => window.close(), 500);
        return;
      }

      // Some mobile and in-app browsers deliberately remove window.opener.
      // Never call close() in that state: it can strand the user on a native
      // "page couldn't load" screen. Return a successful connection to the
      // integrations page; keep provider errors visible and actionable.
      if (message.type === "genit:integration:connected") {
        window.location.replace("/integrations?connection=success");
        return;
      }
      setFailed(true);
      setStatus(
        String(message.message || "Connection failed. Please try again.")
      );
    })();
  }, []);

  return (
    <main className='flex min-h-screen items-center justify-center bg-white px-6 text-sm text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300'>
      <div className='max-w-md text-center'>
        <LocalizedText text={status} />
        {failed ? (
          <Link
            href='/integrations'
            className='mt-4 block font-medium text-violet-600 hover:underline dark:text-violet-400'
          >
            Back to integrations
          </Link>
        ) : null}
      </div>
    </main>
  );
}
