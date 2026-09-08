import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Requests - Genit AI",
  description:
    "Suggest features and improvements for Genit's AI marketing agents, automation, campaigns, integrations, and connected workspace.",
  robots: { index: false, follow: true },
};

export default function SuggestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
