import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.trygenit.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/chat", "/user", "/account", "/settings", "/admin", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
