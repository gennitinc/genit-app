import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – Genit AI Marketing Automation Plans",
  description:
    "Choose a Genit plan for autonomous marketing agents, campaigns, publishing, and team collaboration.",
  keywords: [
    "AI marketing pricing",
    "marketing automation plans",
    "Genit subscription",
  ],
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
