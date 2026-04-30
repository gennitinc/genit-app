"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, trackPageView } from "../lib/mixpanelClient";

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  useEffect(() => {
    if (MIXPANEL_TOKEN) {
      initMixpanel(MIXPANEL_TOKEN);
    }
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    const pathWithQuery = query ? `${pathname}?${query}` : pathname;
    trackPageView(MIXPANEL_TOKEN as string, pathWithQuery, { source: "router" });
  }, [pathname, searchParams, MIXPANEL_TOKEN]);

  return <>{children}</>;
}
