import { HomeFeed } from "@/components/home-feed";
import { getBlogJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getAllPosts();
  const blogJsonLd = getBlogJsonLd();

  return (
    <>
      {blogJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(blogJsonLd),
          }}
        />
      ) : null}
      <HomeFeed posts={posts} />
    </>
  );
}
