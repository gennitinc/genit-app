export type SyncIssueKind =
  "reconnect" | "rate_limited" | "too_large" | "temporary" | "unknown";

/**
 * One short sentence for a channel that failed to sync. Newer servers already
 * send this (with `errorKind`); older ones send the provider's raw response
 * (JSON, trace ids, Composio log ids). Same wording as the mobile app.
 */
export function syncIssue(
  raw: string,
  channel: string
): { kind: SyncIssueKind; message: string } {
  const text = raw.toLowerCase();
  if (
    /\b401\b|oauthexception|"code":\s*190|access token|session key|token (has )?expired|invalid_auth|token_revoked|unauthori[sz]ed|reconnect/.test(
      text
    )
  ) {
    return {
      kind: "reconnect",
      message: `${channel} needs to be reconnected.`,
    };
  }
  if (
    /ratelimit|rate limit|rate_limited|\b429\b|too many requests|limiting requests/.test(
      text
    )
  ) {
    return {
      kind: "rate_limited",
      message: `${channel} is limiting requests. It will catch up on the next sync.`,
    };
  }
  if (/\b413\b|payloadtoolarge|too large|too much at once/.test(text))
    return {
      kind: "too_large",
      message: `${channel} sent too much at once. Try syncing again.`,
    };
  if (
    /unknown error|temporar|timeout|timed out|\b5\d\d\b|unavailable/.test(text)
  ) {
    return {
      kind: "temporary",
      message: `${channel} had a temporary problem. Try again shortly.`,
    };
  }
  return { kind: "unknown", message: `${channel} couldn't sync right now.` };
}

/** Whether any of these accounts synced within the last `withinMs`. */
export function syncedRecently(
  accounts: { metadata?: Record<string, any> }[],
  withinMs: number
) {
  const last = Math.max(
    0,
    ...accounts.map(
      (account) =>
        Date.parse(String(account.metadata?.lastInboxSyncAt ?? "")) || 0
    )
  );
  return Date.now() - last < withinMs;
}

/** Notes about plugins that simply have no inbox (Drive, Calendar…), which aren't problems. */
export function isNoInboxNote(text: string) {
  return /has no managed inbox feed/i.test(text);
}

/** Personal mail providers, whose logo says nothing about the sender. */
const PERSONAL_MAIL = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "zoho.com",
  "yandex.com",
]);

/**
 * For email from a company (LinkedIn, Medium, Bolt…), its logo stands in when
 * the sender has no photo. The domain is looked up with Google's favicon service.
 */
export function senderLogo(conversation: {
  platform: string;
  customerHandle?: string;
}) {
  if (!["gmail", "outlook", "email"].includes(conversation.platform))
    return undefined;
  const domain = conversation.customerHandle
    ?.split("@")[1]
    ?.trim()
    .toLowerCase();
  if (!domain || PERSONAL_MAIL.has(domain) || /^yahoo\./.test(domain))
    return undefined;
  const parts = domain.split(".");
  // mail.bolt.eu → bolt.eu, but keep news.bbc.co.uk → bbc.co.uk
  const keep = parts.length > 2 && parts[parts.length - 2].length <= 3 ? 3 : 2;
  const site = parts.slice(-keep).join(".");
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(site)}&sz=128`;
}
