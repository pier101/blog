import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  tone?: "quiet" | "quiet-2" | "quiet-3" | "accent";
  tracking?: "tight" | "base" | "wide";
};

const toneClasses = {
  quiet: "text-quiet",
  "quiet-2": "text-quiet-2",
  "quiet-3": "text-quiet-3",
  accent: "text-accent",
};

const trackingClasses = {
  tight: "tracking-label-tight",
  base: "tracking-label",
  wide: "tracking-label-widest",
};

export function Eyebrow({
  className,
  tone = "quiet",
  tracking = "base",
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-sans text-label-xs font-semibold uppercase",
        toneClasses[tone],
        trackingClasses[tracking],
        className,
      )}
      {...props}
    />
  );
}
