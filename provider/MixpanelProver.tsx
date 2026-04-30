"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, trackPageView } from "../lib/mixpanelClient";

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  useEffect(() => {
    initMixpanel(MIXPANEL_TOKEN as string);
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    const pathWithQuery = query ? `${pathname}?${query}` : pathname;
    trackPageView(pathWithQuery, { source: "router" });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
