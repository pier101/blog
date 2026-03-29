import {
  createElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/callout";
import { cn } from "@/lib/cn";
import { slugifyHeading } from "@/lib/toc";

function MdxAnchor({
  href = "",
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  const linkClassName = cn("mdx-anchor", className);

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClassName}>
        {children}
      </Link>
    );
  }

  return (
    <a
      {...props}
      href={href}
      className={linkClassName}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ReactNode;
};

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  "data-language"?: string;
  "data-theme"?: string;
};

function extractTextContent(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(children)) {
    return extractTextContent(children.props.children);
  }

  return "";
}

export function useMDXComponents(): MDXComponents {
  const slugCounts = new Map<string, number>();

  const createHeading = (
    tag: "h1" | "h2" | "h3",
    className: string,
  ) => {
    return function Heading({
      children,
      className: userClassName,
      ...props
    }: HeadingProps) {
      const textContent = extractTextContent(children);
      const baseId = slugifyHeading(textContent);
      const nextCount = (slugCounts.get(baseId) ?? 0) + 1;

      slugCounts.set(baseId, nextCount);

      const id = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

      return createElement(
        tag,
        {
          ...props,
          id,
          className: cn("scroll-mt-28 sm:scroll-mt-32", className, userClassName),
        },
        children,
      );
    };
  };

  return {
    h1: createHeading(
      "h1",
      "mdx-heading-1",
    ),
    h2: createHeading(
      "h2",
      "mdx-heading-2",
    ),
    h3: createHeading(
      "h3",
      "mdx-heading-3",
    ),
    p: ({ className, ...props }) => (
      <p
        {...props}
        className={cn("mdx-paragraph", className)}
      />
    ),
    a: MdxAnchor,
    ul: ({ className, ...props }) => (
      <ul
        {...props}
        className={cn("mdx-list mdx-list-disc", className)}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        {...props}
        className={cn("mdx-list mdx-list-decimal", className)}
      />
    ),
    li: ({ className, ...props }) => (
      <li {...props} className={cn("mdx-list-item", className)} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        {...props}
        className={cn("mdx-blockquote", className)}
      />
    ),
    hr: ({ className, ...props }) => (
      <hr {...props} className={cn("mdx-divider", className)} />
    ),
    code: ({ className, "data-language": dataLanguage, ...props }: CodeProps) => {
      const isCodeBlock = Boolean(
        className?.includes("language-") || dataLanguage,
      );

      return (
        <code
          {...props}
          data-language={dataLanguage}
          className={cn(isCodeBlock ? "mdx-code-block" : "mdx-inline-code", className)}
        />
      );
    },
    pre: ({ className, ...props }) => (
      <pre
        {...props}
        className={cn("mdx-pre", className)}
      />
    ),
    strong: ({ className, ...props }) => (
      <strong
        {...props}
        className={cn("mdx-strong", className)}
      />
    ),
    em: ({ className, ...props }) => (
      <em {...props} className={cn("mdx-em", className)} />
    ),
    Callout,
  };
}
