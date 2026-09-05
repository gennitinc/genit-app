import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.trygenit.com";

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
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
