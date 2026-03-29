import fs from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import { cache } from "react";
import type { PostMetadata, PostSummary } from "@/lib/post-meta";
import { extractTocFromMdx } from "@/lib/toc";

type PostModule = {
  default: ComponentType;
  metadata: PostMetadata;
};

const postsDirectory = path.join(process.cwd(), "src/content/posts");

async function getPostSlugs() {
  const entries = await fs.readdir(postsDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.replace(/\.mdx$/, ""));
}

async function importPost(slug: string): Promise<PostModule | null> {
  try {
    return (await import(`../content/posts/${slug}.mdx`)) as PostModule;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cannot find module")) {
      return null;
    }

    throw error;
  }
}

async function readPostSource(slug: string) {
  try {
    return await fs.readFile(path.join(postsDirectory, `${slug}.mdx`), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function isPublished(metadata: PostMetadata) {
  return metadata.published !== false;
}

export const getAllPosts = cache(async (): Promise<PostSummary[]> => {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await importPost(slug);

      if (!post || !isPublished(post.metadata)) {
        return null;
      }

      return {
        slug,
        ...post.metadata,
      };
    }),
  );

  return posts
    .filter((post): post is PostSummary => post !== null)
    .sort((left, right) => {
      return new Date(right.date).getTime() - new Date(left.date).getTime();
    });
});

export const getPostBySlug = cache(async (slug: string) => {
  const [post, source] = await Promise.all([importPost(slug), readPostSource(slug)]);

  if (!post || !source || !isPublished(post.metadata)) {
    return null;
  }

  return {
    slug,
    metadata: post.metadata,
    Content: post.default,
    toc: extractTocFromMdx(source),
  };
});
