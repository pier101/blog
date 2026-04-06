"use client";

import type { MermaidConfig } from "mermaid";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { Panel } from "@/components/ui";
import { subscribeAppearance, resolveTheme, type ThemeMode } from "@/lib/appearance";
import { cn } from "@/lib/cn";

type MermaidDiagramProps = {
  chart: string;
  className?: string;
};

function getMermaidTheme(theme: ThemeMode): "dark" | "neutral" {
  return theme === "dark" ? "dark" : "neutral";
}

const mermaidFontFamily =
  '"Pretendard Variable", "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI", sans-serif';

function getMermaidConfig(theme: ThemeMode): MermaidConfig {
  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: getMermaidTheme(theme),
    fontFamily: mermaidFontFamily,
    htmlLabels: true,
    flowchart: {
      useMaxWidth: false,
      nodeSpacing: 24,
      rankSpacing: 28,
      diagramPadding: 12,
    },
    sequence: {
      useMaxWidth: false,
    },
  };
}

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [svg, setSvg] = useState("");
  const theme = useSyncExternalStore(subscribeAppearance, resolveTheme, resolveTheme);
  const diagramId = useId().replace(/:/g, "-");

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize(getMermaidConfig(theme));
        const { svg: nextSvg } = await mermaid.render(`mermaid-${diagramId}`, chart);

        if (cancelled) {
          return;
        }

        setSvg(nextSvg);
        setErrorMessage("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSvg("");
        setErrorMessage(error instanceof Error ? error.message : "Mermaid diagram could not be rendered.");
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, diagramId, theme]);

  return (
    <figure className={cn("mdx-mermaid-figure", className)}>
      <Panel
        tone="surface"
        border="panel"
        radius="panel"
        shadow="card"
        className="mdx-mermaid-panel px-3 py-3 sm:px-4 sm:py-4"
      >
        <div className="mdx-mermaid-canvas" dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}>
          {!svg && !errorMessage ? (
            <div className="mdx-mermaid-placeholder">다이어그램을 준비하고 있습니다.</div>
          ) : null}
        </div>
        {errorMessage ? (
          <div className="mdx-mermaid-fallback">
            <p className="mdx-mermaid-error">Mermaid 다이어그램을 렌더하지 못했습니다.</p>
            <pre className="mdx-mermaid-source">{chart}</pre>
          </div>
        ) : null}
      </Panel>
    </figure>
  );
}
