import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PostComments } from "@/components/post-comments";
import { PostFloatingBackButton } from "@/components/post-floating-back-button";
import { PostToc } from "@/components/post-toc";
import { Panel, Pill } from "@/components/ui";
import { getBlogPostingJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { formatDisplayDate } from "@/lib/post-meta";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import {
  createAbsoluteUrl,
  defaultOgImagePath,
  hasConfiguredSiteUrl,
  resolveMetadataImage,
  siteLocale,
  siteName,
} from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const canonicalPath = `/posts/${slug}`;
  const metadataImage =
    resolveMetadataImage(post.metadata.thumbnail) ??
    resolveMetadataImage(defaultOgImagePath);

  return {
    title: post.metadata.title,
    description: post.metadata.excerpt,
    keywords: post.metadata.tags,
    alternates: hasConfiguredSiteUrl
      ? {
          canonical: canonicalPath,
        }
      : undefined,
    openGraph: hasConfiguredSiteUrl
      ? {
          type: "article",
          locale: siteLocale,
          title: post.metadata.title,
          description: post.metadata.excerpt,
          url: createAbsoluteUrl(canonicalPath) ?? undefined,
          siteName,
          publishedTime: post.metadata.date,
          modifiedTime: post.metadata.date,
          tags: post.metadata.tags,
          images: metadataImage
            ? [
                {
                  url: metadataImage,
                  alt: post.metadata.title,
                },
              ]
            : undefined,
        }
      : undefined,
    twitter: hasConfiguredSiteUrl
      ? {
          card: "summary_large_image",
          title: post.metadata.title,
          description: post.metadata.excerpt,
          images: metadataImage ? [metadataImage] : undefined,
        }
      : undefined,
    robots: hasConfiguredSiteUrl
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
        },
  };
}

export default async function PostDetailPage(props: PageProps<"/posts/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { Content, metadata, toc } = post;
  const blogPostingJsonLd = getBlogPostingJsonLd(slug, metadata);

  return (
    <div className="relative">
      <PostFloatingBackButton />
      <PostToc headings={toc} />

      <article className="mx-auto min-w-0 max-w-[760px] pt-12 sm:pt-14">
        {blogPostingJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd(blogPostingJsonLd),
            }}
          />
        ) : null}
        <section className="border-b border-border pb-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Pill size="sm">{metadata.category}</Pill>
            <span aria-hidden="true">·</span>
            <span>{formatDisplayDate(metadata.date)}</span>
            <span aria-hidden="true">·</span>
            <span>{metadata.readingTime}</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-title text-balance text-foreground-strong sm:text-4xl">
            {metadata.title}
          </h1>
          <p className="mt-5 max-w-3xl text-body-sm leading-8 text-muted-foreground sm:text-base">{metadata.excerpt}</p>
          {metadata.thumbnail ? (
            <Panel className="mt-8" overflow="hidden" radius="panel" shadow="card" tone="muted">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={metadata.thumbnail}
                  alt={metadata.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 820px) 100vw, 760px"
                  priority
                />
              </div>
            </Panel>
          ) : null}
        </section>

        <section className="pt-10">
          <div className="post-body">
            <Content />
          </div>
        </section>

        <PostComments />
      </article>
    </div>
  );
}
