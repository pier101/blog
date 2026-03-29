import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resolvedSiteUrl = siteUrl;

  if (!resolvedSiteUrl) {
    return [];
  }

  const posts = await getAllPosts();

  return [
    {
      url: resolvedSiteUrl.toString(),
      lastModified: new Date(),
    },
    ...posts.map((post) => ({
      url: new URL(`/posts/${post.slug}`, resolvedSiteUrl).toString(),
      lastModified: new Date(post.date),
    })),
  ];
}
