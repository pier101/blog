import { NextResponse, type NextRequest } from "next/server";

function createCspHeader(nonce: string) {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://giscus.app https://www.googletagmanager.com${
      isDevelopment ? " 'unsafe-eval'" : ""
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
    ...(!isDevelopment ? ["upgrade-insecure-requests"] : []),
  ];

  return directives.join("; ");
}

export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const contentSecurityPolicy = createCspHeader(nonce);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", contentSecurityPolicy);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
