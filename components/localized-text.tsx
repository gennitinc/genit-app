"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LocalizedText({ text }: { text: string }) {
  return useLanguage().t(text);
}
