import {
  pricingCurrencyForCountry,
  pricingCurrencyForCurrency,
} from "@/lib/pricing-currency";
import { getUsdRates } from "@/lib/pricing-rates";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const currency = searchParams.get("currency");
  const rates = await getUsdRates();

  return NextResponse.json(
    currency
      ? pricingCurrencyForCurrency(country, currency, rates)
      : pricingCurrencyForCountry(country, rates)
  );
}
