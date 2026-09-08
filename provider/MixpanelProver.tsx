"use client";

import { initMixpanel, trackPageView } from "../lib/mixpanelClient";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MixpanelProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    const pathWithQuery = query ? `${pathname}?${query}` : pathname;
    trackPageView(pathWithQuery, { source: "router" });
  }, [pathname, searchParams]);

  return null;
}
