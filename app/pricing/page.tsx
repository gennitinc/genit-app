import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import PricingComponent from "@/components/pricing/page";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – Gennit AI | Affordable Plans for Media Design",
  description:
    "Explore Gennit AI pricing plans. Free tier for individuals, paid plans for teams and enterprises. Get started with AI-powered media design today.",
  keywords: [
    "pricing",
    "AI media design pricing",
    "subscription plans",
    "free trial",
    "monthly subscription",
    "annual subscription",
    "enterprise pricing",
  ],
  openGraph: {
    title: "Pricing – Gennit AI",
    description: "Affordable AI-powered media design plans for all users",
    url: "https://www.gennit.online/pricing",
    images: [
      {
        url: "https://www.gennit.online/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Gennit AI Pricing",
      },
    ],
  },
};

export default function Pricing() {
  return (
    <div className='min-h-screen bg-white dark:bg-black'>
      <LandingNavbar />
      <PricingComponent />
      <LandingFooter />
    </div>
  );
}
