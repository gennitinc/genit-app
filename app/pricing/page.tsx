import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import PricingComponent from "@/components/pricing/page";
import { pricingCurrencyForCountry } from "@/lib/pricing-currency";
import { getUsdRates } from "@/lib/pricing-rates";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Pricing – Genit AI | Affordable Plans for Media Design",
  description:
    "Explore Genit AI pricing plans. Free tier for individuals, paid plans for teams and enterprises. Get started with AI-powered media design today.",
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
    title: "Pricing – Genit AI",
    description: "Affordable AI-powered media design plans for all users",
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

export default async function Pricing() {
  const headerList = await headers();
  const country =
    headerList.get("x-vercel-ip-country") ??
    headerList.get("cf-ipcountry") ??
    headerList.get("x-country-code");
  const pricingCurrency = pricingCurrencyForCountry(country, await getUsdRates());

  return (
    <div className='min-h-screen bg-white dark:bg-black'>
      <LandingNavbar />
      <PricingComponent pricingCurrency={pricingCurrency} />
      <LandingFooter />
    </div>
  );
}
