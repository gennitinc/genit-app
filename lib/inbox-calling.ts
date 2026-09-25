const CALL_SUPPORTED_PLATFORMS = new Set(["whatsapp"]);

export function supportsInboxCalling(platform: string) {
  return CALL_SUPPORTED_PLATFORMS.has(platform.toLowerCase());
}
