/**
 * Chat platforms Genit can start a call on. WhatsApp also supports native
 * voice calls; on the others Genit sends a Google Meet or Teams link in the
 * chat. Email (Gmail, Outlook) has no call.
 */
const CALL_SUPPORTED_PLATFORMS = new Set([
  "whatsapp",
  "instagram",
  "messenger",
  "facebook",
  "telegram",
  "x",
  "linkedin",
  "slack",
]);

export function supportsInboxCalling(platform: string) {
  return CALL_SUPPORTED_PLATFORMS.has(platform.toLowerCase());
}
