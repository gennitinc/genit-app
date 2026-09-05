import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import PricingComponent from "@/components/pricing/page";
import { pricingCurrencyForCountry } from "@/lib/pricing-currency";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – Genit AI Marketing Automation Plans",
  description:
    "Compare Genit plans for autonomous marketing agents, content publishing, campaign automation, brand management, and team collaboration.",
  keywords: [
    "pricing",
    "AI marketing automation pricing",
    "subscription plans",
    "free trial",
    "monthly subscription",
    "annual subscription",
    "enterprise pricing",
  ],
  openGraph: {
    title: "Pricing – Genit AI",
    description:
      "Plans for autonomous marketing, campaign execution, and cross-channel publishing.",
    url: "https://www.trygenit.com/pricing",
    images: [
      {
        url: "https://www.trygenit.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Genit AI Pricing",
      },
    ],
  },
};

export default function Pricing() {
  const pricingCurrency = pricingCurrencyForCountry(null);

  return (
    <div className='min-h-screen bg-white dark:bg-black'>
      <LandingNavbar />
      <PricingComponent pricingCurrency={pricingCurrency} />
      <LandingFooter />
    </div>
  );
}
