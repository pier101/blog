import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type PanelProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "aside";
  tone?: "surface" | "muted" | "soft" | "emphasis";
  border?: "default" | "panel" | "none";
  shadow?: "none" | "card" | "panel";
  radius?: "card" | "panel" | "media";
  overflow?: "visible" | "hidden";
};

const toneClasses = {
  surface: "bg-surface",
  muted: "bg-surface-muted",
  soft: "bg-surface-soft",
  emphasis: "bg-surface-emphasis",
};

const borderClasses = {
  default: "border border-border",
  panel: "border border-panel-border",
  none: "",
};

const shadowClasses = {
  none: "",
  card: "shadow-card",
  panel: "shadow-panel",
};

const radiusClasses = {
  card: "rounded-card",
  panel: "rounded-panel",
  media: "rounded-media",
};

export function Panel({
  as: Component = "div",
  className,
  tone = "surface",
  border = "default",
  shadow = "none",
  radius = "card",
  overflow = "visible",
  ...props
}: PanelProps) {
  return (
    <Component
      className={cn(
        toneClasses[tone],
        borderClasses[border],
        shadowClasses[shadow],
        radiusClasses[radius],
        overflow === "hidden" && "overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}
