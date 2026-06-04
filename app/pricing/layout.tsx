import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans - Genit AI",
  description:
    "Choose the perfect plan for your creative needs. Free tier available for AI image and video generation.",
  keywords: ["AI generator pricing", "free AI tools", "genit subscription"],
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
