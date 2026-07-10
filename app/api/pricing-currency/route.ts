import { pricingCurrencyForCountry } from "@/lib/pricing-currency";
import { getUsdRates } from "@/lib/pricing-rates";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");

  return NextResponse.json(pricingCurrencyForCountry(country, await getUsdRates()));
}
