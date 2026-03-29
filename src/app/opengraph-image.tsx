import path from "node:path";
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { cache } from "react";
import { siteDescription, siteName } from "@/lib/site";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const alt = `${siteName} Open Graph Image`;

const loadOgFonts = cache(async () => {
  const fontsDirectory = path.join(
    process.cwd(),
    "node_modules",
    "pretendard",
    "dist",
    "public",
    "static",
    "alternative",
  );

  const [regular, bold] = await Promise.all([
    readFile(path.join(fontsDirectory, "Pretendard-Regular.ttf")),
    readFile(path.join(fontsDirectory, "Pretendard-Bold.ttf")),
  ]);

  return { regular, bold };
});

export default async function OpenGraphImage() {
  const { regular, bold } = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#f8f8f8",
          color: "#111111",
          padding: "72px",
          fontFamily: "Pretendard",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            borderRadius: "36px",
            border: "1px solid rgba(17,17,17,0.06)",
            background: "#ffffff",
            padding: "56px",
            boxShadow: "0 24px 56px rgba(17,17,17,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#3b82f6",
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                <span>@</span>
                <span>pier101</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: 66,
                    lineHeight: 1.08,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {siteName}
                </div>
                <div
                  style={{
                    maxWidth: "760px",
                    color: "#66645f",
                    fontSize: 30,
                    lineHeight: 1.45,
                  }}
                >
                  {siteDescription}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                fontSize: 22,
                color: "#8f8f8f",
              }}
            >
              <div>Next.js · MDX · Korean Tech Blog</div>
              <div style={{ color: "#3b82f6", fontWeight: 600 }}>paper trail</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Pretendard",
          data: regular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Pretendard",
          data: bold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
