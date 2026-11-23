/**
 * A shared social post or reel, as the platform's own embeddable player.
 * Same rules as the mobile app (gennit-mobile/src/lib/social-embed.ts).
 */
export type SocialEmbed = {
  /** The platform's official embed page for this post. */
  embedUrl: string;
  /** The post on the platform itself, for "Open in …". */
  postUrl: string;
  platform: "instagram" | "facebook" | "tiktok" | "youtube" | "x";
  label: string;
  /** Width / height of the player. */
  aspect: number;
};

export function socialEmbed(raw: string): SocialEmbed | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|mobile\.)/, "");
  const path = url.pathname;

  if (host === "instagram.com" || host === "instagr.am") {
    const match = /^\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/.exec(path);
    if (!match) return null;
    const kind = match[1] === "p" ? "p" : "reel";
    return {
      embedUrl: `https://www.instagram.com/${kind}/${match[2]}/embed/`,
      postUrl: `https://www.instagram.com/${kind}/${match[2]}/`,
      platform: "instagram",
      label: "Instagram",
      aspect: kind === "reel" ? 9 / 16 : 4 / 5,
    };
  }
  if (host === "youtube.com" || host === "youtu.be") {
    const id =
      host === "youtu.be"
        ? path.slice(1)
        : url.searchParams.get("v") ||
          /^\/(?:shorts|embed|live)\/([\w-]+)/.exec(path)?.[1] ||
          "";
    if (!/^[\w-]{6,}$/.test(id)) return null;
    const short = path.startsWith("/shorts/");
    return {
      embedUrl: `https://www.youtube.com/embed/${id}`,
      postUrl: short
        ? `https://www.youtube.com/shorts/${id}`
        : `https://www.youtube.com/watch?v=${id}`,
      platform: "youtube",
      label: "YouTube",
      aspect: short ? 9 / 16 : 16 / 9,
    };
  }
  if (host === "tiktok.com") {
    const id = /\/video\/(\d+)/.exec(path)?.[1];
    if (!id) return null;
    return {
      embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
      postUrl: url.toString(),
      platform: "tiktok",
      label: "TikTok",
      aspect: 9 / 16,
    };
  }
  if (host === "x.com" || host === "twitter.com") {
    const id = /\/status\/(\d+)/.exec(path)?.[1];
    if (!id) return null;
    return {
      embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${id}`,
      postUrl: `https://x.com/i/status/${id}`,
      platform: "x",
      label: "X",
      aspect: 4 / 5,
    };
  }
  if (host === "facebook.com" || host === "fb.watch") {
    if (!/\/(reel|videos|watch|share\/[rv])\b/.test(path) && host !== "fb.watch")
      return null;
    return {
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.toString())}&show_text=false`,
      postUrl: url.toString(),
      platform: "facebook",
      label: "Facebook",
      aspect: /\/reel/.test(path) ? 9 / 16 : 16 / 9,
    };
  }
  return null;
}

/** Where to see a conversation the provider didn't share with apps. */
export function platformInboxUrl(platform: string) {
  switch (platform) {
    case "instagram":
      return { url: "https://www.instagram.com/direct/inbox/", label: "Instagram" };
    case "messenger":
    case "facebook":
      return { url: "https://www.messenger.com/", label: "Messenger" };
    case "whatsapp":
      return { url: "https://web.whatsapp.com/", label: "WhatsApp" };
    case "telegram":
      return { url: "https://web.telegram.org/", label: "Telegram" };
    case "x":
      return { url: "https://x.com/messages", label: "X" };
    case "linkedin":
      return { url: "https://www.linkedin.com/messaging/", label: "LinkedIn" };
    default:
      return null;
  }
}

/**
 * A link that opens the chat with this exact person in the platform's own app
 * (ig.me, wa.me, t.me and m.me are the platforms' official chat links).
 * Falls back to the platform's inbox when the contact's handle isn't known.
 */
export function platformChatUrl(
  platform: string,
  contact: { customerHandle?: string; customerId?: string }
) {
  const handle = (contact.customerHandle || "").trim().replace(/^@/, "");
  const usable = /^[\w.]{1,64}$/.test(handle) ? handle : "";
  const inbox = platformInboxUrl(platform);
  const label = inbox?.label || platform;
  const digits = (contact.customerId || contact.customerHandle || "").replace(/\D/g, "");
  switch (platform) {
    case "instagram":
      if (usable) return { url: `https://ig.me/m/${usable}`, label };
      break;
    case "whatsapp":
      if (digits.length >= 7) return { url: `https://wa.me/${digits}`, label };
      break;
    case "telegram":
      if (usable) return { url: `https://t.me/${usable}`, label };
      break;
    case "messenger":
    case "facebook":
      if (usable) return { url: `https://m.me/${usable}`, label };
      break;
    case "x":
      if (contact.customerId && /^\d+$/.test(contact.customerId))
        return {
          url: `https://x.com/messages/compose?recipient_id=${contact.customerId}`,
          label,
        };
      break;
  }
  return inbox;
}
