import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function appendClientTimeContext(prompt: string): string {
  if (!prompt || typeof prompt !== "string") return prompt;
  // If the prompt already has a time context, don't append another one
  if (prompt.includes("[SystemTimeContext:")) return prompt;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  return `${prompt}\n\n[SystemTimeContext: ${now.toLocaleString()} | TZ: ${tz} | TS: ${now.getTime()}]`;
}

export function stripClientTimeContext(text: string): string {
  if (!text || typeof text !== "string") return text;
  return text.replace(/\n\n\[SystemTimeContext:.*?\]/g, "").trim();
}
