import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const prettyCodeOptions = {
  theme: "github-dark-dimmed",
  keepBackground: false,
  bypassInlineCode: true,
  defaultLang: "plaintext",
  grid: true,
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [["rehype-pretty-code", prettyCodeOptions]],
  },
});

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' https://giscus.app https://www.googletagmanager.com${
        process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""
      }`,
      "style-src 'self' 'unsafe-inline' https://giscus.app",
      "img-src 'self' data: blob: https://www.google-analytics.com",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
      "font-src 'self' data:",
      "frame-src https://giscus.app",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      ...(process.env.NODE_ENV === "production"
        ? ["upgrade-insecure-requests"]
        : []),
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withMDX(nextConfig);
