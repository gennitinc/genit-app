import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Onboarding - Gennit AI",
  description:
    "Set up your brand on Gennit AI. Connect your channels, define your brand identity, and launch AI-powered design, content, ads, and marketing automation across every platform.",
  openGraph: {
    title: "Brand Onboarding - Gennit AI",
    description:
      "Set up your brand on Gennit AI. Connect your channels, define your brand identity, and launch AI-powered design, content, ads, and marketing automation across every platform.",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
