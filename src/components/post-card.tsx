import Image from "next/image";
import Link from "next/link";
import { Panel, Pill } from "@/components/ui";
import { formatDisplayDate, type PostSummary } from "@/lib/post-meta";

type PostCardProps = {
  post: PostSummary;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <li>
      <Link
        href={`/posts/${post.slug}`}
        className="group block cursor-pointer rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:rounded-panel"
      >
        <Panel
          className="transition duration-300 group-hover:shadow-card-hover sm:rounded-panel"
          overflow="hidden"
          radius="card"
          shadow="card"
        >
          <div className="grid min-h-[172px] sm:grid-cols-[17.25rem_minmax(0,1fr)]">
            <div className="block overflow-hidden bg-surface-muted">
              {post.thumbnail ? (
                <div className="relative aspect-[4/3] w-full sm:h-full sm:min-h-[188px] sm:aspect-auto">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    loading="eager"
                    className="object-cover transition duration-300 group-hover:scale-[1.1]"
                    sizes="(max-width: 639px) 100vw, 276px"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col justify-between bg-surface-muted p-4 sm:h-full sm:min-h-[188px] sm:aspect-auto sm:p-5">
                  <span className="text-label-xs font-medium text-muted-foreground sm:text-label-sm">
                    {post.category}
                  </span>
                  <span className="max-w-[14rem] text-base font-semibold leading-6 tracking-title-soft text-foreground-strong sm:max-w-[14.25rem] sm:text-title-xs sm:leading-7">
                    {post.title}
                  </span>
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col justify-between border-t border-border px-4 py-4 sm:border-l sm:border-t-0 sm:px-4 sm:py-4">
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <Pill>{post.category}</Pill>
                </div>
                <h2 className="mt-3 text-title-sm font-semibold leading-snug tracking-title text-foreground-strong transition group-hover:text-accent sm:mt-3.5 sm:text-title-sm">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-body-xs leading-6 text-muted-foreground sm:mt-2.5 sm:text-body-xs sm:leading-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground sm:mt-4 sm:text-body-xs">
                <span>{formatDisplayDate(post.date)}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-label-xs tracking-meta text-quiet-2 sm:text-label-sm">
                  {post.readingTime}
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </Link>
    </li>
  );
}
