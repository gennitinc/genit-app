import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.gennit.online";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pricing",
          "/company",
          "/contact",
          "/suggest",
          "/inspire/create",
        ],
        disallow: [
          "/chat",
          "/user",
          "/account",
          "/settings",
          "/admin",
          "/_next",
          "/api",
        ],
      },
      {
        userAgent: "GoogleBot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "CCBot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
