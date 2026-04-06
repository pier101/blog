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
import { MermaidDiagram } from "@/components/mdx/mermaid-diagram";
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

type FigureProps = ComponentPropsWithoutRef<"figure"> & {
  "data-rehype-pretty-code-figure"?: string;
};

type CodeNodeProps = {
  children?: ReactNode;
  className?: string;
  "data-language"?: string;
  "data-line"?: string;
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

function extractCodeBlockText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractCodeBlockText).join("");
  }

  if (isValidElement<CodeNodeProps>(children)) {
    const text = extractCodeBlockText(children.props.children);

    return "data-line" in children.props ? `${text}\n` : text;
  }

  return "";
}

function getCodeLanguage(
  props: Partial<CodeProps> | undefined,
) {
  if (!props) {
    return "";
  }

  if (typeof props["data-language"] === "string") {
    return props["data-language"];
  }

  const className = typeof props.className === "string" ? props.className : "";
  const languageMatch = className.match(/language-([\w-]+)/);

  return languageMatch?.[1] ?? "";
}

function getMermaidChart(children: ReactNode): string | null {
  if (!isValidElement<CodeNodeProps>(children)) {
    return null;
  }

  const directLanguage = getCodeLanguage(children.props as Partial<CodeProps>);

  if (directLanguage === "mermaid") {
    const chart = extractCodeBlockText(children.props.children).trim();

    return chart || null;
  }

  const nestedChildren = children.props.children;

  if (Array.isArray(nestedChildren)) {
    for (const child of nestedChildren) {
      const chart = getMermaidChart(child);

      if (chart) {
        return chart;
      }
    }
  } else if (nestedChildren) {
    return getMermaidChart(nestedChildren);
  }

  return null;
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
    figure: ({ className, children, ...props }: FigureProps) => {
      const mermaidChart = getMermaidChart(children);

      if (mermaidChart) {
        return <MermaidDiagram chart={mermaidChart} className={className} />;
      }

      return (
        <figure {...props} className={className}>
          {children}
        </figure>
      );
    },
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
    pre: ({ className, children, ...props }) => {
      const mermaidChart = getMermaidChart(children);

      if (mermaidChart) {
        return <MermaidDiagram chart={mermaidChart} className={className} />;
      }

      return (
        <pre
          {...props}
          className={cn("mdx-pre", className)}
        >
          {children}
        </pre>
      );
    },
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
