import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resolvedSiteUrl = siteUrl;

  if (!resolvedSiteUrl) {
    return [];
  }

  const posts = await getAllPosts();
  const latestPostDate = posts.reduce<Date | null>((latest, post) => {
    const publishedAt = new Date(post.date);

    if (Number.isNaN(publishedAt.getTime())) {
      return latest;
    }

    if (!latest || publishedAt > latest) {
      return publishedAt;
    }

    return latest;
  }, null);

  return [
    {
      url: resolvedSiteUrl.toString(),
      lastModified: latestPostDate ?? undefined,
    },
    ...posts.map((post) => ({
      url: new URL(`/posts/${post.slug}`, resolvedSiteUrl).toString(),
      lastModified: new Date(post.date),
    })),
  ];
}
