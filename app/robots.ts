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
          "/inspirations",
          "/suggest",
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
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
