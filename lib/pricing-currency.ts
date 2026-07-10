export type PricingCurrency = {
  country: string;
  currency: string;
  locale: string;
  rate: number;
};

const DEFAULT_CURRENCY: PricingCurrency = {
  country: "US",
  currency: "USD",
  locale: "en-US",
  rate: 1,
};

const COUNTRY_CURRENCY: Record<string, Pick<PricingCurrency, "currency" | "locale">> = {
  AU: { currency: "AUD", locale: "en-AU" },
  CA: { currency: "CAD", locale: "en-CA" },
  EU: { currency: "EUR", locale: "en-IE" },
  FR: { currency: "EUR", locale: "fr-FR" },
  DE: { currency: "EUR", locale: "de-DE" },
  GH: { currency: "GHS", locale: "en-GH" },
  IE: { currency: "EUR", locale: "en-IE" },
  IN: { currency: "INR", locale: "en-IN" },
  KE: { currency: "KES", locale: "en-KE" },
  NG: { currency: "NGN", locale: "en-NG" },
  ZA: { currency: "ZAR", locale: "en-ZA" },
  GB: { currency: "GBP", locale: "en-GB" },
  US: { currency: "USD", locale: "en-US" },
};

export function pricingCurrencyForCountry(
  countryCode: string | null,
  rates: Record<string, number> = {}
): PricingCurrency {
  const country = countryCode?.toUpperCase() ?? DEFAULT_CURRENCY.country;
  const match = COUNTRY_CURRENCY[country] ?? DEFAULT_CURRENCY;
  const rate = match.currency === "USD" ? 1 : rates[match.currency];

  if (!rate) return DEFAULT_CURRENCY;

  return {
    country,
    currency: match.currency,
    locale: match.locale,
    rate,
  };
}

export function formatUsdPrice(priceUsd: number, pricingCurrency: PricingCurrency) {
  return new Intl.NumberFormat(pricingCurrency.locale, {
    currency: pricingCurrency.currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(priceUsd * pricingCurrency.rate);
}
