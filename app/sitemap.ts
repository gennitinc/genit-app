import { apiResponse } from "@/utils/apiResponse";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.trygenit.com";

  const staticRoutes = [
    "",
    "/pricing",
    "/company",
    "/contact",
    "/suggest",
    "/signin",
    "/signup",
    "/apps",
    "/apps2",
    "/blog",
    // "/community",
    "/creators-program",
    "/inspirations",
    "/all/plugins",
    "/templates",
    "/legal/terms-of-service",
    "/legal/privacy-policy",
    "/inspire/create",
    "/apps/character",
    "/apps/logo-animation2",
    "/apps/image-generation",
    "/apps/skin-enhancer",
    "/apps/workflow",
    "/apps/text-to-speech",
    "/apps/angles-reshape",
    "/apps/video-generation",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  // Fetch dynamic blog posts
  try {
    const response = await apiResponse.get("/blog", { timeout: 5000 });
    if (response.data && response.data.posts) {
      const blogPosts = response.data.posts;
      blogPosts.forEach((post: any) => {
        sitemapEntries.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.publishedAt || new Date()),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    // Fallback to known static posts if API is unreachable
    const fallbackSlugs = [
      "how-sentry-uses-genit",
      "how-appdirect-turned-non-technical-teams-into-builders-with-genit",
      "how-thinkific-uses-genit-to-prototype",
      "build-apps-from-a-link-with-genit",
    ];
    fallbackSlugs.forEach((slug) => {
      sitemapEntries.push({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  }

  return sitemapEntries;
}
