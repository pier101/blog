import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import Script from "next/script";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { GlobalSearch } from "@/components/global-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { getWebsiteJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { getAllPosts } from "@/lib/posts";
import { defaultOgImagePath, hasConfiguredSiteUrl, siteDescription, siteLocale, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const metadataBase = siteUrl ?? new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: siteUrl
    ? {
        canonical: "/",
      }
    : undefined,
  openGraph: siteUrl
    ? {
        type: "website",
        locale: siteLocale,
        title: siteName,
        description: siteDescription,
        siteName,
        url: "/",
        images: [
          {
            url: defaultOgImagePath,
            width: 1200,
            height: 630,
            alt: `${siteName} Open Graph Image`,
          },
        ],
      }
    : undefined,
  twitter: siteUrl
    ? {
        card: "summary_large_image",
        title: siteName,
        description: siteDescription,
        images: [defaultOgImagePath],
      }
    : undefined,
  robots: hasConfiguredSiteUrl
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getAllPosts();
  const gaId = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_GA_ID : undefined;
  const websiteJsonLd = getWebsiteJsonLd();

  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground"
      >
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
        {websiteJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd(websiteJsonLd),
            }}
          />
        ) : null}
        <div className="pointer-events-none fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
          <div className="pointer-events-auto flex items-center gap-2">
            <GlobalSearch posts={posts} />
            <ThemeToggle />
          </div>
        </div>
        <main className="mx-auto min-h-screen w-full max-w-[1024px] px-4 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
