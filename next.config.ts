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
