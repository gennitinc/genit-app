import { marketingCapabilities } from "@/lib/marketing-capabilities";
import { apiResponse } from "@/utils/apiResponse";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.trygenit.com";

  const staticRoutes = [
    "",
    "/pricing",
    "/platform",
    "/company",
    "/contact",
    "/blog",
    "/plugins",
    "/templates",
    "/legal/terms-of-service",
    "/legal/privacy-policy",
    "/docs",
    ...marketingCapabilities.map(({ slug }) => `/platform/${slug}`),
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/platform") ? 0.9 : 0.7,
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
    // Keep the sitemap accurate when the content API is unavailable.
  }

  return sitemapEntries;
}
