import { PluginsPageClient } from "./plugins-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Plugins & Integrations | Genit AI",
  description:
    "Connect Genit AI with social networks, productivity tools, CRMs and more through 1,000+ supported plugins.",
  alternates: { canonical: "/plugins" },
  openGraph: {
    title: "AI Plugins & Integrations | Genit AI",
    description:
      "Explore 1,000+ plugins that connect Genit AI to the tools your business already uses.",
    url: "/plugins",
    type: "website",
  },
};

export default function PluginsPage() {
  return <PluginsPageClient />;
}
