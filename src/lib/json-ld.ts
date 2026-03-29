import type { PostMetadata } from "@/lib/post-meta";
import {
  createAbsoluteUrl,
  defaultOgImagePath,
  hasConfiguredSiteUrl,
  resolveMetadataImage,
  siteAuthorName,
  siteDescription,
  siteLanguage,
  siteName,
} from "@/lib/site";

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function getWebsiteJsonLd() {
  if (!hasConfiguredSiteUrl) {
    return null;
  }

  const homeUrl = createAbsoluteUrl("/");
  const imageUrl = resolveMetadataImage(defaultOgImagePath);

  if (!homeUrl) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${homeUrl}#website`,
    url: homeUrl,
    name: siteName,
    description: siteDescription,
    inLanguage: siteLanguage,
    publisher: {
      "@type": "Person",
      name: siteAuthorName,
      url: homeUrl,
    },
    ...(imageUrl
      ? {
          image: [imageUrl],
        }
      : {}),
  };
}

export function getBlogJsonLd() {
  if (!hasConfiguredSiteUrl) {
    return null;
  }

  const homeUrl = createAbsoluteUrl("/");
  const imageUrl = resolveMetadataImage(defaultOgImagePath);

  if (!homeUrl) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${homeUrl}#blog`,
    url: homeUrl,
    name: siteName,
    description: siteDescription,
    inLanguage: siteLanguage,
    mainEntityOfPage: homeUrl,
    isPartOf: {
      "@id": `${homeUrl}#website`,
    },
    author: {
      "@type": "Person",
      name: siteAuthorName,
      url: homeUrl,
    },
    publisher: {
      "@type": "Person",
      name: siteAuthorName,
      url: homeUrl,
    },
    ...(imageUrl
      ? {
          image: [imageUrl],
        }
      : {}),
  };
}

export function getBlogPostingJsonLd(slug: string, metadata: PostMetadata) {
  if (!hasConfiguredSiteUrl) {
    return null;
  }

  const homeUrl = createAbsoluteUrl("/");
  const articleUrl = createAbsoluteUrl(`/posts/${slug}`);
  const imageUrl =
    resolveMetadataImage(metadata.thumbnail) ??
    resolveMetadataImage(defaultOgImagePath);

  if (!homeUrl || !articleUrl) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: metadata.title,
    description: metadata.excerpt,
    datePublished: metadata.date,
    dateModified: metadata.date,
    inLanguage: siteLanguage,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    articleSection: metadata.category,
    keywords: metadata.tags,
    isPartOf: {
      "@type": "Blog",
      "@id": `${homeUrl}#blog`,
      name: siteName,
      url: homeUrl,
    },
    author: {
      "@type": "Person",
      name: siteAuthorName,
      url: homeUrl,
    },
    publisher: {
      "@type": "Person",
      name: siteAuthorName,
      url: homeUrl,
    },
    ...(imageUrl
      ? {
          image: [imageUrl],
        }
      : {}),
  };
}
